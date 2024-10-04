import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer } from "../ui/chart";
import { Area, AreaChart, YAxis } from "recharts";
import { Stock } from "@/types";
import Percentage from "./Percentage";

type Props = { stock: Stock };

const graphLength = 300;

export default function StockComponent({ stock }: Props) {
  const prevPrice =
    stock.historical[stock.historical.length - graphLength] ??
    stock.historical[0];
  const percentage = (stock.value / prevPrice - 1) * 100;

  return (
    <Card
      className="h-[214px] flex justify-between overflow-hidden flex-col"
      x-chunk="charts-01-chunk-7"
      style={{ width: "calc((100vw - 480px) / 5)" }}
    >
      <CardHeader className="space-y-0 pb-0">
        <CardDescription style={{ color: stock.color }}>
          {stock.name} ({stock.shortName})
        </CardDescription>
        <CardTitle className="flex justify-between items-baseline text-4xl tabular-nums">
          <div className="flex gap-1 items-baseline">
            {stock.value.toFixed(0)}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              $
            </span>{" "}
          </div>
          <Percentage
            className="text-lg font-normal tracking-normal"
            percentage={percentage}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            time: {
              label: "Time",
              color: stock.color,
            },
          }}
          className="h-[130px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={stock.historical
              .map((value) => ({
                time: value,
              }))
              .slice(-graphLength)}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
            <defs>
              <linearGradient
                id={stock.shortName + "-filler"}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={stock.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={stock.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              isAnimationActive={false}
              dataKey="time"
              type="natural"
              fill={`url(#${stock.shortName + "-filler"})`}
              fillOpacity={0.4}
              stroke={stock.color}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
