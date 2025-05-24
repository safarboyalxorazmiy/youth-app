import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

import { useColorScheme } from '@/hooks/useColorScheme';
import RotatingIcon from '@/components/RotatingIcon';
import LogoText from "@/assets/images/logo-text.svg";
import { PaperProvider } from 'react-native-paper';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

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
      setTimeout(() => {
        setIsAppReady(true);
      }, 500);
    }
  }, [loaded]);

  if (!isAppReady) {
    return (
      <View style={{backgroundColor: "#1A99FF", height: "100%"}}>
        <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%", columnGap: 10}}>
          <RotatingIcon />
          <LogoText height={200} width={250} style={{marginTop: 15}} />
        </View>
      </View>
    );
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>

      <PaperProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#232325' }}>
            <BottomSheetModalProvider>
              <Stack screenOptions={{gestureEnabled: true}} initialRouteName="(tabs)">
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                    animation: 'fade',
                    presentation: 'fullScreenModal'
                  }}
                />
                <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right', presentation: 'fullScreenModal' }} />
                <Stack.Screen name="verify" options={{ headerShown: false, animation: 'slide_from_right', presentation: 'fullScreenModal' }} />

                <Stack.Screen
                  name="UsersFilterModal"
                  options={{
                    presentation: 'transparentModal',
                    animation: 'fade',
                    headerShown: false,
                  }}
                />
                
                <Stack.Screen
                  name="PollFilterModal"
                  options={{
                    presentation: 'transparentModal',
                    animation: 'fade',
                    headerShown: false,
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
      </PaperProvider>
    </ApplicationProvider>

  );
}