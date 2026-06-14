"use client";

import { useStore } from "@/store/useStore";
import { MARKET_SYMBOLS, MarketType } from "@/types";
import { Search, Star, X, Plus, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";

const MARKET_LABELS: Record<MarketType, { label: string; color: string }> = {
  crypto: { label: "Crypto", color: "text-yellow-400" },
  forex: { label: "Forex", color: "text-blue-400" },
  indian: { label: "India", color: "text-orange-400" },
};

export default function Sidebar() {
  const { symbol, setSymbol, watchlist, sidebarOpen, toggleSidebar, addToWatchlist, removeFromWatchlist, market: currentMarket } = useStore();
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

  const handleAdd = (item: { symbol: string; name: string }, market: MarketType) => {
    addToWatchlist({
      symbol: item.symbol,
      name: item.name,
      market,
      price: 0,
      change: 0,
      changePercent: 0,
    });
    setShowAddMenu(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside
        className={`
          fixed lg:relative z-50 lg:z-0
          w-64 h-full bg-[#0a0a0a] border-r border-[#1a1a1a]
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden"}
          flex flex-col shrink-0
        `}
      >
        <div className="p-3 border-b border-[#1a1a1a] flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Watchlist</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="text-zinc-500 hover:text-emerald-400"
              title="Add to watchlist"
            >
              <Plus size={16} />
            </button>
            <button onClick={toggleSidebar} className="text-zinc-500 hover:text-white lg:hidden">
              <X size={16} />
            </button>
          </div>
        </div>

        {showAddMenu && (
          <div className="p-2 border-b border-[#1a1a1a] bg-[#0f0f0f]">
            <div className="flex gap-1 mb-2">
              {(Object.keys(MARKET_LABELS) as MarketType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setAddMarket(m)}
                  className={`text-[10px] px-2 py-1 rounded ${
                    addMarket === m ? "bg-blue-600 text-white" : "bg-[#1a1a1a] text-zinc-400"
                  }`}
                >
                  {MARKET_LABELS[m].label}
                </button>
              ))}
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {availableToAdd.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => handleAdd(item, addMarket)}
                  className="w-full text-left px-2 py-1 text-xs text-zinc-300 hover:bg-[#1a1a1a] rounded flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <Plus size={12} className="text-zinc-500" />
                </button>
              ))}
              {availableToAdd.length === 0 && (
                <div className="text-zinc-500 text-xs text-center py-2">All added</div>
              )}
            </div>
          </div>
        )}

        <div className="p-2">
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] text-zinc-300 text-xs pl-7 pr-2 py-1.5 rounded border border-[#252525] focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredWatchlist.map((item) => {
            const isActive = symbol === item.symbol;
            const marketInfo = MARKET_LABELS[item.market];

            return (
              <div key={item.symbol} className={`group ${isActive ? "bg-[#1a1a1a]" : ""}`}>
                <button
                  onClick={() => {
                    setSymbol(item.symbol, item.name, item.market);
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`
                    w-full px-3 py-2 flex items-center justify-between text-left
                    hover:bg-[#1a1a1a] transition-colors
                    ${isActive ? "border-l-2 border-blue-600" : "border-l-2 border-transparent"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Star size={10} className={marketInfo.color} />
                    <div>
                      <div className="text-xs text-white font-medium">{item.name}</div>
                      <div className="text-[10px] text-zinc-500">
                        {item.symbol.replace("=X", "").replace(".NS", "")}
                        <span className={`ml-1 ${marketInfo.color}`}>·{marketInfo.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-300 font-mono">
                      {item.price ? item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "---"}
                    </div>
                    <div
                      className={`text-[10px] font-mono ${
                        item.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {item.changePercent ? `${item.changePercent >= 0 ? "+" : ""}${item.changePercent.toFixed(2)}%` : "---"}
                    </div>
                  </div>
                </button>
                {isActive && (
                  <div className="px-3 pb-1 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(item.symbol);
                      }}
                      className="text-zinc-600 hover:text-red-400"
                      title="Remove from watchlist"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-2 border-t border-[#1a1a1a] text-[10px] text-zinc-600 text-center">
          {watchlist.length} symbols
        </div>
      </aside>
    </>
  );
}
