import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A628A',
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Calculator',
        }} 
      />
    </Stack>
  );
}
