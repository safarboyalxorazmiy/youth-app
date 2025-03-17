import { Drawer } from "expo-router/drawer";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import CargoIcon from "@/assets/images/cargo-icon.svg";
import LanguageIcon from "@/assets/images/language-icon.svg";
import QuestionIcon from "@/assets/images/question-icon.svg";
import LogoutIcon from "@/assets/images/logout-icon.svg";

function Me() {

  return (
    <View
      style={{
        width: 300,
      }}>
        <View style={{borderBottomColor: "#4F4F4F", borderBottomWidth: 1.5, paddingBottom: 22.5, marginHorizontal: 16,}}>
          <Image source={require("@/assets/images/avatar.png")} style={{width: 56, height: 56, borderRadius: 50, marginTop: 50}} />
          <Text style={{color: "white", fontSize: 24, fontFamily: "SfProDisplayBold", fontWeight: 700, marginTop: 14}}>Dilhayot Mamatxonov</Text>
          <Text style={{color: "#828282", fontFamily: "SfProDisplayRegular", fontSize: 18, marginTop: 9}}>+998 93 608 19 07</Text>
        </View>

        <View style={{marginTop: 10}}>
          <Pressable android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", columnGap: 22, paddingHorizontal: 16, paddingVertical: 10}}>
            <CargoIcon />
            <Text style={{color: "white", fontFamily: "SfProDisplayMedium", fontSize: 20}}>Yuklarim</Text>
          </Pressable>

          <Pressable android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", columnGap: 22, paddingHorizontal: 16, paddingVertical: 10}}>
            <LanguageIcon />
            <Text style={{color: "white", fontFamily: "SfProDisplayMedium", fontSize: 20}}>Tilni o’zgartirish</Text>
          </Pressable>

          <Pressable android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", columnGap: 22, paddingHorizontal: 16, paddingVertical: 10}}>
            <QuestionIcon />
            <Text style={{color: "white", fontFamily: "SfProDisplayMedium", fontSize: 20}}>Yordam</Text>
          </Pressable>
        </View>

        <Pressable android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: 16, height: 57, borderTopColor: "#5A5A5A", borderTopWidth: 1, marginTop: 26}}>
          <LogoutIcon />
          <Text style={{color: "white", fontFamily: "SfProDisplayBold", fontSize: 20}}>Chiqish</Text>
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
          borderBottomRightRadius: 0,
          marginTop: 22
        }
      }}
      drawerContent={() => <Me />}
    />
  );
}