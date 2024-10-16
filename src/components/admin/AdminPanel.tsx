import React, { useMemo } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLedger } from "@/hooks/useLedger";
import Log from "./Log";
import EditAccountsDialog from "./dialogs/EditAccountsDialog";
import { Button } from "@/components/ui/button";
import LoadLedgerDialog from "./dialogs/LoadLedgerDialog";
import SaveLedgerDialog from "./dialogs/SaveLedgerDialog";
import Statistic from "../ui/statistic";
import StartStopButton from "./buttons/StartStopButton";
import ResetButton from "./dialogs/ResetDialog";
import { Label } from "@/components/ui/label";
import SimulateButton from "./buttons/SimulateButton";
import DarkmodeButton from "./buttons/DarkmodeButton";
import useAuth from "@/hooks/useAuth";
import User from "./User";
import LoginButton from "./buttons/LoginButton";
import FullscreenButton from "../controls/FullscreenButton";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { signinWithGoogle } from "@/lib/firebase";
import EditStocksDialog from "./dialogs/EditStocks/EditStocksDialog";
import { displayHourMinutes } from "@/lib/utils";
import { ClockIcon, ReloadIcon, WidthIcon } from "@radix-ui/react-icons";

type Props = { children: React.ReactNode };

export default function AdminPanel({ children }: Props) {
  const { transactions, stocks } = useLedger();
  const user = useAuth();

  const moneyTransferred = useMemo(
    () =>
      transactions.reduce((acc, transaction) => acc + transaction.amount, 0),
    [transactions]
  );

  function loginIfDisabled() {
    if (user === null) signinWithGoogle();
  }

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
            <StartStopButton />
            <SimulateButton />
            <FullscreenButton />
            <DarkmodeButton />
            <Statistic description="Amount of simulation iterations">
              <ReloadIcon className="w-4 h-4" />
              {stocks?.[0]?.historical?.length}
            </Statistic>
            <Statistic description="Duration of current game">
              <ClockIcon className="w-4 h-4" />
              {displayHourMinutes(stocks?.[0]?.historical?.length ?? 0)}
            </Statistic>
            <Statistic description="Total transactions and amount">
              <WidthIcon className="w-4 h-4" />
              {transactions.length}
              <span className="mr-1 text-gray-500">pcs</span>${moneyTransferred}
            </Statistic>
          </div>
        </div>
        {/** Edit stocks */}

        {/** Session */}
        <div className="flex flex-col gap-2">
          <Label>Ledger</Label>

          <div className="flex gap-4">
            <EditAccountsDialog hasNestedButton>
              <SimpleTooltip
                asChild
                message="Change the names or delete accounts"
              >
                <Button variant="secondary">Edit Accounts</Button>
              </SimpleTooltip>
            </EditAccountsDialog>
            <EditStocksDialog hasNestedButton>
              <SimpleTooltip
                asChild
                message="Change the stocks (Resets the simulation)"
              >
                <Button variant="secondary">Edit Stocks</Button>
              </SimpleTooltip>
            </EditStocksDialog>
            <SaveLedgerDialog disabled={user === null} hasNestedButton>
              <SimpleTooltip
                message={
                  user === null
                    ? "Login to save the current stocks and ledger"
                    : "Save the current stocks and ledger"
                }
                asChild
              >
                <Button onClick={loginIfDisabled} variant="secondary">
                  Save
                </Button>
              </SimpleTooltip>
            </SaveLedgerDialog>
            <LoadLedgerDialog disabled={user === null} hasNestedButton>
              <SimpleTooltip
                message={
                  user === null
                    ? "Login to load previous saved stocks and ledger"
                    : "Load previously saved stocks and ledger"
                }
                asChild
              >
                <Button onClick={loginIfDisabled} variant="secondary">
                  Load
                </Button>
              </SimpleTooltip>
            </LoadLedgerDialog>
            <ResetButton hasNestedButton>
              <SimpleTooltip
                asChild
                message="Delete accounts, stocks-progression and transactions"
              >
                <Button variant="destructive">Reset</Button>
              </SimpleTooltip>
            </ResetButton>
          </div>
        </div>

        {/** Login */}
        <div className="flex flex-col gap-2">
          <Label>Login</Label>
          <div className="flex gap-4">
            {user !== null && <User />}
            <LoginButton />
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
