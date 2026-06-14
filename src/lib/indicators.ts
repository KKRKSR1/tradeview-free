import { CandleData } from "@/types";

export function sma(data: CandleData[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) sum += data[i - j].close;
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
}

export function ema(data: CandleData[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  const k = 2 / (period + 1);
  let sum = 0;
  for (let i = 0; i < period; i++) sum += data[i].close;
  let prev = sum / period;
  result.push({ time: data[period - 1].time, value: prev });
  for (let i = period; i < data.length; i++) {
    const v = (data[i].close - prev) * k + prev;
    result.push({ time: data[i].time, value: v });
    prev = v;
  }
  return result;
}

export function hma(data: CandleData[], period: number): { time: number; value: number }[] {
  const half = sma(data, Math.floor(period / 2));
  const full = sma(data, period);
  const diff: { time: number; value: number }[] = [];
  const fullMap = new Map(full.map((f) => [f.time, f.value]));
  for (const h of half) {
    const f = fullMap.get(h.time);
    if (f !== undefined) diff.push({ time: h.time, value: 2 * h.value - f });
  }
  return ema(diff as unknown as CandleData[], Math.floor(Math.sqrt(period))).map((e) => ({
    time: e.time,
    value: e.value,
  }));
}

export function dema(data: CandleData[], period: number): { time: number; value: number }[] {
  const e1 = ema(data, period);
  const e2 = ema(e1 as unknown as CandleData[], period);
  const e2Map = new Map(e2.map((e) => [e.time, e.value]));
  return e1
    .filter((v) => e2Map.has(v.time))
    .map((v) => ({ time: v.time, value: 2 * v.value - (e2Map.get(v.time) || 0) }));
}

export function tema(data: CandleData[], period: number): { time: number; value: number }[] {
  const e1 = ema(data, period);
  const e2 = ema(e1 as unknown as CandleData[], period);
  const e3 = ema(e2 as unknown as CandleData[], period);
  const e2Map = new Map(e2.map((e) => [e.time, e.value]));
  const e3Map = new Map(e3.map((e) => [e.time, e.value]));
  return e1
    .filter((v) => e2Map.has(v.time) && e3Map.has(v.time))
    .map((v) => ({
      time: v.time,
      value: 3 * v.value - 3 * (e2Map.get(v.time) || 0) + (e3Map.get(v.time) || 0),
    }));
}

export function rsi(data: CandleData[], period = 14): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  if (data.length < period + 1) return result;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const c = data[i].close - data[i - 1].close;
    if (c > 0) gains += c; else losses -= c;
  }
  let ag = gains / period, al = losses / period;
  result.push({ time: data[period].time, value: 100 - 100 / (1 + (al === 0 ? 100 : ag / al)) });
  for (let i = period + 1; i < data.length; i++) {
    const c = data[i].close - data[i - 1].close;
    ag = (ag * (period - 1) + (c > 0 ? c : 0)) / period;
    al = (al * (period - 1) + (c < 0 ? -c : 0)) / period;
    result.push({ time: data[i].time, value: 100 - 100 / (1 + (al === 0 ? 100 : ag / al)) });
  }
  return result;
}

export function macd(
  data: CandleData[], fast = 12, slow = 26, signal = 9
): { macd: { time: number; value: number }[]; signal: { time: number; value: number }[]; histogram: { time: number; value: number }[] } {
  const fEma = ema(data, fast);
  const sEma = ema(data, slow);
  const off = slow - fast;
  const ml: { time: number; value: number }[] = [];
  for (let i = 0; i < sEma.length; i++) {
    const fv = fEma[i + off];
    if (fv) ml.push({ time: sEma[i].time, value: fv.value - sEma[i].value });
  }
  const sl: { time: number; value: number }[] = [];
  if (ml.length >= signal) {
    const k = 2 / (signal + 1);
    let s = 0;
    for (let i = 0; i < signal; i++) s += ml[i].value;
    let p = s / signal;
    sl.push({ time: ml[signal - 1].time, value: p });
    for (let i = signal; i < ml.length; i++) {
      const v = (ml[i].value - p) * k + p;
      sl.push({ time: ml[i].time, value: v });
      p = v;
    }
  }
  const sm = new Map(sl.map((s) => [s.time, s.value]));
  const hist = ml.filter((m) => sm.has(m.time)).map((m) => ({ time: m.time, value: m.value - (sm.get(m.time) || 0) }));
  return { macd: ml, signal: sl, histogram: hist };
}

