import BuyStockDialog from "../ledger/dialogs/BuyStockDialog";
import SellStockDialog from "../ledger/dialogs/SellStockDialog";
import TransactionsDialog from "../ledger/dialogs/TransactionsDialog";
import AdminPanel from "../admin/AdminPanel";
import {
  ArrowLeftRight,
  CircleDollarSignIcon,
  ScrollText,
  Settings,
} from "lucide-react";
import { useEffect, useRef } from "react";
import StartStopButton from "@/components/admin/buttons/StartStopButton";
import { CommandTooltip, SimpleTooltip } from "@/components/ui/tooltip";
import FullscreenButton from "./FullscreenButton";
import { Button } from "../ui/button";

export default function ControlPanel() {
  const transactionsButtonRef = useRef<HTMLButtonElement>(null);
  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const sellButtonRef = useRef<HTMLButtonElement>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function binds(e: KeyboardEvent) {
      if (!e.metaKey && !e.ctrlKey) return;

      if (e.key === "t") {
        transactionsButtonRef.current?.click();
      } else if (e.key === "b") {
        buyButtonRef.current?.click();
      } else if (e.key === "s") {
        sellButtonRef.current?.click();
      } else if (e.key === "p") {
        e.preventDefault();
        playButtonRef.current?.click();
      } else if (e.key === "f") {
        e.preventDefault();
        fullscreenButtonRef.current?.click();
      }
    }

    window.addEventListener("keydown", binds);
    return () => window.removeEventListener("keydown", binds);
  }, []);

  return (
    <div className="absolute bottom-0 w-screen left-0 flex justify-center">
      <div className="flex gap-4 items-end px-4 py-2 rounded-t-xl bg-card border shadow-md">
        {/* Transactions */}
        <TransactionsDialog hasNestedButton>
          <CommandTooltip
            hotkey="T"
            prefix="⌘"
            message="Show transactions"
            asChild
          >
            <Button ref={transactionsButtonRef} size="icon" variant="secondary">
              <ArrowLeftRight size={16} />
            </Button>
          </CommandTooltip>
        </TransactionsDialog>

        {/* Buy */}
        <BuyStockDialog hasNestedButton>
          <CommandTooltip
            hotkey="B"
            prefix="⌘"
            message="Buy stocks and create an account!"
            asChild
          >
            <Button
              ref={buyButtonRef}
              className="text-lg"
              variant="destructive"
            >
              <ScrollText size={20} className="mr-2" />
              Buy
            </Button>
          </CommandTooltip>
        </BuyStockDialog>
        {/* Play/Pause */}
        <StartStopButton ref={playButtonRef} />

        {/* Sell */}
        <SellStockDialog hasNestedButton>
          <CommandTooltip
            hotkey="S"
            prefix="⌘"
            message="Sell stocks and make money!"
            asChild
          >
            <Button
              ref={sellButtonRef}
              variant="secondary"
              className="text-lg bg-green-600 hover:bg-green-700"
            >
              <CircleDollarSignIcon size={20} className="mr-2" />
              Sell
            </Button>
          </CommandTooltip>
        </SellStockDialog>

        {/* Maximize */}
        <FullscreenButton ref={fullscreenButtonRef} />

        {/* Admin */}
        <AdminPanel>
          <SimpleTooltip
            message="Access the admin panel for the fake stocks!"
            asChild
          >
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 w-9">
              <Settings size={16} />
            </div>
          </SimpleTooltip>
        </AdminPanel>
      </div>
    </div>
  );
}
