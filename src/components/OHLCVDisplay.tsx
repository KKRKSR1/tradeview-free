"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export default function OHLCVDisplay() {
  const { candles } = useStore();
  const [data, setData] = useState<{
    time: string; open: number; high: number; low: number; close: number; volume: number;
  } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setData(customEvent.detail);
      }
    };
    window.addEventListener("chart:crosshair", handler);
    return () => window.removeEventListener("chart:crosshair", handler);
  }, []);

  // Show last candle if no crosshair data
  useEffect(() => {
    if (!data && candles.length > 0) {
      const last = candles[candles.length - 1];
      setData({
        time: last.displayTime,
        open: last.open,
        high: last.high,
        low: last.low,
        close: last.close,
        volume: last.volume,
      });
    }
  }, [candles, data]);

  if (!data) return null;

  const isUp = data.close >= data.open;

  return (
    <div className="absolute top-2 left-16 z-20 flex items-center gap-3 text-[11px] font-mono pointer-events-none">
      <span className="text-zinc-500">O</span>
      <span className={isUp ? "text-emerald-400" : "text-red-400"}>{data.open.toFixed(2)}</span>
      <span className="text-zinc-500">H</span>
      <span className={isUp ? "text-emerald-400" : "text-red-400"}>{data.high.toFixed(2)}</span>
      <span className="text-zinc-500">L</span>
      <span className={isUp ? "text-emerald-400" : "text-red-400"}>{data.low.toFixed(2)}</span>
      <span className="text-zinc-500">C</span>
      <span className={isUp ? "text-emerald-400" : "text-red-400"}>{data.close.toFixed(2)}</span>
      <span className="text-zinc-500">Vol</span>
      <span className="text-zinc-400">{(data.volume / 1000000).toFixed(2)}M</span>
    </div>
  );
}
