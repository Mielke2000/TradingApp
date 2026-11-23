import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { stocks } from '../../features/stocks/history';

export default function StocksScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>Aktien</Text>
        <Text style={styles.description}>10 große US-Unternehmen nach Marktkapitalisierung</Text>
        <View style={styles.list}>
          {stocks.map(({ symbol, name }) => (
            <Link key={symbol} href={{ pathname: '/aktien/[symbol]', params: { symbol } }} asChild>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={name + ', ' + symbol}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <View style={styles.symbolBadge}>
                  <Text style={styles.symbol}>{symbol}</Text>
                </View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.chevron} accessible={false}>›</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { width: '100%', maxWidth: 660, alignSelf: 'center', padding: 24 },
  title: { color: '#F4F7FA', fontSize: 34, fontWeight: '700' },
  description: { color: '#B2C2CF', fontSize: 15, lineHeight: 22, marginTop: 6, marginBottom: 20 },
  list: { backgroundColor: '#15222D', borderRadius: 16, overflow: 'hidden' },
  row: {
    minHeight: 63, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 13,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#2B3C4B',
  },
  pressed: { backgroundColor: '#223748' },
  symbolBadge: { minWidth: 66, alignItems: 'center', paddingVertical: 7, backgroundColor: '#203544', borderRadius: 8 },
  symbol: { color: '#83E6C9', fontSize: 12, fontWeight: '700' },
  name: { flex: 1, color: '#F4F7FA', fontSize: 16, fontWeight: '600' },
  chevron: { color: '#B2C2CF', fontSize: 25 },
});
