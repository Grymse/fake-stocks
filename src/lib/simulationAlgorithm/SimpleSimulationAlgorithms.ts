import { Stock } from "@/types";
import { ISimulationAlgorithm } from "./ISimulationAlgorithm";
import { TendencyCalculator } from "./TendencyCalculator";

export class SimpleSimulationAlgorithm implements ISimulationAlgorithm {
  private tendencyCalculator = new TendencyCalculator(60 * 3);

  nextValue(stock: Stock): number {
    const tendencies = this.tendencyCalculator.getTendency(stock);

    const overallTendency =
      ((tendencies.general * 0.3 + tendencies.stock + 0.2) / 18) *
      stock.volatile;

    const newValue =
      stock.value *
      (1 -
        stock.volatile +
        Math.random() * (stock.volatile * 2 + overallTendency));

    if (newValue < stock.min) {
      this.tendencyCalculator.forceTendency(stock, 10);
      return stock.min;
    }
    if (stock.max < newValue) {
      this.tendencyCalculator.forceTendency(stock, -10);
      return stock.max;
    }
    return newValue;
  }
}
