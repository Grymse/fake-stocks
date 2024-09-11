import React, { useContext } from "react";

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
import { Label } from "@/components/ui/label";
import { LedgerContext } from "@/LedgerProvider";

type Props = { children: React.ReactNode };

type Purchase = {
  account: Account | null;
  stock: Stock | null;
  amount: number | undefined;
};

export default function BuyStock({ children }: Props) {
  const { toast } = useToast();
  const { buyStock, stocks, accounts } = useContext(LedgerContext);
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Account
            </Label>
            <SelectAccount
              accounts={accounts}
              account={purchase.account}
              setAccount={(acc: Account | null) =>
                setPurchase({ ...purchase, account: acc })
              }
            />
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
              value={purchase.amount}
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
              Total:{" "}
              <span>
                {Math.floor(
                  (purchase?.amount ?? 0) * (purchase?.stock?.value ?? 0)
                )}
              </span>
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button type="submit" onClick={onSubmit}>
              Buy
            </Button>
          </DialogClose>
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

type SelectAccountProps = {
  account: Account | null;
  setAccount: (account: Account | null) => void;
  accounts: Account[];
};

export function SelectAccount({
  account,
  setAccount,
  accounts,
}: SelectAccountProps) {
  function onValueChange(value: string) {
    setAccount(accounts.find((acc) => acc.name === value) ?? null);
  }

  return (
    <Select onValueChange={onValueChange} value={account?.name}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select an account" />
      </SelectTrigger>
      <SelectContent>
        {accounts
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((acc) => (
            <SelectItem value={acc.name}>{acc.name}</SelectItem>
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
            <SelectItem value={acc.shortName}>
              <span style={{ color: acc.color }}>
                ({acc.shortName}) {acc.name} - ${acc.value.toFixed(0)}
              </span>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
