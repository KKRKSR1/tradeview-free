"use client";

import { useStore } from "@/store/useStore";
import { MarketType, MARKET_SYMBOLS } from "@/types";

const MARKETS: { type: MarketType; label: string; icon: string }[] = [
  { type: "crypto", label: "Crypto", icon: "₿" },
  { type: "forex", label: "Forex", icon: "💱" },
  { type: "indian", label: "India", icon: "🇮🇳" },
];

export default function MarketSelector() {
  const { market, setSymbol } = useStore();

  const handleMarketSwitch = (newMarket: MarketType) => {
    const firstSymbol = MARKET_SYMBOLS[newMarket][0];
    if (firstSymbol) {
      setSymbol(firstSymbol.symbol, firstSymbol.name, newMarket);
    }
  };

  return (
    <div className="flex items-center gap-1 px-2">
      {MARKETS.map((m) => (
        <button
          key={m.type}
          onClick={() => handleMarketSwitch(m.type)}
          className={`
            px-2 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1
            ${
              market === m.type
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-[#1a1a1a]"
            }
          `}
        >
          <span>{m.icon}</span>
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  );
}
