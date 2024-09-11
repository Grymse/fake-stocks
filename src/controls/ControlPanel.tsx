import { useContext } from "react";
import { Button } from "../components/ui/button";
import { LedgerContext } from "../LedgerProvider";
import AddAccount from "./AddAccount";
import BuyStock from "./BuyStock";
import SellStock from "./SellStock";

export default function ControlPanel() {
  const { setActive, active, buyStock, accounts, stocks } =
    useContext(LedgerContext);

  function double() {
    const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];

    buyStock(randomAccount, randomStock, Math.floor(Math.random() * 100));
  }

  return (
    <div className="ml-auto flex items-center gap-2">
      <Button
        onClick={double}
        size="sm"
        variant="outline"
        className="h-7 gap-1 text-sm"
      >
        <span className="sr-only sm:not-sr-only">Double</span>
      </Button>
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
      <AddAccount>
        <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
          <span className="sr-only sm:not-sr-only">Add User</span>
        </Button>
      </AddAccount>
    </div>
  );
}
