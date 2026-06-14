import { CandleData, Timeframe } from "@/types";

const BINANCE_REST = "https://api.binance.com";
const BINANCE_WS = "wss://stream.binance.com:9443/ws";

export function getKlineEndpoint(symbol: string, interval: Timeframe): string {
  return `${BINANCE_WS}/${symbol.toLowerCase()}@kline_${interval}`;
}

export async function fetchKlines(
  symbol: string,
  interval: Timeframe,
  limit = 500
): Promise<CandleData[]> {
  const url = `${BINANCE_REST}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();

  return data.map((k: (string | number)[]) => ({
    time: Math.floor((k[0] as number) / 1000),
    open: parseFloat(k[1] as string),
    high: parseFloat(k[2] as string),
    low: parseFloat(k[3] as string),
    close: parseFloat(k[4] as string),
    volume: parseFloat(k[5] as string),
    displayTime: formatTime(k[0] as number),
  }));
}

export async function fetchTicker(symbol: string) {
  const url = `${BINANCE_REST}/api/v3/ticker/24hr?symbol=${symbol}`;
  const res = await fetch(url);
  const data = await res.json();

  return {
    symbol: data.symbol,
    price: parseFloat(data.lastPrice),
    change: parseFloat(data.priceChange),
    changePercent: parseFloat(data.priceChangePercent),
    high24h: parseFloat(data.highPrice),
    low24h: parseFloat(data.lowPrice),
    volume24h: parseFloat(data.quoteVolume),
  };
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString().replace("T", " ").slice(0, 19);
}

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private symbol: string;
  private interval: Timeframe;
  private onKline: (data: CandleData) => void;
  private onTicker?: (data: { price: number; change: number; changePercent: number }) => void;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed = false;

  constructor(
    symbol: string,
    interval: Timeframe,
    onKline: (data: CandleData) => void,
    onTicker?: (data: { price: number; change: number; changePercent: number }) => void
  ) {
    this.symbol = symbol;
    this.interval = interval;
    this.onKline = onKline;
    this.onTicker = onTicker;
  }

  connect() {
    if (this.isDestroyed) return;
    this.disconnect();

    const klineStream = `${this.symbol.toLowerCase()}@kline_${this.interval}`;
    const tickerStream = `${this.symbol.toLowerCase()}@ticker`;
    const url = `${BINANCE_WS}/${klineStream}/${tickerStream}`;

    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.e === "kline") {
        const k = msg.k;
        this.onKline({
          time: Math.floor(k.t / 1000),
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
          displayTime: formatTime(k.t),
        });
      }

      if (msg.e === "24hrTicker" && this.onTicker) {
        this.onTicker({
          price: parseFloat(msg.c),
          change: parseFloat(msg.p),
          changePercent: parseFloat(msg.P),
        });
      }
    };

    this.ws.onclose = () => {
      if (!this.isDestroyed) {
        this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }

  updateSymbol(symbol: string, interval: Timeframe) {
    this.symbol = symbol;
    this.interval = interval;
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.connect();
    }
  }

  destroy() {
    this.isDestroyed = true;
    this.disconnect();
  }
}
