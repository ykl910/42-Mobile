import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SearchProvider } from '@/context/search-context';

export default function TabLayout() {
  return (
    <SearchProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.lightCream,
          tabBarInactiveTintColor: '#7FA1C3',
          tabBarStyle: {
            backgroundColor: Colors.darkBlue,
          },
          headerStyle: {
            backgroundColor: Colors.darkBlue,
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
