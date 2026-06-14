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

export type Timeframe = "1s" | "5s" | "15s" | "30s" | "1m" | "2m" | "3m" | "5m" | "15m" | "30m" | "45m" | "1h" | "2h" | "3h" | "4h" | "6h" | "8h" | "12h" | "1d" | "2d" | "3d" | "1w" | "1M";

export type MarketType = "crypto" | "forex" | "indian";

export type IndicatorType =
  | "sma" | "ema" | "rsi" | "macd" | "bollinger" | "volume"
  | "ichimoku" | "vwap" | "supertrend" | "stochastic"
  | "adx" | "atr" | "obv" | "cci" | "williams" | "mfi"
  | "psar" | "kc" | "dc" | "hma" | "vwma" | "dema" | "tema";

export type ChartType = "candlestick" | "line" | "area" | "bar" | "histogram";

export type DrawingToolType =
  | "horizontal" | "horizontalRay" | "vertical"
  | "trendline" | "parallelChannel" | "fibonacci"
  | "rectangle" | "ellipse" | "triangle"
  | "pitchfork" | "fibTime" | "text";

export interface IndicatorConfig {
  type: IndicatorType;
  period?: number;
  period2?: number;
  period3?: number;
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
  type: DrawingToolType;
  points?: { time: number; price: number }[];
  color: string;
  text?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export interface ChartLayout {
  id: string;
  name: string;
  symbols: { symbol: string; name: string; market: MarketType }[];
  interval: Timeframe;
  indicators: IndicatorConfig[];
}

export const TIMEFRAMES: { value: Timeframe; label: string; group: string }[] = [
  { value: "1s", label: "1s", group: "seconds" },
  { value: "5s", label: "5s", group: "seconds" },
  { value: "15s", label: "15s", group: "seconds" },
  { value: "30s", label: "30s", group: "seconds" },
  { value: "1m", label: "1m", group: "minutes" },
  { value: "2m", label: "2m", group: "minutes" },
  { value: "3m", label: "3m", group: "minutes" },
  { value: "5m", label: "5m", group: "minutes" },
  { value: "15m", label: "15m", group: "minutes" },
  { value: "30m", label: "30m", group: "minutes" },
  { value: "45m", label: "45m", group: "minutes" },
  { value: "1h", label: "1H", group: "hours" },
  { value: "2h", label: "2H", group: "hours" },
  { value: "3h", label: "3H", group: "hours" },
  { value: "4h", label: "4H", group: "hours" },
  { value: "6h", label: "6H", group: "hours" },
  { value: "8h", label: "8H", group: "hours" },
  { value: "12h", label: "12H", group: "hours" },
  { value: "1d", label: "1D", group: "days" },
  { value: "2d", label: "2D", group: "days" },
  { value: "3d", label: "3D", group: "days" },
  { value: "1w", label: "1W", group: "weeks" },
  { value: "1M", label: "1M", group: "months" },
];

export const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "candlestick", label: "Candles" },
  { value: "line", label: "Line" },
  { value: "area", label: "Area" },
  { value: "bar", label: "Bars" },
  { value: "histogram", label: "Hollow Candles" },
];

export const PREMIUM_INDICATORS: { type: IndicatorType; name: string; category: string; defaultPeriod?: number }[] = [
  { type: "sma", name: "SMA", category: "Trend", defaultPeriod: 20 },
  { type: "ema", name: "EMA", category: "Trend", defaultPeriod: 20 },
  { type: "hma", name: "Hull MA", category: "Trend", defaultPeriod: 20 },
  { type: "dema", name: "DEMA", category: "Trend", defaultPeriod: 20 },
  { type: "tema", name: "TEMA", category: "Trend", defaultPeriod: 20 },
  { type: "vwma", name: "VWMA", category: "Trend", defaultPeriod: 20 },
  { type: "ichimoku", name: "Ichimoku Cloud", category: "Trend" },
  { type: "psar", name: "Parabolic SAR", category: "Trend" },
  { type: "supertrend", name: "Supertrend", category: "Trend" },
  { type: "vwap", name: "VWAP", category: "Volume" },
  { type: "obv", name: "OBV", category: "Volume" },
  { type: "mfi", name: "Money Flow", category: "Volume" },
  { type: "rsi", name: "RSI", category: "Oscillator", defaultPeriod: 14 },
  { type: "macd", name: "MACD", category: "Oscillator" },
  { type: "stochastic", name: "Stochastic", category: "Oscillator" },
  { type: "cci", name: "CCI", category: "Oscillator", defaultPeriod: 20 },
  { type: "williams", name: "Williams %R", category: "Oscillator", defaultPeriod: 14 },
  { type: "adx", name: "ADX", category: "Volatility", defaultPeriod: 14 },
  { type: "atr", name: "ATR", category: "Volatility", defaultPeriod: 14 },
  { type: "bollinger", name: "Bollinger Bands", category: "Volatility", defaultPeriod: 20 },
  { type: "kc", name: "Keltner Channel", category: "Volatility" },
  { type: "dc", name: "Donchian Channel", category: "Volatility" },
  { type: "volume", name: "Volume", category: "Volume" },
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
    { symbol: "MATICUSDT", name: "Polygon" },
    { symbol: "UNIUSDT", name: "Uniswap" },
    { symbol: "LTCUSDT", name: "Litecoin" },
    { symbol: "ATOMUSDT", name: "Cosmos" },
    { symbol: "NEARUSDT", name: "NEAR" },
    { symbol: "APTUSDT", name: "Aptos" },
    { symbol: "ARBUSDT", name: "Arbitrum" },
    { symbol: "OPUSDT", name: "Optimism" },
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
    { symbol: "AUDJPY=X", name: "AUD/JPY" },
    { symbol: "EURAUD=X", name: "EUR/AUD" },
  ],
  indian: [
    { symbol: "^NSEI", name: "NIFTY 50" },
    { symbol: "^BSESN", name: "SENSEX" },
    { symbol: "^NSEBANK", name: "BANK NIFTY" },
    { symbol: "RELIANCE.NS", name: "Reliance" },
    { symbol: "TCS.NS", name: "TCS" },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
    { symbol: "INFY.NS", name: "Infosys" },
    { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
    { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever" },
    { symbol: "SBIN.NS", name: "SBI" },
    { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
    { symbol: "ITC.NS", name: "ITC" },
    { symbol: "KOTAKBANK.NS", name: "Kotak Bank" },
    { symbol: "LT.NS", name: "L&T" },
    { symbol: "AXISBANK.NS", name: "Axis Bank" },
  ],
};

export const DEFAULT_WATCHLIST: WatchlistItem[] = [
  ...MARKET_SYMBOLS.crypto.slice(0, 5).map((s) => ({ ...s, market: "crypto" as MarketType, price: 0, change: 0, changePercent: 0 })),
  ...MARKET_SYMBOLS.forex.slice(0, 4).map((s) => ({ ...s, market: "forex" as MarketType, price: 0, change: 0, changePercent: 0 })),
  ...MARKET_SYMBOLS.indian.slice(0, 4).map((s) => ({ ...s, market: "indian" as MarketType, price: 0, change: 0, changePercent: 0 })),
];
