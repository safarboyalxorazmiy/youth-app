import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, Vibration  } from "react-native";
import * as Haptics from "expo-haptics";

export default function Login() {  
  const [focusedInput, setFocusedInput] = useState<String>("PhoneNumberInput");
  const [phoneNumberInputValue, setPhoneNumberInputValue] = useState<string>("");

  const phoneNumberInputRef = useRef<TextInput>(null);

  const router = useRouter();

  useEffect(() => {
    phoneNumberInputRef.current?.focus();
  });
  
  return (
    <View style={{backgroundColor: "#FFF", paddingHorizontal: 30, height: "100%", paddingTop: 140, position: "relative"}}>
      <Text style={{fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 16, textAlign: "center"}}>Telefon raqamingiz</Text>

      <View style={{marginTop: 15, width: "100%"}}>
          <View style={{
            width: "100%", 
            borderColor: focusedInput == "PhoneNumberInput" || phoneNumberInputValue != "" ? "#2CA82A" : "#ADADAD", 
            borderRadius: 10, 
            paddingHorizontal: 12, 
            borderWidth: focusedInput == "PhoneNumberInput" || phoneNumberInputValue != "" ? 1.5 : 1, 
            height: 45, 
            position: "relative", 
            alignItems: "center", 
            justifyContent: "center"
          }}>
            {
              focusedInput == "PhoneNumberInput" || phoneNumberInputValue != "" ? (
                <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                  <Text allowFontScaling={false} style={{color: "#2CA82A", fontSize: 12}}>Telefon raqam</Text>
                </View>
              ) : (<></>)
            }

            <Text allowFontScaling={false} style={focusedInput != "PhoneNumberInput" && phoneNumberInputValue == "" ? {position: "absolute", top: "25%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>Telefon raqam</Text>
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
                }}
                value={phoneNumberInputValue}
                onFocus={() => setFocusedInput("PhoneNumberInput")} 
                cursorColor={"#000000"}
                onBlur={() => setFocusedInput("")} />
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
          onPress={async () => {
            await AsyncStorage.setItem("userPhoneNumber", phoneNumberInputValue);
            router.push("/verify");
          }}
          android_ripple={{color: "#1E1E1E"}} 
          style={{width: "100%", height: "100%", backgroundColor: "#2CA82A", alignItems: "center", justifyContent: "center"}} >
          <Text style={{fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 14, color: "#FFF"}}>Davom etish</Text>
        </Pressable>
      </View>
    </View>
  );
}