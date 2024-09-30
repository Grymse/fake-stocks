import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = { children: React.ReactNode; help: string };

export default function Statistic({ children, help }: Props) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger>
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors border border-input bg-background shadow-sm h-9 px-4 py-2 gap-1 text-sm">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{help}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
