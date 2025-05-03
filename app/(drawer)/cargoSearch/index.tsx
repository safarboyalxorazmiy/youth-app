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
  const [locationAInputValue, setLocationAInputValue] = useState<string>("");
  const [locationBInputValue, setLocationBInputValue] = useState<string>("");

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
  
  useEffect(() => {
    async function fetchData() {
      setUserLanguage((await AsyncStorage.getItem("userLocale") || "uz") as string);
    }
    fetchData();

    setFocusedInput("");
    setLocationAInputValue("");
    setLocationBInputValue("");
  }, [isFocused])


  

  const [locationAReccommendData, setLocationAReccommendData] = useState<LocationDetails[]>([]);
  const [locationBReccommendData, setLocationBReccommendData] = useState<LocationDetails[]>([]);

  const [locationAReccumendationVisible, setLocationAReccumendationVisible] = useState<boolean>(false);
  const [locationBReccumendationVisible, setLocationBReccumendationVisible] = useState<boolean>(false);

  const [destinationARegion , setDestinationARegion] = useState<string>("");
  const [destinationBRegion , setDestinationBRegion] = useState<string>("");

  const locationBInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const searchAndSetLocationA = async (locationAInputValue: string) => {  
    await fetch('https://api.e-yuk.uz/location/search/region?query=' + locationAInputValue, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => 
      {
        // console.log(response.json())
        return response.json()

      })
    .then(data => {
      setLocationBReccumendationVisible(true);
      setLocationAReccommendData(data);
    });
  }

  const searchAndSetLocationB = async () => {  
    await fetch('https://api.e-yuk.uz/location/search/region?query=' + locationBInputValue, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => 
      {
        // console.log(response)
        return response.json()
      })
    .then(data => {
      setLocationBReccumendationVisible(true);
      setLocationBReccommendData(data);
    });
  }

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
          {/* <View style={{width: 44, height: 44, borderRadius: 8, overflow: "hidden"}}>
            <Pressable onPress={() => {
              AsyncStorage.removeItem("destination");
              router.push("/");
            }} android_ripple={{ color: "#808080" }} style={{backgroundColor: "#0c0c0d", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
              <LocationDeleteIcon />
            </Pressable>
          </View> */}
      </View>

      <View style={{paddingHorizontal: 38, marginTop: 50, width: "100%"}}>
        <Pressable 
          android_ripple={{ color: "#808080" }} 
          onPress={() => {
            router.push("/chooseFrom");
          }}
          style={{
            width: "100%", 
            backgroundColor: focusedInput == "LocationAInput" || locationAInputValue != "" ? "#232325" : "#FFFFFF", 
            borderColor: focusedInput == "LocationAInput" || locationAInputValue != "" ? "#FFF" : "#454141", 
            borderRadius: 10, 
            paddingHorizontal: 18, 
            borderWidth: focusedInput == "LocationAInput" || 
            locationAInputValue != "" ? 1.5 : 1, 
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
            }}>Tanlash</Text>
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
            backgroundColor: focusedInput == "LocationAInput" || locationAInputValue != "" ? "#232325" : "#FFFFFF", 
            borderColor: focusedInput == "LocationAInput" || locationAInputValue != "" ? "#FFF" : "#454141", 
            borderRadius: 10, 
            paddingHorizontal: 18, 
            borderWidth: focusedInput == "LocationAInput" || 
            locationAInputValue != "" ? 1.5 : 1, 
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
            }}>Tanlash</Text>
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
          router.push("/chooseFrom");
          return;
          
          if (locationAInputValue == "" && locationBInputValue == "") {            
            await AsyncStorage.removeItem("destination");
            router.push("/");
            return;
          }

          if (destinationARegion == "" || destinationBRegion == "") {
            console.log("destinationARegion == '' || destinationBRegion == ''");
            await AsyncStorage.setItem("destination", JSON.stringify({
              destinationARegion: locationAInputValue == "" ? null : locationAInputValue,
              destinationBRegion: locationBInputValue == "" ? null : locationBInputValue,
            }));

            console.log({
              destinationARegion: locationAInputValue == "" ? null : locationAInputValue,
              destinationBRegion: locationBInputValue == "" ? null : locationBInputValue,
            })

            setDestinationARegion("");
            setDestinationBRegion("");
            setFocusedInput("");
            setLocationAInputValue("");
            setLocationBInputValue("");
            router.push("/");
            return;
          }

          await AsyncStorage.setItem("destination", JSON.stringify({
            destinationARegion: destinationARegion,
            destinationBRegion: destinationBRegion,
          }));
          
          setDestinationARegion("");
          setDestinationBRegion("");
          setFocusedInput("");
          setLocationAInputValue("");
          setLocationBInputValue("");
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