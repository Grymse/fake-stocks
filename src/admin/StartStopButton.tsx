import { Button } from "@/components/ui/button";
import { useLedger } from "@/ledger/ledgerHook";

export default function StartStopButton() {
  const { setActive, active } = useLedger();
  return (
    <Button
      className="gap-1 text-sm"
      variant="secondary"
      onClick={() => setActive(!active)}
    >
      {active ? "Pause" : "Start"}
    </Button>
  );
}
