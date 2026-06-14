"use client";

import { useStore } from "@/store/useStore";
import { TIMEFRAMES, Timeframe } from "@/types";

export default function TimeframeSelector() {
  const { interval, setInterval } = useStore();

  return (
    <div className="flex items-center gap-0.5 px-2">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => setInterval(tf.value)}
          className={`
            px-2 py-1 text-xs font-medium rounded transition-colors
            ${
              interval === tf.value
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-[#1a1a1a]"
            }
          `}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}
