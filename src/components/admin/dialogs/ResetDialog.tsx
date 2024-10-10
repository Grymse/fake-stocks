import ConfirmDialog from "@/components/ui/confirmdialog";
import { toast } from "@/hooks/useToast";
import { useLedger } from "@/hooks/useLedger";

type Props = { children: React.ReactNode; hasNestedButton?: boolean };

export default function ResetButton({ children, hasNestedButton }: Props) {
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
      hasNestedButton={hasNestedButton}
      variant="destructive"
    >
      {children}
    </ConfirmDialog>
  );
}
