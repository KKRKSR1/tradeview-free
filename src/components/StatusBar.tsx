"use client";

import { useStore } from "@/store/useStore";
import { Clock, Globe } from "lucide-react";

export default function StatusBar() {
  const { market, interval, ticker } = useStore();

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="h-6 bg-[#131722] border-t border-[#2a2e39] flex items-center px-3 text-[10px] text-zinc-500 shrink-0 gap-4">
      <div className="flex items-center gap-1">
        <Globe size={10} />
        <span>
          {market === "crypto" ? "Binance" : market === "forex" ? "Yahoo Finance" : "NSE India"}
        </span>
      </div>
      <div className="w-px h-3 bg-[#2a2e39]" />
      <span>{interval}</span>
      <div className="w-px h-3 bg-[#2a2e39]" />
      <div className="flex items-center gap-1">
        <Clock size={10} />
        <span>{timeStr}</span>
      </div>
      <span>{dateStr}</span>
      <div className="flex-1" />
      <span className="text-emerald-500">LIVE</span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
    </div>
  );
}
