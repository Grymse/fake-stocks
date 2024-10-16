import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Stock } from "@/types";
import Percentage from "./Percentage";
import { Plotly } from "@/lib/plotly";

type Props = { stock: Stock };

const graphLength = 300;

export default function StockComponent({ stock }: Props) {
  const prevPrice =
    stock.historical[stock.historical.length - graphLength] ??
    stock.historical[0];
  const percentage = (stock.value / prevPrice - 1) * 100;
  const data = stock.historical.slice(-graphLength);

  const trace = {
    x: Array(data.length)
      .fill(0)
      .map((_, i) => i),
    y: data,
    mode: "lines",
    line: {
      color: stock.color,
      width: 1,
    },
    fill: "tozeroy", // Fills the area under the line to the x-axis
    fillcolor: stock.color + "25", // Fading fill color (adjust the alpha for transparency)
  };

  // Layout with no labels, titles, or ticks
  const layout = {
    xaxis: {
      visible: false,
    },
    yaxis: {
      range: [Math.min(...data) - 2, Math.max(...data) + 2],
      visible: false,
    },
    margin: {
      t: 0, // top margin
      r: 0, // right margin
      b: 0, // bottom margin
      l: 0, // left margin
    },
    showlegend: false,
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    autosize: true,
  };

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
      <CardContent
        style={{ width: "calc((100vw - 480px) / 5)" }}
        className="p-0 h-full w-full pointer-events-none cursor-none"
      >
        <Plotly
          layout={layout}
          data={[trace]}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
          config={{ responsive: true, staticPlot: true, displayModeBar: false }}
        />
      </CardContent>
    </Card>
  );
}
