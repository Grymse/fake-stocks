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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Props = { children: React.ReactNode };

type Purchase = {
  account: Account | null;
  stock: Stock | null;
  amount: number | undefined;
};

export default function BuyStock({ children }: Props) {
  const { toast } = useToast();
  const { buyStock, stocks, accounts } = useLedger();
  const [purchase, setPurchase] = React.useState<Purchase>({
    account: null,
    stock: null,
    amount: 1,
  });

  function onSubmit(e: React.FormEvent) {
    if (
      !purchase.account ||
      !purchase.stock ||
      purchase.amount == undefined ||
      purchase.amount < 1
    ) {
      toast({
        title: "FILL OUT ALL THE FIELDS",
        description: "You need to fill out all the fields",
      });
      e.stopPropagation();
      return;
    }

    try {
      buyStock(purchase.account, purchase.stock, purchase.amount);
      setPurchase({ account: null, stock: null, amount: 1 });
      toast({
        title:
          "PAY UP! - " +
          Math.floor(purchase.amount * purchase.stock.value) +
          " $",
      });
    } catch (err) {
      e.stopPropagation();
      toast({
        title: "ARE YOU TRYING TO SCAM >:( !?!?",
        description: "" + err,
      });
    }
  }

  const total = Math.floor(
    (purchase?.amount ?? 0) * (purchase?.stock?.value ?? 0)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy stocks!</DialogTitle>
          <DialogDescription>
            Becoming rich, is just a click away!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right pl-7">
              Account
            </Label>
            <SelectAccount
              className="w-[220px]"
              accounts={accounts}
              account={purchase.account}
              setAccount={(acc: Account | null) =>
                setPurchase({ ...purchase, account: acc })
              }
            />
            <AddAccount>
              <Button variant="secondary">
                <PlusIcon />
              </Button>
            </AddAccount>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Stock
            </Label>
            <SelectStock
              stocks={stocks}
              stock={purchase.stock}
              setStock={(acc: Stock | null) =>
                setPurchase({ ...purchase, stock: acc })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Amount
            </Label>
            <Input
              type="number"
              className="w-[280px]"
              value={isNaN(purchase.amount ?? 0) ? "" : purchase.amount}
              onChange={(e) => {
                let amount = parseInt(e.target.value);
                if (amount < 1) {
                  amount = 1;
                }
                setPurchase({ ...purchase, amount });
              }}
              placeholder="Amount"
            />
          </div>
          <div className="w-full justify-end flex">
            <p>
              Total: <span>{Number.isNaN(total) ? "---" : total}</span>
            </p>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-between">
            <AddAccount>
              <Button variant="secondary">
                <span className="sr-only sm:not-sr-only">Add Account</span>
              </Button>
            </AddAccount>
            <DialogClose asChild>
              <Button type="submit" onClick={onSubmit}>
                Buy
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account, Stock } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import AddAccount from "./AddAccount";
import { PlusIcon } from "@radix-ui/react-icons";
import { DialogClose } from "@radix-ui/react-dialog";
import { useLedger } from "@/ledger/ledgerHook";

type SelectAccountProps = {
  account: Account | null;
  setAccount: (account: Account | null) => void;
  accounts: Account[];
  className?: string;
};

export function SelectAccount({
  account,
  setAccount,
  accounts,
  className,
}: SelectAccountProps) {
  function onValueChange(value: string) {
    setAccount(accounts.find((acc) => acc.name === value) ?? null);
  }

  return (
    <Select onValueChange={onValueChange} value={account?.name ?? "none"}>
      <SelectTrigger className={cn("w-[280px]", className)}>
        <SelectValue placeholder="Select an account" />
      </SelectTrigger>
      <SelectContent>
        {accounts
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((acc) => (
            <SelectItem value={acc.name} key={acc.name}>
              {acc.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

type SelectStockProps = {
  stock: Stock | null;
  setStock: (stock: Stock | null) => void;
  stocks: Stock[];
};

function SelectStock({ stock, setStock, stocks }: SelectStockProps) {
  function onValueChange(value: string) {
    setStock(stocks.find((stock) => stock.shortName === value) ?? null);
  }

  return (
    <Select onValueChange={onValueChange} value={stock?.shortName}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a stock" />
      </SelectTrigger>
      <SelectContent>
        {stocks
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((acc) => (
            <SelectItem value={acc.shortName} key={acc.id}>
              <span style={{ color: acc.color }}>
                ({acc.shortName}) {acc.name} - ${acc.value.toFixed(0)}
              </span>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
