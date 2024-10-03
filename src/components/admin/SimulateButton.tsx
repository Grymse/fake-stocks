import { Button } from "../ui/button";
import { Zap, ZapOff } from "lucide-react";
import { useLedger } from "../ledger/LedgerProvider";
import { SimpleTooltip } from "../ui/tooltip";

export default function SimulateButton() {
  const { setActive, active } = useLedger();

  function toggleSimulation() {
    setActive(active === "SIMULATING" ? "INACTIVE" : "SIMULATING");
  }
  return (
    <SimpleTooltip message="Simulate the stock market at 20x speed" asChild>
      <Button
        className="text-yellow-400 hover:text-yellow-500"
        onClick={toggleSimulation}
        variant="ghost"
        size="icon"
      >
        {active === "SIMULATING" ? <ZapOff size={20} /> : <Zap size={20} />}
      </Button>
    </SimpleTooltip>
  );
}
