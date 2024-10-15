import {
  Dialog,
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

    if (stock.shortName === "") {
      e.preventDefault();
      e.stopPropagation();
      setError("Short name is empty");
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
            <Label className="text-right">ID</Label>
            <Input
              value={stock.shortName}
              onChange={onShortNameChanged}
              placeholder="SKRT"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Min</Label>
            <Input
              value={stock.min}
              onChange={onMinChanged}
              type="number"
              placeholder="5"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Default</Label>
            <Input
              value={stock.defaultValue}
              onChange={onDefaultValueChanged}
              type="number"
              placeholder="20"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Max</Label>
            <Input
              value={stock.max}
              onChange={onMaxChanged}
              type="number"
              placeholder="500"
              className="col-span-3"
            />
          </div>
          {error !== null && (
            <p className="text-right text-destructive">{error}</p>
          )}
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button onClick={onSubmit}>Update</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
