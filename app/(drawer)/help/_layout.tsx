import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function HelpLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="help"
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
