import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Intensity } from "@/components/ui/intensity";
import { Stock } from "@/types";
import { Separator } from "@radix-ui/react-select";
import { Pencil } from "lucide-react";
import StockProperty from "./StockProperty";
import EditStockDialog from "./EditStockDialog";

type Props = {
  stock: Stock;
  setStock: (stock: Stock) => void;
};

export default function StockProperties({ stock, setStock }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center pb-4 justify-between">
        <CardTitle style={{ color: stock.color }}>
          {stock.name} ({stock.shortName})
        </CardTitle>
        <EditStockDialog stock={stock} hasNestedButton setStock={setStock}>
          <Button size="icon" variant="outline">
            <Pencil size="16" />
          </Button>
        </EditStockDialog>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pointer-events-none">
        <div className="flex w-full items-center gap-2">
          <StockProperty name="min" value={stock.min.toFixed()} unit="$" />
          <Separator className="mx-2 h-10 w-px" />
          <StockProperty
            name="default"
            value={stock.defaultValue.toFixed()}
            unit="$"
          />
          <Separator className="mx-2 h-10 w-px" />
          <StockProperty name="max" value={stock.max.toFixed()} unit="$" />
        </div>
        <Intensity
          color={stock.color}
          value={(stock.volatile - 0.005) * 6000} // 0.0010 til 0.025 => 5 til 25
          aria-label="25% increase"
        />
      </CardContent>
    </Card>
  );
}