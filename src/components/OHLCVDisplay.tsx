"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export default function OHLCVDisplay() {
  const { candles } = useStore();
  const [data, setData] = useState<{
    time: string; open: number; high: number; low: number; close: number; volume: number;
  } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setData(customEvent.detail);
      }
    };
    window.addEventListener("chart:crosshair", handler);
    return () => window.removeEventListener("chart:crosshair", handler);
  }, []);

  useEffect(() => {
    if (!data && candles.length > 0) {
      const last = candles[candles.length - 1];
      setData({
        time: last.displayTime,
        open: last.open,
        high: last.high,
        low: last.low,
        close: last.close,
        volume: last.volume,
      });
    }
  }, [candles, data]);

  if (!data) return null;

  const isUp = data.close >= data.open;

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 border-b flex-wrap" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="text-[9px]" style={{ color: 'var(--text3)' }}>
        O<span className="font-semibold ml-0.5" style={{ color: 'var(--text)' }}>{data.open.toFixed(2)}</span>
      </div>
      <div className="text-[9px]" style={{ color: 'var(--text3)' }}>
        H<span className="font-semibold ml-0.5" style={{ color: 'var(--green)' }}>{data.high.toFixed(2)}</span>
      </div>
      <div className="text-[9px]" style={{ color: 'var(--text3)' }}>
        L<span className="font-semibold ml-0.5" style={{ color: 'var(--red)' }}>{data.low.toFixed(2)}</span>
      </div>
      <div className="text-[9px]" style={{ color: 'var(--text3)' }}>
        C<span className="font-semibold ml-0.5" style={{ color: 'var(--text)' }}>{data.close.toFixed(2)}</span>
      </div>
      <div className="text-[9px]" style={{ color: 'var(--text3)' }}>
        V<span className="font-semibold ml-0.5" style={{ color: 'var(--text)' }}>{(data.volume / 1000000).toFixed(2)}M</span>
      </div>
    </div>
  );
}
