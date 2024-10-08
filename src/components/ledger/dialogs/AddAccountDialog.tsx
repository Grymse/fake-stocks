import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { useLedger } from "@/hooks/useLedger";
import { EnterTriggeredButton } from "@/components/ui/entertriggeredbutton";
import { Account } from "@/types";

type Props = {
  children: React.ReactNode;
  onNewAccount?: (account: Account) => void;
};

export default function AddAccountDialog({ children, onNewAccount }: Props) {
  const { addAccount } = useLedger();
  const { toast } = useToast();
  const [name, setName] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    try {
      const newAccount = addAccount(name);
      onNewAccount?.(newAccount);
      toast({
        title: `Created new account ${name}`,
        description: `You can now buy and sell stocks with your brand new account!`,
      });
      setName("");
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
    setName(e.target.value.slice(0, 10));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new user!</DialogTitle>
          <DialogDescription>
            Become apart of the sickest and epicest game of all games
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
              value={name}
              onChange={onNameChange}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <EnterTriggeredButton type="submit" onClick={onSubmit}>
              Add User
            </EnterTriggeredButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
