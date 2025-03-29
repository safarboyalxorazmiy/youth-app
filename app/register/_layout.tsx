import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="register"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}
