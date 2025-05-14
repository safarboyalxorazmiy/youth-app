import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "Gilroy-Light": require("@/assets/fonts/gilroy/Gilroy-Light.ttf"),
    "Gilroy-Regular": require("@/assets/fonts/gilroy/Gilroy-Regular.ttf"),
    "Gilroy-Medium": require("@/assets/fonts/gilroy/Gilroy-Medium.ttf"),
    "Gilroy-SemiBold": require("@/assets/fonts/gilroy/Gilroy-SemiBold.ttf"),
    "Gilroy-Bold": require("@/assets/fonts/gilroy/Gilroy-Bold.ttf"),
    "Gilroy-Black": require("@/assets/fonts/gilroy/Gilroy-Black.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#232325' }}>
          <BottomSheetModalProvider>
            <Stack screenOptions={{gestureEnabled: true}} initialRouteName="(tabs)">
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  animation: 'flip'
                }}
              />
              <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="verify" options={{ headerShown: false, animation: 'slide_from_right' }} />

              <Stack.Screen name="+not-found" />
            </Stack>

            <StatusBar
              animated={true}
              backgroundColor="#232325"
              barStyle={'default'}
              showHideTransition={'slide'}
              hidden={false}
            />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
    </ThemeProvider>
  );
}