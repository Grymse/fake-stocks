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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    LOG(`${name} deleted`, "warn");
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
    } catch (e: unknown) {
      console.error(e);
      toast({
        title: "Error loading ledger",
        description: "There was an error loading the ledger",
        variant: "destructive",
      });
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerList.map((name) => {
                const [time, ledgerName] = name.split("|");
                const date = new Date(+time);
                return (
                  <ConfirmDialog
                    key={name}
                    onConfirm={() => loadGame(name)}
                    title="Overwrite current ledger"
                    message="Are you sure you want to continue and overwrite the current ledger? This action cannot be undone!"
                  >
                    <TableRow>
                      <TableCell>{date.toLocaleString()}</TableCell>
                      <TableCell>{ledgerName}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <ConfirmDialog
                          onConfirm={() => remove(name)}
                          title={`Delete ${ledgerName}?`}
                          message={`Are you sure you want to delete saved ledger: "${ledgerName}"`}
                          asChild
                        >
                          <Button variant="destructive" size="icon">
                            <Trash size={16} />
                          </Button>
                        </ConfirmDialog>
                      </TableCell>
                    </TableRow>
                  </ConfirmDialog>
                );
              })}
            </TableBody>
          </Table>
          {ledgerList.length === 0 && (
            <div className="p-4 text-center text-gray-500">No saves found</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
