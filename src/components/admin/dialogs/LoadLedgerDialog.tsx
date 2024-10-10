import { useEffect, useState } from "react";
import { useLedger } from "@/hooks/useLedger";
import { DatabaseRecordWithoutData, db } from "@/services/IDatabase";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/useToast";
import { LOG } from "../Log";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import ConfirmDialog from "../../ui/confirmdialog";

type Props = { children: React.ReactNode };

export default function LoadLedgerDialog({ children }: Props) {
  const { parse } = useLedger();
  const [open, setOpen] = useState(false);

  const [ledgerList, setLedgerList] = useState<DatabaseRecordWithoutData[]>([]);

  useEffect(() => {
    if (!open) return;
    db.list().then(setLedgerList);
  }, [open]);

  async function remove(ledger: DatabaseRecordWithoutData) {
    try {
      await db.delete(ledger.id);
    } catch (e) {
      toast({
        title: "Error deleting ledger",
        description: `There was an error deleting the ledger ${ledger.name}. Check the logs for more information`,
        variant: "destructive",
      });
      return LOG(`Error deleting ${ledger.name}: ${e}`, "error");
    }
    setLedgerList(ledgerList.filter((l) => l.id !== ledger.id));
    LOG(`${ledger.name} deleted`, "warn");
  }

  async function loadGame(id: string) {
    try {
      const ledger = await db.load(id);
      parse(ledger.data);
      toast({
        title: `${ledger.name} loaded`,
        description: "The ledger has been loaded successfully",
      });
      LOG(`New ledger loaded: ${ledger.name}`);
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error loading ledger",
          description: `There was an error loading the ledger ${error.message}`,
          variant: "destructive",
        });
        LOG(`Error loading ledger: ${error.message}`, "error");
      }
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Load ledger!</DialogTitle>
          <DialogDescription>
            You can load and overwrite the current ledger by clicking on one of
            the saved ledgers
          </DialogDescription>
        </DialogHeader>
        <div
          className="border w-full overflow-scroll overflow-x-hidden rounded-lg shadow-sm"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          {ledgerList.map((ledger) => {
            return (
              <ConfirmDialog
                key={ledger.id}
                onConfirm={() => loadGame(ledger.id)}
                title="Overwrite current ledger"
                message="Are you sure you want to continue and overwrite the current ledger? This action cannot be undone!"
                className="hover:bg-foreground/10 flex p-2 justify-between w-full items-center"
                hasNestedButton
              >
                <p>
                  <span className="text-muted-foreground text-sm mr-2">
                    {ledger.createdAt.getDate()}.{" "}
                    {ledger.createdAt.toLocaleString("default", {
                      month: "short",
                    })}{" "}
                    {ledger.createdAt.getHours()}:
                    {ledger.createdAt.getMinutes().toString().padStart(2, "0")}
                  </span>
                  {ledger.name}
                </p>
                <div onClick={(e) => e.stopPropagation()}>
                  <ConfirmDialog
                    onConfirm={() => remove(ledger)}
                    title={`Delete ${ledger.name}?`}
                    message={`Are you sure you want to delete saved ledger: "${ledger.name}"`}
                    asChild
                    variant="destructive"
                  >
                    <Button variant="destructive" size="icon">
                      <Trash size={16} />
                    </Button>
                  </ConfirmDialog>
                </div>
              </ConfirmDialog>
            );
          })}
          {ledgerList.length === 0 && (
            <div className="p-4 text-center text-gray-500">No saves found</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
