import { useCallback, useState } from "react";
import { Account, OwnerCertificate, Stock, Transaction } from "@/types";
import { parseLedger, serializeLedger } from "@/lib/ledgerSerializer";
import { LOG } from "@/components/admin/Log";
import { defaultStocks } from "@/lib/defaultStocks";

export type Ledger = {
  active: boolean;
  setActive: (active: boolean) => void;
  accounts: Account[];
  stocks: Stock[];
  transactions: Transaction[];
  addAccount: (name: string) => Account;
  buyStock: (account: Account, stock: Stock, amount: number) => void;
  sellStock: (
    account: Account,
    certificate: OwnerCertificate,
    amount: number
  ) => void;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  serialize: () => string;
  parse: (data: string) => void;
  clear: () => void;
  renameAccount: (account: Account, newName: string) => void;
  removeAccount: (account: Account) => void;
};

export const useLedgerStateManager = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stocks, setStocks] = useState<Stock[]>(defaultStocks);
  const [active, setActive] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addAccount = useCallback(
    (name: string) => {
      validateName(name, accounts); // Throws if invalid

      const newAccount = { name, owns: [], id: generateId() };

      setAccounts((accounts) => {
        return [...accounts, newAccount];
      });

      return newAccount;
    },
    [accounts]
  );

  const removeAccount = useCallback((account: Account) => {
    setAccounts((accounts) => accounts.filter((a) => a.id !== account.id));
  }, []);

  const serialize = useCallback(() => {
    return serializeLedger({ accounts, stocks, transactions });
  }, [accounts, stocks, transactions]);

  const parse = useCallback((data: string) => {
    const output = parseLedger(data);

    const { accounts, stocks, transactions } = output;
    setAccounts(accounts);
    setStocks(stocks);
    setTransactions(transactions);
  }, []);

  const clear = useCallback(() => {
    setAccounts([]);
    setStocks((stocks) =>
      stocks.map((stock) => ({
        ...stock,
        historical: [],
        value: stock.defaultValue,
      }))
    );
    setTransactions([]);
    setActive(false);
    LOG("Ledger cleared");
  }, []);

  const addTransactions = useCallback(
    (account: Account, stock: Stock, amount: number, type: "BUY" | "SELL") => {
      setTransactions((transactions) => {
        const newTransactions = [
          ...transactions,
          {
            id: generateId(),
            account,
            stock,
            amount,
            price: stock.value,
            total: Math.floor(stock.value * amount),
            time: Date.now(),
            type,
          },
        ];

        return newTransactions.sort((a, b) => b.time - a.time);
      });
    },
    []
  );

  const renameAccount = useCallback(
    (account: Account, newName: string) => {
      validateName(newName, accounts); // Throws if invalid

      setAccounts((accounts) => {
        const newAccount = {
          ...account,
          name: newName,
        };

        return accounts.map((a) => (a.id === account.id ? newAccount : a));
      });

      setTransactions((transactions) => {
        return transactions.map((t) => {
          if (t.account.id === account.id) {
            return {
              ...t,
              account: { ...account, name: newName },
            };
          }
          return t;
        });
      });
    },
    [accounts]
  );

  const buyStock = useCallback(
    (account: Account, stock: Stock, amount: number) => {
      if (!stock) return;

      addTransactions(account, stock, amount, "BUY");

      setAccounts((accounts) => {
        const newOwnerCertificate = {
          id: generateId(),
          stockId: stock.id,
          amount,
          initialValue: stock.value,
          time: Date.now(),
        };

        const acc = accounts.find((a) => a.name === account.name);
        if (!acc) return accounts;

        const newAccount = {
          ...acc,
          owns: [...acc.owns, newOwnerCertificate],
        };
        return accounts.map((a) => (a.name === acc.name ? newAccount : a));
      });
    },
    [addTransactions]
  );

  const sellStock = useCallback(
    (account: Account, certificate: OwnerCertificate, amount: number) => {
      if (certificate.amount < amount) {
        throw new Error("You don't have enough stocks to sell");
      }

      const stock = stocks.find((s) => s.id === certificate.stockId);
      if (stock) addTransactions(account, stock, amount, "SELL");

      setAccounts((accounts) => {
        const newAccount = {
          ...account,
          owns: account.owns
            .map((c) => {
              if (c.id === certificate.id) {
                return {
                  ...c,
                  amount: c.amount - amount,
                };
              }
              return c;
            })
            .filter((c) => c.amount > 0),
        };

        return accounts.map((a) => (a.name === account.name ? newAccount : a));
      });
    },
    [addTransactions, stocks]
  );

  return {
    accounts,
    stocks,
    transactions,
    addAccount,
    buyStock,
    sellStock,
    setStocks,
    active,
    setActive,
    serialize,
    parse,
    clear,
    renameAccount,
    removeAccount,
  };
};

function generateId() {
  return Math.floor(Math.random() * 2147483647);
}

function validateName(name: string, accounts: Account[]) {
  if (name.length === 0) {
    throw new Error("Name cannot be empty");
  }

  if (name.length > 10) {
    throw new Error("Name cannot be longer than 10 characters");
  }

  const nameAlreadyExist = accounts.find((a) => a.name === name);
  if (nameAlreadyExist) {
    throw new Error("An account with that name already exists");
  }
}
