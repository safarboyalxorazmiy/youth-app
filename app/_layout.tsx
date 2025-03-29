import { loadLocale } from '../i18n';

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
    'SfProDisplayRegular': require('../assets/fonts/SF-Pro-Display-Regular.ttf'),
    'SfProDisplayMedium': require('../assets/fonts/SF-Pro-Display-Medium.ttf'),
    'SfProDisplayBold': require('../assets/fonts/SF-Pro-Display-Bold.ttf'),
  });

  useEffect(() => {
    loadLocale();
  }, []);

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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen name="lang" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="register" options={{ headerShown: false}} />
              <Stack.Screen name="verify" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="myCargo" options={{ headerShown: false }} />
              <Stack.Screen name="cargoAdd" options={{ headerShown: false}} />
              <Stack.Screen
                name="(drawer)"
                options={{
                  headerShown: false,
                  animation: 'flip'
                }}
              />
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