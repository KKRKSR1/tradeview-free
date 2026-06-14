"use client";

import { useStore } from "@/store/useStore";
import { SYMBOL_NAMES } from "@/types";
import { formatPrice, formatPercent } from "@/lib/format";
import { Search, Star, X } from "lucide-react";
import { useState } from "react";
import { WATCHLIST_SYMBOLS } from "@/types";

export default function Sidebar() {
  const { symbol, setSymbol, watchlist, sidebarOpen, toggleSidebar } = useStore();
  const [search, setSearch] = useState("");

  const filteredSymbols = WATCHLIST_SYMBOLS.filter(
    (s) =>
      s.toLowerCase().includes(search.toLowerCase()) ||
      (SYMBOL_NAMES[s] || "").toLowerCase().includes(search.toLowerCase())
  );

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
          <button onClick={toggleSidebar} className="text-zinc-500 hover:text-white lg:hidden">
            <X size={16} />
          </button>
        </div>

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
          {filteredSymbols.map((sym) => {
            const item = watchlist.find((w) => w.symbol === sym);
            const isActive = symbol === sym;

            return (
              <button
                key={sym}
                onClick={() => {
                  setSymbol(sym);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`
                  w-full px-3 py-2 flex items-center justify-between text-left
                  hover:bg-[#1a1a1a] transition-colors
                  ${isActive ? "bg-[#1a1a1a] border-l-2 border-blue-600" : "border-l-2 border-transparent"}
                `}
              >
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-zinc-600" />
                  <div>
                    <div className="text-xs text-white font-medium">{sym.replace("USDT", "")}</div>
                    <div className="text-[10px] text-zinc-500">{SYMBOL_NAMES[sym] || sym}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-300 font-mono">
                    {item?.price ? formatPrice(item.price) : "---"}
                  </div>
                  <div
                    className={`text-[10px] font-mono ${
                      (item?.changePercent ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {item?.changePercent ? formatPercent(item.changePercent) : "---"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
