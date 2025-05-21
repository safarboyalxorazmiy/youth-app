import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Pressable, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import ArrowLeftIcon from "@/assets/images/ArrowLeftIcon.svg";
import { TouchableRipple } from "react-native-paper";
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
import Constants from 'expo-constants';
import Collapsible from 'react-native-collapsible';
import { SpecialityDropdown } from "@/components/dropdown/userItem/SpecialityDropdown";
import { EmployStatus2Dropdown } from "@/components/dropdown/userItem/EmployStatus2Dropdown";
import { YesNoDropdown } from "@/components/dropdown/userItem/YesNoDropdown";
import { CauseDropdown } from "@/components/dropdown/userItem/CauseDropdown";

import * as DocumentPicker from 'expo-document-picker';

const statusBarHeight = Constants.statusBarHeight;
const UserItem = () => {
  const { item } = useLocalSearchParams();
  const parsedItem = item ? JSON.parse(item as string) : null;
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(true);
  const [shortUserInfo, setShortUserInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const [rawPhone, setRawPhone] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const [isError, setIsError] = useState(false);

  const [selectedSpeciality, setSelectedSpeciality] = useState<{
    title: string;
    value: string;
  }>({ title: '', value: '' });

  const [selectedEmployStatus, setSelectedEmployStatus] = useState({
    title: '',
    value: '',
  });

  const [selectedStudyingInAbroadStatus, setSelectedStudyingInAbroadStatus] = useState({
    title: '',
    value: '',
  });

  const [selectedStudyingInUzbekistanStatus, setSelectedStudyingInUzbekistanStatus] = useState({
    title: '',
    value: '',
  });

  const [causeStatus, setCauseStatus] = useState({
    title: '',
    value: '',
  });

  const [causeInputFocused, setCauseInputFocused] = useState(false);
  const [causeInput, setCauseInput] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userToken = await AsyncStorage.getItem("access_token");
        if (!userToken) {
          return;
        }

        const response = await fetch(`https://dev-api.yoshtadbirkorlar.uz/api/dashboard/user/${parsedItem?.id}/`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Content-Language": "uz"
          },
        });

        if (!response.ok) {
          throw new Error(`Server xatosi: ${response.status}`);
        }

        const json = await response.json();
        setUserInfo(json.data);
        // console.log("item topildi:", json.data)
      } catch (err: any) {
        // setError(err.message || "Noma'lum xatolik");
      } finally {
        // setLoading(false);
      }
    };


    // setShortUserInfo(item);
    console.log(item)
    const obj = JSON.parse(item);
    // console.log();
    setShortUserInfo(obj)
    // let item = JSON.parse(item);
    // console.log(item.roles)

    if (parsedItem?.id) {
      fetchUserInfo();
    } else {
      // setLoading(false);
      // setError("Item topilmadi");
      console.log("Item topilmadi::", item)
    }
  }, [parsedItem?.id]);
  
  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    // only allow up to 9 digits after 998
    let raw = digits.startsWith("998") ? digits : "998" + digits;
    raw = raw.slice(0, 12);
    setRawPhone(raw);
  };

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

  const formatPhone = (raw: string) => {
    const phone = raw.replace(/\D/g, "").replace(/^998/, "");
    let formatted = "+998";

    if (phone.length > 0) formatted += " " + phone.slice(0, 2);
    if (phone.length > 2) formatted += " " + phone.slice(2, 5);
    if (phone.length > 5) formatted += " " + phone.slice(5, 7);
    if (phone.length > 7) formatted += " " + phone.slice(7, 9);

    return formatted;
  };


  const handleDocumentPick = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      const fileToUpload = {
        uri: result.uri,
        name: result.name,
        type: result.mimeType || 'application/octet-stream',
      };

      const formData = new FormData();
      formData.append('file', fileToUpload); // 🔑 'file' should match your backend key

      try {
        const response = await fetch('https://your-backend.com/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const data = await response.json();
        console.log('Upload success:', data);
        Alert.alert('Success', 'File uploaded!');
      } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Error', 'File upload failed');
      }
    }
  };


  return (
    <ScrollView style={{ marginTop: statusBarHeight, height: "100%", padding: 16,  }}>
      <TouchableRipple onPress={() => {
        router.push("../");
      }} borderless={true} style={{ backgroundColor: "#FFF",  borderRadius: 8, marginBottom: 16, }}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 12, height: 46, borderRadius: 8, columnGap: 8 }}>
          <ArrowLeftIcon />

          <Text style={{ fontSize: 18, fontFamily: "Gilroy-SemiBold" }}>Batafsil</Text>
        </View>
      </TouchableRipple>

      <View style={{ borderRadius: 8, overflow: 'hidden', }}>
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
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{userInfo?.email || "-"}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginTop: 20 }}>
              <PhoneIcon />
              <View>
                <Text style={{color: "#C6C6C6", fontSize: 14, fontFamily: "Gilroy-Regular"}}>Telefon raqam: </Text>
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{formatPhoneNumber(userInfo?.phone_number || "-")}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginTop: 20 }}>
              <CalendarIcon />
              <View>
                <Text style={{color: "#C6C6C6", fontSize: 14, fontFamily: "Gilroy-Regular"}}>Tug’ilgan sana </Text>
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{userInfo?.birth_date || "-"}</Text>
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
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{userInfo?.passport_series || "-"}{userInfo?.passport_number || "-"}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginTop: 20 }}>
              <PinflIcon />
              <View>
                <Text style={{color: "#C6C6C6", fontSize: 14, fontFamily: "Gilroy-Regular"}}>PINFL </Text>
                <Text style={{color: "#111111", fontSize: 14, fontFamily: "Gilroy-Medium"}}>{userInfo?.pinfl || "-"}</Text>
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


      <View style={{ backgroundColor: "#FFF", borderRadius: 8, padding: 16, marginTop: 16 }}>
        <Text style={{ fontFamily: "Gilroy-SemiBold", fontSize: 18, color: "#303131" }}>
          Shaxsiy ma'lumotlar
        </Text>

        <Text style={{ fontFamily: "Gilroy-Medium", fontSize: 16, color: "#474848", marginTop: 16}}>Foydalanuvchi ID</Text>
        <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 16, color: "#8C8D8D", marginTop: 8}}>{userInfo?.id}</Text>

        <Text style={{ fontFamily: "Gilroy-Medium", fontSize: 16, color: "#474848", marginTop: 16}}>Foydalanuvchi roli</Text>
        <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 16, color: "#8C8D8D", marginTop: 8}}>{shortUserInfo?.roles[0].name}</Text>

        <Text style={{fontFamily: "Gilroy-Medium", fontSize: 16, color: "#474848", marginTop: 20, marginBottom: 8}}>ONE ID Verifikatsiya</Text>
        {
          userInfo?.isVerified ? (
            <View style={{backgroundColor: "#1A99FF0F", width: 232, height: 36, alignItems: "center", justifyContent: "center", borderColor: "#1A99FF", borderWidth: 1, borderRadius: 100}}>
              <Text style={{color: "#1A99FF", fontSize: 16, fontFamily: "Gilroy-Medium"}}>Tasdiqlangan foydalanuvchi</Text>
            </View>
          ) : (
            <View style={{backgroundColor: "#e7000b1a", width: 252, height: 36, alignItems: "center", justifyContent: "center", borderColor: "#fb2c36", borderWidth: 1, borderRadius: 100}}>
              <Text style={{color: "#fb2c36", fontSize: 16, fontFamily: "Gilroy-Medium"}}>Tasdiqlanmagan foydalanuvchi</Text>
            </View>
          )
        }

      

      </View>

      <View style={{ backgroundColor: "#FFF", borderRadius: 8, padding: 16, marginTop: 16, paddingBottom: 200 }}>
        <Text style={{ fontFamily: "Gilroy-SemiBold", fontSize: 18, color: "#303131" }}>So’rovnoma</Text>

        <Text style={{ fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 14, color: "#474848", marginTop: 16 }}>Telefon raqam</Text>
        
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

        <Text style={{ fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 14, color: "#474848", marginTop: 16, marginBottom: 6 }}>Yo'nalishi</Text>
        <SpecialityDropdown
          selectedSpeciality={selectedSpeciality}
          setSelectedSpeciality={setSelectedSpeciality}
        />

        <Text style={{ fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 14, color: "#474848", marginBottom: 6 }}>Doimiy ish joyiga ega</Text>
        <EmployStatus2Dropdown
          selectedEmployStatus={selectedEmployStatus}
          setSelectedEmployStatus={setSelectedEmployStatus}
        />

        <Text style={{ fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 14, color: "#474848", marginBottom: 6 }}>Chet elda ishlamoqchi </Text>
        <YesNoDropdown
          selectedStatus={selectedStudyingInAbroadStatus}
          setSelectedStatus={setSelectedStudyingInAbroadStatus}
        />

        <Text style={{ fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 14, color: "#474848", marginBottom: 6 }}>O’zbekiston respublikasida ishlamoqchi</Text>
        <YesNoDropdown
          selectedStatus={selectedStudyingInUzbekistanStatus}
          setSelectedStatus={setSelectedStudyingInUzbekistanStatus}
        />

        <Text style={{ fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 14, color: "#474848", marginBottom: 6 }}>Kasbga o'qitish kurslarida o'qishga ehtiyoj mavjudligi</Text>
        <YesNoDropdown
          selectedStatus={selectedStudyingInUzbekistanStatus}
          setSelectedStatus={setSelectedStudyingInUzbekistanStatus}
        />

        <Text style={{ fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 14, color: "#474848", marginBottom: 6 }}>Sababini tanlang</Text>
        <CauseDropdown
          selectedStatus={causeStatus}
          setSelectedStatus={setCauseStatus}
        />

        <Text style={{ fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 14, color: "#474848" }}>Sababini kiritng</Text>
        <View style={{ 
          borderColor: isError ? "#FF0000" : causeInputFocused ? "#1A99FF" : "#EFEFEF", 
          borderWidth: 1.27, 
          width: "100%", 
          marginTop: 8, 
          backgroundColor: "#FFFFFF", 
          borderRadius: 8,  
          flexDirection: "row", 
          alignItems: "center", 
          paddingHorizontal: 20, 
          paddingVertical: 16, 
          height: 122, 
          columnGap: 8 
        }}>
        
          <TextInput
            multiline={true}
            onFocus={() => setCauseInputFocused(true)}
            style={{ 
              width: "100%", 
              height: "100%", 
              fontSize: 16, 
              fontFamily: "Gilroy-Regular", 
              color: "#111111",
              textAlignVertical: 'top'
            }}
            keyboardType="phone-pad"
            placeholder=""
            placeholderTextColor="#111111"
            value={causeInput}
            onChangeText={(value) => {
              setCauseInput(value);
            }}
          />
        </View>


      <View style={{marginTop: 20}}>
        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', fontWeight: '500', color: '#474848', marginBottom: 6 }}>
          Hujjatlarni kiriting
        </Text>
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: '#1A99FF',
            borderStyle: 'dashed',
            borderRadius: 12,
            height: 140,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
          }}
          onPress={handleDocumentPick}
        >
          <Text style={{ fontFamily: "Gilroy-Medium", color: '#1A99FF', fontSize: 14, textDecorationLine: 'underline', fontWeight: '500' }}>
            Hujjatlarni yuklash
          </Text>
        </TouchableOpacity>
      </View>


      <TouchableRipple 
        rippleColor={"#111111B2"} 
        style={{
          backgroundColor: "#1A99FF", 
          height: 48, 
          borderRadius: 14, 
          alignItems: "center", 
          justifyContent: "center", 
          marginTop: 32
        }}>
        <Text style={{fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 16, color: "#FFFFFF"}}>Arizani topshirish</Text>
      </TouchableRipple>

      <TouchableRipple style={{backgroundColor: "#1A99FF1F", height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 12}}>
        <Text style={{fontFamily: "Gilroy-Medium", fontWeight: "500", fontSize: 16, color: "#1A99FF"}}>MyID dan o’tish</Text>
      </TouchableRipple>
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'red',
    borderRadius: 8,
    marginBottom: 8,
    height: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserItem;
