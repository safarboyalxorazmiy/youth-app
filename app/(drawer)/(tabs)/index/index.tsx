import React, { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, StatusBar, Platform } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SidebarMenu from "@/assets/images/sidebar-menu-icon.svg";
import SearchIcon from "@/assets/images/search-icon.svg";
import CrossIcon from "@/assets/images/cross-icon.svg";
import ArrowRightIcon from "@/assets/images/navbar/ArrowRightIcon.svg";
import TruckDeliverySpeedIcon from "@/assets/images/navbar/TruckDeliverySpeedIcon.svg";
import AnimatedToast from "@/components/AnimatedToast";
import { Dimensions, Appearance } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import moment from "moment";
import { useRouter } from "expo-router";
import ArrowRightIconSm from "@/assets/images/arrow-right-sm.svg";
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { Redirect } from 'expo-router';
import { useRouteInfo } from "expo-router/build/hooks";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Constants from 'expo-constants';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import NewBadge from './NewBadge';
import LiveTimeAgo from "./LiveTimeAgo";

const statusBarHeight = Constants.statusBarHeight;

const screenWidth = Dimensions.get("window").width;

const SkeletonLoader = () => {
  return (
    <View style={{
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      gap: 12,
      marginTop: 14,
    }}>
      <View style={{ marginTop: 4, rowGap: 20 }}>
        <Skeleton
          colorMode="light"
          // colors={["#FFF", "#ECEDEE", "#FFF"]}
          width={screenWidth}
          height={205}
        />

        <Skeleton
          colorMode="light"
          // colors={["#FFF", "#ECEDEE", "#FFF"]}
          width={screenWidth}
          height={205}
        />

        <Skeleton
          colorMode="light"
          // colors={["#FFF", "#ECEDEE", "#FFF"]}
          width={screenWidth}
          height={205}
        />

        <Skeleton
          colorMode="light"
          // colors={["#FFF", "#ECEDEE", "#FFF"]}
          width={screenWidth}
          height={205}
        />

        <Skeleton
          colorMode="light"
          // colors={["#FFF", "#ECEDEE", "#FFF"]}
          width={screenWidth}
          height={205}
        />
      </View>
    </View>
  );
};

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

