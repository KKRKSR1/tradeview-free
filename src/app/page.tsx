"use client";

import dynamic from "next/dynamic";
import LeftToolbar from "@/components/LeftToolbar";
import TopToolbar from "@/components/TopToolbar";
import StatusBar from "@/components/StatusBar";
import DataFetcher from "@/components/DataFetcher";
import SettingsPanel from "@/components/SettingsPanel";
import AlertsPanel from "@/components/AlertsPanel";
import RightSidebar from "@/components/RightSidebar";
import IndicatorBar from "@/components/IndicatorBar";

const ChartContainer = dynamic(() => import("@/components/ChartContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  ),
});

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden rounded-2xl border" style={{ background: 'var(--bg)', borderColor: 'var(--border2)' }}>
      <DataFetcher />
      <SettingsPanel />
      <AlertsPanel />

      {/* Top Toolbar - 48px */}
      <TopToolbar />

      {/* Body - grid: sidebar | mid | right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - 44px */}
        <LeftToolbar />

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <ChartContainer />
          <IndicatorBar />
        </div>

        {/* Right Sidebar - 210px */}
        <RightSidebar />
      </div>

      {/* Status Bar - 32px */}
      <StatusBar />
    </div>
  );
}