export function bollingerBands(
  data: CandleData[], period = 20, stdDev = 2
): { upper: { time: number; value: number }[]; middle: { time: number; value: number }[]; lower: { time: number; value: number }[] } {
  const mid = sma(data, period);
  const upper: { time: number; value: number }[] = [];
  const lower: { time: number; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sq = 0;
    const mean = mid[i - period + 1]?.value ?? 0;
    for (let j = 0; j < period; j++) sq += Math.pow(data[i - j].close - mean, 2);
    const std = Math.sqrt(sq / period);
    upper.push({ time: data[i].time, value: mean + stdDev * std });
    lower.push({ time: data[i].time, value: mean - stdDev * std });
  }
  return { upper, middle: mid, lower };
}

export function stochastic(
  data: CandleData[], kPeriod = 14, dPeriod = 3
): { k: { time: number; value: number }[]; d: { time: number; value: number }[] } {
  const kValues: { time: number; value: number }[] = [];
  for (let i = kPeriod - 1; i < data.length; i++) {
    let high = -Infinity, low = Infinity;
    for (let j = 0; j < kPeriod; j++) {
      high = Math.max(high, data[i - j].high);
      low = Math.min(low, data[i - j].low);
    }
    const val = high === low ? 50 : ((data[i].close - low) / (high - low)) * 100;
    kValues.push({ time: data[i].time, value: val });
  }
  const dValues = sma(kValues as unknown as CandleData[], dPeriod);
  return { k: kValues, d: dValues };
}

export function adx(data: CandleData[], period = 14): { adx: { time: number; value: number }[]; plusDi: { time: number; value: number }[]; minusDi: { time: number; value: number }[] } {
  const trList: number[] = [];
  const plusDM: number[] = [];
  const minusDM: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevHigh = data[i - 1].high;
    const prevLow = data[i - 1].low;
    const prevClose = data[i - 1].close;

    trList.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));
    plusDM.push(high - prevHigh > prevLow - low ? Math.max(high - prevHigh, 0) : 0);
    minusDM.push(prevLow - low > high - prevHigh ? Math.max(prevLow - low, 0) : 0);
  }

  const atr = sma(trList.map((v, i) => ({ time: data[i + 1].time, open: v, high: v, low: v, close: v, volume: 0, displayTime: "" })), period);
  const plusDiEMA = ema(plusDM.map((v, i) => ({ time: data[i + 1].time, open: v, high: v, low: v, close: v, volume: 0, displayTime: "" })), period);
  const minusDiEMA = ema(minusDM.map((v, i) => ({ time: data[i + 1].time, open: v, high: v, low: v, close: v, volume: 0, displayTime: "" })), period);

  const atrMap = new Map(atr.map((a) => [a.time, a.value]));
  const plusMap = new Map(plusDiEMA.map((p) => [p.time, p.value]));
  const minusMap = new Map(minusDiEMA.map((m) => [m.time, m.value]));

  const plusDI: { time: number; value: number }[] = [];
  const minusDI: { time: number; value: number }[] = [];
  const dxList: { time: number; value: number }[] = [];

  for (const [time, atrVal] of atrMap) {
    const pv = plusMap.get(time) || 0;
    const mv = minusMap.get(time) || 0;
    const pdi = atrVal ? (pv / atrVal) * 100 : 0;
    const mdi = atrVal ? (mv / atrVal) * 100 : 0;
    plusDI.push({ time, value: pdi });
    minusDI.push({ time, value: mdi });
    dxList.push({ time, value: pdi + mdi === 0 ? 0 : (Math.abs(pdi - mdi) / (pdi + mdi)) * 100 });
  }

  const adxValues = sma(dxList as unknown as CandleData[], period);
  return { adx: adxValues, plusDi: plusDI, minusDi: minusDI };
}

