import { View, Text, TextInput, ScrollView, Pressable, FlatList, Dimensions, Platform } from "react-native";

import { useRef, useState } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

import ArrowLeftLightIcon from "@/assets/images/arrow-left-light.svg";
import ArrowRightBottom from "@/assets/images/arrow-right-bottom.svg";
import RefreshIcon from "@/assets/images/refresh-icon.svg";
import LocationDeleteIcon from "@/assets/images/location-delete-icon.svg";
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

export default function CargoSearch() {
  const [focusedInput, setFocusedInput] = useState<String>("");
  const [locationAInputValue, setLocationAInputValue] = useState<string>("");
  const [locationBInputValue, setLocationBInputValue] = useState<string>("");

  type LocationDetails = {
    id: number;
    locationRegion: string;
    locationDistinct: string;
  };

  const [locationAReccommendData, setLocationAReccommendData] = useState<LocationDetails[]>([]);
  const [locationBReccommendData, setLocationBReccommendData] = useState<LocationDetails[]>([]);

  const [locationAReccumendationVisible, setLocationAReccumendationVisible] = useState<boolean>(false);
  const [locationBReccumendationVisible, setLocationBReccumendationVisible] = useState<boolean>(false);

  const [destinationARegion , setDestinationARegion] = useState<string>("");
  const [destinationADistinct , setDestinationADistinct] = useState<string>("");

  const [destinationBRegion , setDestinationBRegion] = useState<string>("");
  const [destinationBDistinct , setDestinationBDistinct] = useState<string>("");

  const locationBInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

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

          <Text allowFontScaling={false} style={{fontSize: 16, fontWeight: 700, fontFamily: "SfProDisplayBold", color: "#FFF"}}>Yuk qidiruvi</Text>

          <View style={{width: 44, height: 44, borderRadius: 8, overflow: "hidden"}}>
            <Pressable onPress={() => {
              AsyncStorage.removeItem("destination");
              router.push("/");
            }} android_ripple={{ color: "#808080" }} style={{backgroundColor: "#0c0c0d", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
              <LocationDeleteIcon />
            </Pressable>
          </View>
      </View>

      <View style={{paddingHorizontal: 38, marginTop: 50, width: "100%"}}>
        <View style={{
          width: "100%", 
          backgroundColor: focusedInput == "LocationAInput" || locationAInputValue != "" ? "#232325" : "#5A5A5A", 
          borderColor: focusedInput == "LocationAInput" || locationAInputValue != "" ? "#FFF" : "#454141", 
          borderRadius: 10, 
          paddingHorizontal: 18, 
          borderWidth: focusedInput == "LocationAInput" || 
          locationAInputValue != "" ? 1.5 : 1, 
          height: 45, 
          position: "relative", 
          alignItems: "center", 
          justifyContent: "center"
        }}>
          {
            focusedInput == "LocationAInput" || locationAInputValue != "" ? (
              <View style={{position: "absolute", top: "-25%", backgroundColor: "#232325", paddingHorizontal: 7, left: 18}}>
                <Text allowFontScaling={false} style={{color: "white", fontSize: 12}}>dan</Text>
              </View>
            ) : (<></>)
          }

          <Text allowFontScaling={false} style={focusedInput != "LocationAInput" && locationAInputValue == "" ? {position: "absolute", top: "25%", color: "#FFF", left: 18, height: "100%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>dan</Text>
          <TextInput 
            onPress={() => {
              setLocationAReccumendationVisible(true);
              scrollToStart();
            }}
            style={{width: "100%", height: "100%", marginTop: "7%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular", color: "#FFF"}} 
            onChange={async (e) => {
              if (e.nativeEvent.text == "") {
                setDestinationADistinct("");
                setDestinationARegion("");
                setLocationAReccumendationVisible(false)
              }

              setLocationAInputValue(e.nativeEvent.text)
              await searchAndSetLocationA();
            }} 
            value={locationAInputValue}
            onFocus={() => setFocusedInput("LocationAInput")} 
            cursorColor={"#FFF"}
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
                    setLocationAInputValue((item.locationRegion == null ? "" : item.locationRegion) + " " + (item.locationDistinct == null ? "" : item.locationDistinct))
                    setLocationAReccumendationVisible(false);
                    setDestinationARegion(item.locationRegion == null ? "" : item.locationRegion);
                    setDestinationADistinct(item.locationDistinct == null ? "" : item.locationDistinct);
                  }} 
                  style={{ paddingVertical: 15, paddingHorizontal: 20, height: 55, justifyContent: "center", columnGap: 5, borderBottomColor: "#EFEFEF", borderBottomWidth: 1 }}>
                  <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.locationRegion}</Text>
                  {item.locationDistinct != null && <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.locationDistinct}</Text>}
                </Pressable>
              )}
              nestedScrollEnabled={true} // ✅ This fixes the nested scroll issue!
              style={{ maxHeight: 200,  marginTop: 5, marginHorizontal: 38, backgroundColor: "#FBFBFB", borderColor: "#EFEFEF", borderWidth: 1, borderRadius: 8 }} // ✅ Restrict height to avoid layout issues
            />
          </View>
        ) : (<></>)
      }
      
      <ArrowRightBottom style={{
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: 15,
        marginBottom: 15
      }} />

      <View style={{paddingHorizontal: 38, marginTop: 22, width: "100%"}}>
        <View style={{
          width: "100%", 
          backgroundColor: focusedInput == "LocationBInput" || locationAInputValue != "" ? "#232325" : "#5A5A5A", 
          borderColor: focusedInput == "LocationBInput" || locationAInputValue != "" ? "#FFF" : "#454141", 
          borderRadius: 10, paddingHorizontal: 18, borderWidth: focusedInput == "LocationBInput" || locationBInputValue != "" ? 1.5 : 1, 
          height: 45, 
          position: "relative", 
          alignItems: "center", 
          justifyContent: "center"
        }}>            
          {
            focusedInput == "LocationBInput" || locationBInputValue != "" ? (
              <View style={{position: "absolute", top: "-25%", backgroundColor: "#232325", paddingHorizontal: 7, left: 18}}>
                <Text allowFontScaling={false} style={{color: "#FFF", fontSize: 12}}>ga</Text>
              </View>
            ) : (<></>)
          }

          <Text allowFontScaling={false} style={
            focusedInput != "LocationBInput" && locationBInputValue == "" ? {
              position: "absolute", 
              top: "25%", 
              color: "#FFF", 
              left: 18, 
              height: "100%", 
              fontSize: 14, 
              fontWeight: 400, 
              fontFamily: "SfProDisplayRegular"
            } : {
              display: "none"
            }}>ga</Text>
            
          <TextInput 
            onPress={() => {
              setLocationBReccumendationVisible(true);
            }}
            ref={locationBInputRef}
            style={{width: "100%", height: "100%", marginTop: "7%", fontSize: 14, fontWeight: 400, fontFamily: "SfProDisplayRegular", color: "#FFF"}} 
            onChange={async (e) => {
              if (e.nativeEvent.text == "") {
                setDestinationBDistinct("");
                setDestinationBRegion("");
                setLocationBReccumendationVisible(false)
              }

              setLocationBInputValue(e.nativeEvent.text);
              await searchAndSetLocationB();
            }} 
            value={locationBInputValue}
            onFocus={() => setFocusedInput("LocationBInput")} 
            cursorColor={"#FFF"}
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
                    setLocationBInputValue((item.locationRegion == null ? "" : item.locationRegion) + " " + (item.locationDistinct == null ? "" : item.locationDistinct))
                    setLocationBReccumendationVisible(false);
                    setDestinationBRegion(item.locationRegion == null ? "" : item.locationRegion);
                    setDestinationBDistinct(item.locationDistinct == null ? "" : item.locationDistinct);
                  }} 
                  style={{ paddingVertical: 15, paddingHorizontal: 20, height: 55, justifyContent: "center", columnGap: 5, borderBottomColor: "#EFEFEF", borderBottomWidth: 1 }}>
                  <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.locationRegion}</Text>
                  {item.locationDistinct != null && <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.locationDistinct}</Text>}
                </Pressable>
              )}
              nestedScrollEnabled={true} // ✅ This fixes the nested scroll issue!
              style={{ maxHeight: 200,  marginTop: 5, marginHorizontal: 38, backgroundColor: "#FBFBFB", borderColor: "#EFEFEF", borderWidth: 1, borderRadius: 8 }} // ✅ Restrict height to avoid layout issues
            />
          </View>
        ) : (<></>)
      }

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
        onPress={() => {
          if (locationAInputValue == "" && locationBInputValue == "") {
            router.push("/");
            return;
          }

          AsyncStorage.setItem("destination", JSON.stringify({
            destinationARegion: destinationARegion,
            destinationADistinct: destinationADistinct,
            destinationBRegion: destinationBRegion,
            destinationBDistinct: destinationBDistinct
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
        <Text allowFontScaling={false} style={{color: "#FFF", fontFamily: "SfProDisplayBold", fontWeight: "700", fontSize: 16}}>KO’RISH</Text>
        <RefreshIcon />
      </Pressable>
      </View>

    </ScrollView>
  );
}