import { Button } from "@/components/ui/button";
import { Fullscreen, Minimize } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { CommandTooltip } from "../ui/tooltip";

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
        {isFullscreen ? <Minimize size={20} /> : <Fullscreen size={20} />}
      </Button>
    </CommandTooltip>
  );
});

export default FullscreenButton;