export function atr(data: CandleData[], period = 14): { time: number; value: number }[] {
  const trList: { time: number; open: number; high: number; low: number; close: number; volume: number; displayTime: string }[] = [];
  for (let i = 1; i < data.length; i++) {
    const tr = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    );
    trList.push({ ...data[i], open: tr, high: tr, low: tr, close: tr });
  }
  return sma(trList, period);
}

export function obv(data: CandleData[]): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    if (i > 0) {
      sum += data[i].close > data[i - 1].close ? data[i].volume : -data[i].volume;
    }
    result.push({ time: data[i].time, value: sum });
  }
  return result;
}

export function cci(data: CandleData[], period = 20): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      const tp = (data[i - j].high + data[i - j].low + data[i - j].close) / 3;
      sum += tp;
    }
    const mean = sum / period;
    let devSum = 0;
    for (let j = 0; j < period; j++) {
      const tp = (data[i - j].high + data[i - j].low + data[i - j].close) / 3;
      devSum += Math.abs(tp - mean);
    }
    const meanDev = devSum / period;
    const tp = (data[i].high + data[i].low + data[i].close) / 3;
    result.push({ time: data[i].time, value: meanDev === 0 ? 0 : (tp - mean) / (0.015 * meanDev) });
  }
  return result;
}

export function williamsR(data: CandleData[], period = 14): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let high = -Infinity, low = Infinity;
    for (let j = 0; j < period; j++) {
      high = Math.max(high, data[i - j].high);
      low = Math.min(low, data[i - j].low);
    }
    result.push({ time: data[i].time, value: high === low ? -50 : ((high - data[i].close) / (high - low)) * -100 });
  }
  return result;
}

export function supertrend(data: CandleData[], period = 10, multiplier = 3): { time: number; value: number }[] {
  const atrVals = atr(data, period);
  const atrMap = new Map(atrVals.map((a) => [a.time, a.value]));
  const result: { time: number; value: number }[] = [];
  let prevUpper = 0;
  let prevLower = 0;

  for (let i = period; i < data.length; i++) {
    const a = atrMap.get(data[i].time) || 0;
    const hl2 = (data[i].high + data[i].low) / 2;
    const upper = hl2 + multiplier * a;
    const lower = hl2 - multiplier * a;

    const prevClose = data[i - 1].close;
    const st = prevClose <= prevUpper ? Math.min(upper, prevUpper || upper) : lower;
    result.push({ time: data[i].time, value: st });
    prevUpper = upper;
    prevLower = lower;
  }
  return result;
}

export function vwap(data: CandleData[]): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  let cumVol = 0;
  let cumTP = 0;
  for (const c of data) {
    const tp = (c.high + c.low + c.close) / 3;
    cumVol += c.volume;
    cumTP += tp * c.volume;
    result.push({ time: c.time, value: cumVol === 0 ? tp : cumTP / cumVol });
  }
  return result;
}

export function mfi(data: CandleData[], period = 14): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  if (data.length < period + 1) return result;

  const tp = data.map((d) => (d.high + d.low + d.close) / 3);
  const mf = tp.map((t, i) => t * data[i].volume);

  for (let i = period; i < data.length; i++) {
    let posMf = 0, negMf = 0;
    for (let j = i - period + 1; j <= i; j++) {
      if (tp[j] > tp[j - 1]) posMf += mf[j];
      else negMf += mf[j];
    }
    const ratio = negMf === 0 ? 100 : posMf / negMf;
    result.push({ time: data[i].time, value: 100 - 100 / (1 + ratio) });
  }
  return result;
}

