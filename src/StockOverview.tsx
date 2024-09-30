import { useLedger } from "./ledger/ledgerHook";
import StockComponent from "./Stock";

export default function StockOverview() {
  const { stocks } = useLedger();

  return (
    <div className="flex w-full gap-4">
      {stocks.map((stock) => (
        <StockComponent key={stock.shortName} stock={stock} />
      ))}
    </div>
  );
}
