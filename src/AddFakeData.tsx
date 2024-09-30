import { useEffect, useState } from "react";
import { useLedger } from "./ledger/ledgerHook";
import { LOG } from "./admin/Log";

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
  const { addAccount, accounts, stocks, buyStock } = useLedger();
  const [fakePurchases, setFakePurchases] = useState(false);

  useEffect(() => {
    if (accounts.length >= fakeAccounts.length) return;
    async function x() {
      for (const name of fakeAccounts) {
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
      LOG("Start adding fake data", "update");
      for (const name of fakeAccounts) {
        const acc = accounts.find((account) => account.name === name);
        for (const stock of stocks) {
          const price = Math.floor(Math.random() * 10) * 5;
          if (!acc || price === 0) continue;
          buyStock(acc, stock, price);
        }
      }
      LOG("Finished adding fake data", "update");
      return Promise.resolve();
    }
    x();

    setFakePurchases(true);
  }, [stocks, buyStock]);
  return null;
}
