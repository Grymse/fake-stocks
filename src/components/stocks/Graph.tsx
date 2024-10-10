import { Card, CardContent } from "@/components/ui/card";
import { useResizeDetector } from "react-resize-detector";
import Plot from "react-plotly.js";
import { useLedger } from "@/hooks/useLedger";
import { LOG } from "../admin/Log";
import { useDarkmode } from "@/hooks/useDarkmode";

export default function Graph() {
  const { stocks } = useLedger();
  const { isDarkmode } = useDarkmode();
  const { width, height, ref } = useResizeDetector({});

  const layout = {
    ...defaultLayout,
    width: width,
    height: height,
  };

  if (!isDarkmode) {
    layout.yaxis!.tickfont!.color = "rgb(100 116 139)";
    layout.yaxis!.gridcolor = "rgb(203 213 225)";
  }

  if (stocks[0]?.historical?.length && stocks[0].historical.length % 50 === 0)
    LOG("Total updates: " + stocks[0].historical.length);

  return (
    <Card className="p-0 m-0 relative overflow-hidden w-full">
      <CardContent
        className="p-0 m-0"
        style={{ height: "calc(100vh - 264px)", width: "calc(100vw - 420px)" }}
        ref={ref}
      >
        <Plot
          data={stocks.map((stock) => ({
            x: stock.historical.map((_, index) => index),
            y: stock.historical,
            type: "scatter",
            line: { color: stock.color, width: 2 },
          }))}
          layout={layout}
          config={defaultConfig}
        />
      </CardContent>
    </Card>
  );
}

const defaultLayout: Partial<Plotly.Layout> = {
  hovermode: false,
  showlegend: false,
  xaxis: {
    visible: false,
  },
  yaxis: {
    tickprefix: "$", // Format Y-axis values with a dollar sign
    tickfont: {
      color: "rgb(209 213 219)", // Change the Y-axis text color
      size: 14, // Set font size
    },
    ticks: "outside", // Position ticks outside of the axis line
    ticklen: 10, // Length of the tick lines
    nticks: 12, // Increase the number of vertical grid lines
    gridcolor: "rgb(75 85 99)", // Change the color of the vertical grid lines
  },
  plot_bgcolor: "rgba(0,0,0,0)", // Remove plot background
  paper_bgcolor: "rgba(0,0,0,0)", // Remove surrounding paper background
  autosize: true,
  margin: {
    l: 64, // Left margin
    r: 48, // Right margin
    t: 36, // Top margin
    b: 36, // Bottom margin
  },
};

const defaultConfig = {
  staticPlot: true,
  displayModeBar: false, // Disable
};
