import { Button } from "../../ui/button";
import { Zap, ZapOff } from "lucide-react";
import { useLedger } from "@/hooks/useLedger";
import { SimpleTooltip } from "../../ui/tooltip";

export default function SimulateButton() {
  const { setActive, active } = useLedger();

  function toggleSimulation() {
    setActive(active === "SIMULATING" ? "INACTIVE" : "SIMULATING");
  }
  return (
    <SimpleTooltip message="Simulate the stock market at 20x speed" asChild>
      <Button
        className="text-yellow-500 hover:text-yellow-400 dark:text-yellow-400 dark:hover:text-yellow-500"
        onClick={toggleSimulation}
        variant="secondary"
        size="icon"
      >
        {active === "SIMULATING" ? <ZapOff size={20} /> : <Zap size={20} />}
      </Button>
    </SimpleTooltip>
  );
}