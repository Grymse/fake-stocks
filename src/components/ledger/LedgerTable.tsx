import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { OwnerCertificate, Stock } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import Percentage from "../stocks/Percentage";

type TableEntry = { owner: string } & OwnerCertificate & Partial<Stock>;

type Props = {
  stocks: TableEntry[];
  onSelect?: (stock: TableEntry | null) => void;
  paged?: boolean;
  height?: number;
};

const STOCK_SHOW_CHANGE_TIME = 7000;

export default function LedgerTable({
  stocks,
  paged = false,
  height: forceHeight,
  onSelect,
}: Props) {
  const [selected, setSelected] = useState<TableEntry | null>(null);
  const [index, setIndex] = useState(0);
  const [stockLength, setStockLength] = useState(stocks.length);
  const { height, ref } = useResizeDetector({});
  const maxStocks = useMemo(
    () =>
      paged ? Math.floor(((forceHeight ?? height ?? 800) - 70) / 41) : 1000,
    [height, paged, forceHeight]
  );

  useEffect(() => {
    setStockLength(stocks.length);
  }, [stocks]);

  const onClick = (stock: TableEntry) => {
    if (!onSelect) return;
    if (selected === stock) {
      setSelected(null);
      onSelect(null);
      return;
    }
    setSelected(stock);
    onSelect?.(stock);
  };

  useEffect(() => {
    const func = () => {
      setIndex((index) => {
        if (Number.isNaN(index) || index === undefined) return 0;

        const lim = Math.ceil(stockLength / maxStocks);
        return (index + 1) % lim;
      });
    };
    const interval = setInterval(func, STOCK_SHOW_CHANGE_TIME);
    func();

    return () => clearInterval(interval);
  }, [stockLength, maxStocks]);

  const stockSection = useMemo(
    () => stocks.slice(index * maxStocks, index * maxStocks + maxStocks),
    [stocks, index, maxStocks]
  );

  return (
    <>
      <div
        ref={ref}
        style={{ maxHeight: forceHeight }}
        className={`border rounded-lg shadow-sm ${
          forceHeight && !paged
            ? "overflow-y-scroll overflow-x-hidden"
            : "overflow-hidden"
        }`}
      >
        <Table className="text-base">
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Pcs</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockSection.map((stock) => {
              const stockValue = stock.value ?? 0;
              const percentage = (stockValue / stock.initialValue - 1) * 100;
              return (
                <TableRow
                  className={
                    selected?.id === stock.id
                      ? "bg-blue-800 hover:bg-blue-700"
                      : ""
                  }
                  key={stock.id}
                  onClick={() => onClick?.(stock)}
                >
                  <TableCell>{stock.owner.slice(0, 10)}</TableCell>
                  <TableCell>
                    <span style={{ color: stock.color }}>
                      {stock.shortName}
                    </span>
                  </TableCell>
                  <TableCell>{stock.amount}</TableCell>
                  <TableCell>
                    <Percentage percentage={percentage} />
                  </TableCell>
                  <TableCell>
                    ${(stock.amount * stockValue).toFixed(0)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {maxStocks < stockLength && (
          <div className="w-full flex justify-center">
            <p className="text-xl text-gray-400">
              {index + 1} / {Math.ceil(stockLength / maxStocks)}
            </p>
          </div>
        )}
        {stocks.length === 0 && (
          <div className="p-4 text-center text-gray-500">No stocks found</div>
        )}
      </div>
    </>
  );
}
