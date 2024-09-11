import { createContext, ReactNode, useState } from "react";
import { Account, OwnerCertificate, Stock } from "./types";

export type Ledger = {
  active: boolean;
  setActive: (active: boolean) => void;
  accounts: Account[];
  stocks: Stock[];
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

  const addAccount = (name: string) => {
    setAccounts([...accounts, { name, owns: [] }]);
  };

  const buyStock = (account: Account, stock: Stock, amount: number) => {
    if (!stock) return;

    console.log(
      "BUY",
      amount,
      "of",
      stock?.name,
      "TOTAL:",
      Math.floor(stock.value * amount)
    );

    const newAccount = {
      ...account,
      owns: [
        ...account.owns,
        {
          stockId: stock.id,
          amount,
          initialValue: stock.value,
          time: Date.now(),
        },
      ],
    };
    setAccounts(
      accounts.map((a) => (a.name === account.name ? newAccount : a))
    );
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
    console.log(
      "SALE",
      amount,
      "of",
      stock?.name,
      "TOTAL:",
      Math.floor((stock?.value ?? 0) * amount)
    );

    const newAccount = {
      ...account,
      owns: account.owns
        .map((c) => {
          if (c.stockId === certificate.stockId) {
            return {
              ...c,
              amount: c.amount - amount,
            };
          }
          return c;
        })
        .filter((c) => c.amount > 0),
    };
    setAccounts(
      accounts.map((a) => (a.name === account.name ? newAccount : a))
    );
  };

  const ledger = {
    accounts,
    stocks,
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

export default LedgerProvider;
