import { Button } from "@/components/ui/button";
import { useLedger } from "@/hooks/useLedger";
import { forwardRef } from "react";
import { CommandTooltip } from "../../ui/tooltip";
import { ActiveState } from "@/hooks/useLedgerStateManager";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";

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
            <PauseIcon className="w-5 h-5" />
          ) : active === "SIMULATING" ? (
            <PauseIcon className="w-5 h-5 text-yellow-500 hover:text-yellow-400 dark:text-yellow-400 dark:hover:text-yellow-500" />
          ) : (
            <PlayIcon className="w-5 h-5" />
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
