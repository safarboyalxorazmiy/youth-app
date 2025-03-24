import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function LanguageLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="language"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}
