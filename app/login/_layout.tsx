import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function LoginLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}
