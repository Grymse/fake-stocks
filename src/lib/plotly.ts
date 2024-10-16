// @ts-expect-error Doesn't have a default export
import ExistingPlotly from "plotly.js/dist/plotly-basic.min";
import createPlotlyComponent from "react-plotly.js/factory";

export const Plotly = createPlotlyComponent(ExistingPlotly);
