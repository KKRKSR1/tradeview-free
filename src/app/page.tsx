"use client";

import dynamic from "next/dynamic";
import LeftToolbar from "@/components/LeftToolbar";
import TopToolbar from "@/components/TopToolbar";
import ChartControls from "@/components/ChartControls";
import OHLCVDisplay from "@/components/OHLCVDisplay";
import StatusBar from "@/components/StatusBar";
import DataFetcher from "@/components/DataFetcher";
import SettingsPanel from "@/components/SettingsPanel";
import AlertsPanel from "@/components/AlertsPanel";

const ChartContainer = dynamic(() => import("@/components/ChartContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#131722]">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-[#131722] text-white overflow-hidden select-none">
      <DataFetcher />
      <SettingsPanel />
      <AlertsPanel />

      {/* Top Toolbar */}
      <TopToolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar + Watchlist */}
        <LeftToolbar />

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <OHLCVDisplay />
          <ChartControls />
          <ChartContainer />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
