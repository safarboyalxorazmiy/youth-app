import { View, Text, TextInput, ScrollView, Pressable, FlatList, Platform } from "react-native";
import ArrowLeftIcon from "@/assets/images/navbar/ArrowLeftIcon.svg";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { t } from '@/i18n';

type LocationDetails = {
  id: number;
  locationRegionUz: string;
  locationRegionCy: string;
  locationRegionRu: string;

  locationDistinctUz: string;
  locationDistinctCy: string;
  locationDistinctRu: string;
};

import Constants from 'expo-constants';
import { useIsFocused } from "@react-navigation/native";

const statusBarHeight = Constants.statusBarHeight;

export default function CargoAdd() {  
  const [focusedInput, setFocusedInput] = useState<String>("");
  const [typeInputValue, setTypeInputValue] = useState<string>("");

  const [locationAInputValue, setLocationAInputValue] = useState<string>("");
  const [locationBInputValue, setLocationBInputValue] = useState<string>("");

  const [locationAReccommendData, setLocationAReccommendData] = useState<LocationDetails[]>([]);
  const [locationBReccommendData, setLocationBReccommendData] = useState<LocationDetails[]>([]);

  const [detailInputValue, setDetailInputValue] = useState<string>("");

  const [locationAReccumendationVisible, setLocationAReccumendationVisible] = useState<boolean>(false);
  const [locationBReccumendationVisible, setLocationBReccumendationVisible] = useState<boolean>(false);

  const [destinationARegion , setDestinationARegion] = useState<string>("");
  const [destinationADistinct , setDestinationADistinct] = useState<string>("");

  const [destinationBRegion , setDestinationBRegion] = useState<string>("");
  const [destinationBDistinct , setDestinationBDistinct] = useState<string>("");

  const [transactionStarted, setTransactionStarted] = useState<boolean>(false);

  const locationBInputRef = useRef<TextInput>(null);

  const detailInputRef = useRef<TextInput>(null);

  const scrollRef = useRef<ScrollView>(null);

  const router = useRouter();

  const isFocused = useIsFocused();
  const [userLanguage, setUserLanguage] = useState<string>("");
  
  useEffect(() => {
    async function fetchData() {
      setUserLanguage((await AsyncStorage.getItem("userLocale") || "uz") as string);
    }
    fetchData();
  }, [isFocused])

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const scrollToStart = () => {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  const handleCreateData = async () => {
    if (transactionStarted) return;

    setTransactionStarted(true);
    try {
      const response = await fetch('http://167.86.107.247:8080/cargo/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          destinationARegion: destinationARegion || "",
          destinationADistinct: destinationADistinct || "",
          destinationBRegion: destinationBRegion || "",
          destinationBDistinct: destinationBDistinct || "",
          transportType: typeInputValue, 
          comment: detailInputValue,
          phone: "+998917972385"
        })
      });

      console.log("data:", { 
        destinationARegion,
        destinationADistinct,
        destinationBRegion,
        destinationBDistinct,
        transportType: typeInputValue, 
        comment: detailInputValue,
        phone: "+998917972385"
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("newItemCreated", "true");
      }

      setTransactionStarted(false);

      router.push("/");
    } catch (error) {
      console.error('Error creating data:', error);
    }
  }

  const searchAndSetLocationA = async () => {  
    await fetch('http://167.86.107.247:8080/location/search?query=' + locationAInputValue, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => 
      {
        console.log(response)
        return response.json()

      })
    .then(data => {
      console.log(data.length == 0);
      setLocationAReccommendData(data);
    });
  }

  const searchAndSetLocationB = async () => {  
    await fetch('http://167.86.107.247:8080/location/search?query=' + locationBInputValue, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => 
      {
        console.log(response)
        return response.json()

      })
    .then(data => {
      console.log(data.length == 0);
      setLocationBReccommendData(data);
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF"}}>
      <StatusBar
        animated={true}
        backgroundColor="#232325"
        barStyle={'default'}
        showHideTransition={"slide"}
        hidden={false}
      />
      
      <View style={{marginTop: statusBarHeight, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, width: "100%"}}>
        <View style={{ borderRadius: 50, overflow: 'hidden' }}>
          <Pressable
            android_ripple={{ color: "#808080" }}
            style={{ padding: 10 }}
            onPress={() => {
              router.push("/");
            }}
          >
            <ArrowLeftIcon />
          </Pressable>
        </View>

        <Text allowFontScaling={false} style={{fontSize: 14, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>{t("cargoAdd")}</Text>

        <View></View>
      </View>
      
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps={Platform.OS === "ios" ? "never" : "always"} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View style={{ paddingTop: 16, paddingBottom: 70 }}>
          

          <View style={{paddingHorizontal: 38, marginTop: 50, width: "100%"}}>
            <View style={{
              width: "100%", 
              borderColor: focusedInput == "LocationAInput" || locationAInputValue != "" ? "#000000" : "#ADADAD", 
              borderRadius: 10, 
              paddingHorizontal: 12, 
              borderWidth: focusedInput == "LocationAInput" || locationAInputValue != "" ? 1.5 : 1, 
              height: 45, 
              position: "relative", 
              alignItems: "center", 
              justifyContent: "center"
            }}>
              {
                focusedInput == "LocationAInput" || locationAInputValue != "" ? (
                  <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                    <Text allowFontScaling={false} style={{color: "#000000", fontSize: 12}}>{t("from")}</Text>
                  </View>
                ) : (<></>)
              }

              <Text allowFontScaling={false} style={focusedInput != "LocationAInput" && locationAInputValue == "" ? {position: "absolute", top: "25%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>{t("from")}</Text>
              <TextInput 
                onPress={() => {
                  setLocationAReccumendationVisible(true);
                  scrollToStart();
                }}
                style={{width: "100%", height: "100%", marginTop: "7%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"}} 
                onChange={async (e) => {
                  setLocationAInputValue(e.nativeEvent.text)
                  await searchAndSetLocationA();
                }} 
                value={locationAInputValue}
                onFocus={() => setFocusedInput("LocationAInput")} 
                cursorColor={"#000000"}
                onBlur={() => setFocusedInput("")} />
              <Text allowFontScaling={false} style={{color: "#4F4F4F", fontSize: 14, fontFamily: "SfProDisplayRegular"}}></Text>
            </View>
          </View> 

          {
            locationAReccumendationVisible ? (
              <View>
                <FlatList
                  data={locationAReccommendData}
                  keyExtractor={(item) => item.id.toString()}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <Pressable 
                      android_ripple={{ color: "#EFEFEF" }} 
                      onPress={() => {
                        const region = userLanguage == "uz" ? item.locationRegionUz : userLanguage == "ru" ? item.locationRegionRu : item.locationRegionCy;
                        console.log("'" + region + "'");
                        
                        const distinct = userLanguage == "uz" ? item.locationDistinctUz : userLanguage == "ru" ? item.locationDistinctRu : item.locationDistinctCy;
                        
                        setLocationAInputValue(`${region} ${distinct != null ? distinct : ""}`);
                        setLocationAReccumendationVisible(false);
                        setDestinationARegion(region);
                        setDestinationADistinct(distinct);
                      }} 
                      style={{ paddingVertical: 15, paddingHorizontal: 20, height: 50, justifyContent: "center", columnGap: 5, borderBottomColor: "#EFEFEF", borderBottomWidth: 1 }}>
                      <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{userLanguage == "ru" ? item.locationRegionRu : userLanguage == "cy" ? item.locationRegionCy : item.locationRegionUz}</Text>
                      {item.locationDistinctUz != null && <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{userLanguage == "ru" ? item.locationDistinctRu : userLanguage == "cy" ? item.locationDistinctCy : item.locationDistinctUz}</Text>}
                    </Pressable>
                  )}
                  nestedScrollEnabled={true} // ✅ This fixes the nested scroll issue!
                  style={{ maxHeight: 200,  marginTop: 5, marginHorizontal: 38, backgroundColor: "#FBFBFB", borderColor: "#EFEFEF", borderWidth: 1, borderRadius: 8 }} // ✅ Restrict height to avoid layout issues
                />
              </View>
            ) : (<></>)
          }
          
          <View style={{paddingHorizontal: 38, marginTop: 22, width: "100%"}}>
            <View style={{width: "100%", borderColor: focusedInput == "LocationBInput" || locationBInputValue != "" ? "#000000" : "#ADADAD", borderRadius: 10, paddingHorizontal: 12, borderWidth: focusedInput == "LocationBInput" || locationBInputValue != "" ? 1.5 : 1, height: 45, position: "relative", alignItems: "center", justifyContent: "center"}}>
              {
                focusedInput == "LocationBInput" || locationBInputValue != "" ? (
                  <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                    <Text allowFontScaling={false} style={{color: "#000000", fontSize: 12}}>{t("to")}</Text>
                  </View>
                ) : (<></>)
              }

              <Text allowFontScaling={false} style={focusedInput != "LocationBInput" && locationBInputValue == "" ? {position: "absolute", top: "25%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>{t("to")}</Text>
              <TextInput 
                onPress={() => {
                  setLocationBReccumendationVisible(true);
                }}
                ref={locationBInputRef}
                style={{width: "100%", height: "100%", marginTop: "7%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"}} 
                onChange={async (e) => {
                  setLocationBInputValue(e.nativeEvent.text)
                  await searchAndSetLocationB();
                }} 
                value={locationBInputValue}
                onFocus={() => setFocusedInput("LocationBInput")} 
                cursorColor={"#000000"}
                onBlur={() => setFocusedInput("")} />
              <Text allowFontScaling={false} style={{color: "#4F4F4F", fontSize: 14, fontFamily: "SfProDisplayRegular"}}></Text>
            </View>
          </View> 

          
          {
            locationBReccumendationVisible ? (
              <View>
                <FlatList
                  data={locationBReccommendData}
                  keyExtractor={(item) => item.id.toString()}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <Pressable 
                      android_ripple={{ color: "#EFEFEF" }} 
                      onPress={() => {
                        const region = userLanguage == "uz" ? item.locationRegionUz : userLanguage == "ru" ? item.locationRegionRu : item.locationRegionCy;
                        const distinct = userLanguage == "uz" ? item.locationDistinctUz : userLanguage == "ru" ? item.locationDistinctRu : item.locationDistinctCy;
                        setLocationBInputValue(`${region} ${distinct != null ? distinct : ""}`);
                        setLocationBReccumendationVisible(false);
                        setDestinationBRegion(region);
                        setDestinationBDistinct(distinct);
                      }} 
                      style={{ paddingVertical: 15, paddingHorizontal: 20, height: 50, justifyContent: "center", columnGap: 5, borderBottomColor: "#EFEFEF", borderBottomWidth: 1 }}>
                      <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{userLanguage == "uz" ? (item.locationRegionUz) : userLanguage == "ru" ? (item.locationRegionRu) : (item.locationRegionCy)}</Text>
                      {item.locationDistinctUz != null && <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{userLanguage == "uz" ? (item.locationDistinctUz) : userLanguage == "ru" ? (item.locationDistinctRu) : (item.locationDistinctCy)}</Text>}
                    </Pressable>
                  )}
                  nestedScrollEnabled={true} // ✅ This fixes the nested scroll issue!
                  style={{ maxHeight: 200,  marginTop: 5, marginHorizontal: 38, backgroundColor: "#FBFBFB", borderColor: "#EFEFEF", borderWidth: 1, borderRadius: 8 }} // ✅ Restrict height to avoid layout issues
                />
              </View>
            ) : (<></>)
          }

          <View style={{paddingHorizontal: 38, marginTop: 28, width: "100%"}}>
            <View style={{
              width: "100%",
              borderColor: focusedInput == "TypeInput" || typeInputValue != "" ? "#000000" : "#ADADAD", 
              borderRadius: 10, 
              paddingHorizontal: 12, 
              borderWidth: focusedInput == "TypeInput" || typeInputValue != "" ? 1.5 : 1, 
              height: 45, position: "relative", alignItems: "center", justifyContent: "center"}}>
              {
                focusedInput == "TypeInput" || typeInputValue != "" ? (
                  <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                    <Text allowFontScaling={false} style={{color: "#000000", fontSize: 12}}>{t("cargoVehicleType")}</Text>
                  </View>
                ) : (<></>)
              }

              <Text allowFontScaling={false} style={focusedInput != "TypeInput" && typeInputValue == "" ? {position: "absolute", top: "25%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>{t("cargoVehicleType")}</Text>
              <TextInput 
                style={{width: "100%", height: "100%", marginTop: "7%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"}} 
                onChange={(e) => setTypeInputValue(e.nativeEvent.text)} 
                value={typeInputValue}
                onFocus={() => setFocusedInput("TypeInput")} 
                cursorColor={"#000000"}
                onBlur={() => setFocusedInput("")} />
              <Text allowFontScaling={false} style={{color: "#4F4F4F", fontSize: 14, fontFamily: "SfProDisplayRegular"}}></Text>
            </View>

            <Text allowFontScaling={false} style={{color: "#4F4F4F", marginLeft: 18, marginTop: 8, fontSize: 12, fontFamily: "SfProDisplayRegular"}}>{t("ex1")}</Text>
          </View>

          <View style={{paddingHorizontal: 38, marginTop: 28, width: "100%"}}>
            <Pressable 
              onPress={() => {
                detailInputRef.current?.blur();
                detailInputRef.current?.focus();
              }}
              style={{width: "100%", borderColor: focusedInput == "DetailInput" || detailInputValue != "" ? "#000000" : "#ADADAD", borderRadius: 10, paddingHorizontal: 12, borderWidth: focusedInput == "DetailInput" || detailInputValue != "" ? 1.5 : 1, height: 104, position: "relative", 
                justifyContent: "flex-start",   
              }}>
              {
                focusedInput == "DetailInput" || detailInputValue != "" ? (
                  <View style={{position: "absolute", top: "-10%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                    <Text allowFontScaling={false} style={{color: "#000000", fontSize: 12}}>{t("comment")}</Text>
                  </View>
                ) : (<></>)
              }

              <Text allowFontScaling={false} style={focusedInput != "DetailInput" && detailInputValue == "" ? {position: "absolute", top: "20%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>{t("comment")}</Text>
              <TextInput 
                ref={detailInputRef}
                onPress={() => {
                  setFocusedInput("DetailInput");
                  scrollToEnd();
                }}
                value={detailInputValue}
                multiline
                style={{width: "100%", marginTop: 10, fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular", }} 
                onChange={(e) => setDetailInputValue(e.nativeEvent.text)} 
                onFocus={() => setFocusedInput("DetailInput")} 
                cursorColor={"#000000"}
                onBlur={() => setFocusedInput("")} />
            </Pressable>

            <Text allowFontScaling={false} style={{color: "#4F4F4F", marginLeft: 18, marginTop: 8, fontSize: 12, fontFamily: "SfProDisplayRegular"}}>{t("ex2")}</Text>
          </View>

          <View style={{paddingHorizontal: 38, marginTop: 28, width: "100%"}}>
            <View style={{width: "100%", borderColor: "#ADADAD", backgroundColor: "#D9D9D9", borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, height: 45, position: "relative", alignItems: "center", justifyContent: "center"}}>
              <Text allowFontScaling={false} style={{color: "#4F4F4F", fontSize: 14, fontFamily: "SfProDisplayRegular", position: "absolute", left: 18}}>+998 91 797 23 85</Text>
            </View>
          </View>

          <View style={{paddingHorizontal: 38, marginTop: 40}}>
            <View style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
              <Pressable onPress={handleCreateData} style={{width: "100%", height: 50, backgroundColor: "#000000", borderRadius: 12, alignItems: "center", justifyContent: "center"}}>
                <Text allowFontScaling={false} style={{color: "#FFF", fontSize: 14, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>{t("compleate")}</Text>
              </Pressable>
            </View>
          </View>
          
        </View>
      </ScrollView>
    </View>
  );
}