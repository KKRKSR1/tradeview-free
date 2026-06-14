"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { BinanceWebSocket, fetchKlines, fetchTicker } from "@/lib/binance";
import { WATCHLIST_SYMBOLS } from "@/types";

export default function DataFetcher() {
  const {
    symbol,
    interval,
    setCandles,
    addCandle,
    setTicker,
    setTickerFn,
    updateWatchlistItem,
  } = useStore();

  const wsRef = useRef<BinanceWebSocket | null>(null);
  const watchlistFetchers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  // Main chart data
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [klines, tickerData] = await Promise.all([
          fetchKlines(symbol, interval),
          fetchTicker(symbol),
        ]);
        if (!cancelled) {
          setCandles(klines);
          setTicker({
            price: tickerData.price,
            change: tickerData.change,
            changePercent: tickerData.changePercent,
            high24h: tickerData.high24h,
            low24h: tickerData.low24h,
            volume24h: tickerData.volume24h,
          });
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }

    loadData();

    // WebSocket for real-time updates
    wsRef.current?.destroy();
    wsRef.current = new BinanceWebSocket(
      symbol,
      interval,
      (candle) => {
        if (!cancelled) addCandle(candle);
      },
      (ticker) => {
        if (!cancelled) {
          setTickerFn((prev) =>
            prev
              ? { ...prev, ...ticker }
              : { ...ticker, high24h: 0, low24h: 0, volume24h: 0 }
          );
        }
      }
    );
    wsRef.current.connect();

    return () => {
      cancelled = true;
      wsRef.current?.destroy();
    };
  }, [symbol, interval, setCandles, addCandle, setTicker]);

  // Watchlist ticker updates
  useEffect(() => {
    // Fetch initial prices
    WATCHLIST_SYMBOLS.forEach(async (sym) => {
      try {
        const ticker = await fetchTicker(sym);
        updateWatchlistItem(sym, {
          price: ticker.price,
          change: ticker.change,
          changePercent: ticker.changePercent,
        });
      } catch {
        // ignore
      }
    });

    // Poll every 10 seconds
    const intervalId = setInterval(async () => {
      for (const sym of WATCHLIST_SYMBOLS) {
        try {
          const ticker = await fetchTicker(sym);
          updateWatchlistItem(sym, {
            price: ticker.price,
            change: ticker.change,
            changePercent: ticker.changePercent,
          });
        } catch {
          // ignore
        }
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [updateWatchlistItem]);

  return null;
}
