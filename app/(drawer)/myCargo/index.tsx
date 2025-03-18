import { FlatList, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import TruckDeliverySpeedIcon from "@/assets/images/navbar/TruckDeliverySpeedIcon.svg";
import ArrowRightIcon from "@/assets/images/navbar/ArrowRightIcon.svg";
import DeleteIcon from "@/assets/images/delete-icon.svg";
import SidebarMenu from "@/assets/images/sidebar-menu-icon.svg";
import SearchIcon from "@/assets/images/search-icon.svg";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useRouter, usePathname } from "expo-router";
import HomeIcon from "@/assets/images/navbar/HomeIcon.svg";
import HomeIconActive from "@/assets/images/navbar/HomeIconActive.svg";
import CargoAddIcon from "@/assets/images/navbar/CargoAddIcon.svg";
import { useEffect, useState } from "react";
import { Dimensions, Appearance } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      <View style={{ marginTop: 4 }}>
        <Skeleton
          colorMode="light"
          colors={["#FFF", "#ECEDEE", "#FFF"]}
          width={screenWidth}
          height={75}
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

export default function MyCargo() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter();
  const pathname = usePathname();

  const [data, setData] = useState<CargoDTO[]>([]);
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(11);
  const [dataFullyLoaded, setDataFullyLoaded] = useState(false);
  
  // useEffect(() => {
  //   handleCargoData();
  // }, []);

  // const handleCargoData = async () => {
  //   try {
  //     const response = await fetch("http://167.86.107.247:8080/cargo/get/by-phone?phone=+998901234567?page=0&size=10&sort=string", {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     const result = await response.json();
  //     setData(result.content);
  //   } catch (error) {
  //     console.error("Error fetching cargo data:", error);
  //   }
  // };

  const isFocused = useIsFocused();
  
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

  useEffect(() => {
    setDataFullyLoaded(false);
    setData([]);
    setPage(0);
    loadCargoData();
  }, [isFocused]);

  const loadCargoData = async () => {
    if (dataFullyLoaded) return;

    try {
      const response = await fetch(`http://167.86.107.247:8080/cargo/get/by-phone?phone=%2B998917972385&page=${page}&size=${size}`, {
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
    <View style={{ backgroundColor: "#232325", height: 69, paddingHorizontal: 22, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ height: 40, width: 40, borderRadius: 20, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
        <Pressable
          style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
          android_ripple={{ color: "#4F4F4F" }}
          onPress={() => navigation.openDrawer()}
        >
          <SidebarMenu />
        </Pressable>
      </View>

      <Pressable
        style={{
          backgroundColor: "#D9D9D9",
          width: "70%",
          height: 40,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 14,
        }}
      >
        <Text style={{ color: "#000000", fontSize: 18, fontFamily: "SfProDisplayRegular", fontWeight: "400", width: "70%", textAlign: "center" }}>Yuk qidirish</Text>
        <SearchIcon />
      </Pressable>
    </View>
  );

  const deleteCargoById = async (id: number) => {
    await AsyncStorage.setItem("itemRemoved", "true");
    
    try {
      console.log("CargoID::", id)
      await fetch(`http://167.86.107.247:8080/cargo/delete?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      setData(data.filter((cargo) => cargo.id !== id));
    } catch (error) {
      console.error("Error deleting cargo:", error);
    }
  };

  const renderItem = ({ item, index }: { item: CargoDTO, index: number }) => (
    <View style={{ marginTop: index === 0 ? 0 : 20, paddingHorizontal: 30, paddingTop: 17, paddingBottom: 26, backgroundColor: "#FFF" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 39, width: "100%" }}>
        <View style={{ alignItems: "center", justifyContent: "center", width: 86, height: 39, backgroundColor: "#2CA82A", borderRadius: 8 }}>
          <Text style={{ fontSize: 16, color: "#FFF", fontFamily: "SfProDisplayBold", fontWeight: "700" }}>Yangi</Text>
        </View>
        <Text>{getTimeAgo(item.createdDate)}</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <View style={{ width: 135, alignItems: "flex-start" }}>
          <Text style={{ fontSize: 25, fontWeight: "700", fontFamily: "SfProDisplayBold",}}  >{item.destinationARegion}</Text>
          {item.destinationADistinct && <Text style={{ fontSize: 18, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.destinationADistinct}</Text>}
        </View>

        <ArrowRightIcon style={{ marginLeft: -20 }} />

        <View style={{ width: 135, alignItems: "flex-start" }}>
          <Text style={{ fontSize: 25, fontWeight: "700", fontFamily: "SfProDisplayBold" }}>{item.destinationBRegion}</Text>
          {item.destinationBDistinct && <Text style={{ fontSize: 18, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>{item.destinationBDistinct}</Text>}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, columnGap: 10 }}>
        <TruckDeliverySpeedIcon />
        <Text style={{ fontSize: 20, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>Transport turi: {item.transportType}</Text>
      </View>

      <View style={{ 
          alignItems: "center",
          justifyContent: "center", 
          marginTop: 13, 
          height: 60, 
          backgroundColor: "#FFEBEB", 
          borderWidth: 0.6, 
          borderColor: "#B00020",
          borderRadius: 11, 
          overflow: "hidden"
        }}>
        <Pressable
          onPress={async () => {
            if (!item) {
              return;
            } 

            await deleteCargoById(item.id)
          }}
          android_ripple={{ color: "#B00020" }}
          style={{ flex: 1, flexDirection: "row", columnGap: 15, width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
          <DeleteIcon />
          <Text style={{ fontSize: 18, fontWeight: "700", fontFamily: "SfProDisplayBold", color: "#B00020" }}>OLIB TASHLASH</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: "#EFEFEF" }}>  
      <ScrollView>
        <StatusBar animated={true} backgroundColor="#232325" barStyle={"default"} showHideTransition={"slide"} hidden={false} />
        
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
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          height: 80,
          backgroundColor: "white",
          borderTopColor: "#D1D1D1",
          borderTopWidth: 0.5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Home Button */}
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            width: "50%", // Adjust width
            paddingLeft: 65,
            height: 60,
          }}
          onPress={() => (pathname === "/" ? {} : router.push("/"))}
        >
          {pathname === "/" ? <HomeIconActive /> : <HomeIcon />}
        </Pressable>

        {/* Cargo Add Button */}
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingRight: 39,
            width: "50%",
            height: 60,
          }}
          onPress={() => router.push("/cargoAdd")}
        >
          <CargoAddIcon />
        </Pressable>
      </View>

    </View>
  )  
}