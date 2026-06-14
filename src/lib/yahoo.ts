import { CandleData, MarketType, Timeframe } from "@/types";

export const YAHOO_INTERVAL_MAP: Record<Timeframe, string> = {
  "1s": "1m", "5s": "1m", "15s": "1m", "30s": "1m",
  "1m": "1m", "2m": "1m", "3m": "1m", "5m": "5m",
  "15m": "15m", "30m": "30m", "45m": "30m",
  "1h": "1h", "2h": "1h", "3h": "1h", "4h": "1h",
  "6h": "1d", "8h": "1d", "12h": "1d",
  "1d": "1d", "2d": "1d", "3d": "1d",
  "1w": "1wk", "1M": "1mo",
};

export const YAHOO_RANGE_MAP: Record<Timeframe, string> = {
  "1s": "1d", "5s": "1d", "15s": "1d", "30s": "1d",
  "1m": "5d", "2m": "5d", "3m": "5d", "5m": "5d",
  "15m": "1mo", "30m": "1mo", "45m": "1mo",
  "1h": "3mo", "2h": "3mo", "3h": "3mo", "4h": "3mo",
  "6h": "6mo", "8h": "6mo", "12h": "6mo",
  "1d": "1y", "2d": "1y", "3d": "2y",
  "1w": "5y", "1M": "max",
};

export async function fetchYahooKlines(
  symbol: string,
  interval: Timeframe,
  market: MarketType,
  limit = 500
): Promise<CandleData[]> {
  const yahooInterval = YAHOO_INTERVAL_MAP[interval];
  const range = YAHOO_RANGE_MAP[interval];

  const url = `/api/yahoo?symbol=${encodeURIComponent(symbol)}&interval=${yahooInterval}&range=${range}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`Yahoo error: ${data.error}`);
  }

  const result = data.chart?.result?.[0];
  if (!result) {
    console.warn(`No chart result for ${symbol}`);
    return [];
  }

  const timestamps = result.timestamp || [];
  const ohlcv = result.indicators?.quote?.[0] || {};

  const candles: CandleData[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const open = ohlcv.open?.[i];
    const high = ohlcv.high?.[i];
    const low = ohlcv.low?.[i];
    const close = ohlcv.close?.[i];
    const volume = ohlcv.volume?.[i];

    if (open != null && high != null && low != null && close != null && !isNaN(open) && !isNaN(close)) {
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
  const url = `/api/yahoo?symbol=${encodeURIComponent(symbol)}&interval=1d&range=2d`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`Yahoo error: ${data.error}`);
  }

  const result = data.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta) {
    console.warn(`No meta for ${symbol}`);
    return null;
  }

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
