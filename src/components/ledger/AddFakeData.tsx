import { useEffect, useRef } from "react";
import { useLedger } from "@/hooks/useLedger";
import { LOG } from "../admin/Log";

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
  const { addAccount, accounts, setStocks, buyStock } = useLedger();
  const accountsHasBeenAdded = useRef(false);
  const stocksHasBeenAdded = useRef(false);

  useEffect(() => {
    if (accounts.length >= fakeAccounts.length || accountsHasBeenAdded.current)
      return;
    accountsHasBeenAdded.current = true;

    LOG("Start adding fake data", "update");

    for (const name of fakeAccounts) {
      addAccount(name);
    }
  }, []);

  useEffect(() => {
    if (stocksHasBeenAdded.current || accounts.length < fakeAccounts.length)
      return;
    stocksHasBeenAdded.current = true;

    setStocks((stocks) => {
      for (const name of fakeAccounts) {
        const account = accounts.find((account) => account.name === name);
        for (const stock of stocks) {
          const price = Math.floor(Math.random() * 10) * 5;
          if (!account || price === 0) continue;
          buyStock(account, stock, price);
        }
      }
      LOG("Finished adding fake data", "update");
      return [...stocks];
    });
  }, [accounts]);

  return null;
}
