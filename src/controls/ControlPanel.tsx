import { useContext } from "react";
import { Button } from "../components/ui/button";
import { LedgerContext } from "../LedgerProvider";
import AddAccount from "./AddAccount";
import BuyStock from "./BuyStock";
import SellStock from "./SellStock";
import SeeTransactions from "./SeeTransactions";

export default function ControlPanel() {
  const { setActive, active } = useContext(LedgerContext);
  return (
    <div className="ml-auto flex justify-between w-full">
      <div className="flex gap-2">
        <BuyStock>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <span className="sr-only sm:not-sr-only">Buy</span>
          </Button>
        </BuyStock>
        <SellStock>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <span className="sr-only sm:not-sr-only">Sell</span>
          </Button>
        </SellStock>
        <AddAccount>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <span className="sr-only sm:not-sr-only">Add Account</span>
          </Button>
        </AddAccount>
      </div>
      <div className="flex gap-2">
        <SeeTransactions>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <span className="sr-only sm:not-sr-only">Transactions</span>
          </Button>
        </SeeTransactions>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 text-sm"
          onClick={() => setActive(!active)}
        >
          <span className="sr-only sm:not-sr-only">
            {active ? "Pause" : "Start"}
          </span>
        </Button>
      </div>
    </div>
  );
}
