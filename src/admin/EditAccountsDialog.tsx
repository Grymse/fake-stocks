import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TableHeader,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useLedger } from "@/ledger/ledgerHook";
import { Pencil, Trash } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import EditAccountDialog from "./EditAccountDialog";

type Props = { children: React.ReactNode };

export default function EditAccountsDialog({ children }: Props) {
  const { accounts, removeAccount } = useLedger();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change accounts</DialogTitle>
          <DialogDescription>
            You can save and load sessions to continue playing later
          </DialogDescription>
        </DialogHeader>
        <div
          className="border w-full overflow-scroll overflow-x-hidden rounded-lg shadow-sm"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Owns</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => {
                return (
                  <TableRow key={account.id}>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>
                      {account.owns.reduce((acc, s) => acc + s.amount, 0)}
                    </TableCell>
                    <TableCell className="flex gap-4 justify-end">
                      <EditAccountDialog account={account}>
                        <Button variant="ghost" size="icon">
                          <Pencil />
                        </Button>
                      </EditAccountDialog>
                      <ConfirmDialog
                        title={`Delete ${account.name}`}
                        message="If you proceed to remove this account, it cannot be undone"
                        onConfirm={() => removeAccount(account)}
                        asChild
                      >
                        <Button variant="destructive" size="icon">
                          <Trash />
                        </Button>
                      </ConfirmDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {accounts.length === 0 && (
            <p className="p-4 text-center text-gray-500">No accounts found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
