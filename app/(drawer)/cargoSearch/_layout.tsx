import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function CargoSearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="CargoSearch"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}
