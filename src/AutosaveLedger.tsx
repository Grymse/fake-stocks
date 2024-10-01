import { useEffect, useRef } from "react";
import { useLedger } from "./ledger/ledgerHook";

const autosaveInterval = 10000;

export default function AutosaveLedger() {
  const { parse, serialize } = useLedger();
  const serializeRef = useRef(serialize);

  useEffect(() => {
    serializeRef.current = serialize;
  }, [serialize]);

  function restore(content: string) {
    console.log(content);
    setTimeout(() => {
      parse(content);
    }, 500);

    localStorage.removeItem("autosave-content");
    localStorage.removeItem("autosave-time");
  }

  useEffect(() => {
    const autosaveContent = localStorage.getItem("autosave-content");
    const autosaveTime = localStorage.getItem("autosave-time");

    if (autosaveContent !== null && autosaveTime !== null) {
      const diff = Date.now() - parseInt(autosaveTime);
      // Format diff in minutes
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      if (
        window.confirm(
          `Do you want to restore your previous session from ${minutes}m ${seconds}s ago?`
        )
      ) {
        restore(autosaveContent);
      }
    }

    const interval = setInterval(() => {
      localStorage.setItem("autosave-content", serializeRef.current());
      localStorage.setItem("autosave-time", Date.now().toString());
    }, autosaveInterval);

    return () => clearInterval(interval);
  }, []);

  return null;
}
