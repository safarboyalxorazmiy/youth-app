import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { t } from "@/i18n";
import CameraAvatarIcon from "@/assets/images/camera-avatar-icon.svg";
import LinerIcon from "@/assets/images/liner-icon.svg";
import * as Application from 'expo-application';

import axios from "axios";

import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ActivityIndicator } from 'react-native';

import { Dimensions } from 'react-native';
import { useIsFocused } from "@react-navigation/native";

const screenHeight = Dimensions.get("window").height;


const RegistrationScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<String>("NameInput");

  const [nameInputValue, setNameInputValue] = useState<string>("");
  const [surnameInputValue, setSurnameInputValue] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const nameInputRef = useRef<TextInput>(null);
  const surnameInputRef = useRef<TextInput>(null);
  const router = useRouter();
  const isFocused = useIsFocused();

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use array format
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });
  
  //   if (!result.canceled) {
  //     console.log(result.assets[0].uri);
  //   }   

  //   if (!result.canceled) {
  //     setImageUri(result.assets[0].uri);
  //   }
  // };

  useEffect(() => {
    setNameInputValue("");
    setSurnameInputValue("");
    nameInputRef.current?.focus();
  }, [isFocused]);

  useEffect(() => {
    setNameInputValue("");
    setSurnameInputValue("");
    nameInputRef.current?.focus();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const compressedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }], // Resize to reduce size
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Reduce quality
      );
  
      await AsyncStorage.setItem('compressedImageUri', compressedImage.uri);
      setImageUri(compressedImage.uri);
    }
  };
  

  const uploadImageAndEditProfile = async () => {
    setLoading(true);

    if (loading) return;

    if (!imageUri || imageUri === "") {
      await AsyncStorage.setItem('compressedImageUri', "");
      await updateProfile("");
    }

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      const response = await axios.post("https://api.e-yuk.uz/attach/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API Response:", response.data);

      await updateProfile(response.data.url);
    } catch (error) {
      await updateProfile("");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (url: string) => {
    let deviceId;
    if (Platform.OS === "ios") {
      console.log("IOS deviceId: ", await Application.getIosIdForVendorAsync());  
      deviceId = await Application.getIosIdForVendorAsync();
    } else if (Platform.OS === "android") {
      console.log("deviceId: ", await Application.getAndroidId()); 
      deviceId = await Application.getAndroidId();     
    }
    try {
      const response = await axios.put(
        "https://api.e-yuk.uz/profile/update",
        {
          name: nameInputValue,
          surname: surnameInputValue,
          profilePhotoUrl: url,
          deviceId: deviceId,
        }
      );

      await AsyncStorage.setItem("name", nameInputValue);
      await AsyncStorage.setItem("surname", surnameInputValue);

      const token2 = await AsyncStorage.getItem("token2");
      if (token2) {
        await AsyncStorage.setItem("token", token2);
        await AsyncStorage.removeItem("token2");
      }

      await AsyncStorage.setItem("fromRoute", "Verify");
      
      setLoading(false);

      router.push("/");
      console.log("Profile updated:", response.data);
    } catch (error: any) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", height: screenHeight, width: "100%", backgroundColor: "#fff", padding: 20 }}>
      {loading ? <ActivityIndicator size="large" color="#2CA82A" /> : (
        <View style={{width: "100%"}}>
          <Animated.View entering={FadeInDown.duration(500)} style={{  alignItems: "center", marginTop: -5 }}>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                backgroundColor: "#4CAF50",
                width: 60,
                height: 60,
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
              ) : (
                <CameraAvatarIcon />
              )}
            </TouchableOpacity>
            <Text style={{ marginTop: 10, fontSize: 16, fontFamily: "SfProDisplayRegular" }}>Profil rasmi</Text>
          </Animated.View>

          
          <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: "center", width: "100%" }}>

            <View 
              
            style={{
                marginTop: 26,
                width: "100%", 
                borderColor: focusedInput == "NameInput" || surnameInputValue != "" ? "#2CA82A" : "#ADADAD", 
                borderWidth: focusedInput == "NameInput" || surnameInputValue != "" ? 1.5 : 1, 
                borderRadius: 10, paddingHorizontal: 18,  
                height: 45, 
                position: "relative", 
                alignItems: "center", 
                justifyContent: "center"
              }}>            
                {
                  focusedInput == "NameInput" || nameInputValue != "" ? (
                    <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                      <Text allowFontScaling={false} style={{color: "#000", fontSize: 12}}>{t("name")}</Text>
                    </View>
                  ) : (<></>)
                }
      
                <Text allowFontScaling={false} style={
                  focusedInput != "NameInput" && nameInputValue == "" ? {
                    position: "absolute", 
                    top: "25%", 
                    color: "#000", 
                    left: 18, 
                    height: "100%", 
                    fontSize: 14, 
                    fontWeight: 400, 
                    fontFamily: "SfProDisplayRegular"
                  } : {
                    display: "none"
                  }}>{t("name")}</Text>
                  
                <TextInput 
                  ref={nameInputRef}
                  style={{width: "100%", height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular", color: "#000"}} 
                  onPress={() => {
                    scrollViewRef.current?.scrollTo({ x: 0, y: 202.5454559326172, animated: true });
                  }}
                  onChange={(e) => {
                    setNameInputValue(e.nativeEvent.text);
                  }} 
                  value={nameInputValue}
                  onFocus={() => {
                    scrollViewRef.current?.scrollTo({ x: 0, y: 202.5454559326172, animated: true });
                    setFocusedInput("NameInput")
                  }} 
                  cursorColor={"#000"}
                  onBlur={() => setFocusedInput("")} />
            </View> 

            <View style={{
                width: "100%", 
                marginTop: 18,
                borderColor: focusedInput == "SurnameInput" || surnameInputValue != "" ? "#2CA82A" : "#ADADAD", 
                borderWidth: focusedInput == "SurnameInput" || surnameInputValue != "" ? 1.5 : 1, 
                borderRadius: 10, paddingHorizontal: 18,  
                height: 45, 
                position: "relative", 
                alignItems: "center", 
                justifyContent: "center"
              }}>            
                {
                  focusedInput == "SurnameInput" || surnameInputValue != "" ? (
                    <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                      <Text allowFontScaling={false} style={{color: "#000", fontSize: 12}}>{t("surname")}</Text>
                    </View>
                  ) : (<></>)
                }
      
                <Text allowFontScaling={false} style={
                  focusedInput != "SurnameInput" && surnameInputValue == "" ? {
                    position: "absolute", 
                    top: "25%", 
                    color: "#000", 
                    left: 18, 
                    height: "100%", 
                    fontSize: 14, 
                    fontWeight: 400, 
                    fontFamily: "SfProDisplayRegular"
                  } : {
                    display: "none"
                  }}>{t("surname")}</Text>
                  
                <TextInput 
                  onPress={() => {
                    scrollViewRef.current?.scrollTo({ x: 0, y: 202.5454559326172, animated: true });
                  }}
                  ref={surnameInputRef}
                  style={{width: "100%", height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular", color: "#000"}} 
                  onChange={(e) => {
                    setSurnameInputValue(e.nativeEvent.text);
                  }} 
                  value={surnameInputValue}
                  onFocus={() => setFocusedInput("SurnameInput")} 
                  cursorColor={"#000"}
                  onBlur={() => setFocusedInput("")} />
            </View> 

          </Animated.View>

          <View style={{ 
            width: "100%", 
            alignItems: "center", 
            marginTop: 30, 
            borderRadius: 12, 
            overflow: "hidden",
            }}>
            <Pressable
              onPress={async () => {
                uploadImageAndEditProfile();
              }}
              android_ripple={{ color: "#4F4F4F" }}
              style={{
                backgroundColor: "black",
                paddingVertical: 17,
                width: "100%",
                alignItems: "center",
              }}>
              <Text style={{ color: "white", fontSize: 16, fontFamily: "SfProDisplayBold", fontWeight: 700 }}>{t("compleate2")}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};


export default RegistrationScreen;