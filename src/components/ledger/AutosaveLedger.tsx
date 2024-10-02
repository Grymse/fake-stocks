import { useEffect, useRef } from "react";
import { useLedger } from "./LedgerProvider";
import { useFlags } from "@/hooks/useFlags";

const autosaveInterval = 10000;

export default function AutosaveLedger() {
  const { parse, serialize, transactions, stocks } = useLedger();
  const serializeRef = useRef(serialize);
  const transactionsRef = useRef(transactions);
  const stocksRef = useRef(stocks);
  const { debug } = useFlags();

  useEffect(() => {
    serializeRef.current = serialize;
  }, [serialize]);

  useEffect(() => {
    transactionsRef.current = transactions;
  }, [transactions]);

  useEffect(() => {
    stocksRef.current = stocks;
  }, [stocks]);

  useEffect(() => {
    const autosaveContent = localStorage.getItem("autosave-content");
    const autosaveTime = localStorage.getItem("autosave-time");

    function restore(content: string) {
      setTimeout(() => {
        parse(content);
      }, 500);

      localStorage.removeItem("autosave-content");
      localStorage.removeItem("autosave-time");
    }

    if (debug === false && autosaveContent !== null && autosaveTime !== null) {
      const diff = Date.now() - parseInt(autosaveTime);
      // Format diff in minutes
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      if (
        minutes < 300 &&
        window.confirm(
          `Do you want to restore your previous session from ${minutes}m ${seconds}s ago?`
        )
      ) {
        restore(autosaveContent);
      }
    }

    const interval = setInterval(() => {
      if (
        stocksRef.current[0]?.historical.length < 1 ||
        transactionsRef.current.length < 1
      )
        return;
      localStorage.setItem("autosave-content", serializeRef.current());
      localStorage.setItem("autosave-time", Date.now().toString());
    }, autosaveInterval);

    return () => clearInterval(interval);
  }, [debug]);

  return null;
}
