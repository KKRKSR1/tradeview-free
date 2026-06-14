import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const interval = searchParams.get("interval") || "1d";
  const range = searchParams.get("range") || "1y";

  if (!symbol) {
    return NextResponse.json({ error: "Symbol required" }, { status: 400 });
  }

  try {
    const encodedSymbol = encodeURIComponent(symbol);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodedSymbol}?interval=${interval}&range=${range}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Yahoo API error for ${symbol}: ${res.status} - ${text}`);
      return NextResponse.json({ error: `Yahoo API error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();

    if (data.chart?.error) {
      console.error(`Yahoo chart error for ${symbol}:`, data.chart.error);
      return NextResponse.json({ error: data.chart.error.description || "Chart error" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Failed to fetch Yahoo data for ${symbol}:`, error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
