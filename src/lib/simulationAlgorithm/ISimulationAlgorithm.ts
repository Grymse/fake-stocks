import { Stock } from "@/types";

export interface ISimulationAlgorithm {
  nextValue(stock: Stock): number;
}
