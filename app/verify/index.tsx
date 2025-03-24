import { router, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import ArrowLeftIcon from "@/assets/images/navbar/ArrowLeftIcon.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from 'expo-application';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useIsFocused } from "@react-navigation/native";

export default function Verify() {
  // const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
  const [selection, setSelection] = useState(
    otp.map(() => ({ start: 0, end: 0 }))
  ); // Track selection positions
  const [codeError, setCodeError] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  const limitActionRef = useRef<ActionSheetRef>(null);

  const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null);
  const [tryCount, setTryCount] = useState(5);

  const [secondsLeft, setSecondsLeft] = useState(60); // 1 minute = 60 seconds

  useEffect(() => {
    if (secondsLeft === 0) {
      router.back();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, [secondsLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const secsLeft = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${secsLeft.toString().padStart(2, '0')}`;
  };

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

    const fetchUserPhoneNumber = async () => {
      const userPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");
      setUserPhoneNumber(userPhoneNumber);
    };

    fetchUserPhoneNumber();
  }, [isFocused]);

  // Handle input change
  const handleChange = async (text: string, index: number) => {
    if (text.length > 1) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if not last digit
    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    } else if (text && index === 4) {
      console.log(newOtp.join(""));
      fetch('http://167.86.107.247:8080/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: userPhoneNumber,
          code: newOtp.join(""),
          // deviceId: Application.getAndroidId() || Application.getIosIdForVendorAsync(),
          deviceId: "dsadasdsdaasa"
        }),
      })
        .then(async response => {
          const contentType = response.headers.get('Content-Type');
          if (!response.ok) {
            const errorText = contentType?.includes('application/json')
              ? await response.json()
              : await response.text();
            if (errorText == "FAILED") {
              // Failed show red error
              setOtp(["", "", "", "", ""]);
              setCodeError(true);
              setTryCount(tryCount - 1);
              if ((tryCount - 1) == 0) {
                router.back();
              }
              inputRefs.current[0]?.focus();
            } else if (errorText == "LIMIT_EXECUTED") {
              // Limit executed show limit modal
              setOtp(["", "", "", "", ""]);
              inputRefs.current[0]?.focus();
              router.back();
            }
            console.log('❌ Error message:', errorText);
            return;
          }
          
          const data = await response.json();
          await AsyncStorage.setItem("token", data.access_token);
          router.push("/");
        })
        .catch(error => {
          console.log('❌ Network error:', error.message);
        });      
        
      // AsyncStorage.setItem("fromRoute", "Verify");
      // AsyncStorage.setItem("token", "&&&&");
      // router.push("/");      
    }

    // Move cursor to end
    setSelection((prev) =>
      prev.map((sel, i) => (i === index ? { start: 1, end: 1 } : sel))
    );
  };

  return (
    <View style={{ marginTop: Platform.OS === "ios" ? statusBarHeight : 0, backgroundColor: "#FFF", paddingHorizontal: 30, height: "100%", paddingTop: 140 }}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.back();
        }}
        android_ripple={{ color: "#E5E7EB", borderless: true, radius: 20 }} // Ripple for Android
        style={({ pressed }) => ({
          position: "absolute",
          top: 43,
          left: 30,
          borderRadius: 20,
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed && Platform.OS === "ios" ? "#E5E7EB" : "transparent", // iOS Press Effect
        })}
      >
        <ArrowLeftIcon />
      </Pressable>

      <Text style={{ fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 18, textAlign: "center" }}>
        Kodni kiriting
      </Text>
      <Text style={{ textAlign: "center", fontFamily: "SfProDisplayRegular", fontSize: 15, color: "#000", marginTop: 10 }}>
        Biz sizning +{userPhoneNumber} telefoningizga SMS kodini jo‘natdik
      </Text>

      {/* OTP Input Fields */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30, columnGap: 10 }}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el!)}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              borderWidth: digit ? 1.7 : 1.5,
              borderColor: inputRefs.current[index]?.isFocused()
                ? "#000" 
                : codeError ? "#FF0000" 
                : digit
                ? "#2CA82A"
                : "#ADADAD",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "700",
            }}
            cursorColor={"#000"}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            selectionColor={"#FFF"} 
            caretHidden={true} 
            selection={selection[index]} // Controls selection manually
            onFocus={() =>
              setSelection((prev) =>
                prev.map((sel, i) =>
                  i === index ? { start: 0, end: digit.length } : sel
                )
              )
            } // Selects the entire text on focus
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {/* Resend Button */}
      <Pressable onPress={() => {}} style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ color: "#2CA82A", fontWeight: "600" }}>Qolgan urunishlar soni: {tryCount}</Text>
        <Text style={{ color: "#2CA82A", fontWeight: "600" }}>{formatTime(secondsLeft)}</Text>
      </Pressable>


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
        }}>
        <View style={{paddingHorizontal: 30}}>
          <Text style={{fontFamily: "SfProDisplayMedium", fontWeight: "500", fontSize: 18, marginTop: 40, textAlign: "left"}}>Siz juda ko‘p SMS olishga urindingiz. Limit tugadi. Iltimos, 24 soatdan keyin qayta urinib ko‘ring.</Text>

          <Pressable onPress={() => limitActionRef.current?.hide()} style={{backgroundColor: "#F2F2F2", height: 50, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 20}}>
            <Text style={{fontFamily: "SfProDisplayMedium", fontWeight: "500", fontSize: 18, textAlign: "left", color: "black"}}>Yopish</Text>
          </Pressable>
        </View>
      </ActionSheet>
    </View>
  );
}
