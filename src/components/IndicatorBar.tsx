"use client";

import { useStore } from "@/store/useStore";

export default function IndicatorBar() {
  const { indicators, toggleIndicator } = useStore();

  const quickIndicators = [
    { type: "bollinger" as const, label: "BB" },
    { type: "ema" as const, label: "EMA9", period: 9 },
    { type: "ema" as const, label: "EMA21", period: 21 },
    { type: "ema" as const, label: "EMA50", period: 50 },
    { type: "ema" as const, label: "EMA200", period: 200 },
    { type: "vwap" as const, label: "VWAP" },
    { type: "psar" as const, label: "SAR" },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1 border-t flex-wrap" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <span className="text-[8px] font-semibold uppercase tracking-wider mr-1" style={{ color: 'var(--text3)' }}>Inds</span>
      {quickIndicators.map((ind) => {
        const isActive = indicators.find((i) => i.type === ind.type && (ind.period ? i.period === ind.period : true))?.visible;
        return (
          <button
            key={`${ind.type}_${ind.period || ''}`}
            onClick={() => toggleIndicator(ind.type)}
            className="text-[9px] font-medium px-1.5 py-0.5 rounded-full transition-all border"
            style={{
              borderColor: isActive ? 'rgba(108,99,255,0.33)' : 'var(--border)',
              background: isActive ? 'rgba(108,99,255,0.07)' : 'transparent',
              color: isActive ? 'var(--purple)' : 'var(--text3)',
            }}
          >
            {ind.label}
          </button>
        );
      })}
    </div>
  );
}
