import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "react-native";
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "SfProDisplayRegular": require('../assets/fonts/SF-Pro-Display-Regular.ttf'),
    "SfProDisplayMedium": require('../assets/fonts/SF-Pro-Display-Medium.ttf'),
    "SfProDisplayBold": require('../assets/fonts/SF-Pro-Display-Bold.ttf'),
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
      <GestureHandlerRootView
        style={{
          flex: 1
        }}
      >

      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal', animation: 'fade_from_bottom' }} />
        <Stack.Screen name="verify" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_right' }} />
        <Stack.Screen name="myCargo" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="cargoAdd" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
            presentation: 'modal', 
            animation: 'flip'
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      
      <StatusBar
        animated={true}
        backgroundColor="#232325"
        barStyle={'default'}
        showHideTransition={"slide"}
        hidden={false}
      />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
