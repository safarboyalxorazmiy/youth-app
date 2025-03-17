import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function CargoAddLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="myCargo"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}
