import { Stack } from 'expo-router';

export default function IndexLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="poll"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="poll/pollitem"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}