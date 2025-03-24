import { Drawer } from "expo-router/drawer";
import { View, Text, Pressable, Image, Platform } from "react-native";
import CargoIcon from "@/assets/images/cargo-icon.svg";
import LanguageIcon from "@/assets/images/language-icon.svg";
import QuestionIcon from "@/assets/images/question-icon.svg";
import LogoutIcon from "@/assets/images/logout-icon.svg";
import { router, useRouter } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

function Me() {
  const router = useRouter();

  const insets = useSafeAreaInsets();
  
  return (
    <View
      style={{
        width: 300,
        marginBottom: insets.bottom,
        marginTop: Platform.OS === "ios" ? statusBarHeight : 0,
      }}>
        <View style={{borderBottomColor: "#4F4F4F", borderBottomWidth: 1.5, paddingBottom: 14.5, marginHorizontal: 16,}}>
          <Image source={require("@/assets/images/avatar.png")} style={{width: 56, height: 56, borderRadius: 50, marginTop: 50}} />
          <Text allowFontScaling={false} style={{color: "white", fontSize: 16, fontFamily: "SfProDisplayBold", fontWeight: 700, marginTop: 14}}>Dilhayot Mamatxonov</Text>
          <Text allowFontScaling={false} style={{color: "#828282", fontFamily: "SfProDisplayRegular", fontSize: 14, marginTop: 9}}>+998 93 608 19 07</Text>
        </View>

        <View style={{marginTop: 10}}>
          <Pressable onPress={() => {
            router.push("/myCargo");
          }} android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", columnGap: 22, paddingHorizontal: 16, paddingVertical: 10}}>
            <CargoIcon />
            <Text allowFontScaling={false} style={{color: "white", fontFamily: "SfProDisplayMedium", fontSize: 14}}>Yuklarim</Text>
          </Pressable>

          <Pressable android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", columnGap: 22, paddingHorizontal: 16, paddingVertical: 10}}>
            <LanguageIcon />
            <Text allowFontScaling={false} style={{color: "white", fontFamily: "SfProDisplayMedium", fontSize: 14}}>Tilni o’zgartirish</Text>
          </Pressable>

          <Pressable android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", columnGap: 22, paddingHorizontal: 16, paddingVertical: 10}}>
            <QuestionIcon />
            <Text allowFontScaling={false} style={{color: "white", fontFamily: "SfProDisplayMedium", fontSize: 14}}>Yordam</Text>
          </Pressable>
        </View>

        <Pressable android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: 16, height: 57, borderTopColor: "#5A5A5A", borderTopWidth: 1, marginTop: 26}}>
          <LogoutIcon />
          <Text allowFontScaling={false} style={{color: "white", fontFamily: "SfProDisplayBold", fontSize: 14}}>Chiqish</Text>
        </Pressable>
    </View>
  );
}

// const styles = StyleSheet.create({});

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        swipeEdgeWidth: 36,
        drawerStyle: {
          width: 300,
          backgroundColor: "#232325",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        }
      }}
      drawerContent={() => <Me />}
    />
  );
}