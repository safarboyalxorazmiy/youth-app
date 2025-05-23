import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ImageBackground, StyleSheet, View, Text, Dimensions, Image, TextInput, Pressable, Animated } from "react-native";
import { BlurView } from 'expo-blur';
import ToggleSwitch from "toggle-switch-react-native";
import YouthLogo from "@/assets/images/youth-logo.svg";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import * as Haptics from "expo-haptics";

export default function Login() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const [rawPhone, setRawPhone] = useState("+998");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isResponseError, setIsResponseError] = useState(false);
  const [responseErrorText, setResponseErrorText] = useState("");

  
  const [inputFocused, setInputFocused] = useState(false);

  const limitActionRef = useRef<ActionSheetRef>(null);

  const formatPhone = (raw: string) => {
    const phone = raw.replace(/\D/g, "").replace(/^998/, "");
    let formatted = "+998";

    if (phone.length > 0) formatted += " " + phone.slice(0, 2);
    if (phone.length > 2) formatted += " " + phone.slice(2, 5);
    if (phone.length > 5) formatted += " " + phone.slice(5, 7);
    if (phone.length > 7) formatted += " " + phone.slice(7, 9);

    return formatted;
  };


  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    // only allow up to 9 digits after 998
    let raw = digits.startsWith("998") ? digits : "998" + digits;
    raw = raw.slice(0, 12);
    setRawPhone(raw);
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

  const sendLoginRequest = async () => {
    if (isLoading) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    fetch("https://dev-api.yoshtadbirkorlar.uz/api/user/auth/send-otp/", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Content-Language": "uz"
      },
      body: JSON.stringify({
        action: "login",
        phone_number: "+" + rawPhone
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("OTP sent response:", data);
        if (data.code != 200) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setIsResponseError(true);
          setResponseErrorText(data.message);
          setIsLoading(false);
          limitActionRef.current?.show();
          return;
        } else {
          setIsLoading(false);
          router.push({
            pathname: "/verify",
            params: {
              phone: "+" + rawPhone,
            },
          });
        }
      })
      .catch(error => console.error("Error sending OTP:", error));
  }

  useEffect(() => {

  }, [isFocused]);

  return (
    <ImageBackground
      source={require("@/assets/images/auth-bg.png")} // or use { uri: "https://..." }
      style={styles.background}
      resizeMode="cover"
    >
      <YouthLogo style={{position: "absolute", top: 40, right: 30}} />

      <BlurView intensity={80} tint="light" style={styles.content}>
        <Text style={styles.text}>Kirish</Text>

        <Text style={{marginTop: 40, fontSize: 16, fontFamily: "Gilroy-Regular", color: "#292929"}}>Telefon raqam</Text>

        <View style={{ borderColor: isError ? "#FF0000" : inputFocused ? "#1A99FF" : "#EFEFEF", borderWidth: 1.27, width: "100%", marginTop: 8, backgroundColor: "#FFFFFF", borderRadius: 8,  flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, height: 54, columnGap: 8 }}>
          <Image
            source={require("@/assets/images/flaguz.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          <TextInput
            onFocus={() => setInputFocused(true)}
            style={{ width: "100%", height: 54, fontSize: 16, fontFamily: "Gilroy-Regular", color: "#111111"}}
            keyboardType="phone-pad"
            placeholder="+998"
            placeholderTextColor="#111111"
            value={formatPhone(rawPhone)}
            onChangeText={handleChange}
          />
        </View>

        {
          isError && 
            <Text style={{ marginTop: 8, fontSize: 14, height: 23, fontFamily: "Gilroy-Medium", color: "#FF0000" }}>Raqam formati: +998XXXXXXXXX</Text>
        }

        <View style={{ flexDirection: "row", alignItems: "center",columnGap: 8, marginTop: 8 }}>
          <ToggleSwitch
            onColor="#1A99FF"
            offColor="gray"
            size="medium"
            thumbOnStyle={{ backgroundColor: "#FFFFFF", height: 17, width: 17 }}
            thumbOffStyle={{ backgroundColor: "#FFFFFF", height: 17, width: 17  }}
            trackOnStyle={{  height: 20, width: 44 }}
            trackOffStyle={{ height: 20, width: 44 }}
            onToggle={setRememberMe}
            isOn={rememberMe}
          />

          <Text style={{ marginTop: 8.5, fontSize: 14, height: 23, fontFamily: "Gilroy-Medium", color: "#333333" }}>
            Eslab qolish
          </Text>
        </View>

        <Pressable
          onPressIn={animateIn}
          onPressOut={animateOut}
          onPress={() => {
            if (rawPhone.length === 12) {
              // router.push({
              //   pathname: "/verify",
              //   params: {
              //     phone: rawPhone,
              //     // rememberMe: rememberMe,
              //   },
              // });
              sendLoginRequest();
            } else {
              setIsError(true);
            }
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale }],
              backgroundColor: "#3E97FF",
              borderRadius: 8,
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
                Jo'natilmoqda...
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
                Kirish
              </Text>
            )}
          </Animated.View>
        </Pressable>

      </BlurView>


      
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
            height: "auto",
            // paddingTop: 24,
            paddingBottom: 60
          }}
          indicatorStyle={{
            width: 100,
            // backgroundColor: "white"
          }}
          onClose={() => {
            // phoneNumberInputRef.current?.focus();
          }}
        >
          <View style={{paddingHorizontal: 30}}>
            <Text style={{fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 18, marginTop: 40, textAlign: "left"}}>{responseErrorText}</Text>

            <Pressable onPress={() => limitActionRef.current?.hide()} style={{backgroundColor: "#F2F2F2", height: 50, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 20}}>
              <Text style={{fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 18, textAlign: "left", color: "black"}}>Yopish</Text>
            </Pressable>
          </View>
        </ActionSheet>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  content: {
    backgroundColor: "#FFFFFFCC",
    width: Dimensions.get('window').width - 32,
    marginLeft: "auto",
    marginRight: "auto",
    // height: 315,
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
