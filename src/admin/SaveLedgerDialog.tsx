import { useEffect, useState } from "react";
import { useLedger } from "../ledger/ledgerHook";
import { db } from "@/database/db";
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOG } from "./Log";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

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
      const date = Date.now();
      const timedLedgerName = date + "|" + ledgerName;

      await db.save(timedLedgerName, getSerialized());
      setStatusMessage("Game saved successfully");
      toast({
        title: `${ledgerName} saved`,
        description: "You can now load the ledger from your list",
      });
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
          <DialogTitle>Save the ledger</DialogTitle>
          <DialogDescription>
            You can save and load sessions to continue playing later
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right pl-7">
              Name
            </Label>
            <Input
              className="w-[220px]"
              id="name"
              name="name"
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
