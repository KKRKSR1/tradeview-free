"use client";

import { useStore } from "@/store/useStore";

export default function StatusBar() {
  const { market, interval, ticker, symbol } = useStore();

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const displaySymbol = symbol.replace("=X", "").replace(".NS", "").replace("^", "");

  return (
    <div className="flex items-center px-3 gap-3 text-[9px] border-t shrink-0" style={{ height: '32px', background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text3)' }}>
      {/* Live Indicator */}
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
        <span>Live</span>
      </div>

      {/* Symbol Info */}
      <span style={{ color: 'var(--text2)' }}>{displaySymbol} · {market === "crypto" ? "Binance" : market === "forex" ? "Yahoo" : "NSE"}</span>

      {/* Time */}
      <span>{timeStr}</span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* RSI */}
      {ticker && (
        <span>
          RSI <span style={{ color: 'var(--purple)' }}>—</span>
        </span>
      )}

      {/* MACD */}
      {ticker && (
        <span>
          MACD <span style={{ color: 'var(--blue)' }}>—</span>
        </span>
      )}

      {/* Alert Count */}
      <span style={{ color: 'var(--amber)' }}></span>
    </div>
  );
}
