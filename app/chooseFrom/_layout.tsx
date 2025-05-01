import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function ChooseFromLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chooseFrom" options={{ headerShown: false, animation: 'slide_from_right'}} />
    </Stack>
  );
}