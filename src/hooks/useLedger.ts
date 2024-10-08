import { LedgerContext } from "@/contexts/LedgerProvider";
import { useContext } from "react";

export function useLedger() {
  return useContext(LedgerContext);
}
