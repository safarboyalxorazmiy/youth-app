import { useLocalSearchParams, useRouter } from "expo-router";
import { ImageBackground, StyleSheet, View, Text, Dimensions, Image, TextInput, Pressable, Animated, NativeSyntheticEvent, TextInputKeyPressEventData, ScrollView, Platform } from "react-native";
import YouthLogo from "@/assets/images/youth-logo.svg";
import { BlurView } from 'expo-blur';
import { memo, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Verify({ route }: { route: { params: { phone: string; } } }) {
  const { phone } = useLocalSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);


  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [selection, setSelection] = useState(
    otp.map(() => ({ start: 0, end: 0 }))
  ); // Track selection positions

  const [codeError, setCodeError] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  const limitActionRef = useRef<ActionSheetRef>(null);

  // const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null);
  const [tryCount, setTryCount] = useState(5);

  const [secondsLeft, setSecondsLeft] = useState(60); // 1 minute = 60 seconds

  
  const [timerIntervalId, setTimerIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);


  useEffect(() => {
    if (secondsLeft === 0) {
      setTimerIntervalId(null);
      router.push("../");
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    setTimerIntervalId(timer);

    return () => clearInterval(timer); 
  }, [secondsLeft]);

  const scrollViewRedf = useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollViewRedf.current?.scrollTo({ y: 100, animated: true });
  };
  
  const isFocused = useIsFocused();
  useEffect(() => {
    setOtp(Array(6).fill(""));
    setSecondsLeft(60);
    setTryCount(5);
  }, [isFocused]);



  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const secsLeft = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${secsLeft.toString().padStart(2, '0')}`;
  };


  const sendVerifyRequest = async (code: string) => {
    console.log("users request: ", {
      action: "login",
      phone_number: phone,
      code: code
    });
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("https://dev-api.yoshtadbirkorlar.uz/api/user/auth/verify-otp/", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Content-Language": "uz"
        },
        body: JSON.stringify({
          action: "login",
          phone_number: phone,
          code: code
        })
      });
      const data = await response.json();


      console.log("OTP verification response:", data);
      console.log("Access token: ", data.data.tokens.access);
      await AsyncStorage.setItem("access_token", data.data.tokens.access);
      router.push({
        pathname: "/"
      });

    } catch (err) {
      // console.error("Verification error:", err);
      setCodeError(true);
    }
    setIsLoading(false);
  }

  const formatPhone = (raw: string) => {
    const phone = raw.replace(/\D/g, "").replace(/^998/, "");
    let formatted = "+998";

    if (phone.length > 0) formatted += " " + phone.slice(0, 2);
    if (phone.length > 2) formatted += " " + phone.slice(2, 5);
    if (phone.length > 5) formatted += " " + phone.slice(5, 7);
    if (phone.length > 7) formatted += " " + phone.slice(7, 9);

    return formatted;
  };

  // Handle input change
  const handleChange = async (text: string, index: number) => {
    console.log("text: ", text);

    if (text.length > 1) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (text && index === 5) {
      console.log(newOtp.join(""));
      sendVerifyRequest(newOtp.join(""));
    }

    if (text === "") {
      inputRefs.current[index - 1]?.focus();
    }

    setSelection((prev) =>
      prev.map((sel, i) => (i === index ? { start: 1, end: 1 } : sel))
    );
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };


  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const animateOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  
  const scale2 = useRef(new Animated.Value(1)).current;

  const animateIn2 = () => {
    Animated.spring(scale2, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const animateOut2 = () => {
    Animated.spring(scale2, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };  


  return (
    <ScrollView ref={scrollViewRedf} keyboardShouldPersistTaps={Platform.OS === "ios" ? "never" : "always"} showsVerticalScrollIndicator={false} nestedScrollEnabled={true} style={{ flex: 1, backgroundColor: "black", height: Dimensions.get('window').height }}>
      <ImageBackground
        source={require("@/assets/images/auth-bg.png")} // or use { uri: "https://..." }
        style={styles.background}
        resizeMode="cover"
      >
        <YouthLogo style={{position: "absolute", top: 40, right: 30}} />

        <BlurView intensity={80} tint="light" style={styles.content}>
          <Text style={styles.text}>SMS kodni kiriting</Text>
          
          <Text style={{marginTop: 8, fontSize: 16, fontFamily: "Gilroy-Regular", color: "#292929"}}>{formatPhone(phone)} raqamiga yuborilgan SMS kodini kiriting.</Text>


        {/* OTP Input Fields */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30, columnGap: 10 }}>
          {otp.map((digit, index) => (
            <TextInput
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={{
                width: 45,
                height: 45,
                borderRadius: 10,
                borderWidth: digit ? 1.7 : 1.5,
                borderColor: inputRefs.current[index]?.isFocused()
                  ? "#000" 
                  : codeError ? "#FF0000" 
                  : digit
                  ? "#1A99FF"
                  : "#FBFBFB",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "700",
                backgroundColor: "#FFFFFF",
              }}
              onKeyPress={(e) => handleKeyPress(e, index)}
              cursorColor={"#000"}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              selectionColor={"transparent"} 
              caretHidden={true} 
              selection={selection[index]} // Controls selection manually
              onFocus={() => {
                scrollToTop();
                setSelection((prev) =>
                  prev.map((sel, i) =>
                    i === index ? { start: 0, end: digit.length } : sel
                  )
                );
              }} // Selects the entire text on focus
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>


        <Pressable onPress={() => {}} style={{ marginTop: 20, alignItems: "center" }}>
          {/* <Text style={{ color: "#2CA82A", fontWeight: "600" }}>Qolgan urunishlar soni: {tryCount}</Text> */}
          <Text style={{ color: "#292929", fontWeight: "600", fontSize: 16, fontFamily: "Gilroy-Regular" }}>{formatTime(secondsLeft)}</Text>
        </Pressable>

        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 8}}>
          <Text style={{ color: "#292929", fontSize: 16, fontFamily: "Gilroy-Regular"}}>Kod kelmadi?</Text>
          <Pressable onPress={() => {
            if (tryCount > 0) {
              setTryCount(tryCount - 1);
              setSecondsLeft(60);
              setTimerIntervalId(null);
            } else {
              limitActionRef.current?.setModalVisible();
            }
          }} style={{ marginLeft: 5 }}>
            <Text style={{ color: "#EF4444", fontSize: 16, fontFamily: "Gilroy-Regular" }}>Qayta yuborish</Text>
          </Pressable>
        </View>


        <Pressable
            onPressIn={animateIn}
            onPressOut={animateOut}
            onPress={() => {
              sendVerifyRequest(otp.join(""));
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale }],
                backgroundColor: "#3E97FF",
                borderRadius: 14,
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginTop: 28,
                opacity: isLoading ? 0.8 : 1,
              }}>
              {isLoading ? (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontFamily: "Gilroy-Medium",
                    textAlign: "center",
                  }}
                >
                  Tasdiqlanmoqda...
                </Text>
                ) : (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontFamily: "Gilroy-Medium",
                    textAlign: "center",
                  }}
                >
                  Davom etish
                </Text>
              )}
            </Animated.View>
        </Pressable>

        <Pressable
          onPressIn={animateIn2}
          onPressOut={animateOut2}
          onPress={() => {
            router.back();
          }}>
            <Animated.View
              style={{
                transform: [{ scale: scale2 }], 
                backgroundColor: "#ECF5FF",
                borderRadius: 14,
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginTop: 16,
                opacity: isLoading ? 0.8 : 1,
              }}>
                <Text
                  style={{
                    color: "#3E97FF",
                    fontSize: 18,
                    fontFamily: "Gilroy-Medium",
                    textAlign: "center",
                  }}
                >
                  Orqaga
                </Text>
              </Animated.View>
        </Pressable>


        </BlurView>
      
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    height: Dimensions.get('window').height,
    width: "100%",
  },
  content: {
    backgroundColor: "#FFFFFFCC",
    width: Dimensions.get('window').width - 32,
    marginLeft: "auto",
    marginRight: "auto",
    height: 440,
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  text: {
    color: "#3E97FF",
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default memo(Verify);