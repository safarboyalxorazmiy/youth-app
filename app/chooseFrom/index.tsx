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

    search("");
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
    <View style={{backgroundColor: "#232325", height: "100%"}}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={{
              marginTop: Platform.OS === "ios" ? statusBarHeight : 25,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 25,
              width: "100%",
            }}>
              <View style={{ borderRadius: 50, overflow: 'hidden' }}>
                <Pressable
                  android_ripple={{ color: "#808080" }}
                  style={{ padding: 10 }}
                  onPress={() => {
                    router.back();
                  }}
                >
                  <ArrowLeftLightIcon />
                </Pressable>
              </View>

              <Text allowFontScaling={false} style={{
                fontSize: 16,
                fontWeight: "700",
                fontFamily: "SfProDisplayBold",
                color: "#FFF"
              }}>
                {t("cargoSearch")}
              </Text>

              <View></View>
            </View>

            <View style={{ paddingHorizontal: 25 }}>
              <TextInput
                onChangeText={(text) => search(text)}
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
                  fontSize: 16,
                  height: 50,
                  paddingHorizontal: 20,
                  fontWeight: "400",
                  color: "#000",
                  backgroundColor: "#FFFFFF",
                  borderBottomWidth: isFocused ? 1 : 0.7,
                  borderBottomColor: isFocused ? "#000" : "#CCC",
                  fontFamily: "SfProDisplayRegular"
                }} />
            </View>
          </>
        }
        data={recommendData}
        renderItem={({ item, index }) => (
          <View style={{
            backgroundColor: "#FFF",
            marginHorizontal: 25,
            // marginBottom: 10,
            borderTopLeftRadius: index === 0 ? 8 : 0,
            borderTopRightRadius: index === 0 ? 8 : 0,
            borderBottomLeftRadius: index === recommendData.length - 1 ? 8 : 0,
            borderBottomRightRadius: index === recommendData.length - 1 ? 8 : 0,

            overflow: "hidden",
            // Optional: add shadow on iOS and elevation on Android
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}>
            <Pressable
              onPress={() => {
                if (userLanguage == "uz") {
                  AsyncStorage.setItem("locationFrom", (item.locationRegionUz == null ? "" : item.locationRegionUz));
                } else if (userLanguage == "ru") {
                  AsyncStorage.setItem("locationFrom", (item.locationRegionRu == null ? "" : item.locationRegionRu));
                } else {
                  AsyncStorage.setItem("locationFrom", (item.locationRegionCy == null ? "" : item.locationRegionCy));
                }

                router.back();
              }}
              style={{
                height: 55,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
              android_ripple={{ color: "#EEE" }}
            >
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  fontFamily: "SfProDisplayRegular"
                }}
              >
                {userLanguage == "uz"
                  ? item.locationRegionUz
                  : userLanguage == "ru"
                  ? item.locationRegionRu
                  : item.locationRegionCy}
              </Text>
        
              <ArrowRightForChoosing />
            </Pressable>
          </View>
        )}
        
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};
