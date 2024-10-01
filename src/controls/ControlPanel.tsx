import { Button } from "../components/ui/button";
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
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "../components/ui/tooltip";

export default function ControlPanel() {
  return (
    <div className="absolute bottom-0 w-screen left-0 flex justify-center">
      <div className="flex gap-4 items-end px-4 py-2 rounded-t-xl bg-card border shadow-md">
        <SeeTransactions>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon">
                  <ArrowLeftRight size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>See all the transactions during the game!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SeeTransactions>
        <BuyStock>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" className="text-lg">
                  <ScrollText size={20} className="mr-2" />
                  Buy
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sell stocks and make money!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </BuyStock>
        <SellStock>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="hover:bg-green-700 bg-green-600 text-lg"
                  variant="secondary"
                >
                  <CircleDollarSignIcon size={20} className="mr-2" />
                  Sell
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Buy stocks and create an account!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SellStock>

        <AdminPanel>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Settings size={16} />
                </Button>
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
