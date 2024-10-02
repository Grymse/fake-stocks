import { useLedger } from "./LedgerProvider";
import StockTable from "../stocks/StockTable";

function Ledger() {
  const { accounts, stocks } = useLedger();

  function getStock(stockId: number) {
    return stocks.find((stock) => stock.id === stockId);
  }

  const allStocks = accounts.flatMap((account) =>
    account.owns.map((c) => {
      return { ...c, owner: account.name, ...getStock(c.stockId), id: c.id };
    })
  );

  return <StockTable stocks={allStocks} />;
}

export default Ledger;
