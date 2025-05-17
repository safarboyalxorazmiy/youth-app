import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function VerifyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="verify"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
