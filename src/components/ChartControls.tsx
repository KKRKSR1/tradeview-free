"use client";

import { useStore } from "@/store/useStore";
import { ZoomIn, ZoomOut, RefreshCw, Maximize2, Crosshair } from "lucide-react";

export default function ChartControls() {
  const { symbol, symbolName, market, ticker } = useStore();

  return (
    <div className="absolute bottom-16 right-2 z-20 flex flex-col gap-1">
      <button
        className="w-7 h-7 flex items-center justify-center rounded bg-[#1e222d] border border-[#2a2e39] text-zinc-400 hover:text-white hover:bg-[#2a2e39] transition-colors"
        title="Zoom In"
        onClick={() => {
          const chart = document.querySelector(".tv-lightweight-charts") as HTMLDivElement;
          if (chart) {
            const event = new WheelEvent("wheel", { deltaY: -100, bubbles: true });
            chart.dispatchEvent(event);
          }
        }}
      >
        <ZoomIn size={14} />
      </button>
      <button
        className="w-7 h-7 flex items-center justify-center rounded bg-[#1e222d] border border-[#2a2e39] text-zinc-400 hover:text-white hover:bg-[#2a2e39] transition-colors"
        title="Zoom Out"
        onClick={() => {
          const chart = document.querySelector(".tv-lightweight-charts") as HTMLDivElement;
          if (chart) {
            const event = new WheelEvent("wheel", { deltaY: 100, bubbles: true });
            chart.dispatchEvent(event);
          }
        }}
      >
        <ZoomOut size={14} />
      </button>
      <button
        className="w-7 h-7 flex items-center justify-center rounded bg-[#1e222d] border border-[#2a2e39] text-zinc-400 hover:text-white hover:bg-[#2a2e39] transition-colors"
        title="Reset Chart"
        onClick={() => {
          window.dispatchEvent(new CustomEvent("chart:fitContent"));
        }}
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
}
