import "../../index.css";
import { useLedger } from "@/hooks/useLedger";

export default function LedgerUpdaterVisualizer() {
  const { active } = useLedger();

  if (active === "INACTIVE") {
    return null;
  }

  return (
    <div className="w-screen absolute h-1 max-w-screen overflow-hidden">
      {active === "ACTIVE" && (
        <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 animate-ping duration-1000" />
      )}
      {active === "SIMULATING" && (
        <div className="w-screen h-1 absolute bg-orange-600 dark:bg-yellow-400 animate-pulse duration-500" />
      )}
    </div>
  );
}
