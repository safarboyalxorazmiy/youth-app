import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function CargoSearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chooseTo" options={{ headerShown: false, animation: 'slide_from_right'}} />
    </Stack>
  );
}