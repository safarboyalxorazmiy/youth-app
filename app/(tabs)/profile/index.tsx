import Collapsible from 'react-native-collapsible';
import { View, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import Collapser from "@/assets/images/collapser-icon.svg"
import EmailIcon from "@/assets/images/email-icon.svg";
import PhoneIcon from "@/assets/images/phone-icon.svg";
import CalendarIcon from "@/assets/images/calendar-icon.svg";
import LanguageIcon from "@/assets/images/language-icon.svg";
import PassportIcon from "@/assets/images/passport-icon.svg";
import PinflIcon from "@/assets/images/pinfl-icon.svg";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExitIcon from "@/assets/images/exit-icon.svg"
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

export default function Profile() {
  const [collapsed, setCollapsed] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [])

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchUserProfile();
  }, [isFocused]);

  const fetchUserProfile = async () => {
    const token = await AsyncStorage.getItem("access_token");

    try {
      const response = await fetch("https://dev-api.yoshtadbirkorlar.uz/api/user/auth/profile/", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Language": "uz",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProfileData(data);
      setCollapsed(false);
      // console.log("User Profile:", data);
      return data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  };

  const router = useRouter();


  function formatPhoneNumber(phoneNumber: string) {
    if (!phoneNumber) return "";

    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Check if it's an Uzbek number (starts with +998 or 998)
    if (cleaned.startsWith("998")) {
      const uz = cleaned.slice(3); // Remove country code
      if (uz.length === 9) {
        return `+998 ${uz.slice(0, 2)} ${uz.slice(2, 5)} ${uz.slice(5, 7)} ${uz.slice(7, 9)}`;
      }
    }

    // If it's not Uzbek, fallback to general format (USA-style)
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }

    // If it starts with country code
    if (cleaned.length > 10) {
      return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
    }

    // Return original if no known format matched
    return phoneNumber;
  }


  return (
    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true} style={{ padding: 20, marginTop: statusBarHeight }}>
      <View style={{borderRadius: 8, overflow: 'hidden',}}>
        <Pressable style={{
        backgroundColor: "#FFF", 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        padding: 16,
      }} onPress={() => setCollapsed(!collapsed)}>
        <Text style={{ fontFamily: "Gilroy-SemiBold", fontSize: 18, color: "#303131" }}>
          Shaxsiy ma'lumotlar
        </Text>

        <Collapser />
        </Pressable>

        <Collapsible collapsed={collapsed} style={{ backgroundColor: "#FFF", paddingHorizontal: 16, borderBottomLeftRadius: 8, borderBottomRightRadius: 8}}>
          <View style={{ paddingVertical: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
              <EmailIcon />
              <View>
                <Text style={{color: "#C6C6C6", fontSize: 14, fontFamily: "Gilroy-Regular"}}>Email: </Text>
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{profileData?.email || "-"}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginTop: 20 }}>
              <PhoneIcon />
              <View>
                <Text style={{color: "#C6C6C6", fontSize: 14, fontFamily: "Gilroy-Regular"}}>Telefon raqam: </Text>
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{formatPhoneNumber(profileData?.phone_number || "-")}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginTop: 20 }}>
              <CalendarIcon />
              <View>
                <Text style={{color: "#C6C6C6", fontSize: 14, fontFamily: "Gilroy-Regular"}}>Tug’ilgan sana </Text>
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{profileData?.birth_date || "-"}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginTop: 20 }}>
              <LanguageIcon />
              <View>
                <Text style={{color: "#C6C6C6", fontSize: 14, fontFamily: "Gilroy-Regular"}}>Til </Text>
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>O’zbek</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginTop: 20 }}>
              <PassportIcon />
              <View>
                <Text style={{color: "#C6C6C6", fontSize: 14, fontFamily: "Gilroy-Regular"}}>Pasport </Text>
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{profileData?.passport_series || "-"}{profileData?.passport_number || "-"}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginTop: 20 }}>
              <PinflIcon />
              <View>
                <Text style={{color: "#C6C6C6", fontSize: 14, fontFamily: "Gilroy-Regular"}}>PINFL </Text>
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{profileData?.pinfl || "-"}</Text>
              </View>
            </View>

            <Text style={{fontFamily: "Gilroy-Medium", fontSize: 16, color: "#474848", marginTop: 20, marginBottom: 8}}>ONE ID Verifikatsiya</Text>
            <View style={{backgroundColor: "#1A99FF0F", width: 232, height: 36, alignItems: "center", justifyContent: "center", borderColor: "#1A99FF", borderWidth: 1, borderRadius: 100}}>
              <Text style={{color: "#1A99FF", fontSize: 16, fontFamily: "Gilroy-Medium"}}>Tasdiqlangan foydalanuvchi</Text>
            </View>

            <Text style={{fontFamily: "Gilroy-Medium", fontSize: 16, color: "#474848", marginTop: 20, marginBottom: 8}}>MyID Verifikatsiya</Text>
            <View style={{backgroundColor: "#1A99FF0F", width: 232, height: 36, alignItems: "center", justifyContent: "center", borderColor: "#1A99FF", borderWidth: 1, borderRadius: 100}}>
              <Text style={{color: "#1A99FF", fontSize: 16, fontFamily: "Gilroy-Medium"}}>Tasdiqlangan foydalanuvchi</Text>
            </View>
            

          </View>
        </Collapsible>
      </View>


      <View style={{backgroundColor: "#FFF", borderRadius: 8, padding: 16, marginTop: 16}}>
        <Text style={{ fontFamily: "Gilroy-SemiBold", fontSize: 18, color: "#303131" }}>
          Shaxsiy ma'lumotlar
        </Text>

        <Text style={{ fontFamily: "Gilroy-Medium", fontSize: 16, color: "#474848", marginTop: 16}}>Foydalanuvchi ID</Text>
        <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 16, color: "#8C8D8D", marginTop: 8}}>{profileData?.id}</Text>
      </View>

      <View style={{ marginTop: 16, width: "100%", marginBottom: 100, borderRadius: 8, overflow: "hidden", }}>
        <Pressable onPress={() => {
          AsyncStorage.clear();
          router.push("/login")
        }} android_ripple={{color: "#e7000b1a"}} style={{backgroundColor: "#e7000b1a", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16,  columnGap: 8, }}>
          <Text style={{color: "#fb2c36", fontSize: 16, fontFamily: "Gilroy-Medium"}}>Chiqish</Text>
          <ExitIcon style={{color: "#fb2c36"}}/>
        </Pressable>
      </View>

    </ScrollView>
  );
}
