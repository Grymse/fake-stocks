import React, { useMemo, useState } from "react";

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
import { SelectAccount } from "./BuyStock";
import { Account, OwnerCertificate } from "@/types";
import StockTable from "@/StockTable";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import StockAmountToggleGroup from "./StockAmountToggleGroup";
import { getRandomAnimation, useAnimations } from "@/AnimationsProvider";
import { useLedger } from "@/ledger/ledgerHook";
import { EnterTriggeredButton } from "@/components/ui/entertriggeredbutton";

type Props = { children: React.ReactNode };

type Sale = {
  account: Account | null;
  certificate: OwnerCertificate | null;
  amount: number | undefined;
};

export default function SellStock({ children }: Props) {
  const { toast } = useToast();
  const { sellStock, stocks, accounts } = useLedger();
  const { animate } = useAnimations();
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

      animate(getRandomAnimation());
    } catch (err) {
      e.stopPropagation();
      toast({
        title: "ARE YOU TRYING TO SCAM >:( !?!?",
        description: "" + err,
      });
    }
  }

  const currentAccountOwns = useMemo(() => {
    if (!sale.account) return undefined;
    // Find newest version of the account object, as the user may have selected
    // the specific account on previous renders, and the account object may have
    // changed since then.
    const account = accounts.find((acc) => acc.id === sale.account?.id);

    return account?.owns?.map((c) => {
      return {
        ...c,
        owner: sale.account?.name ?? "NO NAME",
        ...stocks.find((stock) => stock.id === c.stockId),
        id: c.id,
      };
    });
  }, [sale.account, stocks, accounts]);

  function onEntrySelect(entry: OwnerCertificate | null) {
    setSale({ ...sale, certificate: entry });
  }

  const stockToBeSold = stocks.find(
    (stock) => stock.id === sale.certificate?.stockId
  );

  function setAccount(acc: Account | null) {
    setSale({ account: acc, certificate: null, amount: 1 });
  }

  function setAmount(amount: number) {
    const safeAmount = Math.min(amount, sale.certificate?.amount ?? 0);

    setSale((sale) => {
      return {
        ...sale,
        amount: safeAmount,
      };
    });
  }

  const total = Math.floor((sale?.amount ?? 0) * (stockToBeSold?.value ?? 0));

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
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
                  value={isNaN(sale.amount ?? 0) ? "" : sale.amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                />
                <div className="w-[170px]">
                  <StockAmountToggleGroup
                    maxAmount={sale.certificate.amount}
                    amount={sale.amount ?? 0}
                    setAmount={(amount) =>
                      setSale((sale) => {
                        return {
                          ...sale,
                          amount,
                        };
                      })
                    }
                  />
                </div>
              </div>
              <div className="w-full justify-end flex">
                <p>
                  Total: <span>{Number.isNaN(total) ? "---" : total}</span>
                </p>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <EnterTriggeredButton type="submit" onClick={onSubmit}>
              Sell
            </EnterTriggeredButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
