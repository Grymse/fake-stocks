import { Button } from "../components/ui/button";
import BuyStock from "./BuyStock";
import SellStock from "./SellStock";
import SeeTransactions from "./SeeTransactions";
import AdminPanel from "../admin/AdminPanel";
import { ArrowLeftRight, Settings } from "lucide-react";

export default function ControlPanel() {
  return (
    <div className="absolute bottom-0 w-screen left-0 flex justify-center">
      <div className="flex gap-2 items-end px-8 py-4 rounded-t-xl bg-card border">
        <SeeTransactions>
          <Button variant="outline" size="sm">
            <ArrowLeftRight size={16} className="mr-2" />
            Transactions
          </Button>
        </SeeTransactions>
        <BuyStock>
          <Button
            variant="secondary"
            size="lg"
            className=" hover:bg-green-700 px-8 bg-green-600 text-lg"
          >
            Buy
          </Button>
        </BuyStock>
        <SellStock>
          <Button size="lg" variant="destructive" className="px-8 text-lg">
            Sell
          </Button>
        </SellStock>

        <AdminPanel>
          <Button variant="outline" size="sm">
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
        </AdminPanel>
      </div>
    </div>
  );
}
