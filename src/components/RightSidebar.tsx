"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { MarketType } from "@/types";

type TabType = "watch" | "ob" | "stats" | "alerts";

const WATCH_LIST = [
  { symbol: "RELIANCE", name: "Reliance Ind.", market: "indian" as MarketType, basePrice: 2847 },
  { symbol: "TCS", name: "Tata Consult.", market: "indian" as MarketType, basePrice: 3892 },
  { symbol: "INFY", name: "Infosys Ltd.", market: "indian" as MarketType, basePrice: 1673 },
  { symbol: "HDFCBANK", name: "HDFC Bank", market: "indian" as MarketType, basePrice: 1745 },
  { symbol: "BTCUSDT", name: "Bitcoin", market: "crypto" as MarketType, basePrice: 67420 },
  { symbol: "ETHUSDT", name: "Ethereum", market: "crypto" as MarketType, basePrice: 3520 },
  { symbol: "SOLUSDT", name: "Solana", market: "crypto" as MarketType, basePrice: 175 },
  { symbol: "DOGEUSDT", name: "Dogecoin", market: "crypto" as MarketType, basePrice: 0.165 },
  { symbol: "EURUSD=X", name: "EUR/USD", market: "forex" as MarketType, basePrice: 1.0845 },
  { symbol: "USDINR=X", name: "USD/INR", market: "forex" as MarketType, basePrice: 83.62 },
  { symbol: "^NSEI", name: "NIFTY 50", market: "indian" as MarketType, basePrice: 24350 },
];

export default function RightSidebar() {
  const { symbol, setSymbol, ticker, watchlist, alerts } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>("watch");

  const tabs: { id: TabType; label: string }[] = [
    { id: "watch", label: "Watchlist" },
    { id: "ob", label: "Order Book" },
    { id: "stats", label: "Stats" },
  ];

  const marketBadge = (market: MarketType) => {
    const styles: Record<MarketType, string> = {
      crypto: "background:rgba(56,189,248,0.15);color:var(--blue)",
      forex: "background:rgba(45,212,191,0.15);color:var(--teal)",
      indian: "background:rgba(167,139,250,0.15);color:var(--purple)",
    };
    const labels: Record<MarketType, string> = {
      crypto: "CRYPTO",
      forex: "FOREX",
      indian: "INDIA",
    };
    return (
      <span className="text-[7px] px-1 py-0.5 rounded ml-1" style={{ background: styles[market].split(';')[0].split(':')[1], color: styles[market].split(';')[1].split(':')[1] }}>
        {labels[market]}
      </span>
    );
  };

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
            {WATCH_LIST.map((item) => {
              const isActive = symbol === item.symbol;
              const itemTicker = watchlist.find((w) => w.symbol === item.symbol);
              const price = itemTicker?.price || item.basePrice;
              const change = itemTicker?.changePercent || 0;

              return (
                <div
                  key={item.symbol}
                  onClick={() => setSymbol(item.symbol, item.name, item.market)}
                  className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer transition-all border-b"
                  style={{
                    background: isActive ? 'var(--bg3)' : 'transparent',
                    borderColor: 'var(--border)',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg3)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--text)' }}>{item.symbol.replace("=X", "").replace(".NS", "").replace("^", "")}</span>
                      {marketBadge(item.market)}
                    </div>
                    <span className="text-[8px] mt-0.5" style={{ color: 'var(--text3)' }}>{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-semibold" style={{ color: 'var(--text)' }}>
                      {price ? price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "---"}
                    </div>
                    <div className="text-[8px]" style={{ color: change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {change ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "---"}
                    </div>
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
              { label: "Market Cap", value: "₹19.3L Cr" },
              { label: "P/E Ratio", value: "28.4" },
              { label: "Beta", value: "1.12" },
              { label: "52W High", value: "3,024" },
              { label: "52W Low", value: "2,180" },
              { label: "Volume", value: "600K" },
              { label: "Avg Vol", value: "450K" },
              { label: "Div Yield", value: "0.35%" },
            ].map((stat, i) => (
              <div key={i} className="px-2.5 py-1 border-r border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{stat.label}</div>
                <div className="text-[10px] font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Panel (hidden by default, toggled by bell icon) */}
      {activeTab === "alerts" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="text-[9px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--amber)' }}>Create Alert</div>
            <div className="flex flex-col gap-1.5">
              <select className="w-full text-[10px] px-2 py-1 rounded outline-none" style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
                <option>Price crosses above</option>
                <option>Price crosses below</option>
                <option>RSI goes above 70</option>
                <option>RSI goes below 30</option>
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
                No alerts yet.<br />Create one above.
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-2 rounded-lg mb-1 border" style={{ background: 'var(--bg3)', borderColor: 'var(--border2)' }}>
                  <div className="text-[11px] font-bold" style={{ color: 'var(--text)' }}>{alert.symbol}</div>
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
