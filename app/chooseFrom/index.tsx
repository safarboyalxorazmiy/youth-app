import { Dimensions, Pressable, Text, TextInput, View, StatusBar, Platform } from "react-native";
import { t } from '@/i18n';
import ArrowRightForChoosing from "@/assets/images/ArrowRightForChoosing.svg";
import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArrowLeftLightIcon from "@/assets/images/arrow-left-light.svg";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;


export default function ChooseFrom() {
  const [isFocused, setIsFocused] = useState(false);
  const [recommendData, setRecommendData] = useState([]);
  const [query, setQuery] = useState("");
  const [userLanguage, setUserLanguage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setUserLanguage((await AsyncStorage.getItem("userLocale") || "uz") as string);
    }
    fetchData();
  }, [isFocused])
  

  const search = async (query: string) => {  
    await fetch('https://api.e-yuk.uz/location/search/region?query=' + query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      setRecommendData(data);
    });
  }

  return (
    <View style={{
      backgroundColor: "#232325", 
      height: "100%",
    }}>
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

      <View style={{ 
        flexDirection: "column", 
        alignItems: "flex-start",
        
        paddingLeft: 25,
        paddingRight: 25,
      }}>
        <TextInput 
          onChangeText={(text) => {
            // setQuery(text);
            search(text);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          cursorColor={"#232325"}
          placeholder={t("from")}
          placeholderTextColor={"#000"}
          style={{ 
            width: "100%",
            borderRadius: 8,
            marginTop: 25,
            marginBottom: 25,
            
            // flex: 1, 
            fontSize: 16, 
            height: 50,
            paddingHorizontal: 20,
            // paddingVertical: 40,
            fontWeight: "400", 
            color: "#000",
            backgroundColor: "#FFFFFF",
            borderBottomWidth: isFocused ? 1 : 0.7,
            borderBottomColor: isFocused ? "#000" : "#CCC",
            fontFamily: "SfProDisplayRegular"
          }} />

        <View style={{
          width: "100%",
          borderRadius: 8, 
          overflow: "hidden",
        }}>
          <FlatList
            data={recommendData}
            renderItem={({ item }) => (
              <Pressable 
                // android_ripple={{ color: "#CCC" }}
                style={{ 
                  backgroundColor: "#FFF", 
                  height: 55,
                  width: "100%",
                  // borderBottomWidth: 0.5,
                  // borderBottomColor: "#000",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                  marginBottom: -1
                }}>
                
                <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>
                  {userLanguage == "uz" ? item.locationRegionUz : userLanguage == "ru" ? item.locationRegionRu : item.locationRegionCy}
                </Text>

                <ArrowRightForChoosing />
              </Pressable>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>

      
    </View>
  );
};
