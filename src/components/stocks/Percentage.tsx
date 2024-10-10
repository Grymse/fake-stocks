import { NaNToZero } from "@/hooks/lib/utils";
import { cn } from "../../hooks/lib/utils";

type Props = { percentage: number; className?: string };

export default function Percentage({ percentage, className }: Props) {
  return percentage < 0 ? (
    <span className={cn("text-red-400", className)}>
      -{NaNToZero(Math.abs(percentage)).toFixed(1)}%
    </span>
  ) : (
    <span className={cn("text-green-500", className)}>
      ▲{NaNToZero(percentage).toFixed(1)}%
    </span>
  );
}
