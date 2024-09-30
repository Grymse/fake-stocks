import { useEffect, useState } from "react";
import { useLedger } from "../ledger/ledgerHook";
import { db } from "@/database/db";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { LOG } from "./Log";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";

type Props = { children: React.ReactNode };

export default function LoadLedgerDialog({ children }: Props) {
  const { parse } = useLedger();
  const [open, setOpen] = useState(false);

  const [ledgerList, setLedgerList] = useState<string[]>([]);

  useEffect(() => {
    db.list().then(setLedgerList);
  }, [open]);

  async function remove(name: string) {
    await db.delete(name);
    setLedgerList(await db.list());
    LOG(`${name.split("|")[1]} deleted`, "warn");
  }

  async function loadGame(name: string) {
    try {
      parse(await db.load(name));

      const ledgerName = name.split("|")[1];
      toast({
        title: `${ledgerName} loaded`,
        description: "The ledger has been loaded successfully",
      });
      LOG(`New ledger loaded: ${ledgerName}`);
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error loading ledger",
          description: `There was an error loading the ledger ${error.message}`,
          variant: "destructive",
        });
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
          {ledgerList.map((name) => {
            const [time, ledgerName] = name.split("|");
            const date = new Date(+time);
            return (
              <ConfirmDialog
                key={name}
                onConfirm={() => loadGame(name)}
                title="Overwrite current ledger"
                message="Are you sure you want to continue and overwrite the current ledger? This action cannot be undone!"
                className="hover:bg-white hover:bg-opacity-10 flex p-2 justify-between w-full items-center"
              >
                <p>
                  <span className="text-muted-foreground">
                    {date.toLocaleString()}
                  </span>{" "}
                  {ledgerName}
                </p>
                <p></p>
                <div onClick={(e) => e.stopPropagation()}>
                  <ConfirmDialog
                    onConfirm={() => remove(name)}
                    title={`Delete ${ledgerName}?`}
                    message={`Are you sure you want to delete saved ledger: "${ledgerName}"`}
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
