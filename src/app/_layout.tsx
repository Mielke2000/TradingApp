import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{
        contentStyle: { backgroundColor: '#101820' },
        headerStyle: { backgroundColor: '#101820' },
        headerTintColor: '#F4F7FA',
        headerShadowVisible: false,
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="aktien/[symbol]" options={{ title: 'Kursverlauf', headerBackTitle: 'Zurück' }} />
      </Stack>
    </>
  );
}
