import { Drawer } from "expo-router/drawer";
import { View, Text, Pressable, Image, Platform } from "react-native";
import CargoIcon from "@/assets/images/cargo-icon.svg";
import LanguageIcon from "@/assets/images/language-icon.svg";
import QuestionIcon from "@/assets/images/question-icon.svg";
import LogoutIcon from "@/assets/images/logout-icon.svg";
import { router, useRouter } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { t } from '@/i18n';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import * as Application from 'expo-application';
import { format } from "i18next";

const statusBarHeight = Constants.statusBarHeight;

function Me() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const [localImageUri, setLocalImageUri] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchImage = async () => {
      const imageUri = await AsyncStorage.getItem('compressedImageUri');
      console.log(imageUri);
      setLocalImageUri(imageUri || "");

      let name = await AsyncStorage.getItem("name");
      setName(name || "");

      let surname = await AsyncStorage.getItem("surname");
      setSurname(surname || "");

      console.log(name, surname);
      
      let deviceId;
      if (Platform.OS === "ios") {
        console.log("IOS deviceId: ", await Application.getIosIdForVendorAsync());  
        deviceId = await Application.getIosIdForVendorAsync();
      } else if (Platform.OS === "android") {
        console.log("deviceId: ", await Application.getAndroidId()); 
        deviceId = await Application.getAndroidId();     
      }

      if (name == null || surname == null) {
        const response = await axios.get("https://api.e-yuk.uz/profile/get?deviceId=" + deviceId);

        setName(response.data.name);
        setSurname(response.data.surname);
        await AsyncStorage.setItem("name", response.data.name);
        await AsyncStorage.setItem("surname", response.data.surname);

        downloadImage(response.data.profilePhotoUrl);
      }
      
      let userPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");
      setPhone(formatPhoneNumber(userPhoneNumber || ""));
    };

    fetchImage();
  }, [isFocused]);

  useEffect(() => {
    const fetchImage = async () => {
      const imageUri = await AsyncStorage.getItem('compressedImageUri');
      console.log(imageUri);
      setLocalImageUri(imageUri || "");

      let name = await AsyncStorage.getItem("name");
      setName(name || "");

      let surname = await AsyncStorage.getItem("surname");
      setSurname(surname || "");

      console.log(name, surname);

      if (name == null || surname == null) {
        let deviceId;
        if (Platform.OS === "ios") {
          console.log("IOS deviceId: ", await Application.getIosIdForVendorAsync());  
          deviceId = await Application.getIosIdForVendorAsync();
        } else if (Platform.OS === "android") {
          console.log("deviceId: ", await Application.getAndroidId()); 
          deviceId = await Application.getAndroidId();     
        }

        const response = await axios.get("https://api.e-yuk.uz/profile/get?deviceId=" + deviceId);

        setName(response.data.name);
        setSurname(response.data.surname);
        await AsyncStorage.setItem("name", response.data.name);
        await AsyncStorage.setItem("surname", response.data.surname);

        downloadImage(response.data.profilePhotoUrl);
      }

      let userPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");
      setPhone(formatPhoneNumber(userPhoneNumber || ""));
    };
    fetchImage();
  }, []);
  
  const formatPhoneNumber = (number: string) => {
    return number.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }

  const downloadImage = async (imageUrl: string) => {
    try {
      const fileUri = FileSystem.documentDirectory + "downloadedImage.jpg";
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      await AsyncStorage.setItem("compressedImageUri", uri);
      setLocalImageUri(uri);
      console.log("Image saved to:", uri);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  
  return (
    <View
      style={{
        width: 300,
        marginBottom: insets.bottom,
        marginTop: Platform.OS === "ios" ? statusBarHeight : 0,
      }}>
        <View style={{borderBottomColor: "#4F4F4F", borderBottomWidth: 1.5, paddingBottom: 14.5, marginHorizontal: 16,}}>
          <Image source={{ uri: localImageUri }}  style={{width: 56, height: 56, borderRadius: 50, marginTop: 50}} />
          <Text allowFontScaling={false} style={{color: "white", fontSize: 16, fontFamily: "SfProDisplayBold", fontWeight: 700, marginTop: 14}}>{name + " " + surname}</Text>
          <Text allowFontScaling={false} style={{color: "#828282", fontFamily: "SfProDisplayRegular", fontSize: 14, marginTop: 9}}>+{phone}</Text>
        </View>

        <View style={{marginTop: 10}}>
          <Pressable onPress={() => {
            router.push("/myCargo");
          }} android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", columnGap: 22, paddingHorizontal: 16, paddingVertical: 10}}>
            <CargoIcon />
            <Text allowFontScaling={false} style={{color: "white", fontFamily: "SfProDisplayMedium", fontSize: 14}}>{t("myCargo")}</Text>
          </Pressable>

          <Pressable onPress={() => {
            router.push("/lang");
          }} android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", columnGap: 22, paddingHorizontal: 16, paddingVertical: 10}}>
            <LanguageIcon />
            <Text allowFontScaling={false} style={{color: "white", fontFamily: "SfProDisplayMedium", fontSize: 14}}>{t("changeLanguage")}</Text>
          </Pressable>

          <Pressable android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", columnGap: 22, paddingHorizontal: 16, paddingVertical: 10}}>
            <QuestionIcon />
            <Text allowFontScaling={false} style={{color: "white", fontFamily: "SfProDisplayMedium", fontSize: 14}}>{t("help")}</Text>
          </Pressable>
        </View>

        <Pressable onPress={async () => {
          await AsyncStorage.clear();
          router.push("/login");
        }} android_ripple={{color: "#4F4F4F"}} style={{flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: 16, height: 57, borderTopColor: "#5A5A5A", borderTopWidth: 1, marginTop: 26}}>
          <LogoutIcon />
          <Text allowFontScaling={false} style={{color: "white", fontFamily: "SfProDisplayBold", fontSize: 14}}>{t("logOut")}</Text>
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