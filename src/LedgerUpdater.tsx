import { useContext, useEffect, useState } from "react";
import { LedgerContext } from "./LedgerProvider";
import "./index.css";
import { Stock, StockTendency } from "./types";

const durationInterval = 1000;
const tendencyLength = 60 * 3 * durationInterval;

export default function LedgerUpdater() {
  const { updateStockValues, active } = useContext(LedgerContext);
  const [tendency, setTendency] = useState<StockTendency>(generateTendency());

  useEffect(() => {
    updateStockValues(defaultStocks);
    console.log("General tendency", tendency);
    console.log(
      defaultStocks.map((stock) => stock.name + " " + stock.mood).join("\n")
    );

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
            ((tendency * 0.3 + stock.mood + 0.2) / 18) * stock.volatile;

          const newValue =
            stock.value *
            (1 -
              stock.volatile +
              Math.random() * (stock.volatile * 2 + overallTendency));

          if (newValue < stock.min) {
            return {
              ...stock,
              mood: 20,
            };
          }
          if (newValue > stock.max) {
            return {
              ...stock,
              mood: -20,
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
      const tendency = generateTendency();
      setTendency(tendency);
      console.log("General tendency", tendency);
      updateStockValues((stocks) =>
        stocks.map((stock) => {
          const mood = generateTendency();
          console.log(stock.shortName, mood);
          return {
            ...stock,
            mood,
          };
        })
      );
    }, tendencyLength);

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

const defaultStocks: Stock[] = [
  {
    id: 0,
    name: "Olie Baronen",
    shortName: "OLIE",
    value: 50,
    min: 15,
    max: 500,
    volatile: 0.012,
    historical: [],
    color: "#e23670",
    mood: generateTendency(),
  },
  {
    id: 1,
    name: "Amager Airlines",
    shortName: "SKRT",
    value: 30,
    min: 10,
    max: 300,
    volatile: 0.012,
    historical: [],
    color: "#2eb88a",
    mood: generateTendency(),
  },
  {
    id: 2,
    name: "Hundekrone",
    shortName: "DOGE",
    value: 10,
    min: 1,
    max: 100,
    volatile: 0.017,
    historical: [],
    color: "#e88c30",
    mood: generateTendency(),
  },
  {
    id: 3,
    name: "Nuclear Power",
    shortName: "BOOM",
    value: 35,
    min: 10,
    max: 800,
    volatile: 0.012,
    historical: [],
    color: "#af57db",
    mood: generateTendency(),
  },
  {
    id: 4,
    name: "Faxe Kondi",
    shortName: "FAXE",
    value: 20,
    min: 3,
    max: 140,
    volatile: 0.014,
    historical: [],
    color: "#2662d9",
    mood: generateTendency(),
  },
];
