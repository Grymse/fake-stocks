import { Button } from "@/components/ui/button";
import { useLedger } from "@/components/ledger/LedgerProvider";
import { Pause, Play, ZapOff } from "lucide-react";
import { forwardRef } from "react";

type Props = React.ComponentProps<typeof Button>;

const StartStopButton = forwardRef<HTMLButtonElement, Props>(
  ({ ...props }, ref) => {
    const { setActive, active } = useLedger();

    function toggleActivity() {
      if (active === "INACTIVE") setActive("ACTIVE");
      else setActive("INACTIVE");
    }

    return (
      <Button
        ref={ref}
        className={props.className}
        size="icon"
        variant="ghost"
        {...props}
        onClick={toggleActivity}
      >
        {active === "ACTIVE" ? (
          <Pause size={20} />
        ) : active === "SIMULATING" ? (
          <ZapOff className="text-yellow-400 hover:text-yellow-500" size={20} />
        ) : (
          <Play size={20} />
        )}
      </Button>
    );
  }
);

export default StartStopButton;
