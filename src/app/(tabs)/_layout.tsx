import { Tabs } from 'expo-router';
import Svg, { Path, Polyline } from 'react-native-svg';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      sceneStyle: { backgroundColor: '#101820' },
      tabBarStyle: { backgroundColor: '#15222D', borderTopColor: '#2B3C4B' },
      tabBarActiveTintColor: '#6DE4BF',
      tabBarInactiveTintColor: '#B2C2CF',
      tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Start',
        tabBarIcon: ({ color, size }) => (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
          </Svg>
        ),
      }} />
      <Tabs.Screen name="aktien" options={{
        title: 'Aktien',
        tabBarIcon: ({ color, size }) => (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Polyline points="3,18 9,12 13,15 21,6" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ),
      }} />
    </Tabs>
  );
}
