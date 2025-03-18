import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, Text, ScrollView, View, StatusBar, Linking } from "react-native";
import LocationIcon from "@/assets/images/location-icon.svg";
import TruckDeliverySpeedIcon from "@/assets/images/truck-delivery-speed-icon-green.svg";
import CallIcon from "@/assets/images/call-icon.svg";
import TelegramIcon from "@/assets/images/telegram-icon.svg";
import { useNavigation, useRouter } from "expo-router";
import ArrowLeftIconLight from "@/assets/images/arrow-left-light.svg";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import SearchIcon from "@/assets/images/search-icon.svg";
import ArrowLeftIcon from "@/assets/images/navbar/ArrowLeftIcon.svg";

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
      <View style={{ backgroundColor: "#232325", height: 69, paddingHorizontal: 22, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
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
            <Text style={{ fontSize: 18, fontFamily: "SfProDisplayRegular", color: "#fff", fontWeight: "400", width: "70%", textAlign: "center" }} numberOfLines={1}>Qidiruv</Text>
            <SearchIcon />
            
          </Pressable>
        </View>
      </View>

      <Text style={{fontSize: 28, fontFamily: "SfProDisplayBold", fontWeight: "700", marginTop: 40, marginLeft: 60}}>{cargoData?.destinationARegion || ""}</Text>
      <Text style={{fontSize: 24, fontFamily: "SfProDisplayMedium", fontWeight: "500", marginBottom: 8, marginLeft: 60}}>{cargoData?.destinationADistinct || ""}</Text>

      <LocationIcon style={{marginLeft: 83}} />

      <Text style={{fontSize: 28, fontFamily: "SfProDisplayBold", fontWeight: "700", marginTop: 8, marginLeft: 126}}>{cargoData?.destinationBRegion || ""}</Text>
      <Text style={{fontSize: 24, fontFamily: "SfProDisplayMedium", fontWeight: "500", marginBottom: 25, marginLeft: 126}}>{cargoData?.destinationBDistinct || ""}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 24, marginLeft: 7, columnGap: 10, paddingHorizontal: 46, marginBottom: 30}}>
        <TruckDeliverySpeedIcon />
        <Text style={{fontSize: 20, color: "#2CA82A", fontWeight: "700", fontFamily: "SfProDisplayBold"}}>Transport turi: ISUZU</Text>
      </View>

      <View style={{paddingHorizontal: 46, marginBottom: 100}}>
        <Text style={{fontSize: 20, color: "#2CA82A", fontWeight: "700", fontFamily: "SfProDisplayBold", marginBottom: 11}}>Izoh:</Text>

        <View style={{height: 206, borderWidth: 1, borderRadius: 8, borderColor: "#232325", width: "100%", padding: 20}}>
          <Text style={{fontSize: 20, fontFamily: "SfProDisplayRegular", fontWeight: "400"}}>{cargoData?.comment || ""}</Text>
        </View>

        <View style={{height: 65, borderRadius: 11, width: "100%", marginTop: 32, overflow: "hidden"}}>
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
              columnGap: 30
            }}>
            <CallIcon />
            <Text style={{fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 22, color: "#FFF"}}>+998 91 797 23 85</Text>
          </Pressable>
        </View>

        <View style={{height: 78, borderRadius: 11, width: "100%", marginTop: 15, overflow: "hidden"}}>
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
            <Text style={{fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 22,  color: "#FFF"}}>Telegram</Text>
          </Pressable>
        </View>
        
      </View>
    </ScrollView>
  )
}