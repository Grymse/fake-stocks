import {
  SelectValue,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Stock } from "@/types";

type SelectStockProps = {
  stock: Stock | null;
  setStock: (stock: Stock | null) => void;
  stocks: Stock[];
};

export default function SelectStock({
  stock,
  setStock,
  stocks,
}: SelectStockProps) {
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
            <SelectItem value={acc.shortName} key={acc.id}>
              <span style={{ color: acc.color }}>
                ({acc.shortName}) {acc.name} - ${acc.value.toFixed(0)}
              </span>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
