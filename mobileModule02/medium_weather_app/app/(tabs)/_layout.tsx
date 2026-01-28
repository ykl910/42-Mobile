import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SearchProvider } from '@/context/search-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/search-bar';

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <SearchProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.searchBarContainer}>
            <SearchBar/>
          </View>
          <View style={{flex:1}}>
            <MaterialTopTabs
            tabBarPosition='bottom'
              screenOptions={{
                tabBarActiveTintColor: Colors.lightCream,
                tabBarInactiveTintColor: '#7FA1C3',
                tabBarStyle: {
                  backgroundColor: Colors.darkBlue,
                },
                tabBarIndicatorStyle: {
                  backgroundColor: Colors.lightCream,
                  height: 3,
                },
                tabBarShowIcon: true,
                swipeEnabled: true,
                lazy: true,
              }}
            >
              <MaterialTopTabs.Screen
                name="index"
                options={{
                  title: 'Currently',
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="partly-sunny" size={16} color={color} />
                  ),
                }}
              />
              <MaterialTopTabs.Screen
                name="today"
                options={{
                  title: 'Today',
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="today" size={16} color={color} />
                  ),
                }}
              />
              <MaterialTopTabs.Screen
                name="weekly"
                options={{
                  title: 'Weekly',
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="calendar" size={16} color={color} />
                  ),
                }}
              />
            </MaterialTopTabs>
          </View>
        </View>
      </SafeAreaView>
    </SearchProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
  },
  searchBarContainer: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 8,
  },
});