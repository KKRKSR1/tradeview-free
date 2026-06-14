import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CandleData, IndicatorConfig, Timeframe, WatchlistItem, Alert, Drawing, MarketType } from "@/types";
import { DEFAULT_WATCHLIST } from "@/types";

interface AppState {
  symbol: string;
  symbolName: string;
  market: MarketType;
  interval: Timeframe;
  candles: CandleData[];
  ticker: { price: number; change: number; changePercent: number; high24h: number; low24h: number; volume24h: number } | null;
  indicators: IndicatorConfig[];
  watchlist: WatchlistItem[];
  alerts: Alert[];
  drawings: Drawing[];
  sidebarOpen: boolean;
  settingsOpen: boolean;
  alertsOpen: boolean;
  drawingMode: string | null;

  setSymbol: (symbol: string, name: string, market: MarketType) => void;
  setInterval: (interval: Timeframe) => void;
  setCandles: (candles: CandleData[]) => void;
  addCandle: (candle: CandleData) => void;
  setTicker: (ticker: AppState["ticker"]) => void;
  setTickerFn: (fn: (prev: AppState["ticker"]) => AppState["ticker"]) => void;
  toggleIndicator: (type: IndicatorConfig["type"]) => void;
  updateIndicator: (type: IndicatorConfig["type"], updates: Partial<IndicatorConfig>) => void;
  setWatchlist: (watchlist: WatchlistItem[]) => void;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (symbol: string) => void;
  updateWatchlistItem: (symbol: string, data: Partial<WatchlistItem>) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  checkAlerts: (price: number) => void;
  addDrawing: (drawing: Drawing) => void;
  removeDrawing: (id: string) => void;
  clearDrawings: () => void;
  setDrawingMode: (mode: string | null) => void;
  toggleSidebar: () => void;
  toggleSettings: () => void;
  toggleAlerts: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      symbol: "BTCUSDT",
      symbolName: "Bitcoin",
      market: "crypto" as MarketType,
      interval: "1h" as Timeframe,
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
      watchlist: DEFAULT_WATCHLIST,
      alerts: [],
      drawings: [],
      sidebarOpen: true,
      settingsOpen: false,
      alertsOpen: false,
      drawingMode: null,

      setSymbol: (symbol, name, market) => set({ symbol, symbolName: name, market, candles: [] }),
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
      setTicker: (ticker) => set({ ticker }),
      setTickerFn: (fn) => set((state) => ({ ticker: fn(state.ticker) })),
      toggleIndicator: (type) =>
        set((state) => ({
          indicators: state.indicators.map((ind) =>
            ind.type === type ? { ...ind, visible: !ind.visible } : ind
          ),
        })),
      updateIndicator: (type, updates) =>
        set((state) => ({
          indicators: state.indicators.map((ind) =>
            ind.type === type ? { ...ind, ...updates } : ind
          ),
        })),
      setWatchlist: (watchlist) => set({ watchlist }),
      addToWatchlist: (item) =>
        set((state) => {
          if (state.watchlist.find((w) => w.symbol === item.symbol)) return state;
          return { watchlist: [...state.watchlist, item] };
        }),
      removeFromWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.filter((w) => w.symbol !== symbol),
        })),
      updateWatchlistItem: (symbol, data) =>
        set((state) => ({
          watchlist: state.watchlist.map((item) =>
            item.symbol === symbol ? { ...item, ...data } : item
          ),
        })),
      addAlert: (alert) =>
        set((state) => ({ alerts: [...state.alerts, alert] })),
      removeAlert: (id) =>
        set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
      toggleAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
        })),
      checkAlerts: (price) => {
        const state = get();
        for (const alert of state.alerts) {
          if (!alert.active) continue;
          if (alert.symbol !== state.symbol) continue;
          const triggered =
            (alert.type === "above" && price >= alert.price) ||
            (alert.type === "below" && price <= alert.price);
          if (triggered) {
            if (typeof window !== "undefined" && "Notification" in window) {
              new Notification(`Price Alert: ${alert.symbol}`, {
                body: `Price is now ${alert.type} ${alert.price}. Current: ${price}`,
                icon: "/favicon.ico",
              });
            }
            set((s) => ({
              alerts: s.alerts.map((a) => (a.id === alert.id ? { ...a, active: false } : a)),
            }));
          }
        }
      },
      addDrawing: (drawing) =>
        set((state) => ({ drawings: [...state.drawings, drawing] })),
      removeDrawing: (id) =>
        set((state) => ({ drawings: state.drawings.filter((d) => d.id !== id) })),
      clearDrawings: () => set({ drawings: [] }),
      setDrawingMode: (mode) => set({ drawingMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
      toggleAlerts: () => set((state) => ({ alertsOpen: !state.alertsOpen })),
    }),
    {
      name: "tradeview-storage",
      partialize: (state) => ({
        indicators: state.indicators,
        watchlist: state.watchlist,
        alerts: state.alerts,
        symbol: state.symbol,
        symbolName: state.symbolName,
        market: state.market,
        interval: state.interval,
      }),
    }
  )
);
