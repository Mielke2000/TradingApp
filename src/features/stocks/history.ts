import { Platform } from 'react-native';

export const stocks = [
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'AVGO', name: 'Broadcom' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'BRK-B', name: 'Berkshire Hathaway' },
  { symbol: 'WMT', name: 'Walmart' },
];

export const periods = [
  { label: '1W', days: 7, name: '1 Woche' },
  { label: '1M', days: 30, name: '1 Monat' },
  { label: '3M', days: 90, name: '3 Monate' },
  { label: '6M', days: 180, name: '6 Monate' },
  { label: '1J', days: 365, name: '1 Jahr' },
];

export type PricePoint = { time: number; close: number };
type ChartResponse = {
  chart?: {
    result?: {
      timestamp?: (number | null)[];
      indicators?: { quote?: { close?: (number | null)[] }[] };
    }[];
  };
};

export const day = 86_400_000;

export function demoHistory(symbol: string): PricePoint[] {
  const seed = Array.from(symbol).reduce((sum, letter) => sum * 31 + letter.charCodeAt(0), 7);
  const end = Math.floor(Date.now() / day) * day;
  const prices: PricePoint[] = [];
  let close = 80 + seed % 170;

  for (let offset = 366; offset >= 0; offset--) {
    const time = end - offset * day;
    const weekday = new Date(time).getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    close *= 1 + Math.sin(seed % 360 + offset * 1.73) * 0.017
      + Math.cos(seed % 90 + offset * 0.32) * 0.008 + 0.0004;
    prices.push({ time, close });
  }

  return prices;
}

export async function fetchHistory(symbol: string, signal: AbortSignal): Promise<PricePoint[] | null> {
  const endpoint = process.env.EXPO_PUBLIC_STOCK_CHART_URL
    || (Platform.OS === 'web' ? undefined : 'https://query1.finance.yahoo.com/v8/finance/chart');
  if (!endpoint) return null;

  const url = new URL(endpoint.replace(/\/$/, '') + '/' + encodeURIComponent(symbol));
  url.searchParams.set('range', '1y');
  url.searchParams.set('interval', '1d');
  const response = await fetch(url.toString(), { signal });
  if (!response.ok) throw new Error('Kursquelle nicht erreichbar');

  const payload: ChartResponse = await response.json();
  const result = payload.chart?.result?.[0];
  const closes = result?.indicators?.quote?.[0]?.close;
  const points = (result?.timestamp ?? []).flatMap((time, index) => {
    const close = closes?.[index];
    return typeof time === 'number' && Number.isFinite(time)
      && typeof close === 'number' && Number.isFinite(close) && close > 0
      ? [{ time: time * 1000, close }]
      : [];
  });
  if (points.length < 2) throw new Error('Kursverlauf unvollständig');

  return points.sort((a, b) => a.time - b.time);
}
