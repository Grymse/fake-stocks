import { ISimulationAlgorithm } from "@/lib/simulationAlgorithm/ISimulationAlgorithm";
import { SimpleSimulationAlgorithm } from "@/lib/simulationAlgorithm/SimpleSimulationAlgorithms";
import { Stock } from "@/types";
import { useEffect, useState } from "react";
import { ActiveState } from "./useLedgerStateManager";

export function useSimulator(
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>,
  active: ActiveState
) {
  const [algorithm, setAlgorithm] = useState<ISimulationAlgorithm>(
    new SimpleSimulationAlgorithm()
  );

  useEffect(() => {
    if (active === "INACTIVE") return;

    const durationInterval = active === "ACTIVE" ? 1000 : 50;

    const interval = setInterval(() => {
      setStocks((stocks) =>
        stocks.map((stock) => {
          const value = algorithm.nextValue(stock);

          stock.historical.push(value);

          return {
            ...stock,
            value,
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
