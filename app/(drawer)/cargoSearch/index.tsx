import { View, Text, TextInput, ScrollView, Pressable, FlatList, Dimensions, Platform } from "react-native";

import { useEffect, useRef, useState } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

import ArrowLeftLightIcon from "@/assets/images/arrow-left-light.svg";
import ArrowRightBottom from "@/assets/images/arrow-right-bottom.svg";
import RefreshIcon from "@/assets/images/refresh-icon.svg";
import LocationDeleteIcon from "@/assets/images/location-delete-icon.svg";
import Constants from 'expo-constants';
import { t } from '@/i18n';
import { useIsFocused } from "@react-navigation/native";
import ArrowRightForChoosing from "@/assets/images/ArrowRightForChoosing.svg";

const statusBarHeight = Constants.statusBarHeight;

export default function CargoSearch() {
  const [focusedInput, setFocusedInput] = useState<String>("");

  type LocationDetails = {
    id: number;
    locationRegionUz: string;
    locationRegionCy: string;
    locationRegionRu: string;
  
    locationDistinctUz: string;
    locationDistinctCy: string;
    locationDistinctRu: string;
  };

  const [userLanguage, setUserLanguage] = useState<string>("");
  const isFocused = useIsFocused();

  const [locationFrom, setLocationFrom] = useState<string>("");
  const [locationTo, setLocationTo] = useState<string>("");
  
  useEffect(() => {
    async function fetchData() {
      setUserLanguage((await AsyncStorage.getItem("userLocale") || "uz") as string);
      setLocationFrom((await AsyncStorage.getItem("locationFrom")) as string || "");
      setLocationTo((await AsyncStorage.getItem("locationTo")) as string || "");
    }


    fetchData();
  }, [isFocused])


  const [destinationARegion , setDestinationARegion] = useState<string>("");
  const [destinationBRegion , setDestinationBRegion] = useState<string>("");

  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const scrollToStart = () => {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <ScrollView style={{backgroundColor: "#232325"}} keyboardShouldPersistTaps="always">
      <StatusBar />

      <View style={{marginTop: Platform.OS === "ios" ? statusBarHeight : 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, width: "100%"}}>
        <View style={{ borderRadius: 50, overflow: 'hidden' }}>
          <Pressable
            android_ripple={{ color: "#808080" }}
            style={{ padding: 10 }}
            onPress={() => {
              router.push("/");
            }}
          >
            <ArrowLeftLightIcon />
          </Pressable>
        </View>

        <Text allowFontScaling={false} style={{fontSize: 16, fontWeight: 700, fontFamily: "SfProDisplayBold", color: "#FFF"}}>{t("cargoSearch")}</Text>

        <View></View>
      </View>


      <View style={{paddingHorizontal: 38, marginTop: 50, width: "100%"}}>
        <Pressable 
          android_ripple={{ color: "#808080" }} 
          onPress={() => {
            router.push("/chooseFrom");
          }}
          style={{
            width: "100%", 
            backgroundColor: "#FFFFFF", 
            borderColor: "#454141", 
            borderRadius: 10, 
            paddingHorizontal: 18, 
            borderWidth: 1, 
            height: 45, 
            position: "relative", 
            alignItems: "center", 
            justifyContent: "space-between",
            flexDirection: "row",
          }}>
          <Text 
            allowFontScaling={false} 
            style={{
              fontSize: 14, 
              fontWeight: 400, 
              fontFamily: "SfProDisplayRegular", 
              color: "#000000"
            }}>{locationFrom != "" ? locationFrom : "Tanlash"}</Text>
          <ArrowRightForChoosing />
        </Pressable>
      </View> 

      <View style={{paddingHorizontal: 38, marginTop: 22, width: "100%"}}>
        <Pressable 
          android_ripple={{ color: "#808080" }} 
          onPress={() => {
            router.push("/chooseTo");
          }}
          style={{
            width: "100%", 
            backgroundColor: "#FFFFFF", 
            borderColor: "#454141", 
            borderRadius: 10, 
            paddingHorizontal: 18, 
            borderWidth: 1, 
            height: 45, 
            position: "relative", 
            alignItems: "center", 
            justifyContent: "space-between",
            flexDirection: "row",
          }}>
            <Text allowFontScaling={false} style={{fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular", color: "#000000"}}>{locationTo != "" ? locationTo : "Tanlash"}</Text>
            <ArrowRightForChoosing />
        </Pressable>
      </View> 


    <View style={{
      height: 55,
      width: Dimensions.get("window").width - 76,
      marginTop: 45,
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: 14,
      overflow: "hidden"
    }}>
      <Pressable 
        android_ripple={{color: "#1E1E1E"}} 
        onPress={async () => {
          const locationFrom = await AsyncStorage.getItem("locationFrom") || "";
          const locationTo = await AsyncStorage.getItem("locationTo") || "";

          await AsyncStorage.setItem("destination", JSON.stringify({
            destinationARegion: locationFrom,
            destinationBRegion: locationTo,
          }));
          
          router.push("/");
        }}  

        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#2CA82A",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          columnGap: 15,
        }}>
        <Text allowFontScaling={false} style={{color: "#FFF", fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 16}}>{t("view")}</Text>
        <RefreshIcon />
      </Pressable>
      </View>

    </ScrollView>
  );
}