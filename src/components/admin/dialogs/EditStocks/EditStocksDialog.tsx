import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EnterTriggeredButton } from "@/components/ui/entertriggeredbutton";
import { useLedger } from "@/hooks/useLedger";
import { useToast } from "@/hooks/useToast";
import StockProperties from "./StockProperties";
import StocksPropertiesGraph from "./StocksPropertiesGraph";
import { useEffect, useState } from "react";
import { Stock } from "@/types";

type Props = {
  children: React.ReactNode;
  hasNestedButton?: boolean;
};

export default function EditStocksDialog({ children, hasNestedButton }: Props) {
  const { toast } = useToast();
  const { stocks: globalStocks, setStocks: setGlobalStocks } = useLedger();
  const [isOpen, setOpen] = useState(false);
  const [stocks, setStocks] = useState(globalStocks);

  useEffect(() => {
    if (!isOpen) return;

    console.log("TRIGGER UPDATE");

    setGlobalStocks((s) => {
      setStocks(s.map((stock) => ({ ...stock, historical: [] })));
      return s;
    });
  }, [isOpen, setGlobalStocks]);

  function onSubmit() {
    toast({
      title: "Stocks updated",
    });
    setGlobalStocks(stocks.map((s) => ({ ...s, value: s.defaultValue })));
  }

  function setStock(stock: Stock) {
    setStocks((stocks) => {
      const index = stocks.findIndex((s) => s.id === stock.id);
      if (index === -1) return stocks;

      const newStocks = [...stocks];
      newStocks[index] = stock;
      return newStocks;
    });
  }

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger hasNestedButton={hasNestedButton} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Edit stocks</DialogTitle>
          <DialogDescription>
            You can rename and change the properties of stocks, to define your
            own stock market
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-3">
          <StocksPropertiesGraph />
          <div className="grid col-span-2 gap-4 grid-cols-2">
            {stocks.map((stock) => (
              <StockProperties
                key={stock.id}
                stock={stock}
                setStock={setStock}
              />
            ))}
            <div className="w-full h-full flex justify-end items-end">
              <DialogClose asChild>
                <EnterTriggeredButton type="submit" onClick={onSubmit}>
                  Update Stocks
                </EnterTriggeredButton>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
