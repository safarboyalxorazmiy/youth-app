import { router, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import ArrowLeftIcon from "@/assets/images/navbar/ArrowLeftIcon.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Verify() {
  // const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [selection, setSelection] = useState(
    otp.map(() => ({ start: 0, end: 0 }))
  ); // Track selection positions
  const inputRefs = useRef<TextInput[]>([]);


  // Handle input change
  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if not last digit
    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    } else if (text && index === 4) {
      AsyncStorage.setItem("fromRoute", "Verify");
      AsyncStorage.setItem("token", "&&&&");
      router.push("/");      
    }

    // Move cursor to end
    setSelection((prev) =>
      prev.map((sel, i) => (i === index ? { start: 1, end: 1 } : sel))
    );
  };

  return (
    <View style={{ backgroundColor: "#FFF", paddingHorizontal: 30, height: "100%", paddingTop: 140 }}>
      <Pressable
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
        Biz sizning +998 917972385 telefoningizga SMS kodini jo‘natdik
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
        <Text style={{ color: "#2CA82A", fontWeight: "600" }}>Qayta yuborish</Text>
      </Pressable>
    </View>
  );
}
