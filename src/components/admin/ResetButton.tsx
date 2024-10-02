import ConfirmDialog from "@/components/utils/ConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { useLedger } from "@/components/ledger/LedgerProvider";

type Props = { children: React.ReactNode };

export default function ResetButton({ children }: Props) {
  const { clear } = useLedger();

  function clearLedger() {
    clear();
    toast({
      title: "Ledger reset",
      description: "The ledger has been reset",
    });
  }

  return (
    <ConfirmDialog
      onConfirm={clearLedger}
      title="Reset the ledger?"
      message="Are you totally sure you want to reset the ledger. If you do this, then all the progress has been lost!"
      asChild
      variant="destructive"
    >
      {children}
    </ConfirmDialog>
  );
}
