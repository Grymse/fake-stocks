import { useContext } from "react";
import { LedgerContext } from "./LedgerProvider";

export function useLedger() {
  return useContext(LedgerContext);
}
