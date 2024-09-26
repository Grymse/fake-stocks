import { createContext, ReactNode, useState } from "react";
import { Account, OwnerCertificate, Stock, Transaction } from "./types";

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
};

// This components needs to make a context available to all its children.

// The context should be the Ledger type.
export const LedgerContext = createContext<Ledger>({
  active: false,
  setActive: () => {},
  accounts: [],
  stocks: [],
  transactions: [],
  addAccount: () => {},
  buyStock: () => {},
  sellStock: () => {},
  updateStockValues: () => {},
});

// Component which exposes the LedgerContext
const LedgerProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [active, setActive] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addAccount = (name: string) => {
    setAccounts((accounts) => {
      if (accounts.find((account) => account.name === name)) return accounts;
      return [...accounts, { name, owns: [], id: generateId() }];
    });
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
  };

  return (
    <LedgerContext.Provider value={ledger}>{children}</LedgerContext.Provider>
  );
};

function generateId() {
  return Math.floor(Math.random() * 2147483647);
}

export default LedgerProvider;