export function psar(data: CandleData[], afStart = 0.02, afStep = 0.02, afMax = 0.2): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  if (data.length < 2) return result;

  let isLong = data[1].close > data[0].close;
  let af = afStart;
  let ep = isLong ? data[0].high : data[0].low;
  let psar = isLong ? data[0].low : data[0].high;

  for (let i = 1; i < data.length; i++) {
    const prevPsar = psar;
    psar = prevPsar + af * (ep - prevPsar);

    if (isLong) {
      if (data[i - 1].low < prevPsar) psar = Math.min(data[i - 1].low, data[i - 2]?.low || data[i - 1].low);
      if (psar > data[i].low) { isLong = false; psar = ep; af = afStart; ep = data[i].low; }
      else {
        if (data[i].high > ep) { ep = data[i].high; af = Math.min(af + afStep, afMax); }
      }
    } else {
      if (data[i - 1].high > prevPsar) psar = Math.max(data[i - 1].high, data[i - 2]?.high || data[i - 1].high);
      if (psar < data[i].high) { isLong = true; psar = ep; af = afStart; ep = data[i].high; }
      else {
        if (data[i].low < ep) { ep = data[i].low; af = Math.min(af + afStep, afMax); }
      }
    }
    result.push({ time: data[i].time, value: psar });
  }
  return result;
}

export function ichimoku(data: CandleData[]): {
  tenkan: { time: number; value: number }[];
  kijun: { time: number; value: number }[];
  senkouA: { time: number; value: number }[];
  senkouB: { time: number; value: number }[];
} {
  const tenkanPeriod = 9;
  const kijunPeriod = 26;
  const senkouBPeriod = 52;

  function periodMid(period: number): { time: number; value: number }[] {
    const r: { time: number; value: number }[] = [];
    for (let i = period - 1; i < data.length; i++) {
      let high = -Infinity, low = Infinity;
      for (let j = 0; j < period; j++) {
        high = Math.max(high, data[i - j].high);
        low = Math.min(low, data[i - j].low);
      }
      r.push({ time: data[i].time, value: (high + low) / 2 });
    }
    return r;
  }

  const tenkan = periodMid(tenkanPeriod);
  const kijun = periodMid(kijunPeriod);
  const senkouB = periodMid(senkouBPeriod);

  const kijunMap = new Map(kijun.map((k) => [k.time, k.value]));
  const senkouA: { time: number; value: number }[] = [];
  for (const t of tenkan) {
    const k = kijunMap.get(t.time);
    if (k !== undefined) senkouA.push({ time: t.time, value: (t.value + k) / 2 });
  }

  return { tenkan, kijun, senkouA, senkouB };
}

export function kc(
  data: CandleData[], emaPeriod = 20, atrPeriod = 10, multiplier = 2
): { upper: { time: number; value: number }[]; middle: { time: number; value: number }[]; lower: { time: number; value: number }[] } {
  const mid = ema(data, emaPeriod);
  const atrVals = atr(data, atrPeriod);
  const atrMap = new Map(atrVals.map((a) => [a.time, a.value]));
  const upper: { time: number; value: number }[] = [];
  const lower: { time: number; value: number }[] = [];
  for (const m of mid) {
    const a = atrMap.get(m.time) || 0;
    upper.push({ time: m.time, value: m.value + multiplier * a });
    lower.push({ time: m.time, value: m.value - multiplier * a });
  }
  return { upper, middle: mid, lower };
}

export function dc(
  data: CandleData[], period = 20
): { upper: { time: number; value: number }[]; middle: { time: number; value: number }[]; lower: { time: number; value: number }[] } {
  const upper: { time: number; value: number }[] = [];
  const lower: { time: number; value: number }[] = [];
  const mid: { time: number; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let high = -Infinity, low = Infinity;
    for (let j = 0; j < period; j++) {
      high = Math.max(high, data[i - j].high);
      low = Math.min(low, data[i - j].low);
    }
    upper.push({ time: data[i].time, value: high });
    lower.push({ time: data[i].time, value: low });
    mid.push({ time: data[i].time, value: (high + low) / 2 });
  }
  return { upper, middle: mid, lower };
}
