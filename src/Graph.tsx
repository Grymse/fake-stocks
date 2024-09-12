import { useContext, useEffect, useMemo, useState } from "react";
import { LedgerContext } from "./LedgerProvider";
import { ChartConfig, ChartContainer } from "./components/ui/chart";
import { Card, CardContent } from "./components/ui/card";
import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

function getChartConfig(stocks: Stock[]): ChartConfig {
  const chartConfig = {
    views: {
      label: "Page Views",
    },
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  stocks.forEach((stock) => {
    chartConfig[stock.shortName] = {
      label: stock.name,
      color: stock.color,
    };
  });

  return chartConfig;
}

export default function Graph() {
  const { stocks } = useContext(LedgerContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const currentIndex = stocks[0]?.historical?.length;
    if (!currentIndex) return;

    const newObject = {};
    stocks.forEach((stock) => {
      newObject[stock.shortName] = stock.value;
    });

    setChartData((prev) => {
      prev[currentIndex] = newObject;
      return [...prev];
    });
  }, [stocks]);

  /* useEffect(() => {
    const currentIndex = stocks[0]?.historical?.length / 3;
    if (!currentIndex) return;

    const array: object[] = [];

    for (let i = 0; i < currentIndex; i++) {
      const newObject = {};
      stocks.forEach((stock) => {
        newObject[stock.shortName] = stock.historical[i * 3];
      });

      array.push(newObject);
    }

    setChartData(array);
  }, [stocks]); */

  const chartConfig = useMemo(() => getChartConfig(stocks), []);

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <YAxis
              dataKey={stocks[0]?.shortName}
              tickLine={true}
              tickMargin={5}
              tickFormatter={(value) => value + "$"}
            />
            <CartesianGrid vertical={false} />
            {stocks.map((stock) => (
              <Line
                key={stock.shortName}
                dataKey={stock.shortName}
                type="monotone"
                stroke={stock.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
