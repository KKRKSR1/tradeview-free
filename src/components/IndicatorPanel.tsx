"use client";

import { useStore } from "@/store/useStore";
import { IndicatorType } from "@/types";

interface IndicatorDef {
  type: IndicatorType;
  label: string;
  category: "overlay" | "oscillator";
}

const INDICATORS: IndicatorDef[] = [
  { type: "sma", label: "SMA", category: "overlay" },
  { type: "ema", label: "EMA", category: "overlay" },
  { type: "bollinger", label: "BB", category: "overlay" },
  { type: "rsi", label: "RSI", category: "oscillator" },
  { type: "macd", label: "MACD", category: "oscillator" },
  { type: "volume", label: "VOL", category: "overlay" },
];

export default function IndicatorPanel() {
  const { indicators, toggleIndicator } = useStore();

  return (
    <div className="flex items-center gap-1 px-2">
      <span className="text-[10px] text-zinc-500 uppercase mr-1">Ind:</span>
      {INDICATORS.map((ind) => {
        const config = indicators.find((i) => i.type === ind.type);
        const isActive = config?.visible ?? false;

        return (
          <button
            key={ind.type}
            onClick={() => toggleIndicator(ind.type)}
            className={`
              px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors
              ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent"
              }
            `}
          >
            {ind.label}
          </button>
        );
      })}
    </div>
  );
}
