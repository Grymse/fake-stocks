import { Button } from "../components/ui/button";
import BuyStock from "./BuyStock";
import SellStock from "./SellStock";
import SeeTransactions from "./SeeTransactions";
import AdminPanel from "../admin/AdminPanel";
import { Settings } from "lucide-react";

export default function ControlPanel() {
  return (
    <div className="ml-auto flex justify-between w-full">
      <div className="flex gap-2">
        <BuyStock>
          <Button
            variant="secondary"
            className=" hover:bg-green-700 px-8 bg-green-600"
          >
            Buy
          </Button>
        </BuyStock>
        <SellStock>
          <Button variant="destructive" className="px-8">
            Sell
          </Button>
        </SellStock>
      </div>
      <div className="flex gap-2">
        <SeeTransactions>
          <Button variant="outline">Transactions</Button>
        </SeeTransactions>
        <AdminPanel>
          <Button variant="outline" size="icon">
            <Settings />
          </Button>
        </AdminPanel>
      </div>
    </div>
  );
}
