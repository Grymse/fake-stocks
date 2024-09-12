import { useContext, useEffect, useState } from "react";
import { LedgerContext } from "./LedgerProvider";

const fakeAccounts = [
  "Nicolai",
  "Mikkel",
  "Anders",
  "Jonas",
  "Marie",
  "Lars",
  "Kasper",
  "Mads",
  "Jesper",
];

export default function AddFakeData() {
  const { addAccount, accounts, stocks, buyStock } = useContext(LedgerContext);
  const [fakePurchases, setFakePurchases] = useState(false);

  useEffect(() => {
    if (accounts.length >= fakeAccounts.length) return;
    async function x() {
      for (const name of fakeAccounts) {
        await delay(5);
        addAccount(name);
      }
      return Promise.resolve();
    }

    x();
  }, []);

  useEffect(() => {
    if (
      fakePurchases ||
      accounts.length < fakeAccounts.length ||
      stocks.length !== 5
    )
      return;

    async function x() {
      for (const name of fakeAccounts) {
        const acc = accounts.find((account) => account.name === name);
        console.log(acc);
        for (const stock of stocks) {
          await delay(10);
          buyStock(acc, stock, Math.floor(Math.random() * 10) * 5);
        }
      }
      console.log("Added all");
      return Promise.resolve();
    }
    x();

    setFakePurchases(true);
  }, [stocks, buyStock]);
  return null;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
