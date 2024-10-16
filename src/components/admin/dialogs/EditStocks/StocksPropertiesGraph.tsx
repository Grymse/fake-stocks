import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { lightenColor } from "@/lib/utils";
import { Data } from "plotly.js";
import { Stock } from "@/types";
import { Plotly } from "@/lib/plotly";

type Props = {
  stocks: Stock[];
};

export default function StocksPropertiesGraph({ stocks }: Props) {
  const minValues = {
    x: stocks.map((s) => s.shortName),
    y: stocks.map((s) => s.min),
    type: "bar",
    marker: {
      color: stocks.map((s) => lightenColor(s.color, -60)),
    },
  } satisfies Data;

  const defaultValues = {
    x: stocks.map((s) => s.shortName),
    y: stocks.map((s) => s.defaultValue),
    type: "bar",
    marker: { color: stocks.map((s) => s.color) },
  } satisfies Data;

  const maxValues = {
    x: stocks.map((s) => s.shortName),
    y: stocks.map((s) => s.max),
    type: "bar",
    marker: {
      color: stocks.map((s) => lightenColor(s.color, 40)),
    },
  } satisfies Data;

  const layout = {
    ...defaultLayout,
    xaxis: {
      tickvals: [0, 1, 2, 3, 4],
      ticktext: stocks.map(
        (s) => `<span style="color:${s.color};">${s.shortName}</span>`
      ),
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <Plotly
        data={[minValues, defaultValues, maxValues]}
        layout={layout}
        config={config}
        style={{ width: "100%", height: "100%" }}
      />
    </Card>
  );
}

const defaultLayout: Partial<Plotly.Layout> = {
  barmode: "stack",
  hovermode: false,
  showlegend: false,
  yaxis: {
    visible: false,
    type: "log",
    gridcolor: "rgb(75 85 99)", // Change the color of the vertical grid lines
  },
  plot_bgcolor: "rgba(0,0,0,0)", // Remove plot background
  paper_bgcolor: "rgba(0,0,0,0)", // Remove surrounding paper background
  margin: {
    l: 24, // Left margin
    r: 24, // Right margin
    t: 0, // Top margin
    b: 36, // Bottom margin
  },
  height: 500,
};

const config = {
  staticPlot: true,
  displayModeBar: false, // Disable
};
