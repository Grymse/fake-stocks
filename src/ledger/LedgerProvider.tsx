import { createContext, ReactNode, useState } from "react";
import { Account, OwnerCertificate, Stock, Transaction } from "../types";
import { parseLedger, serializeLedger } from "./ledgerSerializer";
import { LOG } from "@/admin/Log";

export type Ledger = {
  active: boolean;
  setActive: (active: boolean) => void;
  accounts: Account[];
  stocks: Stock[];
  transactions: Transaction[];
  addAccount: (name: string) => void;
  buyStock: (account: Account, stock: Stock, amount: number) => void;
  sellStock: (
    account: Account,
    certificate: OwnerCertificate,
    amount: number
  ) => void;
  updateStockValues: React.Dispatch<React.SetStateAction<Stock[]>>;
  serialize: () => string;
  parse: (data: string) => void;
  clear: () => void;
  renameAccount: (account: Account, newName: string) => void;
  removeAccount: (account: Account) => void;
};

// The context should be the Ledger type.
export const LedgerContext = createContext<Ledger>({
  active: false,
  setActive: () => {},
  clear: () => {},
  accounts: [],
  stocks: [],
  transactions: [],
  addAccount: () => {},
  buyStock: () => {},
  sellStock: () => {},
  updateStockValues: () => {},
  serialize: () => "",
  parse: () => {},
  renameAccount: () => {},
  removeAccount: () => {},
});

// Component which exposes the LedgerContext
const LedgerProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [active, setActive] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addAccount = (name: string) => {
    validateName(name, accounts); // Throws if invalid

    setAccounts((accounts) => {
      if (accounts.find((account) => account.name === name)) return accounts;
      return [...accounts, { name, owns: [], id: generateId() }];
    });
  };

  const removeAccount = (account: Account) => {
    setAccounts((accounts) => accounts.filter((a) => a.id !== account.id));
  };

  const serialize = () => {
    return serializeLedger({ accounts, stocks, transactions });
  };

  const parse = (data: string) => {
    const output = parseLedger(data);

    const { accounts, stocks, transactions } = output;
    setAccounts(accounts);
    setStocks(stocks);
    setTransactions(transactions);
  };

  const clear = () => {
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
  };

  const addTransactions = (
    account: Account,
    stock: Stock,
    amount: number,
    type: "BUY" | "SELL"
  ) => {
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
  };

  const renameAccount = (account: Account, newName: string) => {
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
  };

  const buyStock = (account: Account, stock: Stock, amount: number) => {
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
  };

  const sellStock = (
    account: Account,
    certificate: OwnerCertificate,
    amount: number
  ) => {
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
  };

  const ledger = {
    accounts,
    stocks,
    transactions,
    addAccount,
    buyStock,
    sellStock,
    updateStockValues: setStocks,
    active,
    setActive,
    serialize,
    parse,
    clear,
    renameAccount,
    removeAccount,
  };

  return (
    <LedgerContext.Provider value={ledger}>{children}</LedgerContext.Provider>
  );
};

function generateId() {
  return Math.floor(Math.random() * 2147483647);
}

export default LedgerProvider;

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
