import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CircleHelp } from "lucide-react";

type Props = { children: React.ReactNode };

export default function Help({ children }: Props) {
  return (
    <Popover>
      <PopoverTrigger className="hidden text-muted-foreground hover:text-foreground disabled:opacity-50 sm:flex">
        <CircleHelp className="h-3.5 w-3.5" />
        <span className="sr-only">Block description</span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={20}
        className="space-y-3 rounded-[0.5rem] text-sm"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}