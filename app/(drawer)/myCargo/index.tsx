import { Pressable, ScrollView, Text, View } from "react-native";
import TruckDeliverySpeedIcon from "@/assets/images/navbar/TruckDeliverySpeedIcon.svg";
import ArrowRightIcon from "@/assets/images/navbar/ArrowRightIcon.svg";
import DeleteIcon from "@/assets/images/delete-icon.svg";
import SidebarMenu from "@/assets/images/sidebar-menu-icon.svg";
import SearchIcon from "@/assets/images/search-icon.svg";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useRouter, usePathname } from "expo-router";
import HomeIcon from "@/assets/images/navbar/HomeIcon.svg";
import HomeIconActive from "@/assets/images/navbar/HomeIconActive.svg";
import CargoAddIcon from "@/assets/images/navbar/CargoAddIcon.svg";

export default function MyCargo() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={{flex: 1, backgroundColor: "#EFEFEF" }}>  
      <ScrollView>
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

        <View style={{ marginTop: 14, paddingHorizontal: 30, paddingTop: 17, paddingBottom: 26, backgroundColor: "#FFF" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 39, width: "100%" }}>
            <View style={{ alignItems: "center", justifyContent: "center", width: 86, height: 39, backgroundColor: "#2CA82A", borderRadius: 8 }}>
              <Text style={{ fontSize: 16, color: "#FFF", fontFamily: "SfProDisplayBold", fontWeight: "700" }}>Yangi</Text>
            </View>
            <Text>20 daqiqa oldin</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <View style={{ width: 105, alignItems: "center" }}>
              <Text style={{ fontSize: 25, fontWeight: "700", fontFamily: "SfProDisplayBold" }}>Toshkent</Text>
              <Text style={{ fontSize: 18, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>Bekobod</Text>
            </View>

            <ArrowRightIcon />

            <View style={{ width: 105, alignItems: "center" }}>
              <Text style={{ fontSize: 25, fontWeight: "700", fontFamily: "SfProDisplayBold" }}>Samarqand</Text>
              <Text style={{ fontSize: 18, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>Urgut</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, columnGap: 10 }}>
            <TruckDeliverySpeedIcon />
            <Text style={{ fontSize: 20, fontWeight: "400", fontFamily: "SfProDisplayRegular" }}>Transport turi: ISUZU</Text>
          </View>

          <Pressable style={{ 
            alignItems: "center",
            justifyContent: "center", 
            marginTop: 13, 
            height: 60, 
            backgroundColor: "#FFEBEB", 
            borderWidth: 0.6, 
            borderColor: "#B00020",
            borderRadius: 11, 
            flexDirection: "row", 
            columnGap: 15 
          }}>
            <DeleteIcon />
            <Text style={{ fontSize: 18, fontWeight: "700", fontFamily: "SfProDisplayBold", color: "#B00020" }}>OLIB TASHLASH</Text>
          </Pressable>
        </View>
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