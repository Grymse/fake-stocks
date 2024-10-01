import { Button } from "@/components/ui/button";
import { useLedger } from "@/ledger/ledgerHook";
import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";
import { forwardRef } from "react";

type Props = {
  isIcon?: boolean;
} & React.ComponentProps<typeof Button>;

const StartStopButton = forwardRef<HTMLButtonElement, Props>(
  ({ isIcon, ...props }, ref) => {
    const { setActive, active } = useLedger();

    if (isIcon) {
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

    return (
      <Button
        ref={ref}
        className={cn("gap-1 text-sm", props.className)}
        variant="secondary"
        onClick={() => setActive(!active)}
        {...props}
      >
        {active ? "Pause" : "Start"}
      </Button>
    );
  }
);

export default StartStopButton;
