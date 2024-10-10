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
import useLoader from "@/hooks/useLoader";

type Props = {
  children: React.ReactNode;
  hasNestedButton?: boolean;
  disabled?: boolean;
};

export default function LoadLedgerDialog({
  children,
  hasNestedButton,
  disabled,
}: Props) {
  const { parse } = useLedger();
  const [open, setOpen] = useState(false);
  const { setLoading: setLoading, Loading } = useLoader();

  const [ledgerList, setLedgerList] = useState<DatabaseRecordWithoutData[]>([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    db.list()
      .then(setLedgerList)
      .catch((e: Error) => {
        LOG(`Error loading ledger list: ${e}`, "error");
        toast({
          title: "Error loading ledger list",
          description: e.message,
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, [open]);

  async function remove(ledger: DatabaseRecordWithoutData) {
    setLoading(true);
    db.delete(ledger.id)
      .then(() => {
        setLedgerList(ledgerList.filter((l) => l.id !== ledger.id));
        LOG(`${ledger.name} deleted`, "warn");
      })
      .catch((e: Error) => {
        LOG(`Error deleting ${ledger.name}: ${e}`, "error");
        toast({
          title: "Error deleting ledger",
          description: `There was an error deleting the ledger ${ledger.name}. ${e.message}`,
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }

  async function loadGame(id: string) {
    setLoading(true);
    db.load(id)
      .then((ledger) => {
        parse(ledger.data);
        toast({
          title: `${ledger.name} loaded`,
          description: "The ledger has been loaded successfully",
        });
        LOG(`New ledger loaded: ${ledger.name}`);
        setOpen(false);
      })
      .catch((e: Error) => {
        LOG(`Error loading ledger: ${e}`, "error");
        toast({
          title: "Error loading ledger",
          description: `There was an error loading the ledger ${e.message}`,
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {disabled ? (
        children
      ) : (
        <DialogTrigger
          disabled={disabled}
          hasNestedButton={hasNestedButton}
          asChild
        >
          {children}
        </DialogTrigger>
      )}
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

          <div className="w-full flex justify-center">
            <Loading>
              {ledgerList.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No saves found
                </div>
              )}
            </Loading>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
