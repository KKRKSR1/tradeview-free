import { CandleData } from "@/types";

export function sma(data: CandleData[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
}

export function ema(data: CandleData[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  const multiplier = 2 / (period + 1);

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let prev = sum / period;
  result.push({ time: data[period - 1].time, value: prev });

  for (let i = period; i < data.length; i++) {
    const current = (data[i].close - prev) * multiplier + prev;
    result.push({ time: data[i].time, value: current });
    prev = current;
  }
  return result;
}

export function rsi(data: CandleData[], period = 14): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  if (data.length < period + 1) return result;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push({ time: data[period].time, value: 100 - 100 / (1 + rs) });

  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    const rsVal = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push({ time: data[i].time, value: 100 - 100 / (1 + rsVal) });
  }
  return result;
}

export function macd(
  data: CandleData[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): { macd: { time: number; value: number }[]; signal: { time: number; value: number }[]; histogram: { time: number; value: number }[] } {
  const fastEma = ema(data, fastPeriod);
  const slowEma = ema(data, slowPeriod);

  const macdLine: { time: number; value: number }[] = [];
  const offset = slowPeriod - fastPeriod;

  for (let i = 0; i < slowEma.length; i++) {
    const fastVal = fastEma[i + offset];
    if (fastVal) {
      macdLine.push({
        time: slowEma[i].time,
        value: fastVal.value - slowEma[i].value,
      });
    }
  }

  const signalLine: { time: number; value: number }[] = [];
  if (macdLine.length >= signalPeriod) {
    const multiplier = 2 / (signalPeriod + 1);
    let sum = 0;
    for (let i = 0; i < signalPeriod; i++) {
      sum += macdLine[i].value;
    }
    let prev = sum / signalPeriod;
    signalLine.push({ time: macdLine[signalPeriod - 1].time, value: prev });

    for (let i = signalPeriod; i < macdLine.length; i++) {
      const current = (macdLine[i].value - prev) * multiplier + prev;
      signalLine.push({ time: macdLine[i].time, value: current });
      prev = current;
    }
  }

  const histogram: { time: number; value: number }[] = [];
  const signalMap = new Map(signalLine.map((s) => [s.time, s.value]));
  for (const m of macdLine) {
    const sig = signalMap.get(m.time);
    if (sig !== undefined) {
      histogram.push({ time: m.time, value: m.value - sig });
    }
  }

  return { macd: macdLine, signal: signalLine, histogram };
}

export function bollingerBands(
  data: CandleData[],
  period = 20,
  stdDev = 2
): { upper: { time: number; value: number }[]; middle: { time: number; value: number }[]; lower: { time: number; value: number }[] } {
  const middle = sma(data, period);
  const upper: { time: number; value: number }[] = [];
  const lower: { time: number; value: number }[] = [];

  for (let i = period - 1; i < data.length; i++) {
    let sumSq = 0;
    const mean = middle[i - period + 1]?.value ?? 0;
    for (let j = 0; j < period; j++) {
      sumSq += Math.pow(data[i - j].close - mean, 2);
    }
    const std = Math.sqrt(sumSq / period);
    const time = data[i].time;
    upper.push({ time, value: mean + stdDev * std });
    lower.push({ time, value: mean - stdDev * std });
  }

  return { upper, middle, lower };
}
