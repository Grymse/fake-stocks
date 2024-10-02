import "../../index.css";
import { useLedger } from "./LedgerProvider";

export default function LedgerUpdaterVisualizer() {
  const { active } = useLedger();

  if (active === "INACTIVE") {
    return null;
  }

  if (active === "ACTIVE") {
    return (
      <div className="w-full h-1 absolute bg-gradient-to-r from-green-400 to-blue-500 animate-ping duration-1000" />
    );
  }

  return (
    <div className="w-full h-1 absolute bg-yellow-400 animate-pulse duration-3000" />
  );
}
