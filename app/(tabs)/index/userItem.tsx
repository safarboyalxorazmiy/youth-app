import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import ArrowLeftIcon from "@/assets/images/ArrowLeftIcon.svg";
import { TouchableRipple } from "react-native-paper";

const statusBarHeight = Constants.statusBarHeight;

const UserItem = () => {
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item as string) : null;

  // useEffect(() => {
  //   console.log(item);
  // }, []);

  const router = useRouter();

  
  const formatToUzbekDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  return (
    <ScrollView style={{ marginTop: statusBarHeight, height: "100%", padding: 16, }}>
      <TouchableRipple onPress={() => {
        router.push("/poll");
      }} borderless={true} style={{ backgroundColor: "#FFF",  borderRadius: 8, marginBottom: 16, }}>
        <View style={{flexDirection: "row", alignItems: "center", padding: 12, height: 46, borderRadius: 8, columnGap: 8}}>
          <ArrowLeftIcon />

          <Text style={{fontSize: 18, fontFamily: "Gilroy-SemiBold"}}>Batafsil</Text>
        </View>
      </TouchableRipple>

      <View style={{padding: 12, backgroundColor: "#FFFFFF", borderRadius: 16 }}>
        <View>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>To’liq ismi</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{item?.user?.first_name || ""} {item?.user?.last_name || ""} {item?.user?.middle_name || ""}</Text>
        </View>


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'red',
    borderRadius: 8,
    marginBottom: 8,
    height: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserItem;
