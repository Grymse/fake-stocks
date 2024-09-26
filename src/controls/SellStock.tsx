import React, { useContext, useMemo, useState } from "react";

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
import { SelectAccount } from "./BuyStock";
import { Account, OwnerCertificate } from "@/types";
import StockTable from "@/StockTable";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

type Props = { children: React.ReactNode };

type Sale = {
  account: Account | null;
  certificate: OwnerCertificate | null;
  amount: number | undefined;
};

export default function SellStock({ children }: Props) {
  const { toast } = useToast();
  const { sellStock, stocks, accounts } = useContext(LedgerContext);
  const [sale, setSale] = useState<Sale>({
    account: null,
    certificate: null,
    amount: 1,
  });

  function onSubmit(e: React.FormEvent) {
    if (
      !sale.account ||
      !sale.certificate ||
      sale.amount == undefined ||
      sale.amount < 1
    ) {
      toast({
        title: "FILL OUT ALL THE FIELDS",
        description: "You need to fill out all the fields",
      });
      e.stopPropagation();
      return;
    }

    const stockToBuy = stocks.find(
      (stock) => stock.id === sale.certificate?.stockId
    );

    if (!stockToBuy) {
      toast({
        title: "ARE YOU TRYING TO SCAM >:( !?!?",
        description: "This stock does not exist",
      });
      e.stopPropagation();
      return;
    }

    try {
      sellStock(sale.account, sale.certificate, sale.amount);
      setSale({ account: null, certificate: null, amount: 1 });
      toast({
        title:
          "YOU GET! - " + Math.floor(sale.amount * stockToBuy.value) + " $",
      });
    } catch (err) {
      e.stopPropagation();
      toast({
        title: "ARE YOU TRYING TO SCAM >:( !?!?",
        description: "" + err,
      });
    }
  }

  const currentAccountOwns = useMemo(
    () =>
      sale.account?.owns?.map((c) => {
        return {
          ...c,
          owner: sale.account?.name ?? "NO NAME",
          ...stocks.find((stock) => stock.id === c.stockId),
          id: c.id,
        };
      }),
    [sale.account, stocks]
  );

  function onEntrySelect(entry: OwnerCertificate | null) {
    setSale({ ...sale, certificate: entry });
  }

  const stockToBeSold = stocks.find(
    (stock) => stock.id === sale.certificate?.stockId
  );

  function setAccount(acc: Account | null) {
    setSale({ account: acc, certificate: null, amount: 1 });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[700px]">
        <DialogHeader>
          <DialogTitle>Sell stocks</DialogTitle>
          <DialogDescription>
            This game is about making money! Remember to make that money!!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Account
            </Label>
            <SelectAccount
              accounts={accounts}
              account={sale.account}
              setAccount={setAccount}
            />
          </div>
          {sale.account && !currentAccountOwns && <p>You own no stocks! :(</p>}
          {currentAccountOwns && (
            <StockTable stocks={currentAccountOwns} onSelect={onEntrySelect} />
          )}

          {currentAccountOwns && sale.certificate && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={sale.amount}
                  onChange={(e) =>
                    setSale({ ...sale, amount: +e.target.value })
                  }
                />
              </div>
              <div className="w-full justify-end flex">
                <p>
                  Total:{" "}
                  <span>
                    {Math.floor(
                      (sale?.amount ?? 0) * (stockToBeSold?.value ?? 0)
                    )}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={onSubmit}>
              Sell
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
