import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polyline } from 'react-native-svg';

import type { PricePoint } from './history';

const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' });
const date = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export function PriceChart({ points }: { points: PricePoint[] }) {
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last || points.length < 2) {
    return <Text style={styles.muted}>Für diesen Zeitraum sind zu wenige Kurse verfügbar.</Text>;
  }

  const low = Math.min(...points.map(({ close }) => close));
  const high = Math.max(...points.map(({ close }) => close));
  const padding = Math.max((high - low) * 0.1, high * 0.005);
  const min = low - padding;
  const max = high + padding;
  const span = last.time - first.time || 1;
  const path = points.map(({ time, close }) => {
    const x = 3 + (time - first.time) / span * 354;
    const y = 3 + (max - close) / (max - min) * 174;
    return x + ',' + y;
  }).join(' ');
  const change = (last.close / first.close - 1) * 100;
  const changeLabel = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 2, minimumFractionDigits: 2, signDisplay: 'exceptZero',
  }).format(change) + ' %';
  const color = change >= 0 ? '#6DE4BF' : '#FFA9A5';

  return (
    <View>
      <Text style={styles.muted}>Letzter Schlusskurs am {date.format(last.time)}</Text>
      <Text style={styles.price}>{price.format(last.close)}</Text>
      <Text style={[styles.change, { color }]}>{changeLabel} im gewählten Zeitraum</Text>
      <Text style={styles.muted}>{price.format(max)}</Text>
      <Svg
        width="100%"
        height={190}
        viewBox="0 0 360 180"
        preserveAspectRatio="none"
        accessible
        accessibilityLabel={`Kurschart von ${price.format(first.close)} bis ${price.format(last.close)}`}
      >
        {[3, 90, 177].map(y => (
          <Line key={y} x1={3} x2={357} y1={y} y2={y} stroke="#314656" strokeDasharray="4 5" />
        ))}
        <Polyline points={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
      </Svg>
      <Text style={styles.muted}>{price.format(min)}</Text>
      <View style={styles.dates}>
        <Text style={styles.muted}>{date.format(first.time)}</Text>
        <Text style={styles.muted}>{date.format(last.time)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  muted: { color: '#B2C2CF', fontSize: 13 },
  price: { color: '#F4F7FA', fontSize: 30, fontWeight: '700', marginTop: 3 },
  change: { fontSize: 14, fontWeight: '600', marginTop: 4, marginBottom: 18 },
  dates: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
