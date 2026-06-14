import { CandleData, MarketType, Timeframe } from "@/types";

const YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

export const YAHOO_INTERVAL_MAP: Record<Timeframe, string> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "1h": "1h",
  "4h": "1d",
  "1d": "1d",
  "1w": "1wk",
};

export async function fetchYahooKlines(
  symbol: string,
  interval: Timeframe,
  market: MarketType,
  limit = 500
): Promise<CandleData[]> {
  const yahooInterval = YAHOO_INTERVAL_MAP[interval];
  const range = getRange(interval, limit);

  const url = `${YAHOO_BASE}/${encodeURIComponent(symbol)}?interval=${yahooInterval}&range=${range}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Yahoo API error: ${res.status}`);
  const data = await res.json();

  const result = data.chart?.result?.[0];
  if (!result) return [];

  const timestamps = result.timestamp || [];
  const ohlcv = result.indicators?.quote?.[0] || {};

  const candles: CandleData[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const open = ohlcv.open?.[i];
    const high = ohlcv.high?.[i];
    const low = ohlcv.low?.[i];
    const close = ohlcv.close?.[i];
    const volume = ohlcv.volume?.[i];

    if (open != null && high != null && low != null && close != null) {
      candles.push({
        time: timestamps[i],
        open,
        high,
        low,
        close,
        volume: volume || 0,
        displayTime: new Date(timestamps[i] * 1000).toISOString().replace("T", " ").slice(0, 19),
      });
    }
  }

  return candles.slice(-limit);
}

export async function fetchYahooTicker(symbol: string, market: MarketType) {
  const url = `${YAHOO_BASE}/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Yahoo API error: ${res.status}`);
  const data = await res.json();

  const result = data.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta) return null;

  const price = meta.regularMarketPrice || 0;
  const previousClose = meta.chartPreviousClose || meta.previousClose || price;
  const change = price - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;

  return {
    symbol,
    price,
    change,
    changePercent,
    high24h: meta.regularMarketDayHigh || price,
    low24h: meta.regularMarketDayLow || price,
    volume24h: meta.regularMarketVolume || 0,
  };
}

function getRange(interval: Timeframe, limit: number): string {
  switch (interval) {
    case "1m":
      return limit <= 60 ? "1d" : "5d";
    case "5m":
      return limit <= 100 ? "5d" : "1mo";
    case "15m":
      return limit <= 100 ? "1mo" : "3mo";
    case "1h":
      return limit <= 100 ? "1mo" : "3mo";
    case "4h":
      return limit <= 100 ? "3mo" : "6mo";
    case "1d":
      return limit <= 100 ? "6mo" : "2y";
    case "1w":
      return limit <= 100 ? "2y" : "5y";
    default:
      return "6mo";
  }
}

export function isYahooSymbol(symbol: string, market: MarketType): boolean {
  return market === "forex" || market === "indian";
}
