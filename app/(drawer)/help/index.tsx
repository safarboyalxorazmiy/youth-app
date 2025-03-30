import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, Text, ScrollView, View, StatusBar, Linking, Platform } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import CallIcon from "@/assets/images/call-icon.svg";
import MessageIcon from "@/assets/images/message-icon.svg";

import Constants from 'expo-constants';

import { t } from '@/i18n';
import TelegramIcon from "@/assets/images/telegram-icon.svg";
import InstagramIcon from "@/assets/images/instagram-icon.svg";
import ArrowLeftIconLight from "@/assets/images/arrow-left-light.svg";

const statusBarHeight = Constants.statusBarHeight;

export default function Help() { 
  const router = useRouter();
  
  return (
    <ScrollView style={{backgroundColor: "#FFF"}}>
      <StatusBar animated={true} backgroundColor="#232325" barStyle={"default"} showHideTransition={"slide"} hidden={false} />
      
      <View style={{backgroundColor: "#232325", paddingTop: Platform.OS === "ios" ? statusBarHeight : 10, paddingBottom: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, width: "100%"}}>
        <View style={{ borderRadius: 50, overflow: 'hidden' }}>
          <Pressable
            android_ripple={{ color: "#808080" }}
            style={{ padding: 10 }}
            onPress={() => {
              router.push("/");
            }}
          >
            <ArrowLeftIconLight />
          </Pressable>
        </View>

        <View></View>

        <View></View>
      </View>

      <View style={{paddingHorizontal: 20}}>
        <Text allowFontScaling={false} style={{fontSize: 20, fontWeight: "700", fontFamily: "SfProDisplayBold", marginTop: statusBarHeight + 16, marginBottom: 16, textAlign: "left"}}>{t("forContact")}</Text>
        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              backgroundColor: "#2CA82A",
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 10
            },
          ]}
          onPress={() => Linking.openURL(`tel:+998974000774`)}
        >
          <CallIcon />
          <Text style={{ color: "#FFF", fontSize: 16, fontFamily: "SfProDisplayBold" }}>+998 97 400 07 74</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              borderColor: "#4F74CA",
              borderWidth: 2,
              backgroundColor: "#FFF",
              borderRadius: 12,
              padding: 16,
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 10
            },
          ]}
          onPress={() => Linking.openURL(`https://t.me/@e_yukbot`)}
        >
          <MessageIcon />
          <Text style={{ color: "#4F74CA", fontSize: 16, fontFamily: "SfProDisplayBold" }}>{t("telegram")}</Text>
        </Pressable>

        <Text allowFontScaling={false} style={{fontSize: 20, fontWeight: "700", fontFamily: "SfProDisplayBold", marginTop: statusBarHeight + 16, marginBottom: 16, textAlign: "left"}}>{t("socialNetworks")}</Text>
        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              backgroundColor: "#C836AB",
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 12
            },
          ]}
          onPress={() => Linking.openURL(`https://www.instagram.com/@eyuk_app/`)}
        >
          <InstagramIcon />
          <Text style={{ color: "#FFF", fontSize: 16, fontFamily: "SfProDisplayBold" }}>{t("instagram")}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              backgroundColor: "#4F74CA",
              borderRadius: 12,
              padding: 16,
              marginTop: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 12
            },
          ]}
          onPress={() => Linking.openURL(`https://t.me/eyuk_app`)}
        >
          <TelegramIcon />
          <Text style={{ color: "#FFF", fontSize: 16, fontFamily: "SfProDisplayBold" }}>{t("telegram")}</Text>
        </Pressable>
      </View>

    </ScrollView>
  )
}