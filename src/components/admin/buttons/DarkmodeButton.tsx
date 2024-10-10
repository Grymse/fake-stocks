import { Button } from "../../ui/button";
import { Moon, Sun } from "lucide-react";
import { SimpleTooltip } from "../../ui/tooltip";
import { useDarkmode } from "@/hooks/useDarkmode";

export default function DarkmodeButton() {
  const { setDarkmode, isDarkmode } = useDarkmode();

  function toggleDarkmode() {
    setDarkmode(!isDarkmode);
  }

  return (
    <SimpleTooltip
      message={isDarkmode ? "Turn off darkmode" : "Turn on darkmode"}
      asChild
    >
      <Button variant="secondary" size="icon" onClick={toggleDarkmode}>
        {isDarkmode ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
    </SimpleTooltip>
  );
}
