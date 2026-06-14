"use client";

import { useStore } from "@/store/useStore";
import { MARKET_SYMBOLS, MarketType } from "@/types";
import { formatPrice, formatPercent } from "@/lib/format";
import { Menu, TrendingUp, TrendingDown, Settings, Bell, Minus } from "lucide-react";

export default function Header() {
  const { symbol, symbolName, market, ticker, toggleSidebar, toggleSettings, toggleAlerts } = useStore();

  const marketColors: Record<MarketType, string> = {
    crypto: "text-yellow-400",
    forex: "text-blue-400",
    indian: "text-orange-400",
  };

  return (
    <header className="h-12 bg-[#0f0f0f] border-b border-[#1a1a1a] flex items-center px-3 gap-3 shrink-0">
      <button onClick={toggleSidebar} className="text-zinc-400 hover:text-white lg:hidden">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-white font-semibold text-sm">{symbolName}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${marketColors[market]} bg-[#1a1a1a]`}>
          {market === "crypto" ? "CRYPTO" : market === "forex" ? "FOREX" : "INDIA"}
        </span>
      </div>

      {ticker && (
        <div className="flex items-center gap-4 text-sm">
          <span className={`font-mono font-bold ${ticker.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {formatPrice(ticker.price)}
          </span>

          <div className={`flex items-center gap-1 ${ticker.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {ticker.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="font-mono text-xs">{formatPercent(ticker.changePercent)}</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-zinc-500">
            <span>
              H: <span className="text-zinc-300">{formatPrice(ticker.high24h)}</span>
            </span>
            <span>
              L: <span className="text-zinc-300">{formatPrice(ticker.low24h)}</span>
            </span>
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleAlerts}
          className="text-zinc-400 hover:text-yellow-400 p-1"
          title="Price Alerts"
        >
          <Bell size={16} />
        </button>
        <button
          onClick={toggleSettings}
          className="text-zinc-400 hover:text-white p-1"
          title="Indicator Settings"
        >
          <Settings size={16} />
        </button>
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <span className="hidden sm:inline">LIVE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </header>
  );
}
