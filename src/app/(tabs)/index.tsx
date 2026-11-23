import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>TradingApp</Text>
        <Text style={styles.subtitle}>
          Dein Arbeitsbereich für Watchlist und Trading-Journal.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    color: '#F4F7FA',
    fontSize: 36,
    fontWeight: '700',
  },
  subtitle: {
    color: '#B2C2CF',
    fontSize: 17,
    lineHeight: 25,
    marginTop: 12,
  },
});
