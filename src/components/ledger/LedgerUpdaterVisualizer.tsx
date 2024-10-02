import "../../index.css";
import { useLedger } from "./LedgerProvider";

export default function LedgerUpdaterVisualizer() {
  const { active } = useLedger();

  return (
    <div
      className={`w-full h-1 absolute overflow-hidden ${
        active ? "" : "hidden"
      }`}
    >
      <div className="w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 animate-ping duration-1000" />
    </div>
  );
}
