import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { useMemo } from "react";

type StockAmountToggleGroupProps = {
  amount: number;
  setAmount: (amount: number) => void;
  maxAmount: number;
};

export default function StockAmountToggleGroup({
  amount,
  setAmount,
  maxAmount,
}: StockAmountToggleGroupProps) {
  const [p100, p50, p25] = useMemo(() => {
    return [maxAmount, Math.floor(maxAmount / 2), Math.floor(maxAmount / 4)];
  }, [maxAmount]);

  return (
    <ToggleGroup variant="outline" type="single" value={amount.toString()}>
      <SimpleTooltip message="Buy all the stocks!">
        <ToggleGroupItem
          value={p100.toString()}
          onClick={() => setAmount(maxAmount)}
        >
          All
        </ToggleGroupItem>
      </SimpleTooltip>
      <SimpleTooltip message="Buy half the stocks!">
        <ToggleGroupItem value={p50.toString()} onClick={() => setAmount(p50)}>
          50%
        </ToggleGroupItem>
      </SimpleTooltip>
      <SimpleTooltip message="Buy a quarter of the stocks!">
        <ToggleGroupItem value={p25.toString()} onClick={() => setAmount(p25)}>
          25%
        </ToggleGroupItem>
      </SimpleTooltip>
    </ToggleGroup>
  );
}
