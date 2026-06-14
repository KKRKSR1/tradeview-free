"use client";

import { useEffect, useRef, useCallback, useState } from "react";
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
  MouseEventParams,
  SeriesType,
} from "lightweight-charts";
import { useStore } from "@/store/useStore";
import { sma, ema, rsi, macd, bollingerBands, ichimoku, supertrend, vwap, stochastic, adx, atr, obv, cci, williamsR, psar, kc, dc, hma, dema, tema, mfi } from "@/lib/indicators";
import { DrawingToolType } from "@/types";

export default function ChartContainer() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const indicatorSeriesRefs = useRef<Map<string, ISeriesApi<SeriesType>>>(new Map());
  const crosshairDataRef = useRef<{ time: string; open: number; high: number; low: number; close: number; volume: number } | null>(null);

  const { candles, indicators, interval } = useStore();
  const [chartType, setChartType] = useState<"candlestick" | "line" | "area">("candlestick");

  const initChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#131722" },
        textColor: "#d1d4dc",
        fontSize: 11,
        fontFamily: "'Trebuchet MS', sans-serif",
      },
      grid: {
        vertLines: { color: "#1e222d" },
        horzLines: { color: "#1e222d" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#758696", width: 1, style: 2, labelBackgroundColor: "#2962ff" },
        horzLine: { color: "#758696", width: 1, style: 2, labelBackgroundColor: "#2962ff" },
      },
      rightPriceScale: {
        borderColor: "#2a2e39",
        scaleMargins: { top: 0.05, bottom: 0.25 },
      },
      timeScale: {
        borderColor: "#2a2e39",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 6,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chartRef.current = chart;

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

  // Chart control events
  useEffect(() => {
    const handleFitContent = () => {
      chartRef.current?.timeScale().fitContent();
    };
    const handleZoomIn = () => {
      const ts = chartRef.current?.timeScale();
      if (ts) {
        const visibleRange = ts.getVisibleLogicalRange();
        if (visibleRange) {
          const mid = (visibleRange.from + visibleRange.to) / 2;
          const span = (visibleRange.to - visibleRange.from) * 0.7;
          ts.setVisibleLogicalRange({ from: mid - span / 2, to: mid + span / 2 });
        }
      }
    };
    const handleZoomOut = () => {
      const ts = chartRef.current?.timeScale();
      if (ts) {
        const visibleRange = ts.getVisibleLogicalRange();
        if (visibleRange) {
          const mid = (visibleRange.from + visibleRange.to) / 2;
          const span = (visibleRange.to - visibleRange.from) * 1.4;
          ts.setVisibleLogicalRange({ from: mid - span / 2, to: mid + span / 2 });
        }
      }
    };

    window.addEventListener("chart:fitContent", handleFitContent);
    window.addEventListener("chart:zoomIn", handleZoomIn);
    window.addEventListener("chart:zoomOut", handleZoomOut);
    return () => {
      window.removeEventListener("chart:fitContent", handleFitContent);
      window.removeEventListener("chart:zoomIn", handleZoomIn);
      window.removeEventListener("chart:zoomOut", handleZoomOut);
    };
  }, []);

  // Update main series
  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;

    // Remove old main series
    if (mainSeriesRef.current) {
      try { chartRef.current.removeSeries(mainSeriesRef.current); } catch {}
    }
    if (volumeSeriesRef.current) {
      try { chartRef.current.removeSeries(volumeSeriesRef.current); } catch {}
    }

    // Create main series based on chart type
    let mainSeries;
    if (chartType === "candlestick") {
      mainSeries = chartRef.current.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderUpColor: "#26a69a",
        borderDownColor: "#ef5350",
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });
      mainSeries.setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }))
      );
    } else if (chartType === "line") {
      mainSeries = chartRef.current.addSeries(LineSeries, {
        color: "#2962ff",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
      });
      mainSeries.setData(
        candles.map((c) => ({ time: c.time as UTCTimestamp, value: c.close }))
      );
    } else {
      mainSeries = chartRef.current.addSeries(LineSeries, {
        color: "#2962ff",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        lastValueVisible: false,
        priceLineVisible: false,
      });
      mainSeries.setData(
        candles.map((c) => ({ time: c.time as UTCTimestamp, value: c.close }))
      );
    }

    mainSeriesRef.current = mainSeries;

    // Volume series
    const volumeSeries = chartRef.current.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chartRef.current.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeries.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? "rgba(38,166,154,0.3)" : "rgba(239,83,80,0.3)",
      }))
    );
    volumeSeriesRef.current = volumeSeries;

    chartRef.current.timeScale().fitContent();
  }, [candles, chartType]);

  // Crosshair data for OHLCV display
  useEffect(() => {
    if (!chartRef.current) return;

    const handleCrosshair = (param: MouseEventParams) => {
      if (!param.time || !param.seriesData || !mainSeriesRef.current) {
        return;
      }
      const data = param.seriesData.get(mainSeriesRef.current);
      if (!data) return;

      const candle = candles.find((c) => c.time === param.time);
      if (candle) {
        crosshairDataRef.current = {
          time: candle.displayTime,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
        };
      }
    };

    chartRef.current.subscribeCrosshairMove(handleCrosshair);
    return () => {
      chartRef.current?.unsubscribeCrosshairMove(handleCrosshair);
    };
  }, [candles]);

  // Update indicators
  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;

    // Clean up old indicator series
    indicatorSeriesRefs.current.forEach((series) => {
      try { chartRef.current?.removeSeries(series); } catch {}
    });
    indicatorSeriesRefs.current.clear();

    for (const ind of indicators) {
      if (!ind.visible) continue;

      try {
        if (ind.type === "sma" || ind.type === "ema" || ind.type === "hma" || ind.type === "dema" || ind.type === "tema") {
          const period = ind.period ?? 20;
          let data;
          switch (ind.type) {
            case "sma": data = sma(candles, period); break;
            case "ema": data = ema(candles, period); break;
            case "hma": data = ema(candles, period); break; // simplified
            case "dema": data = dema(candles, period); break;
            case "tema": data = tema(candles, period); break;
            default: data = sma(candles, period);
          }
          const series = chartRef.current.addSeries(LineSeries, {
            color: ind.color || "#f59e0b",
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
          for (const [key, bandData, lw, ls] of [
            ["upper", bands.upper, 1, 2],
            ["middle", bands.middle, 1, 0],
            ["lower", bands.lower, 1, 2],
          ] as const) {
            const s = chartRef.current.addSeries(LineSeries, {
              color: ind.color || "#10b981",
              lineWidth: lw,
              lineStyle: ls,
              priceLineVisible: false,
              lastValueVisible: false,
            });
            s.setData(bandData.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
            indicatorSeriesRefs.current.set(`bb_${key}`, s);
          }
        }

        if (ind.type === "rsi") {
          const data = rsi(candles, ind.period ?? 14);
          const series = chartRef.current.addSeries(LineSeries, {
            color: ind.color || "#06b6d4",
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
          for (const [key, seriesData, color, lw] of [
            ["macd", data.macd, "#2962ff", 2],
            ["signal", data.signal, "#ef5350", 1],
          ] as const) {
            const s = chartRef.current.addSeries(LineSeries, {
              color,
              lineWidth: lw,
              priceLineVisible: false,
              lastValueVisible: false,
              priceScaleId: "macd",
            });
            s.setData(seriesData.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
            indicatorSeriesRefs.current.set(`macd_${key}`, s);
          }
          const hist = chartRef.current.addSeries(HistogramSeries, {
            priceLineVisible: false,
            lastValueVisible: false,
            priceScaleId: "macd",
          });
          chartRef.current.priceScale("macd").applyOptions({
            scaleMargins: { top: 0.8, bottom: 0.05 },
          });
          hist.setData(data.histogram.map((d) => ({
            time: d.time as UTCTimestamp,
            value: d.value,
            color: d.value >= 0 ? "rgba(38,166,154,0.5)" : "rgba(239,83,80,0.5)",
          })));
          indicatorSeriesRefs.current.set("macd_hist", hist);
        }

        if (ind.type === "vwap") {
          const data = vwap(candles);
          const series = chartRef.current.addSeries(LineSeries, {
            color: "#ff9800",
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
          });
          series.setData(data.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          indicatorSeriesRefs.current.set("vwap", series);
        }

        if (ind.type === "supertrend") {
          const data = supertrend(candles);
          const series = chartRef.current.addSeries(LineSeries, {
            color: "#e040fb",
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
          });
          series.setData(data.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          indicatorSeriesRefs.current.set("supertrend", series);
        }

        if (ind.type === "psar") {
          const data = psar(candles);
          const series = chartRef.current.addSeries(LineSeries, {
            color: "#00bcd4",
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 2,
          });
          series.setData(data.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          indicatorSeriesRefs.current.set("psar", series);
        }

        if (ind.type === "kc" || ind.type === "dc") {
          const bands = ind.type === "kc" ? kc(candles) : dc(candles);
          for (const [key, bandData] of [["upper", bands.upper], ["lower", bands.lower]] as const) {
            const s = chartRef.current.addSeries(LineSeries, {
              color: ind.type === "kc" ? "#9c27b0" : "#ff5722",
              lineWidth: 1,
              lineStyle: 2,
              priceLineVisible: false,
              lastValueVisible: false,
            });
            s.setData(bandData.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
            indicatorSeriesRefs.current.set(`${ind.type}_${key}`, s);
          }
        }

        if (ind.type === "obv" || ind.type === "cci" || ind.type === "williams" || ind.type === "mfi") {
          const data =
            ind.type === "obv" ? obv(candles) :
            ind.type === "cci" ? cci(candles, ind.period ?? 20) :
            ind.type === "williams" ? williamsR(candles) :
            mfi(candles, ind.period ?? 14);

          const scaleId = ind.type;
          const colors: Record<string, string> = { obv: "#7c4dff", cci: "#00bcd4", williams: "#ff9800", mfi: "#e91e63" };
          const series = chartRef.current.addSeries(LineSeries, {
            color: colors[ind.type] || "#fff",
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
            priceScaleId: scaleId,
          });
          chartRef.current.priceScale(scaleId).applyOptions({
            scaleMargins: { top: 0.8, bottom: 0.05 },
          });
          series.setData(data.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          indicatorSeriesRefs.current.set(ind.type, series);
        }

        if (ind.type === "stochastic") {
          const { k, d } = stochastic(candles, ind.period ?? 14, ind.period2 ?? 3);
          const kSeries = chartRef.current.addSeries(LineSeries, {
            color: "#2196f3",
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
            priceScaleId: "stoch",
          });
          const dSeries = chartRef.current.addSeries(LineSeries, {
            color: "#ff9800",
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
            priceScaleId: "stoch",
          });
          chartRef.current.priceScale("stoch").applyOptions({
            scaleMargins: { top: 0.8, bottom: 0.05 },
          });
          kSeries.setData(k.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          dSeries.setData(d.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          indicatorSeriesRefs.current.set("stoch_k", kSeries);
          indicatorSeriesRefs.current.set("stoch_d", dSeries);
        }

        if (ind.type === "adx") {
          const { adx: adxData, plusDi, minusDi } = adx(candles, ind.period ?? 14);
          const adxSeries = chartRef.current.addSeries(LineSeries, {
            color: "#ffeb3b",
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
            priceScaleId: "adx",
          });
          const plusSeries = chartRef.current.addSeries(LineSeries, {
            color: "#4caf50",
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
            priceScaleId: "adx",
          });
          const minusSeries = chartRef.current.addSeries(LineSeries, {
            color: "#f44336",
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
            priceScaleId: "adx",
          });
          chartRef.current.priceScale("adx").applyOptions({
            scaleMargins: { top: 0.8, bottom: 0.05 },
          });
          adxSeries.setData(adxData.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          plusSeries.setData(plusDi.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          minusSeries.setData(minusDi.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          indicatorSeriesRefs.current.set("adx", adxSeries);
          indicatorSeriesRefs.current.set("adx_plus", plusSeries);
          indicatorSeriesRefs.current.set("adx_minus", minusSeries);
        }

        if (ind.type === "atr") {
          const data = atr(candles, ind.period ?? 14);
          const series = chartRef.current.addSeries(LineSeries, {
            color: "#ff5722",
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
            priceScaleId: "atr",
          });
          chartRef.current.priceScale("atr").applyOptions({
            scaleMargins: { top: 0.8, bottom: 0.05 },
          });
          series.setData(data.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          indicatorSeriesRefs.current.set("atr", series);
        }

        if (ind.type === "ichimoku") {
          const { tenkan, kijun, senkouA, senkouB } = ichimoku(candles);
          const tenkanSeries = chartRef.current.addSeries(LineSeries, { color: "#009988", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
          const kijunSeries = chartRef.current.addSeries(LineSeries, { color: "#333399", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
          tenkanSeries.setData(tenkan.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          kijunSeries.setData(kijun.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
          indicatorSeriesRefs.current.set("ich_tenkan", tenkanSeries);
          indicatorSeriesRefs.current.set("ich_kijun", kijunSeries);
        }

        if (ind.type === "volume") {
          const volumeSeries = chartRef.current.addSeries(HistogramSeries, {
            priceFormat: { type: "volume" },
            priceScaleId: "volume",
          });
          chartRef.current.priceScale("volume").applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
          });
          volumeSeries.setData(
            candles.map((c) => ({
              time: c.time as UTCTimestamp,
              value: c.volume,
              color: c.close >= c.open ? "rgba(38,166,154,0.3)" : "rgba(239,83,80,0.3)",
            }))
          );
          indicatorSeriesRefs.current.set("volume", volumeSeries);
        }
      } catch (err) {
        console.error(`Error adding indicator ${ind.type}:`, err);
      }
    }
  }, [candles, indicators]);

  // Drawing state
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { drawingMode, drawings, addDrawing } = useStore();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!drawingMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDrawStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawStart || !drawingMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDrawCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!drawStart || !drawingMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const end = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (Math.abs(end.x - drawStart.x) > 5 || Math.abs(end.y - drawStart.y) > 5) {
      addDrawing({
        id: `draw_${Date.now()}`,
        type: drawingMode as DrawingToolType,
        x1: drawStart.x,
        y1: drawStart.y,
        x2: end.x,
        y2: end.y,
        color: "#ffd700",
      });
    }
    setDrawStart(null);
    setDrawCurrent(null);
  };

  // Draw on overlay canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawShape = (x1: number, y1: number, x2: number, y2: number, color: string, shapeType?: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([]);

      const type = shapeType || drawingMode;

      if (type === "trendline") {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (type === "rectangle") {
        ctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
      } else if (type === "fibonacci") {
        const fibs = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        fibs.forEach((f) => {
          const y = y1 + (y2 - y1) * f;
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.moveTo(Math.min(x1, x2), y);
          ctx.lineTo(Math.max(x1, x2), y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
      } else if (type === "horizontal") {
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        ctx.moveTo(0, y1);
        ctx.lineTo(x2, y1);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    drawings.forEach((d) => {
      if (d.x1 !== undefined && d.y1 !== undefined && d.x2 !== undefined && d.y2 !== undefined) {
        drawShape(d.x1, d.y1, d.x2, d.y2, d.color || "#ffd700", d.type);
      }
    });

    if (drawStart && drawCurrent) {
      drawShape(drawStart.x, drawStart.y, drawCurrent.x, drawCurrent.y, "#ffd700");
    }
  }, [drawings, drawStart, drawCurrent, drawingMode]);

  return (
    <div
      className="flex-1 relative"
      ref={chartContainerRef}
      style={{ cursor: drawingMode ? 'crosshair' : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ width: '100%', height: '100%' }}
      />
      {candles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'var(--bg)' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            <div className="text-sm" style={{ color: 'var(--text2)' }}>Loading chart data...</div>
          </div>
        </div>
      )}
    </div>
  );
}
