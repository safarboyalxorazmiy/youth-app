import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, Text, ScrollView, View, StatusBar, Linking, Platform } from "react-native";
import LocationIcon from "@/assets/images/location-icon.svg";
import TruckDeliverySpeedIcon from "@/assets/images/truck-delivery-speed-icon-green.svg";
import CallIcon from "@/assets/images/call-icon.svg";
import TelegramIcon from "@/assets/images/telegram-icon.svg";
import { useNavigation, useRouter } from "expo-router";
import ArrowLeftIconLight from "@/assets/images/arrow-left-light.svg";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import SearchIcon from "@/assets/images/search-icon.svg";
import ArrowLeftIcon from "@/assets/images/navbar/ArrowLeftIcon.svg";

import Constants from 'expo-constants';

import { t } from '@/i18n';

const statusBarHeight = Constants.statusBarHeight;

type CargoDTO = {
  id: number;
  comment: string;
  createdDate: string;
  destinationADistinct?: string;
  destinationARegion: string;
  destinationBDistinct?: string;
  destinationBRegion: string;
  transportType: string;
};

export default function CargoDetail() { 
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [cargoData, setCargoData] = useState<CargoDTO | null>(null);

  useEffect(() => {
    async function loadCargoDetail() {
      let cargoDataString = await AsyncStorage.getItem("cargoData");
  
      if (cargoDataString !== null) {
        let cargoData = JSON.parse(cargoDataString);
        setCargoData(cargoData);
      }
  
    }
  
    loadCargoDetail();
  }, [router]);

  return (
    <ScrollView style={{backgroundColor: "#FFF"}}>
      <StatusBar animated={true} backgroundColor="#232325" barStyle={"default"} showHideTransition={"slide"} hidden={false} />
      <View style={{ marginTop: Platform.OS === "ios" ? statusBarHeight : 0,  backgroundColor: "#232325", height: 69, paddingHorizontal: 22, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ height: 40, width: 40, borderRadius: 20, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
          <Pressable
            style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
            android_ripple={{ color: "#4F4F4F" }}
            onPress={() => router.push("/")}
          >
            <ArrowLeftIconLight />
          </Pressable>
        </View>

        <View style={{
          width: "70%",
          height: 40,
          borderRadius: 8,
          overflow: "hidden"
        }}>
          <Pressable
            android_ripple={{ color: "#808080" }}
            style={{
              backgroundColor: "#0c0c0d",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 14,
              width: "100%",
              height: "100%"
            }}
            onPress={() => {
              router.push("/cargoSearch")
            }}
          >
            <Text allowFontScaling={false} style={{ fontSize: 14, fontFamily: "SfProDisplayRegular", color: "#fff", fontWeight: "400", width: "70%", textAlign: "center" }} numberOfLines={1}>{t("search")}</Text>
            <SearchIcon />
          </Pressable>
        </View>
      </View>

      <View style={{flexDirection: "row", alignItems: "center", marginLeft: 22, columnGap: 22}}>
        <LocationIcon />

        <View style={{flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start"}}>
          <View>
            <Text allowFontScaling={false} style={{fontSize: 16, fontFamily: "SfProDisplayBold", fontWeight: "700", marginTop: 40}}>{cargoData?.destinationARegion || ""}</Text>
            <Text allowFontScaling={false} style={{fontSize: 12, fontFamily: "SfProDisplayMedium", fontWeight: "500", marginBottom: 8}}>{cargoData?.destinationADistinct || ""}</Text>
          </View>
          <View>
            <Text allowFontScaling={false} style={{fontSize: 16, fontFamily: "SfProDisplayBold", fontWeight: "700", marginTop: 8, }}>{cargoData?.destinationBRegion || ""}</Text>
            <Text allowFontScaling={false} style={{fontSize: 12, fontFamily: "SfProDisplayMedium", fontWeight: "500", marginBottom: 25}}>{cargoData?.destinationBDistinct || ""}</Text>
          </View>
        </View>
      </View>
  
      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 24, columnGap: 10, paddingHorizontal: 22, marginBottom: 30}}>
        <TruckDeliverySpeedIcon />
        <View style={{flexDirection: "row", alignItems: "center", columnGap: 1}}>
          <Text allowFontScaling={false} style={{fontSize: 14, color: "#2CA82A", fontWeight: "700", fontFamily: "SfProDisplayBold"}}>{t("transportType")}: </Text> 
          <Text allowFontScaling={false} style={{fontSize: 14, color: "#000", fontWeight: "700", fontFamily: "SfProDisplayBold"}}>ISUZU</Text>
        </View>
      </View>

      <View style={{paddingHorizontal: 22, marginBottom: 100}}>
        <Text allowFontScaling={false} style={{fontSize: 14, color: "#2CA82A", fontWeight: "700", fontFamily: "SfProDisplayBold", marginBottom: 11}}>{t("comment2")}:</Text>

        <View style={{height: 106, borderWidth: 1, borderRadius: 8, borderColor: "#232325", width: "100%", padding: 20}}>
          <Text allowFontScaling={false} style={{fontSize: 14, fontFamily: "SfProDisplayRegular", fontWeight: "400"}}>{cargoData?.comment || ""}</Text>
        </View>

        <View style={{height: 45, borderRadius: 11, width: "100%", marginTop: 32, overflow: "hidden"}}>
          <Pressable 
            onPress={() => {
              Linking.openURL(`tel:+998917972385`);
            }}
            android_ripple={{color: "#1E1E1E"}} 
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#2CA82A",  
              display: "flex", 
              flexDirection: "row",
              alignItems: "center", 
              justifyContent: "center", 
              columnGap: 15
            }}>
            <CallIcon />
            <Text allowFontScaling={false} style={{fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 14, color: "#FFF"}}>+998 91 797 23 85</Text>
          </Pressable>
        </View>

        <View style={{height: 45, borderRadius: 11, width: "100%", marginTop: 15, overflow: "hidden"}}>
          <Pressable
            onPress={() => {
              Linking.openURL(`https://t.me/+998917972385`);
            }}
            android_ripple={{color: "#000"}}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#1E1E1E", 
              display: "flex", 
              flexDirection: "row",
              alignItems: "center", 
              justifyContent: "center", 
              columnGap: 15
            }}>
            <TelegramIcon />
            <Text allowFontScaling={false} style={{fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 14,  color: "#FFF"}}>Telegram</Text>
          </Pressable>
        </View>
        
      </View>
    </ScrollView>
  )
}