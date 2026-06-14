import { create } from "zustand";
import { CandleData, IndicatorConfig, Timeframe, WatchlistItem } from "@/types";

interface AppState {
  symbol: string;
  interval: Timeframe;
  candles: CandleData[];
  ticker: { price: number; change: number; changePercent: number; high24h: number; low24h: number; volume24h: number } | null;
  indicators: IndicatorConfig[];
  watchlist: WatchlistItem[];
  sidebarOpen: boolean;

  setSymbol: (symbol: string) => void;
  setInterval: (interval: Timeframe) => void;
  setCandles: (candles: CandleData[]) => void;
  addCandle: (candle: CandleData) => void;
  updateCandle: (candle: CandleData) => void;
  setTicker: (ticker: AppState["ticker"]) => void;
  setTickerFn: (fn: (prev: AppState["ticker"]) => AppState["ticker"]) => void;
  toggleIndicator: (type: IndicatorConfig["type"]) => void;
  setWatchlist: (watchlist: WatchlistItem[]) => void;
  updateWatchlistItem: (symbol: string, data: Partial<WatchlistItem>) => void;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set) => ({
  symbol: "BTCUSDT",
  interval: "1h",
  candles: [],
  ticker: null,
  indicators: [
    { type: "sma", period: 20, color: "#f59e0b", visible: true },
    { type: "ema", period: 50, color: "#8b5cf6", visible: false },
    { type: "rsi", period: 14, color: "#06b6d4", visible: false },
    { type: "macd", color: "#ef4444", visible: false },
    { type: "bollinger", period: 20, color: "#10b981", visible: false },
    { type: "volume", color: "#6b7280", visible: true },
  ],
  watchlist: [
    { symbol: "BTCUSDT", price: 0, change: 0, changePercent: 0 },
    { symbol: "ETHUSDT", price: 0, change: 0, changePercent: 0 },
    { symbol: "BNBUSDT", price: 0, change: 0, changePercent: 0 },
    { symbol: "SOLUSDT", price: 0, change: 0, changePercent: 0 },
    { symbol: "XRPUSDT", price: 0, change: 0, changePercent: 0 },
    { symbol: "DOGEUSDT", price: 0, change: 0, changePercent: 0 },
    { symbol: "ADAUSDT", price: 0, change: 0, changePercent: 0 },
    { symbol: "AVAXUSDT", price: 0, change: 0, changePercent: 0 },
  ],
  sidebarOpen: true,

  setSymbol: (symbol) => set({ symbol, candles: [] }),
  setInterval: (interval) => set({ interval, candles: [] }),
  setCandles: (candles) => set({ candles }),
  addCandle: (candle) =>
    set((state) => {
      const last = state.candles[state.candles.length - 1];
      if (last && last.time === candle.time) {
        const updated = [...state.candles];
        updated[updated.length - 1] = candle;
        return { candles: updated };
      }
      return { candles: [...state.candles, candle] };
    }),
  updateCandle: (candle) =>
    set((state) => {
      const updated = [...state.candles];
      const last = updated[updated.length - 1];
      if (last && last.time === candle.time) {
        updated[updated.length - 1] = candle;
      }
      return { candles: updated };
    }),
  setTicker: (ticker) => set({ ticker }),
  setTickerFn: (fn) => set((state) => ({ ticker: fn(state.ticker) })),
  toggleIndicator: (type) =>
    set((state) => ({
      indicators: state.indicators.map((ind) =>
        ind.type === type ? { ...ind, visible: !ind.visible } : ind
      ),
    })),
  setWatchlist: (watchlist) => set({ watchlist }),
  updateWatchlistItem: (symbol, data) =>
    set((state) => ({
      watchlist: state.watchlist.map((item) =>
        item.symbol === symbol ? { ...item, ...data } : item
      ),
    })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
