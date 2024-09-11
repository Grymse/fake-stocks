import { LedgerContext } from "./LedgerProvider";
import { useContext } from "react";
import StockComponent from "./Stock";

export default function StockOverview() {
  const { stocks } = useContext(LedgerContext);

  return (
    <div className="flex w-full gap-4">
      {stocks.map((stock) => (
        <StockComponent key={stock.shortName} stock={stock} />
      ))}
    </div>
  );
}
