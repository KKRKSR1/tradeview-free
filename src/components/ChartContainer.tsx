"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  UTCTimestamp,
} from "lightweight-charts";
import { useStore } from "@/store/useStore";
import { sma, ema, rsi, macd, bollingerBands } from "@/lib/indicators";

export default function ChartContainer() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const indicatorSeriesRefs = useRef<Map<string, ISeriesApi<"Line"> | ISeriesApi<"Histogram">>>(new Map());

  const { candles, indicators } = useStore();

  const initChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0f0f0f" },
        textColor: "#a0a0a0",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#1a1a1a" },
        horzLines: { color: "#1a1a1a" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#404040", labelBackgroundColor: "#2563eb" },
        horzLine: { color: "#404040", labelBackgroundColor: "#2563eb" },
      },
      rightPriceScale: {
        borderColor: "#1a1a1a",
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: "#1a1a1a",
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const cleanup = initChart();
    return cleanup;
  }, [initChart]);

  // Update candle and volume data
  useEffect(() => {
    if (!candleSeriesRef.current || candles.length === 0) return;

    const candleData = candles.map((c) => ({
      time: c.time as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candleSeriesRef.current.setData(candleData);

    if (volumeSeriesRef.current) {
      const volData = candles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)",
      }));
      volumeSeriesRef.current.setData(volData);
    }

    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  // Update indicators
  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;

    // Clean up old indicator series
    indicatorSeriesRefs.current.forEach((series) => {
      try {
        chartRef.current?.removeSeries(series);
      } catch {
        // ignore
      }
    });
    indicatorSeriesRefs.current.clear();

    // Add visible indicators
    for (const ind of indicators) {
      if (!ind.visible) continue;

      if (ind.type === "sma" || ind.type === "ema") {
        const period = ind.period ?? 20;
        const data = ind.type === "sma" ? sma(candles, period) : ema(candles, period);
        const series = chartRef.current.addSeries(LineSeries, {
          color: ind.color ?? "#f59e0b",
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        series.setData(data.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
        indicatorSeriesRefs.current.set(`${ind.type}_${period}`, series);
      }

      if (ind.type === "bollinger") {
        const period = ind.period ?? 20;
        const bands = bollingerBands(candles, period);

        const upperSeries = chartRef.current.addSeries(LineSeries, {
          color: "#10b981",
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        upperSeries.setData(bands.upper.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));

        const middleSeries = chartRef.current.addSeries(LineSeries, {
          color: "#10b981",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        middleSeries.setData(bands.middle.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));

        const lowerSeries = chartRef.current.addSeries(LineSeries, {
          color: "#10b981",
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        lowerSeries.setData(bands.lower.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));

        indicatorSeriesRefs.current.set("bollinger_upper", upperSeries);
        indicatorSeriesRefs.current.set("bollinger_middle", middleSeries);
        indicatorSeriesRefs.current.set("bollinger_lower", lowerSeries);
      }

      if (ind.type === "rsi") {
        const data = rsi(candles, ind.period ?? 14);
        const series = chartRef.current.addSeries(LineSeries, {
          color: ind.color ?? "#06b6d4",
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: false,
          priceScaleId: "rsi",
        });
        chartRef.current.priceScale("rsi").applyOptions({
          scaleMargins: { top: 0.8, bottom: 0.05 },
        });
        series.setData(data.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
        indicatorSeriesRefs.current.set("rsi", series);
      }

      if (ind.type === "macd") {
        const data = macd(candles);
        const macdSeries = chartRef.current.addSeries(LineSeries, {
          color: "#3b82f6",
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: false,
          priceScaleId: "macd",
        });
        const signalSeries = chartRef.current.addSeries(LineSeries, {
          color: "#ef4444",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
          priceScaleId: "macd",
        });
        const histSeries = chartRef.current.addSeries(HistogramSeries, {
          priceLineVisible: false,
          lastValueVisible: false,
          priceScaleId: "macd",
        });
        chartRef.current.priceScale("macd").applyOptions({
          scaleMargins: { top: 0.8, bottom: 0.05 },
        });

        macdSeries.setData(data.macd.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
        signalSeries.setData(data.signal.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
        histSeries.setData(
          data.histogram.map((d) => ({
            time: d.time as UTCTimestamp,
            value: d.value,
            color: d.value >= 0 ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)",
          }))
        );

        indicatorSeriesRefs.current.set("macd", macdSeries);
        indicatorSeriesRefs.current.set("macd_signal", signalSeries);
        indicatorSeriesRefs.current.set("macd_hist", histSeries);
      }
    }
  }, [candles, indicators]);

  return (
    <div className="flex-1 relative">
      <div ref={chartContainerRef} className="w-full h-full" />
      {candles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-zinc-500 text-lg">Loading chart data...</div>
        </div>
      )}
    </div>
  );
}
