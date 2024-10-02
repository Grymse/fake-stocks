import LedgerProvider from "./components/ledger/LedgerProvider";
import { Toaster } from "@/components/ui/toaster";
import KeepScreenAwake from "./components/utils/KeepScreenAwake";
import AddFakeData from "./components/ledger/AddFakeData";
import { AnimationsProvider } from "./components/utils/AnimationsProvider";
import PreventWebsiteExit from "./components/utils/PreventWebsiteExit";
import AutosaveLedger from "./components/ledger/AutosaveLedger";
import { useFlags } from "./hooks/useFlags";
import { useDarkmode } from "./hooks/useDarkmode";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
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
          {fake && <AddFakeData />}
          {children}
        </LedgerProvider>
      </AnimationsProvider>
    </>
  );
}
