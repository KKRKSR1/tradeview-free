"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { MARKET_SYMBOLS, TIMEFRAMES, Timeframe, MarketType } from "@/types";

export default function TopToolbar() {
  const {
    symbol, symbolName, market, interval, setInterval,
    setSymbol, ticker, toggleAlerts,
  } = useStore();

  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<"candlestick" | "heikin" | "line" | "area">("candlestick");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as HTMLElement)) {
        setShowSymbolSearch(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const marketSymbols = Object.entries(MARKET_SYMBOLS).flatMap(([mkt, syms]) =>
    syms.map((s) => ({ ...s, market: mkt as MarketType }))
  );

  const displaySymbol = symbol.replace("=X", "").replace(".NS", "").replace("^", "");
  const priceChange = ticker?.changePercent || 0;
  const isUp = priceChange >= 0;

  return (
    <div className="flex items-center px-3.5 gap-2 border-b shrink-0" style={{ height: '48px', background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      {/* Logo */}
      <div className="flex items-center gap-1 mr-1 whitespace-nowrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/>
        </svg>
        <span className="text-sm font-bold text-white">Pro<span style={{ color: 'var(--accent)' }}>Chart</span></span>
      </div>

      <div className="vsep" />

      {/* Symbol Pill */}
      <div className="relative" ref={searchRef}>
        <button
          onClick={() => setShowSymbolSearch(!showSymbolSearch)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all border"
          style={{ background: 'var(--bg4)', borderColor: 'var(--border2)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)'; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <select
            value={symbol}
            onChange={(e) => {
              const s = marketSymbols.find((s) => s.symbol === e.target.value);
              if (s) setSymbol(s.symbol, s.name, s.market);
            }}
            className="text-xs font-semibold cursor-pointer outline-none"
            style={{ background: 'none', border: 'none', color: 'var(--text)', maxWidth: '110px' }}
          >
            <optgroup label="Indian Stocks">
              {marketSymbols.filter(s => s.market === 'indian').map(s => (
                <option key={s.symbol} value={s.symbol}>{s.symbol.replace('.NS', '')}</option>
              ))}
            </optgroup>
            <optgroup label="Crypto">
              {marketSymbols.filter(s => s.market === 'crypto').map(s => (
                <option key={s.symbol} value={s.symbol}>{s.symbol.replace('USDT', '/USDT')}</option>
              ))}
            </optgroup>
            <optgroup label="Forex">
              {marketSymbols.filter(s => s.market === 'forex').map(s => (
                <option key={s.symbol} value={s.symbol}>{s.symbol.replace('=X', '')}</option>
              ))}
            </optgroup>
          </select>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {showSymbolSearch && (
          <div className="absolute top-full left-0 mt-1 w-72 rounded-xl shadow-2xl z-50 overflow-hidden" style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}>
            <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <input
                autoFocus
                type="text"
                placeholder="Search symbol..."
                className="w-full text-xs pl-3 pr-2 py-2 rounded-lg outline-none"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {marketSymbols.slice(0, 15).map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => {
                    setSymbol(s.symbol, s.name, s.market);
                    setShowSymbolSearch(false);
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between transition-all"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.market === 'crypto' ? 'var(--blue)' : s.market === 'forex' ? 'var(--teal)' : 'var(--purple)' }} />
                    <div className="text-left">
                      <div className="text-xs font-medium">{s.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text3)' }}>{s.symbol.replace("=X", "").replace(".NS", "")}</div>
                    </div>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: s.market === 'crypto' ? 'rgba(56,189,248,0.15)' : s.market === 'forex' ? 'rgba(45,212,191,0.15)' : 'rgba(167,139,250,0.15)', color: s.market === 'crypto' ? 'var(--blue)' : s.market === 'forex' ? 'var(--teal)' : 'var(--purple)' }}>
                    {s.market === 'crypto' ? 'CRYPTO' : s.market === 'forex' ? 'FOREX' : 'INDIA'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Badge */}
      {ticker && (
        <span className="text-[15px] font-bold whitespace-nowrap" style={{ color: isUp ? 'var(--green)' : 'var(--red)' }}>
          {ticker.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )}

      {/* Change Badge */}
      {ticker && (
        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap" style={{ background: isUp ? 'var(--greenBg)' : 'var(--redBg)', color: isUp ? 'var(--green)' : 'var(--red)' }}>
          {isUp ? "+" : ""}{priceChange.toFixed(2)}%
        </span>
      )}

      <div className="vsep" />

      {/* Timeframe Buttons */}
      <div className="flex gap-px">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setInterval(tf.value)}
            className="text-[10px] font-medium px-1.5 py-0.5 rounded transition-all"
            style={{
              background: interval === tf.value ? 'var(--accent)' : 'transparent',
              color: interval === tf.value ? '#fff' : 'var(--text2)',
            }}
            onMouseEnter={(e) => { if (interval !== tf.value) { e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.color = 'var(--text)'; }}}
            onMouseLeave={(e) => { if (interval !== tf.value) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; }}}
          >
            {tf.label}
          </button>
        ))}
      </div>

      <div className="vsep" />

      {/* Chart Type Buttons */}
      <div className="flex gap-0.5">
        {[
          { type: "candlestick" as const, label: "Candles" },
          { type: "heikin" as const, label: "Heikin" },
          { type: "line" as const, label: "Line" },
          { type: "area" as const, label: "Area" },
        ].map((ct) => (
          <button
            key={ct.type}
            onClick={() => setChartType(ct.type)}
            className="text-[9px] px-1.5 py-0.5 rounded transition-all border"
            style={{
              background: chartType === ct.type ? 'var(--bg4)' : 'transparent',
              borderColor: chartType === ct.type ? 'var(--accent)' : 'var(--border)',
              color: chartType === ct.type ? 'var(--accent)' : 'var(--text2)',
            }}
          >
            {ct.label}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* AI Button */}
      <button className="flex items-center gap-1 rounded-lg text-[10px] px-2 py-1 transition-all border" style={{ background: 'rgba(108,99,255,0.12)', borderColor: 'rgba(108,99,255,0.33)', color: 'var(--purple)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.33)'; e.currentTarget.style.color = 'var(--purple)'; }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        AI
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
      </button>

      {/* Alerts Button */}
      <button onClick={toggleAlerts} className="flex items-center gap-1 rounded-lg text-[10px] px-2 py-1 transition-all border" style={{ background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.33)', color: 'var(--amber)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--amber)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.33)'; }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        Alerts
      </button>

      {/* Settings Button */}
      <button className="flex items-center gap-1 rounded-lg text-[10px] px-2 py-1 transition-all border" style={{ background: 'var(--bg3)', borderColor: 'var(--border2)', color: 'var(--text2)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
    </div>
  );
}
