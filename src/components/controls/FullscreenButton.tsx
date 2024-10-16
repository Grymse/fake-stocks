import { Button } from "@/components/ui/button";
import { forwardRef, useEffect, useState } from "react";
import { CommandTooltip } from "../ui/tooltip";
import { EnterFullScreenIcon, ExitFullScreenIcon } from "@radix-ui/react-icons";

type Props = React.ComponentProps<typeof Button>;

const FullscreenButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    }
  };

  const [isFullscreen, setFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const listener = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", listener);

    return () => {
      document.removeEventListener("fullscreenchange", listener);
    };
  }, []);

  return (
    <CommandTooltip
      hotkey="F"
      prefix="⌘"
      message="Maximize or minimize the game!"
      asChild
    >
      <Button
        size="icon"
        variant="secondary"
        {...props}
        onClick={toggleFullscreen}
        ref={ref}
      >
        {isFullscreen ? (
          <ExitFullScreenIcon className="w-5 h-5" />
        ) : (
          <EnterFullScreenIcon className="w-5 h-5" />
        )}
      </Button>
    </CommandTooltip>
  );
});

export default FullscreenButton;
