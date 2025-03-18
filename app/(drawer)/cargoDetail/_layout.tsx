import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function CargoDetailsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="cargoDetail"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}
