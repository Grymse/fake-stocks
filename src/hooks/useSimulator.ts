import { ISimulationAlgorithm } from "@/lib/simulationAlgorithm/ISimulationAlgorithm";
import { SimpleSimulationAlgorithm } from "@/lib/simulationAlgorithm/SimpleSimulationAlgorithms";
import { Stock } from "@/types";
import { useEffect, useState } from "react";

const durationInterval = 50;

export function useSimulator(
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>,
  active: boolean
) {
  const [algorithm, setAlgorithm] = useState<ISimulationAlgorithm>(
    new SimpleSimulationAlgorithm()
  );

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setStocks((stocks) =>
        stocks.map((stock) => {
          stock.historical.push(stock.value);

          return {
            ...stock,
            value: algorithm.nextValue(stock),
          };
        })
      );
    }, durationInterval);

    return () => {
      clearInterval(interval);
    };
  }, [active, algorithm]); // We cannot add setStocks here because it will cause an infinite loop

  return { setAlgorithm };
}
