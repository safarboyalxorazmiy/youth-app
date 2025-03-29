import React, { useRef, useState } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { t } from "@/i18n";
import CameraAvatarIcon from "@/assets/images/camera-avatar-icon.svg";
import LinerIcon from "@/assets/images/liner-icon.svg";

const RegistrationScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<String>("NameInput");

  const [nameInputValue, setNameInputValue] = useState<string>("");
  const [surnameInputValue, setSurnameInputValue] = useState<string>("");

  const nameInputRef = useRef<TextInput>(null);
  const surnameInputRef = useRef<TextInput>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled"
        onScrollEndDrag={(event) => {
          console.log("scroll y position:", event.nativeEvent.contentOffset.y);
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          {/* Title */}
          <Animated.Text
            entering={FadeInUp.duration(500)}
            style={{
              fontSize: 18,
              fontFamily: "SfProDisplayMedium",
              textAlign: "left",
            }}
          >
            Buyurtmalarni joylashtirish yoki qabul qilish uchun ilovada ro'yxatdan o'ting
          </Animated.Text>


          {/* Profile Image */}
          <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: "center", marginLeft: 117, marginTop: -5 }}>
            <LinerIcon />

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
                      <Text allowFontScaling={false} style={{color: "#000", fontSize: 12}}>Ismingiz</Text>
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
                  }}>Ismingiz</Text>
                  
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
                      <Text allowFontScaling={false} style={{color: "#000", fontSize: 12}}>Familyangiz</Text>
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
                  }}>Familyangiz</Text>
                  
                <TextInput 
                  onPress={() => {
                    scrollViewRef.current?.scrollTo({ x: 0, y: 202.5454559326172, animated: true });
                  }}
                  ref={surnameInputRef}
                  style={{width: "100%", height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular", color: "#FFF"}} 
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
            marginBottom: 522
           }}>
            <Pressable
              android_ripple={{ color: "#4F4F4F" }}
              style={{
                backgroundColor: "black",
                paddingVertical: 17,
                width: "100%",
                alignItems: "center",
              }}>
              <Text style={{ color: "white", fontSize: 16, fontFamily: "SfProDisplayBold", fontWeight: 700 }}>Tugallash</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;