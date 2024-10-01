import { useEffect } from "react";
import { toast } from "./hooks/use-toast";

export default function PreventWebsiteExit() {
  useEffect(() => {
    // Dissallow right clicks
    const preventDefault = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prompt user  closing the tab
    const promptUserBeforeClose = (e: BeforeUnloadEvent) => {
      toast({
        title: "If you leave the site, you will lose all your progress",
        variant: "destructive",
      });
      e.preventDefault();
      e.returnValue = "";
    };
    document.addEventListener("contextmenu", preventDefault);
    window.addEventListener("beforeunload", promptUserBeforeClose);
    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      window.removeEventListener("beforeunload", promptUserBeforeClose);
    };
  }, []);

  return null;
}
