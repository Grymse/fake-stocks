import { useContext, useEffect, useState } from "react";
import { LedgerContext } from "./LedgerProvider";
import "./index.css";
import { StockTendency } from "./types";

const durationInterval = 1000;

export default function LedgerUpdater() {
  const { updateStockValues, active } = useContext(LedgerContext);
  const [tendency, setTendency] = useState<StockTendency>(0);

  useEffect(() => {
    updateStockValues([
      {
        id: 0,
        name: "Olie Baronen",
        shortName: "OLIE",
        value: 50,
        min: 15,
        max: 300,
        volatile: 0.01,
        historical: [],
        color: "hsl(var(--chart-5))",
        mood: 0,
      },
      {
        id: 1,
        name: "Amager Airlines",
        shortName: "SKRT",
        value: 20,
        min: 10,
        max: 200,
        volatile: 0.01,
        historical: [],
        color: "hsl(var(--chart-2))",
        mood: 0,
      },
      {
        id: 2,
        name: "Hundekrone",
        shortName: "DOGE",
        value: 20,
        min: 1,
        max: 1000,
        volatile: 0.015,
        historical: [],
        color: "hsl(var(--chart-3))",
        mood: 0,
      },
      {
        id: 3,
        name: "Nuclear Power",
        shortName: "BOOM",
        value: 35,
        min: 10,
        max: 300,
        volatile: 0.01,
        historical: [],
        color: "hsl(var(--chart-4))",
        mood: 0,
      },
      {
        id: 4,
        name: "Faxe Kondi",
        shortName: "FAXE",
        value: 10,
        min: 3,
        max: 140,
        volatile: 0.012,
        historical: [],
        color: "hsl(var(--chart-1))",
        mood: 0,
      },
    ]);

    return () => {
      updateStockValues([]);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      updateStockValues((stocks) =>
        stocks.map((stock) => {
          stock.historical.push(stock.value);

          const overallTendency =
            ((tendency + stock.mood + 1) / 16) * stock.volatile;

          const newValue =
            stock.value *
              (1 - stock.volatile + Math.random() * (stock.volatile * 2)) +
            overallTendency;

          if (newValue < stock.min) {
            return {
              ...stock,
            };
          }
          if (newValue > stock.max) {
            return {
              ...stock,
            };
          }
          return {
            ...stock,
            value: newValue,
          };
        })
      );
    }, durationInterval);

    const tendencyInterval = setInterval(() => {
      setTendency(generateTendency());
      updateStockValues((stocks) =>
        stocks.map((stock) => {
          return {
            ...stock,
            mood: generateTendency(),
          };
        })
      );
    }, durationInterval * 100);

    return () => {
      clearInterval(interval);
      clearInterval(tendencyInterval);
    };
  }, [updateStockValues, active]);

  return (
    <div
      className={`w-full h-1 absolute overflow-hidden ${
        active ? "" : "hidden"
      }`}
    >
      <div className="w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 animate-ping duration-1000" />
    </div>
  );
}

function generateTendency(): StockTendency {
  // @ts-expect-error - This is a random number generator
  return Math.floor(Math.random() * 7) - 3;
}
