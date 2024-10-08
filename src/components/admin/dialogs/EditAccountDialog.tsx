import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EnterTriggeredButton } from "@/components/ui/entertriggeredbutton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { useLedger } from "@/hooks/useLedger";
import { Account } from "@/types";
import { ReactNode, useState } from "react";

type Props = {
  account: Account;
  children: ReactNode;
  hasNestedButton?: boolean;
};

export default function EditAccountDialog({
  account,
  children,
  hasNestedButton,
}: Props) {
  const [newName, setNewName] = useState(account.name);
  const { toast } = useToast();
  const { renameAccount } = useLedger();

  function onSubmit(e: React.FormEvent) {
    try {
      renameAccount(account, newName);
      toast({
        title: `${account.name} updated to ${newName}`,
      });
      setNewName("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: "destructive",
        });
      }
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewName(e.target.value.slice(0, 10));
  }

  return (
    <Dialog>
      <DialogTrigger hasNestedButton={hasNestedButton} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change {account.name} name</DialogTitle>
          <DialogDescription>
            You are about to change the name of an account. Be careful! Two
            accounts cannot have the same name
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={newName}
              onChange={onNameChange}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <EnterTriggeredButton type="submit" onClick={onSubmit}>
              Update name
            </EnterTriggeredButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
