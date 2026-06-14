"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TimeframeSelector from "@/components/TimeframeSelector";
import IndicatorPanel from "@/components/IndicatorPanel";
import MarketSelector from "@/components/MarketSelector";
import DataFetcher from "@/components/DataFetcher";
import SettingsPanel from "@/components/SettingsPanel";
import AlertsPanel from "@/components/AlertsPanel";
import DrawingTools from "@/components/DrawingTools";

const ChartContainer = dynamic(() => import("@/components/ChartContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#0f0f0f]">
      <div className="text-zinc-500">Loading chart...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <DataFetcher />
      <SettingsPanel />
      <AlertsPanel />
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="h-9 bg-[#0f0f0f] border-b border-[#1a1a1a] flex items-center overflow-x-auto shrink-0">
            <MarketSelector />
            <div className="w-px h-4 bg-[#252525] mx-1" />
            <TimeframeSelector />
            <div className="w-px h-4 bg-[#252525] mx-1" />
            <IndicatorPanel />
            <div className="w-px h-4 bg-[#252525] mx-1" />
            <DrawingTools />
          </div>

          <ChartContainer />

          <div className="h-6 bg-[#0f0f0f] border-t border-[#1a1a1a] flex items-center px-3 text-[10px] text-zinc-500 shrink-0">
            <span>TradeView-Free</span>
            <span className="mx-2">|</span>
            <span>Crypto: Binance | Forex & India: Yahoo Finance</span>
            <span className="mx-2">|</span>
            <span>Real-time Charts</span>
          </div>
        </main>
      </div>
    </div>
  );
}
