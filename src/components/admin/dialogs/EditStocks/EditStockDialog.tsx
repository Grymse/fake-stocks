import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Stock } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Help from "@/components/ui/help";
import { NaNOrDefault } from "@/lib/utils";
import { EnterTriggeredButton } from "@/components/ui/entertriggeredbutton";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
  hasNestedButton?: boolean;
  stock: Stock;
  setStock: (stock: Stock) => void;
};

export default function EditStockDialog({
  children,
  hasNestedButton,
  stock: parentStock,
  setStock: setParentStock,
}: Props) {
  const [isOpen, setOpen] = useState(false);
  const [stock, setStock] = useState(parentStock);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setStock(parentStock);
    setError(null);
  }, [isOpen, parentStock]);

  function onSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (stock.name === "") {
      e.preventDefault();
      e.stopPropagation();
      setError("Name is empty");
      return;
    }

    if (stock.shortName.length < 2) {
      e.preventDefault();
      e.stopPropagation();
      setError("Short name is too short. 2-4 characters");
      return;
    }

    if (
      Number.isNaN(stock.min) ||
      Number.isNaN(stock.defaultValue) ||
      Number.isNaN(stock.max)
    ) {
      e.preventDefault();
      e.stopPropagation();
      setError("Fill in all the numbers: Min, Start, Max");
      return;
    }

    if (stock.max < stock.defaultValue || stock.defaultValue < stock.min) {
      e.preventDefault();
      e.stopPropagation();
      setError("The default value must be between min and max");
      return;
    }

    setParentStock(stock);
    setError(null);
  }

  function onNameChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    if (20 < name.length) return;
    setStock({ ...stock, name });
  }

  function onShortNameChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const shortName = e.target.value.toLocaleUpperCase();
    if (4 < shortName.length) return;

    setStock({ ...stock, shortName });
  }

  function onMinChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const min = parseInt(e.target.value);
    if (min < 0) return;

    setStock({ ...stock, min });
  }

  function onDefaultValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const defaultValue = parseInt(e.target.value);
    if (defaultValue < 0) return;

    setStock({ ...stock, defaultValue });
  }

  function onMaxChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const max = parseInt(e.target.value);
    if (max < 0) return;

    setStock({ ...stock, max });
  }

  function onVolatileChanged(numbers: number[]) {
    setStock({ ...stock, volatile: numbers[0] });
  }

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger hasNestedButton={hasNestedButton} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit {stock.name}</DialogTitle>
          <DialogDescription>
            Here you can change the properties of the stock
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input
              value={stock.name}
              onChange={onNameChanged}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex gap-2 justify-end">
              <Label className="text-right">ID</Label>
              <Help>
                <p className="font-bold">
                  A 3-4 letter representation of the stock
                </p>
                <p>
                  This should somehow be a short representation of the stock. It
                  is used in the ledger to represent the stocks, as the full
                  name cannot be written out every time.
                </p>
                <p>
                  It also serves as a mock of real stockmarkets where stocks are
                  represented by a short ID
                </p>
              </Help>
            </div>
            <Input
              value={stock.shortName}
              onChange={onShortNameChanged}
              placeholder="SKRT"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex gap-2 justify-end">
              <Label className="text-right">Start</Label>
              <Help>
                <p className="font-bold">The start value of the stock</p>
                <p>
                  This should typically be 2x to 10x the value of the minimum
                  value
                </p>
              </Help>
            </div>
            <Input
              value={NaNOrDefault(stock.defaultValue, "")}
              onChange={onDefaultValueChanged}
              type="number"
              placeholder="20"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex gap-2 justify-end">
              <Label className="text-right">Min</Label>
              <Help>
                <p className="font-bold">
                  The Minimum value that a stock can have
                </p>
                <p>
                  This should typically be a low value of 1 to 10. The value
                  cannot concede this value, and it is used to regulate the game
                </p>
                <p>
                  The range between maximum and minimum should ideally be 20x to
                  50x
                </p>
              </Help>
            </div>
            <Input
              value={NaNOrDefault(stock.min, "")}
              onChange={onMinChanged}
              type="number"
              placeholder="5"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex gap-2 justify-end">
              <Label className="text-right">Max</Label>
              <Help>
                <p className="font-bold">
                  The maximum value that a stock can have
                </p>
                <p>
                  This should typically be a high value of 100 to 2000. The
                  value cannot exceed this value, and it is used to regulate the
                  game
                </p>
                <p>
                  The range between maximum and minimum should ideally be 20x to
                  50x
                </p>
              </Help>
            </div>
            <Input
              value={NaNOrDefault(stock.max, "")}
              onChange={onMaxChanged}
              type="number"
              placeholder="500"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 h-8">
            <div className="flex gap-2 justify-end">
              <Label className="text-right">Volatile</Label>
              <Help>
                <p className="font-bold">The volatility of the stock.</p>
                <p>
                  The higher the value, the more unpredictable and rowdy the
                  stock will be.
                </p>
                <p>
                  It is a good idea to have stocks in each category, but mostly
                  medium.
                </p>
                <p>
                  Very low and very high can be very unpredicable and may be
                  less fun to play with.
                </p>
              </Help>
            </div>
            <div className="col-span-3 flex gap-2">
              <Slider
                value={[stock.volatile]}
                onValueChange={onVolatileChanged}
                min={0.005}
                max={0.025}
                step={0.001}
              />
              <p
                className={`text-sm w-24 text-right ${
                  getVolatileStamp(stock.volatile).color
                }`}
              >
                {getVolatileStamp(stock.volatile).text}
              </p>
            </div>
          </div>
          {error !== null && (
            <p className="text-right text-destructive">{error}</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <EnterTriggeredButton onClick={onSubmit}>
              Update
            </EnterTriggeredButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getVolatileStamp(volatile: number) {
  if (volatile < 0.007) return { text: "Very low", color: "text-green-500" };
  if (volatile < 0.011) return { text: "Low", color: "text-teal-500" };
  if (volatile < 0.017) return { text: "Medium", color: "text-blue-500" };
  if (volatile < 0.022) return { text: "High", color: "text-amber-500" };
  return { text: "Very high", color: "text-red-500" };
}
