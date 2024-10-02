import { Button } from "@/components/ui/button";
import { useLedger } from "@/components/ledger/LedgerProvider";
import { Pause, Play } from "lucide-react";
import { forwardRef } from "react";

type Props = React.ComponentProps<typeof Button>;

const StartStopButton = forwardRef<HTMLButtonElement, Props>(
  ({ ...props }, ref) => {
    const { setActive, active } = useLedger();

    return (
      <Button
        ref={ref}
        className={props.className}
        size="icon"
        variant="ghost"
        {...props}
        onClick={() => setActive(!active)}
      >
        {active ? <Pause size={20} /> : <Play size={20} />}
      </Button>
    );
  }
);

export default StartStopButton;
