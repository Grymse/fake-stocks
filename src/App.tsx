import Ledger from "./components/ledger/Ledger";
import LedgerUpdaterVisualizer from "./components/ledger/LedgerUpdaterVisualizer";
import Stocks from "./components/stocks/Stocks";
import ControlPanel from "./components/controls/ControlPanel";
import Graph from "./components/stocks/Graph";
import Providers from "./Providers";

function App() {
  return (
    <Providers>
      <LedgerUpdaterVisualizer />
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
    </Providers>
  );
}

export default App;
