import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/hooks/lib/utils";
import { Account } from "@/types";

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
