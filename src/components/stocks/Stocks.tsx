import { useLedger } from "@/hooks/useLedger";
import Stock from "./Stock";

export default function Stocks() {
  const { stocks } = useLedger();

  return (
    <div className="flex w-full gap-4">
      {stocks.map((stock) => (
        <Stock key={stock.shortName} stock={stock} />
      ))}
    </div>
  );
}
