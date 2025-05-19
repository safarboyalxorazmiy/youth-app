import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import ArrowLeftIcon from "@/assets/images/ArrowLeftIcon.svg";
import { TouchableRipple } from "react-native-paper";

const statusBarHeight = Constants.statusBarHeight;

const PollItem = () => {
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

        <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>PINFL</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{item?.user?.pinfl || ""}</Text>
        </View>

        <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>PINFL</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{item?.user?.passport_series || ""}{item?.user?.passport_number || ""}</Text>
        </View>

        <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>Tug’ilgan sana</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{item?.user?.birth_date || ""}</Text>
        </View>

        <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>Bandlik hoalti</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{
            (item?.has_stable_job == "unemployee" ? "Ishsiz" : item?.has_stable_job == "unofficial_employee" ? "Norasmiy ish bilan band" : item?.has_stable_job == "employee" ? "Ish bilan band" : item?.has_stable_job || "")
          }</Text>
        </View>

        <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>O’zbekistonda ishlash</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{item?.desire_work_uzbekistan == true ? "Ha" : "Yo'q"}</Text>
        </View>

        <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>Kasbiy ta’lim kerak</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{item?.needs_vocational_training == true ? "Ha" : "Yo'q"}</Text>
        </View>

        <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>Kasbiy ta’lim kerak</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{item?.needs_vocational_training == true ? "Ha" : "Yo'q"}</Text>
        </View>

        {/* <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>Filial</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{item?.bank_branch || "null"}</Text>
        </View> */}

        <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>Yaratuvchi</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{item?.created_by.first_name || ""} {item?.created_by.last_name || ""} {item?.created_by.middle_name || ""}</Text>
        </View>

        <View style={{marginTop: 12}}>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", fontWeight: 400, color: "#8C8D8D", marginBottom: 4 }}>Yaratilgan vaqt</Text>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-SemiBold" }}>{formatToUzbekDate(item?.created_time)}</Text>
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

export default PollItem;
