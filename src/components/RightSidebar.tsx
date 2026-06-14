"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { MarketType } from "@/types";

type TabType = "watch" | "ob" | "stats" | "alerts";

export default function RightSidebar() {
  const { symbol, market, setSymbol, ticker, watchlist, alerts, removeFromWatchlist } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>("watch");
  const [addMode, setAddMode] = useState(false);
  const [addMarket, setAddMarket] = useState<MarketType>("crypto");

  const tabs: { id: TabType; label: string }[] = [
    { id: "watch", label: "Watchlist" },
    { id: "ob", label: "Order Book" },
    { id: "stats", label: "Stats" },
  ];

  const marketBadge = (market: MarketType) => {
    const labels: Record<MarketType, string> = {
      crypto: "CRYPTO",
      forex: "FOREX",
      indian: "INDIA",
    };
    const colors: Record<MarketType, string> = {
      crypto: "var(--blue)",
      forex: "var(--teal)",
      indian: "var(--purple)",
    };
    return (
      <span className="text-[7px] px-1 py-0.5 rounded ml-1" style={{ background: `color-mix(in srgb, ${colors[market]} 15%, transparent)`, color: colors[market] }}>
        {labels[market]}
      </span>
    );
  };

  const displaySym = (sym: string) => sym.replace("=X", "").replace(".NS", "").replace("^", "");

  return (
    <div className="w-[210px] flex flex-col overflow-hidden border-l" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-1.5 text-center text-[9px] font-semibold uppercase tracking-wider transition-all"
            style={{
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text3)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Watchlist Panel */}
      {activeTab === "watch" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {watchlist.map((item) => {
              const isActive = symbol === item.symbol;

              return (
                <div
                  key={item.symbol}
                  onClick={() => setSymbol(item.symbol, item.name, item.market)}
                  className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer transition-all border-b group"
                  style={{
                    background: isActive ? 'var(--bg3)' : 'transparent',
                    borderColor: 'var(--border)',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg3)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center">
                      <span className="text-[11px] font-semibold truncate" style={{ color: 'var(--text)' }}>{displaySym(item.symbol)}</span>
                      {marketBadge(item.market)}
                    </div>
                    <span className="text-[8px] mt-0.5 truncate" style={{ color: 'var(--text3)' }}>{item.name}</span>
                  </div>
                  <div className="text-right flex items-center gap-1">
                    <div className="flex flex-col">
                      <div className="text-[11px] font-semibold" style={{ color: 'var(--text)' }}>
                        {item.price ? item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "---"}
                      </div>
                      <div className="text-[8px]" style={{ color: item.changePercent >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {item.changePercent ? `${item.changePercent >= 0 ? "+" : ""}${item.changePercent.toFixed(2)}%` : "---"}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.symbol); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--text3)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text3)'}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trade Buttons */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5">
            <button className="py-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all" style={{ background: 'var(--green2)', color: '#fff' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--green)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--green2)'}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              BUY
            </button>
            <button className="py-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all" style={{ background: 'var(--red2)', color: '#fff' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--red)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--red2)'}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 7L7.8 16.2M7 7v10h10"/></svg>
              SELL
            </button>
          </div>
        </div>
      )}

      {/* Order Book Panel */}
      {activeTab === "ob" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-3 text-[9px] px-2.5 py-1" style={{ color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>
            <span>Price</span><span className="text-right">Qty</span><span className="text-right">Total</span>
          </div>
          <div className="flex-1 overflow-hidden">
            {[...Array(8)].map((_, i) => {
              const basePrice = ticker?.price || 100;
              const spread = basePrice * 0.0001;
              const askPrice = basePrice + spread * (8 - i);
              const qty = Math.floor(Math.random() * 100 + 10);
              return (
                <div key={`ask-${i}`} className="grid grid-cols-3 text-[9px] px-2.5 py-0.5 relative" style={{ color: 'var(--red)' }}>
                  <div className="absolute top-0.5 bottom-0.5 right-0 rounded-sm opacity-10" style={{ background: 'var(--red)', width: `${Math.random() * 60 + 20}%` }} />
                  <span>{askPrice.toFixed(2)}</span>
                  <span className="text-right" style={{ color: 'var(--text2)' }}>{qty}</span>
                  <span className="text-right" style={{ color: 'var(--text3)' }}>{(askPrice * qty).toFixed(0)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between px-2.5 py-1 text-[10px] font-semibold" style={{ background: 'var(--bg3)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--green)' }}>{(ticker?.price || 0).toFixed(2)}</span>
            <span style={{ color: 'var(--text3)' }}>Mid</span>
            <span style={{ color: 'var(--text2)' }}>{ticker?.volume24h ? (ticker.volume24h / 1000).toFixed(1) + 'K' : '—'}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            {[...Array(8)].map((_, i) => {
              const basePrice = ticker?.price || 100;
              const spread = basePrice * 0.0001;
              const bidPrice = basePrice - spread * (i + 1);
              const qty = Math.floor(Math.random() * 100 + 10);
              return (
                <div key={`bid-${i}`} className="grid grid-cols-3 text-[9px] px-2.5 py-0.5 relative" style={{ color: 'var(--green)' }}>
                  <div className="absolute top-0.5 bottom-0.5 right-0 rounded-sm opacity-10" style={{ background: 'var(--green)', width: `${Math.random() * 60 + 20}%` }} />
                  <span>{bidPrice.toFixed(2)}</span>
                  <span className="text-right" style={{ color: 'var(--text2)' }}>{qty}</span>
                  <span className="text-right" style={{ color: 'var(--text3)' }}>{(bidPrice * qty).toFixed(0)}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-1.5">
            <button className="py-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all" style={{ background: 'var(--green2)', color: '#fff' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              BUY
            </button>
            <button className="py-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all" style={{ background: 'var(--red2)', color: '#fff' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 7L7.8 16.2M7 7v10h10"/></svg>
              SELL
            </button>
          </div>
        </div>
      )}

      {/* Stats Panel */}
      {activeTab === "stats" && (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2">
            {[
              { label: "Market Cap", value: ticker?.volume24h ? `$${(ticker.volume24h / 1e9).toFixed(1)}B` : "—" },
              { label: "24h High", value: ticker?.high24h?.toFixed(2) || "—" },
              { label: "24h Low", value: ticker?.low24h?.toFixed(2) || "—" },
              { label: "24h Volume", value: ticker?.volume24h ? `${(ticker.volume24h / 1e6).toFixed(1)}M` : "—" },
              { label: "Change", value: ticker?.change ? `${ticker.change >= 0 ? "+" : ""}${ticker.change.toFixed(2)}` : "—" },
              { label: "Change %", value: ticker?.changePercent ? `${ticker.changePercent >= 0 ? "+" : ""}${ticker.changePercent.toFixed(2)}%` : "—" },
              { label: "Price", value: ticker?.price?.toFixed(2) || "—" },
              { label: "Exchange", value: market === "crypto" ? "Binance" : "Yahoo" },
            ].map((stat, i) => (
              <div key={i} className="px-2.5 py-1 border-r border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{stat.label}</div>
                <div className="text-[10px] font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Panel */}
      {activeTab === "alerts" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="text-[9px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--amber)' }}>Create Alert</div>
            <div className="flex flex-col gap-1.5">
              <select className="w-full text-[10px] px-2 py-1 rounded outline-none" style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
                <option>Price crosses above</option>
                <option>Price crosses below</option>
              </select>
              <input type="number" placeholder="Target price" className="w-full text-[10px] px-2 py-1 rounded outline-none" style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
              <button className="w-full py-1.5 rounded-lg text-[10px] font-semibold" style={{ background: 'var(--accent)', color: '#fff' }}>
                Create Alert
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5">
            {alerts.length === 0 ? (
              <div className="text-center text-[10px] py-4" style={{ color: 'var(--text3)' }}>
                No alerts yet.
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-2 rounded-lg mb-1 border" style={{ background: 'var(--bg3)', borderColor: alert.active ? 'var(--amber)' : 'var(--border2)' }}>
                  <div className="text-[11px] font-bold" style={{ color: 'var(--text)' }}>{displaySym(alert.symbol)}</div>
                  <div className="text-[9px]" style={{ color: 'var(--text2)' }}>{alert.type} {alert.price}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
