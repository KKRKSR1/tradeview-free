"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { MARKET_SYMBOLS, TIMEFRAMES, PREMIUM_INDICATORS, Timeframe, IndicatorType, MarketType } from "@/types";
import {
  Search, ChevronDown, BarChart3, TrendingUp, Bell, Settings,
  Grid, RefreshCw, ZoomIn, ZoomOut, Maximize
} from "lucide-react";

export default function TopToolbar() {
  const {
    symbol, symbolName, market, interval, setInterval,
    setSymbol, indicators, toggleIndicator, ticker,
    toggleSettings, toggleAlerts,
  } = useStore();

  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [showTimeframes, setShowTimeframes] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter symbols for search
  const allSymbols = Object.entries(MARKET_SYMBOLS).flatMap(([market, symbols]) =>
    symbols.map((s) => ({ ...s, market: market as MarketType }))
  );
  const filteredSymbols = allSymbols.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as HTMLElement)) {
        setShowSymbolSearch(false);
        setShowTimeframes(false);
        setShowIndicators(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const marketLabel: Record<MarketType, string> = { crypto: "CRYPTO", forex: "FOREX", indian: "INDIA" };
  const marketColor: Record<MarketType, string> = { crypto: "bg-amber-500/20 text-amber-400", forex: "bg-blue-500/20 text-blue-400", indian: "bg-orange-500/20 text-orange-400" };

  return (
    <div className="h-11 bg-[#1e222d] border-b border-[#2a2e39] flex items-center px-2 gap-1 shrink-0">
      {/* Symbol Search */}
      <div className="relative" ref={searchRef}>
        <button
          onClick={() => setShowSymbolSearch(!showSymbolSearch)}
          className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-[#2a2e39] transition-colors"
        >
          <span className="text-white font-bold text-sm">{symbol.replace("=X", "").replace(".NS", "")}</span>
          <span className={`text-[9px] px-1 py-0.5 rounded ${marketColor[market]}`}>{marketLabel[market]}</span>
          <ChevronDown size={12} className="text-zinc-400" />
        </button>

        {showSymbolSearch && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-[#1e222d] border border-[#2a2e39] rounded-lg shadow-2xl z-50">
            <div className="p-2 border-b border-[#2a2e39]">
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#131722] text-white text-sm pl-8 pr-3 py-2 rounded border border-[#2a2e39] focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredSymbols.map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => {
                    setSymbol(s.symbol, s.name, s.market);
                    setShowSymbolSearch(false);
                    setSearchQuery("");
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between hover:bg-[#2a2e39]"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${s.market === "crypto" ? "amber" : s.market === "forex" ? "blue" : "orange"}-400`} />
                    <div className="text-left">
                      <div className="text-sm text-white">{s.name}</div>
                      <div className="text-[10px] text-zinc-500">{s.symbol.replace("=X", "").replace(".NS", "")}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${marketColor[s.market]}`}>
                    {s.market === "crypto" ? "CRYPTO" : s.market === "forex" ? "FOREX" : "INDIA"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-[#2a2e39]" />

      {/* Timeframe */}
      <div className="relative">
        <button
          onClick={() => setShowTimeframes(!showTimeframes)}
          className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-[#2a2e39] text-white text-sm"
        >
          {interval}
          <ChevronDown size={10} className="text-zinc-400" />
        </button>

        {showTimeframes && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-[#1e222d] border border-[#2a2e39] rounded-lg shadow-2xl z-50 p-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => {
                  setInterval(tf.value);
                  setShowTimeframes(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs rounded ${
                  interval === tf.value
                    ? "bg-blue-600 text-white"
                    : "text-zinc-300 hover:bg-[#2a2e39]"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-[#2a2e39]" />

      {/* Indicators */}
      <div className="relative">
        <button
          onClick={() => setShowIndicators(!showIndicators)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#2a2e39] text-zinc-300 text-xs"
        >
          <BarChart3 size={14} />
          <span>Indicators</span>
        </button>

        {showIndicators && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-[#1e222d] border border-[#2a2e39] rounded-lg shadow-2xl z-50">
            <div className="p-2 border-b border-[#2a2e39]">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search indicators..."
                  className="w-full bg-[#131722] text-white text-xs pl-7 pr-2 py-1.5 rounded border border-[#2a2e39] focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {Object.entries(
                PREMIUM_INDICATORS.reduce((acc, ind) => {
                  if (!acc[ind.category]) acc[ind.category] = [];
                  acc[ind.category].push(ind);
                  return acc;
                }, {} as Record<string, typeof PREMIUM_INDICATORS>)
              ).map(([category, items]) => (
                <div key={category}>
                  <div className="px-2 py-1 text-[10px] text-zinc-500 uppercase font-semibold">{category}</div>
                  {items.map((ind) => {
                    const active = indicators.find((i) => i.type === ind.type)?.visible;
                    return (
                      <button
                        key={ind.type}
                        onClick={() => toggleIndicator(ind.type)}
                        className={`w-full px-2 py-1.5 text-left text-xs rounded flex items-center justify-between ${
                          active ? "bg-blue-600/20 text-blue-400" : "text-zinc-300 hover:bg-[#2a2e39]"
                        }`}
                      >
                        <span>{ind.name}</span>
                        {active && <span className="text-[10px] text-blue-400">ON</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-[#2a2e39]" />

      {/* Active indicators badges */}
      <div className="flex items-center gap-1">
        {indicators.filter((i) => i.visible).map((ind) => (
          <span
            key={ind.type}
            className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 cursor-pointer hover:bg-blue-600/30"
            onClick={() => toggleIndicator(ind.type)}
          >
            {ind.type.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Price display */}
      {ticker && (
        <div className="flex items-center gap-3 mr-3">
          <span className={`font-mono text-sm font-bold ${ticker.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {ticker.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-xs font-mono ${ticker.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {ticker.change >= 0 ? "+" : ""}{ticker.changePercent.toFixed(2)}%
          </span>
        </div>
      )}

      <div className="w-px h-5 bg-[#2a2e39]" />

      {/* Action buttons */}
      <button onClick={toggleAlerts} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2a2e39] text-zinc-400 hover:text-yellow-400" title="Alerts">
        <Bell size={15} />
      </button>
      <button onClick={toggleSettings} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2a2e39] text-zinc-400 hover:text-white" title="Settings">
        <Settings size={15} />
      </button>
    </div>
  );
}
