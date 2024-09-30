import React from "react";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useLedger } from "@/ledger/ledgerHook";

type Props = { children: React.ReactNode };

export default function AddAccount({ children }: Props) {
  const { addAccount } = useLedger();
  const { toast } = useToast();
  const [name, setName] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    try {
      addAccount(name);
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
            <Button type="submit" onClick={onSubmit}>
              Add User
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
