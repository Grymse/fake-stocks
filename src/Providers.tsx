import LedgerProvider from "./contexts/LedgerProvider";
import { Toaster } from "@/components/ui/toaster";
import KeepScreenAwake from "./components/utils/KeepScreenAwake";
import AddFakeData from "./components/ledger/AddFakeData";
import { AnimationsProvider } from "./contexts/AnimationsProvider";
import PreventWebsiteExit from "./components/utils/PreventWebsiteExit";
import AutosaveLedger from "./components/ledger/AutosaveLedger";
import { useFlags } from "./hooks/useFlags";
import React from "react";
import { DarkmodeProvider } from "./contexts/DarkmodeProvider";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  const { fake } = useFlags();

  return (
    <>
      <Toaster />
      <KeepScreenAwake />
      <PreventWebsiteExit />
      <DarkmodeProvider>
        <AnimationsProvider>
          <LedgerProvider>
            <AutosaveLedger />
            {fake && <AddFakeData />}
            {children}
          </LedgerProvider>
        </AnimationsProvider>
      </DarkmodeProvider>
    </>
  );
}
