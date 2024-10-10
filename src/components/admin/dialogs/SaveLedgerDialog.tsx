import { useEffect, useState } from "react";
import { useLedger } from "@/hooks/useLedger";
import { db } from "@/services/IDatabase";
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
import { Input } from "@/components/ui/input";
import { LOG } from "../Log";
import { toast } from "@/hooks/useToast";
import { Label } from "@/components/ui/label";
import { EnterTriggeredButton } from "@/components/ui/entertriggeredbutton";
import useLoader from "@/hooks/useLoader";

type Props = {
  children: React.ReactNode;
  hasNestedButton?: boolean;
  disabled?: boolean;
};

export default function SaveLedgerDialog({
  children,
  hasNestedButton,
  disabled,
}: Props) {
  const [ledgerName, setLedgerName] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const { isLoading, setLoading } = useLoader();
  const { serialize } = useLedger();

  useEffect(() => {
    setStatusMessage("");
  }, [ledgerName]);

  const saveGame = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setLoading(true);
    db.save(ledgerName, serialize())
      .then(() => {
        setLoading(false);
        setStatusMessage("Game saved successfully");
        toast({
          title: `${ledgerName} saved`,
          description: "You can now load the ledger from your list",
        });
        setLedgerName("");
        LOG("Ledger saved: " + ledgerName);
      })
      .catch((error: Error) => {
        LOG("Error saving ledger: " + error, "error");
        e.stopPropagation();
        setStatusMessage("Error: " + error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog>
      {disabled ? (
        children
      ) : (
        <DialogTrigger asChild hasNestedButton={hasNestedButton}>
          {children}
        </DialogTrigger>
      )}
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
            <EnterTriggeredButton
              isLoading={isLoading}
              type="submit"
              onClick={saveGame}
            >
              Save
            </EnterTriggeredButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
