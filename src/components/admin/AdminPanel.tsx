import React, { useMemo } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLedger } from "@/components/ledger/LedgerProvider";
import Log from "./Log";
import EditAccountsDialog from "./dialogs/EditAccountsDialog";
import { Button } from "@/components/ui/button";
import LoadLedgerDialog from "./dialogs/LoadLedgerDialog";
import SaveLedgerDialog from "./dialogs/SaveLedgerDialog";
import Statistic from "./Statistic";
import { ArrowLeftRight, IterationCw, Users } from "lucide-react";
import StartStopButton from "./StartStopButton";
import ResetButton from "./ResetButton";
import { Label } from "@/components/ui/label";
import SimulateButton from "./SimulateButton";
import { CommandTooltip } from "../ui/tooltip";

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
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="max-w-[800px] w-[800px] flex gap-8 flex-col">
        <div className="flex flex-col gap-2">
          <SheetHeader>
            <SheetTitle>Admin Panel</SheetTitle>
          </SheetHeader>
          <SheetDescription>
            Admin panel to setup the fake stocks game
          </SheetDescription>
        </div>
        {/** Current status */}
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <div className="flex gap-4 items-center">
            <CommandTooltip
              hotkey="P"
              prefix="⌘"
              message="Play/Pause the game!"
              asChild
            >
              <StartStopButton />
            </CommandTooltip>{" "}
            <SimulateButton />
            <Statistic description="Amount of simulation iterations">
              <IterationCw size={16} />
              {stocks?.[0]?.historical?.length}
            </Statistic>
            <Statistic description="Total transactions and amount">
              <ArrowLeftRight size={16} />
              {transactions.length}
              <span className="mr-1 text-gray-500">pcs</span>${moneyTransferred}
            </Statistic>
            <Statistic description="Amount of users">
              <Users size={16} />
              {accounts.length}
            </Statistic>
          </div>
        </div>
        {/** Edit stocks */}

        {/** Session */}
        <div className="flex flex-col gap-2">
          <Label>Ledger</Label>

          <div className="flex gap-4">
            <EditAccountsDialog>
              <Button variant="secondary">Edit Accounts</Button>
            </EditAccountsDialog>
            <SaveLedgerDialog>
              <Button variant="secondary">Save Ledger</Button>
            </SaveLedgerDialog>
            <LoadLedgerDialog>
              <Button variant="secondary">Load Ledger</Button>
            </LoadLedgerDialog>
            <ResetButton>
              <Button variant="destructive">Reset ledger</Button>
            </ResetButton>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Action Log</Label>
          <Log />
        </div>
      </SheetContent>
    </Sheet>
  );
}