type Destination = {
  destinationARegion: string;
  destinationADistinct: string;
  destinationBRegion: string;
  destinationBDistinct: string;
}
export default function Home() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [data, setData] = useState<CargoDTO[]>([]);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(11);
  const [dataFullyLoaded, setDataFullyLoaded] = useState(false);

  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);

  const router = useRouter();
  const isFocused = useIsFocused();
  const [hasToken, setHasToken] = useState(false);
  const [checkedToken, setCheckedToken] = useState(false);
  const routeInfo = useRouteInfo();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log("Statusbar height", statusBarHeight);
    // handleVisiting();
    // loadCargoData();

    const checkToken = async () => {
      // await AsyncStorage.removeItem("token");

      const token = await AsyncStorage.getItem('token');
      console.log("token", !!token);
      setHasToken(!!token);
      setCheckedToken(true); 

      if (!!token) {
        console.log("routeInfo.pathname", routeInfo.pathname);
        if ((await AsyncStorage.getItem("fromRoute")) === "Verify") {
          routeInfo.pathname === "/"
          ? {}
          : router.push("/")

          await AsyncStorage.removeItem("fromRoute");
        }
      }
    };

    checkToken();

    const startSocket = async () => {
      const socket = new SockJS('http://167.86.107.247:8080/ws-cargo');
      
      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('Connected to WebSocket');
          stompClient.subscribe('/topic/new-cargo', async (message) => {
            const newCargo = JSON.parse(message.body);
          
            console.log('New Cargo:', newCargo);
          
            const destination = await AsyncStorage.getItem("destination");
            if (destination != null) {
              return;
            }
          
            setData((prevData) => [newCargo, ...prevData]);
          });          
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
        },
      });
  
      stompClient.activate();
  
      return () => {
        stompClient.deactivate();
      };
    }

    startSocket();
  }, []);



  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("token", !!token);
      setHasToken(!!token);
      setCheckedToken(true); 

      if (!!token) {
        console.log("routeInfo.pathname", routeInfo.pathname);
        if ((await AsyncStorage.getItem("fromRoute")) === "Verify") {
          routeInfo.pathname === "/"
          ? {}
          : router.push("/")

          await AsyncStorage.removeItem("fromRoute");
          return;
        }
      }
    };

    checkToken();

    async function fetchData() {
      // AsyncStorage.removeItem("token");

      if ((await AsyncStorage.getItem("itemRemoved")) === "true") {
        console.log("itemRemoved", "true")
        await AsyncStorage.removeItem("itemRemoved");
        await AsyncStorage.removeItem("destination");
        setCurrentDestination(null);
        setPage(0);
        setData([]);
        setDataFullyLoaded(false);

        await loadCargoData();
        return;
      }

      if ((await AsyncStorage.getItem("newItemCreated")) === "true") {
        setToast({ message: "Yangi ma'lumot qo'shildi", type: "success" });
        AsyncStorage.removeItem("newItemCreated");

        if ((await AsyncStorage.getItem("destination")) != null) {
          await AsyncStorage.removeItem("destination");
          setCurrentDestination(null);
          setPage(0);
          setData([]);
          setDataFullyLoaded(false);

          await loadCargoData();
          return;
        }

        // try {
        //   const response = await fetch(`http://167.86.107.247:8080/cargo/get?page=${0}&size=${1}&sort=string`, {
        //     method: "GET",
        //     headers: { "Content-Type": "application/json" },
        //   });

        //   const result = await response.json();
        //   setData([result.content[0], ...data]);          
        // } catch (error) {
        //   console.error("Error fetching cargo data:", error);
        // }
      }

      try {
        const destinationString = await AsyncStorage.getItem("destination");
        if (destinationString != null) {
          let destination = JSON.parse(destinationString);

          setCurrentDestination(destination);
          setPage(0);
          setData([]);

          const response = await fetch(`http://167.86.107.247:8080/cargo/get/by-location`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              destinationARegion: destination.destinationARegion,
              destinationADistinct: destination.destinationADistinct,
              destinationBRegion: destination.destinationBRegion,
              destinationBDistinct: destination.destinationBDistinct,
              page: 0,
              size: 11
            })
          });

          const result = await response.json();
          setData(result.content);

          if (result.last) {
            setDataFullyLoaded(true);
          }
        } else {
          if (currentDestination != null) {
            setCurrentDestination(null);
            setPage(0);
            setData([]);
            setDataFullyLoaded(false);
            await loadCargoData();
          }
        }
      } catch (error) {
        console.error("Error handling destination:", error);
      }
    }
    
    fetchData();
  }, [isFocused]);

  const handleVisiting = async () => {
    try {
      const deviceId = Application.getAndroidId() || Application.getIosIdForVendorAsync();

      const response = await fetch("https://ipinfo.io/json");
      const data = await response.json();

      fetch("http://167.86.107.247:8080/interest/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ip: data.ip, 
          city: data.city, 
          region: data.region,
          deviceId: deviceId,
          model: Device.modelName,
          brand: Device.brand,
          systemVersion: Device.osVersion,
          timezone: "",
         }),
      });
    } catch (error) {
      console.error("Error in handleVisiting:", error);
    }
  };

  const loadCargoData = async () => {
    if (dataFullyLoaded) return;

    try {
      const response = await fetch(`http://167.86.107.247:8080/cargo/get?page=${page}&size=${size}&sort=string`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      setData(data.concat(result.content));
      setPage(page + 1);
      
      if (result.last) {
        setDataFullyLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching cargo data:", error);
    }
  };

  const renderHeader = () => (
    <View>
      {
        currentDestination != null && (
          <View style={{marginTop: 4, paddingHorizontal: 20, paddingVertical: 30, flexDirection: "row", columnGap: 18, alignItems: "center", justifyContent: "center"}}>
            <View>
              <Text allowFontScaling={false} style={{color: "#000", fontFamily: "SfProDisplayRegular", fontSize: 12}}>{currentDestination.destinationARegion} </Text>
              <Text allowFontScaling={false} style={{color: "#000", fontFamily: "SfProDisplayRegular", fontSize: 12}}>{currentDestination.destinationADistinct}</Text>
            </View>

            <ArrowRightIconSm />

            <View>
              <Text allowFontScaling={false} style={{color: "#000", fontFamily: "SfProDisplayRegular", fontSize: 12}}>{currentDestination.destinationBRegion}</Text>
              <Text allowFontScaling={false} style={{color: "#000", fontFamily: "SfProDisplayRegular", fontSize: 12}}>{currentDestination.destinationBDistinct}</Text>
            </View>
          </View>
        )
      }

    </View>
  );

  function getTimeAgo(createdDate: string): string {
    const createdTime = moment(createdDate);
    const now = moment();
    const diffMinutes = now.diff(createdTime, "minutes");
    const diffHours = now.diff(createdTime, "hours");
    const diffDays = now.diff(createdTime, "days");

    if (diffMinutes < 60) {
      return `${diffMinutes} daqiqa oldin`;
    } else if (diffHours < 24) {
      return `${diffHours} soat oldin`;
    } else {
      return `${diffDays} kun oldin`;
    }
  } 

  // const isItemNew = (createdDate: string | null) => {
  //   if (!createdDate) return false;
  //   const createdAt = new Date(createdDate).getTime();
  //   const now = Date.now();
  //   const diffInMinutes = (now - createdAt) / 60000;
  //   return diffInMinutes <= 20;
  // };

  // const renderItem = ({ item, index }: { item: CargoDTO, index: number }) => (
  //   <View style={{ marginTop: index === 0 ? 0 : 20, paddingHorizontal: 30, paddingTop: 10, paddingBottom: 16, backgroundColor: "#FFF" }}>
  //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 39, width: "100%" }}>
  //       {
  //         item.createdDate != null && item.createdDate
  //         <View style={{ alignItems: "center", justifyContent: "center", width: 56, height: 30, backgroundColor: "#2CA82A", borderRadius: 8 }}>
  //           <Text allowFontScaling={false} style={{ fontSize: 12, color: "#FFF", fontFamily: "SfProDisplayBold", fontWeight: "700" }}>Yangi</Text>
  //         </View>
  //       }
  //       <Text allowFontScaling={false} style={{ fontSize: 12, fontFamily: "SfProDisplayRegular"}}>{getTimeAgo(item.createdDate)}</Text>
  //     </View>

      // <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 }}>
      //   <View style={{ width: 135, alignItems: "flex-start" }}>
      //     <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "700", fontFamily: "SfProDisplayBold",}}  >{item.destinationARegion}</Text>
      //     {item.destinationADistinct && <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.destinationADistinct}</Text>}
      //   </View>

      //   <ArrowRightIcon style={{ marginLeft: -20 }} />

      //   <View style={{ width: 135, alignItems: "flex-start" }}>
      //     <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "700", fontFamily: "SfProDisplayBold" }}>{item.destinationBRegion}</Text>
      //     {item.destinationBDistinct && <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.destinationBDistinct}</Text>}
      //   </View>
      // </View>

      // <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15, columnGap: 10 }}>
      //   <TruckDeliverySpeedIcon />
      //   <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>Transport turi: {item.transportType}</Text>
      // </View>

      // <View style={{height: 45, width: "100%", marginTop: 13, borderRadius: 11, overflow: "hidden"}}>
      //   <Pressable 
      //     android_ripple={{ color: "#808080" }}
      //     onPress={async () => {
      //       await AsyncStorage.setItem("cargoData", JSON.stringify(item));
      //       navigation.navigate("cargoDetail");
      //     }} 
      //     style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#000000" }}>
      //     <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "700", fontFamily: "SfProDisplayBold", color: "#FFF" }}>BATAFSIL</Text>
      //   </Pressable>
      // </View>
  //   </View>
  // );


  const renderItem = ({ item, index }: { item: CargoDTO, index: number }) => (
    <View style={{
      marginTop: index === 0 ? 0 : 20,
      paddingHorizontal: 30,
      paddingTop: 10,
      paddingBottom: 16,
      backgroundColor: "#FFF"
    }}>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 39,
        width: "100%"
      }}>
        <NewBadge createdDate={item.createdDate} />

        <LiveTimeAgo createdDate={item.createdDate} />
      </View>


      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 }}>
        <View style={{ width: 135, alignItems: "flex-start" }}>
          <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "700", fontFamily: "SfProDisplayBold",}}  >{item.destinationARegion}</Text>
          {item.destinationADistinct && <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.destinationADistinct}</Text>}
        </View>

        <ArrowRightIcon style={{ marginLeft: -20 }} />

        <View style={{ width: 135, alignItems: "flex-start" }}>
          <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "700", fontFamily: "SfProDisplayBold" }}>{item.destinationBRegion}</Text>
          {item.destinationBDistinct && <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.destinationBDistinct}</Text>}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15, columnGap: 10 }}>
        <TruckDeliverySpeedIcon />
        <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>Transport turi: {item.transportType}</Text>
      </View>

      <View style={{height: 45, width: "100%", marginTop: 13, borderRadius: 11, overflow: "hidden"}}>
        <Pressable 
          android_ripple={{ color: "#808080" }}
          onPress={async () => {
            await AsyncStorage.setItem("cargoData", JSON.stringify(item));
            navigation.navigate("cargoDetail");
          }} 
          style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#000000" }}>
          <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "700", fontFamily: "SfProDisplayBold", color: "#FFF" }}>BATAFSIL</Text>
        </Pressable>
      </View>
    </View>
  );


  if (!checkedToken) {
    return null;
  }
  
  return hasToken ?  (
    <View style={{ flex: 1, backgroundColor: "#EFEFEF" }}>
      <StatusBar animated={true} backgroundColor="#232325" barStyle={"default"} showHideTransition={"slide"} hidden={false} />

      <View style={{ marginTop: Platform.OS === "ios" ? statusBarHeight : 0, backgroundColor: "#232325", height: 69, paddingHorizontal: 22, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ height: 40, width: 40, borderRadius: 20, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
          <Pressable
            style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
            android_ripple={{ color: "#4F4F4F" }}
            onPress={() => navigation.openDrawer()}
          >
            <SidebarMenu />
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
            <Text allowFontScaling={false} style={{ fontSize: 14, fontFamily: "SfProDisplayRegular", color: "#fff", fontWeight: "400", width: "70%", textAlign: "center" }} numberOfLines={1}>{currentDestination != null ? `${currentDestination.destinationARegion} - ${currentDestination.destinationBRegion}` : "Qidiruv"}</Text>
            {
              currentDestination != null ? (
                <CrossIcon />
              ): (
                <SearchIcon />
              )
          }
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        onEndReached={loadCargoData}
        onEndReachedThreshold={1}
        ListFooterComponent={
          dataFullyLoaded ? <></> : <SkeletonLoader />
        }
      />

      {toast && <AnimatedToast message={toast.message} onClose={() => setToast(null)} />}
    </View>
  ) : <Redirect href="/login" />;
}