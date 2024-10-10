import React, { useState } from "react";
import { Account, Stock } from "@/types";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";
import AddAccount from "./AddAccountDialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { DialogClose } from "@radix-ui/react-dialog";
import { useLedger } from "@/hooks/useLedger";
import { EnterTriggeredButton } from "@/components/ui/entertriggeredbutton";
import SelectStock from "../selects/SelectStock";
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
import { SelectAccount } from "../selects/SelectAccount";

type Props = { children: React.ReactNode; hasNestedButton?: boolean };

type Purchase = {
  account: Account | null;
  stock: Stock | null;
  amount: number | undefined;
};

export default function BuyStockDialog({ children, hasNestedButton }: Props) {
  const { toast } = useToast();
  const { buyStock, stocks, accounts } = useLedger();
  const [purchase, setPurchase] = useState<Purchase>({
    account: null,
    stock: null,
    amount: 1,
  });
  const [dollars, setDollars] = useState(0);

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
      setDollars(0);
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

  function onNewAccount(account: Account) {
    setPurchase({ ...purchase, account });
  }

  const total = Math.floor(
    (purchase?.amount ?? 0) * (purchase?.stock?.value ?? 0)
  );

  function onDollarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const dollars = parseInt(e.target.value);
    if (dollars < 1) {
      setDollars(1);
      setPurchase({ ...purchase, amount: 0 });
      return;
    }
    setDollars(dollars);
    const amount = Math.floor(dollars / (purchase?.stock?.value ?? 1));
    setPurchase({ ...purchase, amount });
  }

  function onAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    let amount = parseInt(e.target.value);
    if (amount < 1) {
      amount = 1;
    }
    setPurchase({ ...purchase, amount });
    setDollars(Math.floor(amount * (purchase?.stock?.value ?? 1)));
  }

  return (
    <Dialog>
      <DialogTrigger hasNestedButton={hasNestedButton}>
        {children}
      </DialogTrigger>
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
            <AddAccount onNewAccount={onNewAccount}>
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
            <div className="flex gap-4">
              <div className="flex relative">
                <Input
                  className="w-[132px]"
                  type="number"
                  value={isNaN(purchase.amount ?? 0) ? "" : purchase.amount}
                  onChange={onAmountChange}
                  placeholder="Amount"
                />
                <p className="text-muted-foreground absolute top-1.5 right-2">
                  pcs
                </p>
              </div>

              <div className="flex relative">
                <Input
                  type="number"
                  className="w-[132px]"
                  value={dollars}
                  onChange={onDollarChange}
                  placeholder="Price"
                />
                <p className="text-muted-foreground absolute top-1.5 right-2">
                  $
                </p>
              </div>
            </div>
          </div>
          <div className="w-full justify-end flex">
            <p>
              Total price: <span>${Number.isNaN(total) ? 0 : total}</span>
            </p>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-between">
            <AddAccount onNewAccount={onNewAccount}>
              <Button variant="secondary">
                <span className="sr-only sm:not-sr-only">Add Account</span>
              </Button>
            </AddAccount>
            <DialogClose asChild>
              <EnterTriggeredButton type="submit" onClick={onSubmit}>
                Buy
              </EnterTriggeredButton>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
