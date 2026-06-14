"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { MARKET_SYMBOLS, MarketType, TIMEFRAMES, Timeframe } from "@/types";
import {
  Search, Star, Plus, X, ChevronDown, TrendingUp, TrendingDown,
  BarChart3, Settings, Bell, Maximize2, Minimize2
} from "lucide-react";

export default function LeftToolbar() {
  const { market, setSymbol, watchlist, addToWatchlist, removeFromWatchlist } = useStore();
  const [showWatchlist, setShowWatchlist] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addMarket, setAddMarket] = useState<MarketType>("crypto");

  const filteredWatchlist = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const availableToAdd = MARKET_SYMBOLS[addMarket].filter(
    (s) => !watchlist.find((w) => w.symbol === s.symbol)
  );

  return (
    <div className="flex h-full">
      {/* Icon toolbar */}
      <div className="w-10 bg-[#1e222d] border-r border-[#2a2e39] flex flex-col items-center py-2 gap-1">
        <button
          onClick={() => setShowWatchlist(!showWatchlist)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2a2e39] text-zinc-400 hover:text-white"
          title="Watchlist"
        >
          <BarChart3 size={16} />
        </button>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2a2e39] text-zinc-400 hover:text-white"
          title="Add Symbol"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Watchlist panel */}
      {showWatchlist && (
        <div className="w-56 bg-[#131722] border-r border-[#2a2e39] flex flex-col">
          <div className="p-2 border-b border-[#2a2e39]">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Watchlist</span>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="ml-auto text-zinc-500 hover:text-white"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1e222d] text-zinc-300 text-xs pl-6 pr-2 py-1 rounded border border-[#2a2e39] focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {showAddMenu && (
            <div className="p-2 border-b border-[#2a2e39] bg-[#1e222d]">
              <div className="flex gap-1 mb-2">
                {(["crypto", "forex", "indian"] as MarketType[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setAddMarket(m)}
                    className={`text-[10px] px-2 py-0.5 rounded ${
                      addMarket === m ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-[#2a2e39]"
                    }`}
                  >
                    {m === "crypto" ? "Crypto" : m === "forex" ? "Forex" : "India"}
                  </button>
                ))}
              </div>
              <div className="max-h-32 overflow-y-auto">
                {availableToAdd.slice(0, 8).map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => {
                      addToWatchlist({ ...item, market: addMarket, price: 0, change: 0, changePercent: 0 });
                      setShowAddMenu(false);
                    }}
                    className="w-full text-left px-2 py-1 text-[11px] text-zinc-300 hover:bg-[#2a2e39] rounded flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    <Plus size={10} className="text-zinc-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {filteredWatchlist.map((item) => {
              const { symbol, setSymbol } = useStore.getState();
              const isActive = symbol === item.symbol;
              const marketColors: Record<MarketType, string> = {
                crypto: "#f59e0b",
                forex: "#3b82f6",
                indian: "#f97316",
              };

              return (
                <div
                  key={item.symbol}
                  className={`group px-2 py-1.5 cursor-pointer hover:bg-[#1e222d] ${isActive ? "bg-[#1e222d]" : ""}`}
                  onClick={() => {
                    setSymbol(item.symbol, item.name, item.market);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: marketColors[item.market] }} />
                      <span className="text-[11px] text-white font-medium">{item.symbol.replace("=X", "").replace(".NS", "")}</span>
                      <span className="text-[9px] text-zinc-500">{item.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(item.symbol);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400"
                    >
                      <X size={10} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[11px] text-zinc-300 font-mono">
                      {item.price ? item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "---"}
                    </span>
                    <span className={`text-[10px] font-mono ${item.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {item.changePercent ? `${item.changePercent >= 0 ? "+" : ""}${item.changePercent.toFixed(2)}%` : "---"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
