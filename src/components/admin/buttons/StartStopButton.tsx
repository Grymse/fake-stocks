import { Button } from "@/components/ui/button";
import { useLedger } from "@/hooks/useLedger";
import { Pause, Play, ZapOff } from "lucide-react";
import { forwardRef } from "react";
import { CommandTooltip } from "../../ui/tooltip";
import { ActiveState } from "@/hooks/useLedgerStateManager";

type Props = React.ComponentProps<typeof Button>;

const StartStopButton = forwardRef<HTMLButtonElement, Props>(
  ({ ...props }, ref) => {
    const { setActive, active } = useLedger();

    function toggleActivity() {
      if (active === "INACTIVE") setActive("ACTIVE");
      else setActive("INACTIVE");
    }

    return (
      <CommandTooltip
        hotkey="P"
        prefix="⌘"
        message={getTooltipMessage(active)}
        asChild
      >
        <Button
          ref={ref}
          className={props.className}
          size="icon"
          variant="secondary"
          {...props}
          onClick={toggleActivity}
        >
          {active === "ACTIVE" ? (
            <Pause size={20} />
          ) : active === "SIMULATING" ? (
            <ZapOff
              className="text-yellow-500 hover:text-yellow-400 dark:text-yellow-400 dark:hover:text-yellow-500"
              size={20}
            />
          ) : (
            <Play size={20} />
          )}
        </Button>
      </CommandTooltip>
    );
  }
);

function getTooltipMessage(active: ActiveState) {
  switch (active) {
    case "ACTIVE":
      return "Pause the game";
    case "INACTIVE":
      return "Play the game";
    case "SIMULATING":
      return "Stop simulating";
  }
}

export default StartStopButton;
