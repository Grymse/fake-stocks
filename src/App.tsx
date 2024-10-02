import { useEffect } from "react";
import Ledger from "./ledger/Ledger";
import LedgerProvider from "./ledger/LedgerProvider";
import LedgerUpdater from "./ledger/LedgerUpdater";
import StockOverview from "./StockOverview";
import ControlPanel from "./controls/ControlPanel";
import { Toaster } from "@/components/ui/toaster";
import Graph from "./Graph";
import KeepScreenAwake from "./KeepScreenAwake";
import AddFakeData from "./AddFakeData";
import { AnimationsProvider } from "./AnimationsProvider";
import PreventWebsiteExit from "./PreventWebsiteExit";
import AutosaveLedger from "./AutosaveLedger";
import { useFlags } from "./useFlags";

function App() {
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.add("dark");
  }, []);

  const { fake } = useFlags();

  return (
    <>
      <Toaster />
      <KeepScreenAwake />
      <PreventWebsiteExit />
      <AnimationsProvider>
        <LedgerProvider>
          <AutosaveLedger />
          <LedgerUpdater />
          {fake && <AddFakeData />}
          <div
            className="w-screen max-w-screen gap-4 p-4 h-screen overflow-hidden"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 370px",
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
              className="flex gap-4 flex-col max-h-full w-full max-w-full h-full"
            >
              <StockOverview />
              <Graph />
            </div>
            <Ledger />
          </div>
          <ControlPanel />
        </LedgerProvider>
      </AnimationsProvider>
    </>
  );
}

export default App;
