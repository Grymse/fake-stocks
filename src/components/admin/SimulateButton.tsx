import { Button } from "../ui/button";
import { Zap, ZapOff } from "lucide-react";
import { useLedger } from "../ledger/LedgerProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function SimulateButton() {
  const { setActive, active } = useLedger();

  function toggleSimulation() {
    setActive(active === "SIMULATING" ? "INACTIVE" : "SIMULATING");
  }
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="text-yellow-400 hover:text-yellow-500"
            onClick={toggleSimulation}
            variant="ghost"
            size="icon"
          >
            {active === "SIMULATING" ? <ZapOff size={20} /> : <Zap size={20} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click here to simulate the stock program!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
