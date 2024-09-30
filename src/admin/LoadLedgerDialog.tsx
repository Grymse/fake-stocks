import { useEffect, useState } from "react";
import { useLedger } from "../ledger/ledgerHook";
import { db } from "@/database/db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
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

type Props = { children: React.ReactNode };

export default function LoadLedgerDialog({ children }: Props) {
  const { parse } = useLedger();

  const [ledgerList, setLedgerList] = useState<string[]>([]);

  useEffect(() => {
    db.list().then(setLedgerList);
  }, []);

  async function loadGame(name: string) {
    try {
      parse(await db.load(name));
      toast({
        title: "Ledger loaded",
        description: "The ledger has been loaded successfully",
      });
      LOG("New ledger loaded: " + name);
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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save ledger!</DialogTitle>
          <DialogDescription>
            You can save and load sessions to continue playing later
          </DialogDescription>
        </DialogHeader>
        <div
          className="border w-full overflow-scroll overflow-x-hidden rounded-lg shadow-sm"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerList.map((name) => {
                return (
                  <TableRow onClick={() => loadGame(name)} key={name}>
                    {/* <ConfirmDialog
                      onConfirm={() => loadGame(name)}
                      title="Overwrite current ledger"
                      message="Are you sure you want to continue and overwrite the current ledger? This action cannot be undone!"
                    > */}
                    <TableCell>------------</TableCell>
                    <TableCell>{name}</TableCell>
                    {/* </ConfirmDialog> */}
                  </TableRow>
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
