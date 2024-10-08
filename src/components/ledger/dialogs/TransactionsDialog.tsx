import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Account } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLedger } from "@/hooks/useLedger";
import { SelectAccount } from "../selects/SelectAccount";

type Props = { children: React.ReactNode; hasNestedButton?: boolean };

export default function TransactionsDialog({
  children,
  hasNestedButton,
}: Props) {
  const { transactions, accounts } = useLedger();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const selectedTransactions = transactions.filter(
    (transaction) =>
      transaction.account.name === selectedAccount?.name || !selectedAccount
  );

  return (
    <Dialog>
      <DialogTrigger hasNestedButton={hasNestedButton}>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[700px]">
        <DialogHeader>
          <DialogTitle>All transactions</DialogTitle>
          <DialogDescription>
            See all transactions that have been made
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Filter Account
            </Label>
            <SelectAccount
              accounts={accounts}
              account={selectedAccount}
              className="w-64"
              setAccount={setSelectedAccount}
            />
            <Button variant="outline" onClick={() => setSelectedAccount(null)}>
              Clear
            </Button>
          </div>
          <div
            className="border w-full overflow-scroll overflow-x-hidden rounded-lg shadow-sm"
            style={{ maxHeight: "calc(100vh - 220px)" }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Act</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Pcs</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTransactions.map((stock) => {
                  return (
                    <TableRow
                      key={stock.id}
                      className={
                        stock.type === "BUY" ? "bg-red-950" : "bg-green-950"
                      }
                    >
                      <TableCell>
                        {new Date(stock.time).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{stock.type}</TableCell>
                      <TableCell>{stock.account.name.slice(0, 10)}</TableCell>
                      <TableCell>
                        <span style={{ color: stock.stock.color }}>
                          {stock.stock.shortName}
                        </span>
                      </TableCell>
                      <TableCell>{stock.amount}</TableCell>
                      <TableCell>${stock.price.toFixed(0)}</TableCell>
                      <TableCell>
                        ${(stock.amount * stock.price).toFixed(0)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {selectedTransactions.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
