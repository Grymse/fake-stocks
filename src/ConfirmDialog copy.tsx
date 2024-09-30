import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  Dialog,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
type ConfirmDialogState = "closed" | "open" | "rejected" | "confirmed";

const useConfirmDialog = () => {
  const [state, setInnerState] = useState<ConfirmDialogState>("closed");
  const [message, setMessage] = useState("");
  const stateRef = useRef<ConfirmDialogState>(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  async function confirm(message: string): Promise<void> {
    setState("open");
    setMessage(message);

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (stateRef.current === "confirmed") {
          resolve();
          clearInterval(interval);
          setState("closed");
        } else if (stateRef.current === "rejected") {
          reject();
          clearInterval(interval);
          setState("closed");
        }
      }, 50);
    });
  }

  function setState(newState: ConfirmDialogState) {
    if (stateRef.current === "confirmed" && newState === "rejected") return;
    stateRef.current = newState;
    setInnerState(newState);
  }

  return { state, setState, confirm, close, message };
};

export default function ConfirmDialog2() {
  const { state, setState, message } = useConfirmDialog();

  function onConfirm() {
    setState("confirmed");
  }

  function onDecline() {
    setState("rejected");
  }

  useEffect(() => {
    if (state !== "open") return;
  }, [state]);
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open === false) onDecline();
      }}
    >
      <DialogTrigger className="hidden" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
      </DialogContent>

      <DialogFooter className="flex justify-between">
        <DialogClose asChild>
          <Button type="button">Confirm</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogClose>
      </DialogFooter>
    </Dialog>
  );
}
