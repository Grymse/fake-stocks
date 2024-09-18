import { useEffect } from "react";
import Ledger from "./Ledger";
import LedgerProvider from "./LedgerProvider";
import LedgerUpdater from "./LedgerUpdater";
import StockOverview from "./StockOverview";
import ControlPanel from "./controls/ControlPanel";
import { Toaster } from "@/components/ui/toaster";
import Graph from "./Graph";
import KeepScreenAwake from "./KeepScreenAwake";
import AddFakeData from "./AddFakeData";

function App() {
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.add("dark");
  }, []);
  return (
    <>
      <Toaster />
      <KeepScreenAwake />
      <LedgerProvider>
        <LedgerUpdater />
        <div
          className="w-screen gap-4 p-4 h-screen overflow-hidden"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 450px",
            gridTemplateRows: "1fr",
            gridTemplateAreas: `
            "main side"
          `,
          }}
        >
          <div
            style={{
              gridArea: "main",
            }}
            className="flex gap-4 flex-col max-h-full h-full"
          >
            <StockOverview />
            <Graph />
          </div>
          <div
            style={{
              gridArea: "side",
            }}
            className="flex gap-4 flex-col"
          >
            <ControlPanel />
            <Ledger />
          </div>
        </div>
        <AddFakeData />
      </LedgerProvider>
    </>
  );
}

export default App;
