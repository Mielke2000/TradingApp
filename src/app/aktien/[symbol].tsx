import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { day, demoHistory, fetchHistory, periods, stocks, type PricePoint } from '../../features/stocks/history';
import { PriceChart } from '../../features/stocks/PriceChart';

type Stock = typeof stocks[number];
type History = { points: PricePoint[]; demo: boolean };

export default function StockScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const stock = stocks.find(item => item.symbol === symbol);

  if (!stock) {
    return (
      <View style={styles.content}>
        <Text style={styles.title}>Aktie nicht gefunden</Text>
        <Link href="/aktien" style={styles.link}>Zur Aktienliste</Link>
      </View>
    );
  }

  return <StockDetail key={stock.symbol} stock={stock} />;
}

function StockDetail({ stock }: { stock: Stock }) {
  const [period, setPeriod] = useState(periods[1]);
  const [history, setHistory] = useState<History | null>(null);
  const { symbol } = stock;

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    async function load() {
      let points: PricePoint[] | null = null;
      try {
        points = await fetchHistory(symbol, controller.signal);
      } catch {
        // Keep the chart usable if the quote provider is unavailable.
      } finally {
        clearTimeout(timeout);
      }
      if (active) {
        setHistory(points ? { points, demo: false } : { points: demoHistory(symbol), demo: true });
      }
    }

    void load();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [symbol]);

  const lastTime = history?.points[history.points.length - 1]?.time ?? 0;
  const visiblePoints = history?.points.filter(point => point.time >= lastTime - period.days * day) ?? [];

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.symbol}>{symbol} · USD</Text>
        <Text accessibilityRole="header" style={styles.title}>{stock.name}</Text>

        <View style={styles.periods}>
          {periods.map(option => (
            <Pressable
              key={option.label}
              accessibilityRole="radio"
              accessibilityLabel={option.name}
              aria-checked={option === period}
              onPress={() => setPeriod(option)}
              style={[styles.period, option === period && styles.activePeriod]}
            >
              <Text style={[styles.periodLabel, option === period && styles.activeLabel]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          {history ? (
            <>
              <Text style={history.demo ? styles.demo : styles.source}>
                {history.demo ? 'Beispieldaten · simulierte Kurse' : 'Historische Tagesschlusskurse'}
              </Text>
              <PriceChart points={visiblePoints} />
            </>
          ) : (
            <ActivityIndicator color="#6DE4BF" accessibilityLabel="Kursverlauf wird geladen" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { width: '100%', maxWidth: 660, alignSelf: 'center', padding: 24 },
  symbol: { color: '#83E6C9', fontSize: 14, fontWeight: '700' },
  title: { color: '#F4F7FA', fontSize: 32, fontWeight: '700', marginTop: 4 },
  link: { color: '#83E6C9', marginTop: 16 },
  periods: { flexDirection: 'row', gap: 6, marginTop: 22, marginBottom: 14 },
  period: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#20313F', borderRadius: 8 },
  activePeriod: { backgroundColor: '#6DE4BF' },
  periodLabel: { color: '#F4F7FA', fontWeight: '600' },
  activeLabel: { color: '#101820' },
  card: { borderRadius: 16, backgroundColor: '#15222D', padding: 16, minHeight: 120 },
  demo: { color: '#FFCD85', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  source: { color: '#83E6C9', fontSize: 14, marginBottom: 12 },
});
