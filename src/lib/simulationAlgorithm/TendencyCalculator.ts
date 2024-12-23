import { Stock } from "@/types";

type StockTendency = {
  general: number;
  stock: number;
};

type StockUpdateValue = {
  updates: number;
  tendency: number;
};

export class TendencyCalculator {
  private stockTendencies: Map<number, StockUpdateValue> = new Map();
  private generalTendency: number = 0;
  private updatesBetweenTendencies: number = 0;

  constructor(updates: number) {
    this.updatesBetweenTendencies = updates;
  }

  getStockUpdateValue(stock: Stock): StockUpdateValue {
    let updateValue = this.stockTendencies.get(stock.id);
    if (!updateValue) {
      updateValue = {
        updates: 0,
        tendency: 0,
      };
      this.stockTendencies.set(stock.id, updateValue);
    }
    return updateValue;
  }

  forceTendency(stock: Stock, tendency: number): void {
    const updateValue = this.getStockUpdateValue(stock);
    updateValue.tendency = tendency;
  }

  getTendency(stock: Stock): StockTendency {
    const updateValue = this.getStockUpdateValue(stock);

    if (updateValue.updates % this.updatesBetweenTendencies === 0) {
      updateValue.tendency = this.generateTendency();
      this.generalTendency = this.generateTendency();
    }

    updateValue.updates++;

    return {
      general: this.generalTendency,
      stock: updateValue.tendency,
    };
  }

  generateTendency(): number {
    return Math.floor(Math.random() * 7) - 3;
  }
}
