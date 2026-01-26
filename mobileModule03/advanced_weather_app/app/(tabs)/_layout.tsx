import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SearchProvider } from '@/context/search-context';
import { ImageBackground, StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <SearchProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.lightCream,
          tabBarInactiveTintColor: '#7FA1C3',
          tabBarStyle: {
            backgroundColor: 'rgba(10, 25, 47, 0.7)',
          },
          headerStyle: {
            backgroundColor: 'rgba(10, 25, 47, 0.7)',
          },
          headerTintColor: Colors.lightCream,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Currently',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="partly-sunny" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="today"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="today" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="weekly"
          options={{
            title: 'Weekly',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SearchProvider>
  );
}
