import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
  onConfirm: () => void;
  message: string;
  title?: string;
  asChild?: boolean;
};

export default function ConfirmDialog({
  children,
  onConfirm,
  message,
  title = "Are you absolutely sure?",
  asChild = false,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={onConfirm}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
