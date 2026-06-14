export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  displayTime: string;
}

export interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";

export type MarketType = "crypto" | "forex" | "indian";

export type IndicatorType = "sma" | "ema" | "rsi" | "macd" | "bollinger" | "volume";

export interface IndicatorConfig {
  type: IndicatorType;
  period?: number;
  color?: string;
  visible: boolean;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  market: MarketType;
  price: number;
  change: number;
  changePercent: number;
}

export interface Alert {
  id: string;
  symbol: string;
  type: "above" | "below";
  price: number;
  active: boolean;
  createdAt: number;
}

export interface Drawing {
  id: string;
  type: "trendline" | "horizontal" | "fibonacci" | "rectangle";
  points: { time: number; price: number }[];
  color: string;
}

export const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
];

export const MARKET_SYMBOLS: Record<MarketType, { symbol: string; name: string }[]> = {
  crypto: [
    { symbol: "BTCUSDT", name: "Bitcoin" },
    { symbol: "ETHUSDT", name: "Ethereum" },
    { symbol: "BNBUSDT", name: "BNB" },
    { symbol: "SOLUSDT", name: "Solana" },
    { symbol: "XRPUSDT", name: "XRP" },
    { symbol: "DOGEUSDT", name: "Dogecoin" },
    { symbol: "ADAUSDT", name: "Cardano" },
    { symbol: "AVAXUSDT", name: "Avalanche" },
    { symbol: "DOTUSDT", name: "Polkadot" },
    { symbol: "LINKUSDT", name: "Chainlink" },
  ],
  forex: [
    { symbol: "EURUSD=X", name: "EUR/USD" },
    { symbol: "GBPUSD=X", name: "GBP/USD" },
    { symbol: "USDJPY=X", name: "USD/JPY" },
    { symbol: "AUDUSD=X", name: "AUD/USD" },
    { symbol: "USDCAD=X", name: "USD/CAD" },
    { symbol: "USDCHF=X", name: "USD/CHF" },
    { symbol: "NZDUSD=X", name: "NZD/USD" },
    { symbol: "EURGBP=X", name: "EUR/GBP" },
    { symbol: "EURJPY=X", name: "EUR/JPY" },
    { symbol: "GBPJPY=X", name: "GBP/JPY" },
  ],
  indian: [
    { symbol: "^NSEI", name: "NIFTY 50" },
    { symbol: "^BSESN", name: "SENSEX" },
    { symbol: "RELIANCE.NS", name: "Reliance" },
    { symbol: "TCS.NS", name: "TCS" },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
    { symbol: "INFY.NS", name: "Infosys" },
    { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
    { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever" },
    { symbol: "SBIN.NS", name: "SBI" },
    { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
  ],
};

export const DEFAULT_WATCHLIST: WatchlistItem[] = [
  ...MARKET_SYMBOLS.crypto.slice(0, 4).map((s) => ({ ...s, market: "crypto" as MarketType, price: 0, change: 0, changePercent: 0 })),
  ...MARKET_SYMBOLS.forex.slice(0, 3).map((s) => ({ ...s, market: "forex" as MarketType, price: 0, change: 0, changePercent: 0 })),
  ...MARKET_SYMBOLS.indian.slice(0, 3).map((s) => ({ ...s, market: "indian" as MarketType, price: 0, change: 0, changePercent: 0 })),
];
