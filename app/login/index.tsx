import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { act, useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, Vibration, TouchableOpacity, Platform, Linking  } from "react-native";
import * as Haptics from "expo-haptics";
import * as Application from 'expo-application';
import { useIsFocused } from "@react-navigation/native";
import Constants from 'expo-constants';

import { t } from "@/i18n";

const statusBarHeight = Constants.statusBarHeight;

import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

export default function Login() {  
  const [focusedInput, setFocusedInput] = useState<String>("PhoneNumberInput");
  const [phoneNumberInputValue, setPhoneNumberInputValue] = useState<string>("");

  const [wrongInput, setWrongInput] = useState<boolean>(false);

  const phoneNumberInputRef = useRef<TextInput>(null);
  const limitActionRef = useRef<ActionSheetRef>(null);

  const router = useRouter();

  const [requestStarted, setRequestStarted] = useState(false);
  
  const isFocused = useIsFocused();
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("token", !!token);
      if (!!token) {
        await AsyncStorage.setItem("fromRoute", "Verify");
        router.push("/");
      }
    }

    checkToken();
  }, [isFocused]);

  useEffect(() => {
    phoneNumberInputRef.current?.focus();
  }, []);

  const registerUser = async () => {
    let deviceId;
    if (Platform.OS === "ios") {
      console.log("IOS deviceId: ", await Application.getIosIdForVendorAsync());  
      deviceId = await Application.getIosIdForVendorAsync();
    } else if (Platform.OS === "android") {
      console.log("deviceId: ", await Application.getAndroidId()); 
      deviceId = await Application.getAndroidId();     
    }

    try {
      const response = await fetch('https://api.e-yuk.uz/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({
          phone: "998" + phoneNumberInputValue,
          deviceId: deviceId,
          // deviceId: "sasaadsada"
        }),
      });
  
      const data: boolean = await response.json();
  
      return data;
    } catch (error) {
      return false;
    }
  };  
  
  return (
    <View style={{ marginTop: Platform.OS === "ios" ? statusBarHeight : 0, backgroundColor: "#FFF", paddingHorizontal: 30, height: "100%", paddingTop: 140, position: "relative"}}>
      <View>
        <Text style={{fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 16, textAlign: "center"}}>{t("yourPhoneNumber")}</Text>

        <View style={{marginTop: 15, width: "100%"}}>
            <View style={{
              width: "100%", 
              borderColor: wrongInput ? "#FF0000" : focusedInput == "PhoneNumberInput" || phoneNumberInputValue != "" ? "#2CA82A" : "#ADADAD", 
              borderRadius: 10, 
              paddingHorizontal: 12, 
              borderWidth: focusedInput == "PhoneNumberInput" || phoneNumberInputValue != "" ? 1.5 : 1, 
              height: 45, 
              position: "relative", 
              alignItems: "center", 
              justifyContent: "center",
            }}>
              {
                focusedInput == "PhoneNumberInput" || phoneNumberInputValue != "" ? (
                  <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                    <Text allowFontScaling={false} style={{color: wrongInput ? "#FF0000" : "#2CA82A", fontSize: 12}}>{t("phoneNumber")}</Text>
                  </View>
                ) : (<></>)
              }

              <Text allowFontScaling={false} style={focusedInput != "PhoneNumberInput" ? {position: "absolute", top: "25%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>{t("phoneNumber")}</Text>
              <View style={{flexDirection: "row", alignItems: "center", width: "100%", height: "100%", columnGap: 7}}>
                <Text style={{fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"}}>+998</Text>
                <View style={{width: 0.5, height: "20%", backgroundColor: "#111111"}}></View>
                <TextInput 
                  ref={phoneNumberInputRef}
                  keyboardType="number-pad"
                  style={{height: "100%", width: "100%", fontSize: 14, letterSpacing: 1, fontWeight: 400, fontFamily: "SfProDisplayRegular"}} 
                  onChangeText={(text) => {
                    if (/^\d*$/.test(text) && text.length <= 9) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
                      setPhoneNumberInputValue(text);
                    }
                    if (text.length == 9) {
                      setWrongInput(false);
                    }
                  }}
                  value={phoneNumberInputValue}
                  onFocus={() => setFocusedInput("PhoneNumberInput")} 
                  cursorColor={"#000000"}
                  // onBlur={() => setFocusedInput("")} 
                  />
              </View>
            </View>
        </View> 

        

        <View style={{
          marginTop: 30,
          height: 45,
          width: "100%",
          borderRadius: 11,
          overflow: 'hidden',
        }}>
          <Pressable 
            unstable_pressDelay={200}
            onPressIn={async () => {
              if (requestStarted) return;

              setRequestStarted(true);

              if (phoneNumberInputValue == "" || phoneNumberInputValue.length < 9) {
                setWrongInput(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                limitActionRef.current?.show();
                setRequestStarted(false);
                return;
              }

              try {
                const data = await registerUser();
                if (!data) {
                  limitActionRef.current?.show();
                  setRequestStarted(false);
                  return;
                } else {
                  setRequestStarted(false);
                  AsyncStorage.setItem("userPhoneNumber", "998" + phoneNumberInputValue);
                  router.push("/verify");      
                }
              } catch (error) {
                console.error('❌ Error:', error);
              }

              setRequestStarted(false);
            }}
            android_ripple={{color: "#1E1E1E"}} 
            style={{width: "100%", height: "100%", backgroundColor: "#2CA82A", alignItems: "center", justifyContent: "center"}} >
            <Text style={{fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 14, color: "#FFF"}}>{t("enterCode")}</Text>
          </Pressable>
        </View>

        <TouchableOpacity style={{marginTop: 10}} onPress={() => Linking.openURL('https://e-yuk.uz/privacy-policy.html')}>
          <Text style={{ color: 'black', textDecorationLine: 'underline'}}>{t("privacyPolicy")}</Text>
        </TouchableOpacity>
      </View>

      <View>
        {/* <TouchableOpacity onPress={() => {
        
        }}>
          <Text>open limitActionRef</Text>
        </TouchableOpacity> */}
        <ActionSheet
          ref={limitActionRef}
          gestureEnabled={true}
          containerStyle={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: 270
          }}
          indicatorStyle={{
            width: 100,
            // backgroundColor: "white"
          }}
          onClose={() => {
            phoneNumberInputRef.current?.focus();
          }}
        >
          <View style={{paddingHorizontal: 30}}>
            <Text style={{fontFamily: "SfProDisplayMedium", fontWeight: "500", fontSize: 18, marginTop: 40, textAlign: "left"}}>{t("limitModalText")}</Text>

            <Pressable onPress={() => limitActionRef.current?.hide()} style={{backgroundColor: "#F2F2F2", height: 50, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 20}}>
              <Text style={{fontFamily: "SfProDisplayMedium", fontWeight: "500", fontSize: 18, textAlign: "left", color: "black"}}>{t("close")}</Text>
            </Pressable>
          </View>
        </ActionSheet>
      </View>
    </View>
  );
}