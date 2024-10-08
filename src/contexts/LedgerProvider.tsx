import { createContext, ReactNode } from "react";
import { Ledger, useLedgerStateManager } from "@/hooks/useLedgerStateManager";
import { useSimulator } from "@/hooks/useSimulator";

// The context should be the Ledger type.
export const LedgerContext = createContext<Ledger>({
  active: "INACTIVE",
  setActive: () => {},
  clear: () => {},
  accounts: [],
  stocks: [],
  transactions: [],
  addAccount: () => {
    return { name: "", owns: [], id: 0 };
  },
  buyStock: () => {},
  sellStock: () => {},
  setStocks: () => {},
  serialize: () => "",
  parse: () => {},
  renameAccount: () => {},
  removeAccount: () => {},
});

// Component which exposes the LedgerContext
const LedgerProvider = ({ children }: { children: ReactNode }) => {
  const ledger = useLedgerStateManager();
  useSimulator(ledger.setStocks, ledger.active);

  return (
    <LedgerContext.Provider value={ledger}>{children}</LedgerContext.Provider>
  );
};

export default LedgerProvider;
