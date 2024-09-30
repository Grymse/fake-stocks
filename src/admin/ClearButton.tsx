import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/ConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { useLedger } from "@/ledger/ledgerHook";

export default function ClearButton() {
  const { clear } = useLedger();

  function clearLedger() {
    clear();
    toast({
      title: "Ledger cleared",
      description: "The ledger has been cleared",
    });
  }

  return (
    <ConfirmDialog
      onConfirm={clearLedger}
      title="Clear the ledger?"
      message="Are you totally sure you want to clear the ledger. If you do this, then all the progress has been lost!"
      asChild
    >
      <Button>Clear ledger</Button>
    </ConfirmDialog>
  );
}
