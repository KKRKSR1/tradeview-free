"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { BinanceWebSocket, fetchKlines, fetchTicker } from "@/lib/binance";
import { fetchYahooKlines, fetchYahooTicker } from "@/lib/yahoo";

export default function DataFetcher() {
  const {
    symbol,
    symbolName,
    market,
    interval,
    setCandles,
    addCandle,
    setTicker,
    setTickerFn,
    updateWatchlistItem,
    checkAlerts,
    watchlist,
  } = useStore();

  const wsRef = useRef<BinanceWebSocket | null>(null);

  // Main chart data
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        let candles: Awaited<ReturnType<typeof fetchKlines>> = [];
        let tickerData: Awaited<ReturnType<typeof fetchTicker>> | null = null;

        if (market === "crypto") {
          [candles, tickerData] = await Promise.all([
            fetchKlines(symbol, interval),
            fetchTicker(symbol),
          ]);
        } else {
          candles = await fetchYahooKlines(symbol, interval, market);
          tickerData = await fetchYahooTicker(symbol, market);
        }

        if (!cancelled) {
          setCandles(candles);
          if (tickerData) {
            setTicker({
              price: tickerData.price,
              change: tickerData.change,
              changePercent: tickerData.changePercent,
              high24h: tickerData.high24h,
              low24h: tickerData.low24h,
              volume24h: tickerData.volume24h,
            });
            checkAlerts(tickerData.price);
          } else {
            setTicker(null);
          }
        }
      } catch (err) {
        console.error(`Failed to load data for ${symbol} (${market}):`, err);
        if (!cancelled) {
          setCandles([]);
          setTicker(null);
        }
      }
    }

    loadData();

    wsRef.current?.destroy();

    if (market === "crypto") {
      wsRef.current = new BinanceWebSocket(
        symbol,
        interval,
        (candle) => {
          if (!cancelled) {
            addCandle(candle);
            checkAlerts(candle.close);
          }
        },
        (ticker) => {
          if (!cancelled) {
            setTickerFn((prev) =>
              prev
                ? { ...prev, ...ticker }
                : { ...ticker, high24h: 0, low24h: 0, volume24h: 0 }
            );
            checkAlerts(ticker.price);
          }
        }
      );
      wsRef.current.connect();
    }

    return () => {
      cancelled = true;
      wsRef.current?.destroy();
    };
  }, [symbol, market, interval, setCandles, addCandle, setTicker, setTickerFn, checkAlerts]);

  // Watchlist ticker updates
  useEffect(() => {
    let cancelled = false;

    async function updateWatchlist() {
      for (const item of watchlist) {
        if (cancelled) return;
        try {
          let tickerData: Awaited<ReturnType<typeof fetchTicker>> | null = null;

          if (item.market === "crypto") {
            tickerData = await fetchTicker(item.symbol);
          } else {
            tickerData = await fetchYahooTicker(item.symbol, item.market);
          }

          if (tickerData && !cancelled) {
            updateWatchlistItem(item.symbol, {
              price: tickerData.price,
              change: tickerData.change,
              changePercent: tickerData.changePercent,
            });
          }
        } catch (err) {
          // Silently ignore individual watchlist failures
        }
      }
    }

    updateWatchlist();

    const intervalId = setInterval(updateWatchlist, 30000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [watchlist, updateWatchlistItem]);

  return null;
}
