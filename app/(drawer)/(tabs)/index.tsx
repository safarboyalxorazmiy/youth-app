import { View, Text, Pressable, ScrollView, StatusBarStyle } from "react-native";
import ArrowRightIcon from "@/assets/images/navbar/ArrowRightIcon.svg";
import TruckDeliverySpeedIcon from "@/assets/images/navbar/TruckDeliverySpeedIcon.svg";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import AnimatedToast from '@/components/AnimatedToast';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "react-native";
import SidebarMenu from "@/assets/images/sidebar-menu-icon.svg";
import SearchIcon from "@/assets/images/search-icon.svg";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer"; // Import DrawerNavigationProp
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const STYLES = ['default', 'dark-content', 'light-content'] as const;
const TRANSITIONS = ['fade', 'slide', 'none'] as const;

import { TextInput } from "react-native-gesture-handler";

export default function Home() {
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  // Handle visiting logic when visited is true
  useEffect(() => {
    handleVisiting();
  }, []);

  // Handle visiting logic
  const handleVisiting = async () => {
    const response = await fetch('https://ipinfo.io/json');
    const data = await response.json();

    fetch('http://167.86.107.247:8080/interest/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip: data.ip, city: data.city, region: data.region }),
    });    
  };

  useEffect(() => {
    async function fetchData() {
      if (await AsyncStorage.getItem("newItemCreated") == "true") {
        setToast({ message: "Yangi ma'lumot qo'shildi", type: "success" }); 
        AsyncStorage.removeItem("newItemCreated");
      }
    }
    fetchData();
  }, [useIsFocused]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#EFEFEF" }}>
      <StatusBar
        animated={true}
        backgroundColor="#232325"
        barStyle={'default'}
        showHideTransition={"slide"}
        hidden={false}
      />

      <ScrollView>
        <View style={{backgroundColor: "#232325", marginTop: 25, height: 69, paddingHorizontal: 22, alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
          <View style={{height: 40, width: 40, borderRadius: 20, overflow: "hidden", alignItems: "center", justifyContent: "center"}}>
            <Pressable style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}} android_ripple={{color: "#4F4F4F"}} onPress={() => navigation.openDrawer()}>
              <SidebarMenu />
            </Pressable>
          </View>

          <Pressable style={{ 
            backgroundColor: "#D9D9D9", 
            width: "70%",
            height: 40, 
            borderRadius: 8, 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "space-between", 
            paddingHorizontal: 14, 
          }}>
            <Text style={{ 
              color: "#000000", 
              fontSize: 18, 
              fontFamily: "SfProDisplayRegular", 
              fontWeight: 400, 
              width: "70%",
              textAlign: "center"
            }}>Yuk qidirish</Text>
            <SearchIcon />
          </Pressable>
        </View>

        <View style={{paddingHorizontal: 30, paddingTop: 17, paddingBottom: 26, backgroundColor: "#FFF"}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 39, width: "100%"}}>
            <View style={{alignItems: "center", justifyContent: "center", width: 86, height: 39, backgroundColor: "#2CA82A", borderRadius: 8}}>
              <Text style={{fontSize: 16, color: "#FFF", fontFamily: "SfProDisplayRegular", fontWeight: 400}}>Yangi</Text>
            </View>

            <Text>20 daqiqa oldin</Text>
          </View>

          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20}}>
            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>

            <ArrowRightIcon />

            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>
          </View>

          <View style={{flexDirection: "row", alignItems: "center", marginTop: 20, columnGap: 10}}>
            <TruckDeliverySpeedIcon />
            <Text style={{fontSize: 20, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Transport turi: ISUZU</Text>
          </View>

          <Pressable style={{alignItems: "center", justifyContent: "center", marginTop: 13, height: 60, backgroundColor: "#000000", borderRadius: 11}}>
            <Text style={{fontSize: 16, fontWeight: 700, fontFamily: "SfProDisplayBold", color: "#FFF"}}>BATAFSIL</Text>
          </Pressable>
        </View>
        
        <View style={{marginTop: 14, paddingHorizontal: 30, paddingTop: 17, paddingBottom: 26, backgroundColor: "#FFF"}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 39, width: "100%"}}>
            <View style={{alignItems: "center", justifyContent: "center", width: 86, height: 39, backgroundColor: "#2CA82A", borderRadius: 8}}>
              <Text style={{fontSize: 16, color: "#FFF", fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Yangi</Text>
            </View>

            <Text>20 daqiqa oldin</Text>
          </View>

          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20}}>
            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>

            <ArrowRightIcon />

            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>
          </View>

          <View style={{flexDirection: "row", alignItems: "center", marginTop: 20, columnGap: 10}}>
            <TruckDeliverySpeedIcon />
            <Text style={{fontSize: 20, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Transport turi: ISUZU</Text>
          </View>

          <Pressable style={{alignItems: "center", justifyContent: "center", marginTop: 13, height: 60, backgroundColor: "#000000", borderRadius: 11}}>
            <Text style={{fontSize: 16, fontWeight: 700, fontFamily: "SfProDisplayBold", color: "#FFF"}}>BATAFSIL</Text>
          </Pressable>
        </View>

        <View style={{marginTop: 14, paddingHorizontal: 30, paddingTop: 17, paddingBottom: 26, backgroundColor: "#FFF"}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 39, width: "100%"}}>
            <View style={{alignItems: "center", justifyContent: "center", width: 86, height: 39, backgroundColor: "#2CA82A", borderRadius: 8}}>
              <Text style={{fontSize: 16, color: "#FFF", fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Yangi</Text>
            </View>

            <Text>20 daqiqa oldin</Text>
          </View>

          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20}}>
            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>

            <ArrowRightIcon />

            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>
          </View>

          <View style={{flexDirection: "row", alignItems: "center", marginTop: 20, columnGap: 10}}>
            <TruckDeliverySpeedIcon />
            <Text style={{fontSize: 20, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Transport turi: ISUZU</Text>
          </View>

          <Pressable style={{alignItems: "center", justifyContent: "center", marginTop: 13, height: 60, backgroundColor: "#000000", borderRadius: 11}}>
            <Text style={{fontSize: 16, fontWeight: 700, fontFamily: "SfProDisplayBold", color: "#FFF"}}>BATAFSIL</Text>
          </Pressable>
        </View>

        <View style={{marginTop: 14, paddingHorizontal: 30, paddingTop: 17, paddingBottom: 26, backgroundColor: "#FFF"}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 39, width: "100%"}}>
            <View style={{alignItems: "center", justifyContent: "center", width: 86, height: 39, backgroundColor: "#2CA82A", borderRadius: 8}}>
              <Text style={{fontSize: 16, color: "#FFF", fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Yangi</Text>
            </View>

            <Text>20 daqiqa oldin</Text>
          </View>

          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20}}>
            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>

            <ArrowRightIcon />

            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>
          </View>

          <View style={{flexDirection: "row", alignItems: "center", marginTop: 20, columnGap: 10}}>
            <TruckDeliverySpeedIcon />
            <Text style={{fontSize: 20, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Transport turi: ISUZU</Text>
          </View>

          <Pressable style={{alignItems: "center", justifyContent: "center", marginTop: 13, height: 60, backgroundColor: "#000000", borderRadius: 11}}>
            <Text style={{fontSize: 16, fontWeight: 700, fontFamily: "SfProDisplayBold", color: "#FFF"}}>BATAFSIL</Text>
          </Pressable>
        </View>

        <View style={{marginTop: 14, paddingHorizontal: 30, paddingTop: 17, paddingBottom: 26, backgroundColor: "#FFF"}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 39, width: "100%"}}>
            <View style={{alignItems: "center", justifyContent: "center", width: 86, height: 39, backgroundColor: "#2CA82A", borderRadius: 8}}>
              <Text style={{fontSize: 16, color: "#FFF", fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Yangi</Text>
            </View>

            <Text>20 daqiqa oldin</Text>
          </View>

          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20}}>
            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>

            <ArrowRightIcon />

            <View style={{width: 105, alignItems: "center"}}>
              <Text style={{fontSize: 25, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Toshkent</Text>
              <Text style={{fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Bekobod</Text>
            </View>
          </View>

          <View style={{flexDirection: "row", alignItems: "center", marginTop: 20, columnGap: 10}}>
            <TruckDeliverySpeedIcon />
            <Text style={{fontSize: 20, fontWeight: 400, fontFamily: "SfProDisplayRegular",}}>Transport turi: ISUZU</Text>
          </View>

          <Pressable style={{alignItems: "center", justifyContent: "center", marginTop: 13, height: 60, backgroundColor: "#000000", borderRadius: 11}}>
            <Text style={{fontSize: 16, fontWeight: 700, fontFamily: "SfProDisplayBold", color: "#FFF"}}>BATAFSIL</Text>
          </Pressable>
        </View>
      </ScrollView>

      {toast && <AnimatedToast message={toast.message} onClose={() => setToast(null)} />}
    </View>
  );
}