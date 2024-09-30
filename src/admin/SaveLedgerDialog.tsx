import { useEffect, useState } from "react";
import { useLedger } from "../ledger/ledgerHook";
import { db } from "@/database/db";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Label } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOG } from "./Log";

type Props = { children: React.ReactNode };

export default function SaveLedgerDialog({ children }: Props) {
  const [ledgerName, setLedgerName] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const { getSerialized } = useLedger();

  useEffect(() => {
    setStatusMessage("");
  }, [ledgerName]);

  const saveGame = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      await db.save(ledgerName, getSerialized());
      setStatusMessage("Game saved successfully");
      setLedgerName("");
      LOG("Ledger saved: " + ledgerName);
    } catch (error) {
      e.stopPropagation();
      setStatusMessage("Error: " + error);
    }
  };

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
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label className="text-right pl-7">Name</Label>
            <Input
              className="w-[220px]"
              id="name"
              value={ledgerName}
              onChange={(e) => setLedgerName(e.target.value)}
              placeholder="Name"
            />
          </div>
          {0 < statusMessage?.length && (
            <Label className="text-right text-destructive">
              {statusMessage}
            </Label>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={saveGame}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
