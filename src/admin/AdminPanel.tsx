import React, { useMemo } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Log from "./Log";
import SaveLedgerDialog from "./SaveLedgerDialog";
import { Button } from "@/components/ui/button";
import LoadLedgerDialog from "./LoadLedgerDialog";
import StartStopButton from "./StartStopButton";
import ClearButton from "./ClearButton";
import { useLedger } from "@/ledger/ledgerHook";
import { Label } from "@/components/ui/label";
import Statistic from "./Statistic";
import { ArrowLeftRight, IterationCw, Users } from "lucide-react";

type Props = { children: React.ReactNode };

export default function AdminPanel({ children }: Props) {
  const { accounts, transactions, stocks } = useLedger();

  const moneyTransferred = useMemo(
    () =>
      transactions.reduce((acc, transaction) => acc + transaction.amount, 0),
    [transactions]
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="max-w-[800px] w-[800px] flex gap-8 flex-col">
        <SheetHeader>
          <SheetTitle>Settings Panel</SheetTitle>
        </SheetHeader>
        {/** Current status */}
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <div className="flex gap-4 items-center">
            <StartStopButton /> <ClearButton />{" "}
            <Statistic help="Amount of simulation iterations">
              <IterationCw />
              {stocks?.[0]?.historical?.length}
            </Statistic>
            <Statistic help="Total transactions and amount">
              <ArrowLeftRight />
              {transactions.length}
              <span className="mr-1 text-gray-500">pcs</span>${moneyTransferred}
            </Statistic>
            <Statistic help="Amount of users">
              <Users />
              {accounts.length}
            </Statistic>
          </div>
        </div>
        {/** Edit stocks */}

        {/** Accounts */}

        {/** Session */}
        <div className="flex flex-col gap-2">
          <Label>Status</Label>

          <div className="flex gap-4">
            <SaveLedgerDialog>
              <Button>Save Ledger</Button>
            </SaveLedgerDialog>
            <LoadLedgerDialog>
              <Button>Load Ledger</Button>
            </LoadLedgerDialog>
          </div>
        </div>

        <Log />
      </SheetContent>
    </Sheet>
  );
}
