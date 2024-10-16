import {
  Dialog,
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
import { LOG } from "../../Log";
import ConfirmDialog from "@/components/ui/confirmdialog";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
  hasNestedButton?: boolean;
};

export default function EditStocksDialog({ children, hasNestedButton }: Props) {
  const { toast } = useToast();
  const ledger = useLedger();
  const [isOpen, setOpen] = useState(false);
  const [stocks, setStocks] = useState(ledger.stocks);
  const hasProgress = ledger.stocks[0].historical.length !== 0;

  useEffect(() => {
    if (!isOpen) return;

    ledger.setStocks((s) => {
      setStocks(s.map((stock) => ({ ...stock, historical: [] })));
      return s;
    });
  }, [isOpen]);

  function onConfirm() {
    toast({
      title: "Stocks updated",
    });
    ledger.setStocks(
      stocks.map((s: Stock) => ({ ...s, value: s.defaultValue }))
    );
    ledger.clear();
    setOpen(false);
    LOG("Stocks updated");
  }

  function setStock(stock: Stock) {
    setStocks((stocks: Stock[]) => {
      const index = stocks.findIndex((s) => s.id === stock.id);
      if (index === -1) return stocks;

      const newStocks = [...stocks];
      newStocks[index] = stock;
      return newStocks;
    });
  }

  return (
    <Dialog onOpenChange={setOpen} open={isOpen}>
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
          <StocksPropertiesGraph stocks={stocks} />
          <div className="grid col-span-2 gap-4 grid-cols-2">
            {stocks.map((stock: Stock) => (
              <StockProperties
                key={stock.id}
                stock={stock}
                setStock={setStock}
              />
            ))}
            <div className="w-full h-full flex justify-between items-end">
              <Button onClick={() => setOpen(false)} variant="secondary">
                Cancel
              </Button>
              {hasProgress ? (
                <ConfirmDialog
                  asChild
                  title="Overwrite current stocks?"
                  message="If you continue, you will erase the progress of the current stocks"
                  onConfirm={onConfirm}
                >
                  <EnterTriggeredButton type="submit">
                    Update Stocks
                  </EnterTriggeredButton>
                </ConfirmDialog>
              ) : (
                <EnterTriggeredButton type="submit" onClick={onConfirm}>
                  Update Stocks
                </EnterTriggeredButton>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
