import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { OwnerCertificate, Stock } from "./types";
import { useState } from "react";

type TableEntry = { owner: string } & OwnerCertificate & Partial<Stock>;

type Props = {
  stocks: TableEntry[];
  onSelect?: (stock: TableEntry | null) => void;
};

export default function StockTable({ stocks, onSelect }: Props) {
  const [selected, setSelected] = useState<TableEntry | null>(null);

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

  return (
    <div style={{ height: "calc(100vh - 75px)" }} className="overflow-scroll">
      <div className="border rounded-lg shadow-sm h-fit">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Pcs</TableHead>
              <TableHead>GAK</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => {
              const stockValue = stock.value ?? 0;
              const percentage = (stockValue / stock.initialValue - 1) * 100;
              return (
                <TableRow
                  className={
                    selected?.id === stock.id
                      ? "bg-blue-800 hover:bg-blue-700"
                      : ""
                  }
                  key={stock.stockId}
                  onClick={() => onClick?.(stock)}
                >
                  <TableCell>{stock.owner.slice(0, 10)}</TableCell>
                  <TableCell>
                    <span style={{ color: stock.color }}>
                      {stock.shortName}
                    </span>
                  </TableCell>
                  <TableCell>{stock.amount}</TableCell>
                  <TableCell>${stock.initialValue.toFixed(0)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        percentage < 0 ? "text-red-500" : "text-green-600"
                      }
                    >
                      {percentage > 0 ? "+" : ""}
                      {percentage.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    ${(stock.amount * stockValue).toFixed(0)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {stocks.length === 0 && (
          <div className="p-4 text-center text-gray-500">No stocks found</div>
        )}
      </div>
    </div>
  );
}
