import BuyStock from "./BuyStock";
import SellStock from "./SellStock";
import SeeTransactions from "./SeeTransactions";
import AdminPanel from "../admin/AdminPanel";
import {
  ArrowLeftRight,
  CircleDollarSignIcon,
  ScrollText,
  Settings,
} from "lucide-react";
import { useEffect, useRef } from "react";
import StartStopButton from "@/admin/StartStopButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import KeyboardHotkey from "./KeyboardHotkey";
import FullscreenButton from "./FullscreenButton";

export default function ControlPanel() {
  const transactionsButtonRef = useRef<HTMLDivElement>(null);
  const buyButtonRef = useRef<HTMLDivElement>(null);
  const sellButtonRef = useRef<HTMLDivElement>(null);
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
        <SeeTransactions>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  ref={transactionsButtonRef}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 w-9"
                >
                  <ArrowLeftRight size={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <KeyboardHotkey>
                    <span className="text-xs">⌘</span>T
                  </KeyboardHotkey>{" "}
                  See all the transactions during the game!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SeeTransactions>
        <BuyStock>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  ref={buyButtonRef}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-4 py-2 text-lg"
                >
                  <ScrollText size={20} className="mr-2" />
                  Buy
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <KeyboardHotkey>
                    <span className="text-xs">⌘</span>B
                  </KeyboardHotkey>{" "}
                  Buy stocks and create an account!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </BuyStock>
        {/* Play/Pause */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <StartStopButton ref={playButtonRef} isIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <KeyboardHotkey>
                  <span className="text-xs">⌘</span>P
                </KeyboardHotkey>{" "}
                Play/Pause the game!
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <SellStock>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-9 px-4 py-2 hover:bg-green-700 bg-green-600 text-lg"
                  ref={sellButtonRef}
                >
                  <CircleDollarSignIcon size={20} className="mr-2" />
                  Sell
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <KeyboardHotkey>
                    <span className="text-xs">⌘</span>S
                  </KeyboardHotkey>{" "}
                  Sell stocks and make money!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SellStock>

        {/* Maximize */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <FullscreenButton ref={fullscreenButtonRef} />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <KeyboardHotkey>
                  <span className="text-xs">⌘</span>F
                </KeyboardHotkey>{" "}
                Maximize or minimize the game!
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AdminPanel>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 w-9">
                  <Settings size={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Access the admin panel for the fake stocks!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AdminPanel>
      </div>
    </div>
  );
}
