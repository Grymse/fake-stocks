import Ledger from "./components/ledger/Ledger";
import LedgerProvider from "./components/ledger/LedgerProvider";
import LedgerUpdaterVisualizer from "./components/ledger/LedgerUpdaterVisualizer";
import Stocks from "./components/stocks/Stocks";
import ControlPanel from "./components/controls/ControlPanel";
import { Toaster } from "@/components/ui/toaster";
import Graph from "./components/stocks/Graph";
import KeepScreenAwake from "./components/utils/KeepScreenAwake";
import AddFakeData from "./components/ledger/AddFakeData";
import { AnimationsProvider } from "./components/utils/AnimationsProvider";
import PreventWebsiteExit from "./components/utils/PreventWebsiteExit";
import AutosaveLedger from "./components/ledger/AutosaveLedger";
import { useFlags } from "./hooks/useFlags";
import { useDarkmode } from "./hooks/useDarkmode";

function App() {
  const { fake } = useFlags();
  useDarkmode();

  return (
    <>
      <Toaster />
      <KeepScreenAwake />
      <PreventWebsiteExit />
      <AnimationsProvider>
        <LedgerProvider>
          <AutosaveLedger />
          <LedgerUpdaterVisualizer />
          {fake && <AddFakeData />}
          <div
            className="w-screen gap-4 p-4 h-screen"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 370px",
            }}
          >
            <div className="flex gap-4 flex-col">
              <Stocks />
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
