import { Tabs, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { useRouteInfo } from "expo-router/build/hooks";
import { StatusBar } from "react-native";
import UsersIcon from "@/assets/images/navbar/users-icon.svg";
import UsersIconActive from "@/assets/images/navbar/users-icon-active.svg";
import PollIcon from "@/assets/images/navbar/poll-icon.svg";
import PollIconActive from "@/assets/images/navbar/poll-icon-active.svg";
import ProfileIcon from "@/assets/images/navbar/profile-icon.svg";
import ProfileIconActive from "@/assets/images/navbar/profile-icon-active.svg";

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const routeInfo = useRouteInfo();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ height: "100%", paddingBottom: insets.bottom}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          tabBarStyle: {
            height: 84, // Adjust height as needed
            paddingTop: 0, // Ensure icons/text align properly
            paddingBottom: 0, // Ensure icons/text align properly
            // paddingLeft: 65,
            // paddingRight: 39,
            // backgroundColor: "white",
            elevation: 0, // Optional: Adds shadow effect for better UI
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            backgroundColor: "white",

            borderTopColor: "#D1D1D1",
            borderTopWidth: 0.5,
            paddingHorizontal: 12
          },      
          headerStyle: {
            borderWidth: 0,
            elevation: 0,
            shadowOpacity: 0
          },
          headerLeft: () => (
            <View>

            </View>
          ),
          headerTitle: () => (
            <View>
              
              
            </View>
          ),
          headerRight: () => (
            <View
              // style={{
              //   paddingRight: 8,
              //   display: "flex",
              //   flexDirection: "row",
              //   alignItems: "center"
              // }}
            ></View>
          )
        }}
      >
        {/* 🌟 LOGO (Home) */}
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarButton: () => (
              <Pressable
                style={{
                  // width: "50%", // Adjust width
                  // backgroundColor:"red",
                  // paddingLeft: 65,
                  height: 84, // Adjust height  
                  flexDirection: "column",
                  rowGap: 4,
                  columnGap: 13,
                  // backgroundColor: "red",
                    justifyContent: "center",
                  alignItems: "center",
                      // width: "100%",
                      // height: "100%",
      
                }}
                onPress={() => {
                  router.push("/")
                }}>
                {routeInfo.pathname === "/" ? (
                  <View>
                    <UsersIconActive />
                  </View>
                ) : (
                  <View>
                    <UsersIcon />
                  </View>
                )}
                <Text style={[{ fontSize: 12, fontFamily: "Gilroy-Medium", fontWeight: 500}, routeInfo.pathname === "/" ? { color: "#1A99FF", fontFamily: "Gilroy-SemiBold"} : { color: "#D2D2D2"}]}>Foydalanuvchilar</Text>
              </Pressable>
            ),
            animation: "shift"
          }}
        />

        {/* 🌟 LOGO (Poll) */}
        <Tabs.Screen
          name="poll"
          options={{
            headerShown: false,
            title: "",
            tabBarLabelStyle: {
              display: "none"
            },
            tabBarButton: () => (
              <View style={{
                width: "100%",
                height: 84,
                justifyContent: "center",
                alignItems: "center",
                // paddingRight: 39,
              }}>
                <View style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  height: 84,
                  // width: 133,
                }}>
                  <Pressable
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      rowGap: 4,
                      columnGap: 13,
                      width: "100%",
                      height: "100%",
                    }}
                    onPress={() => router.push("./poll")}>
                    { 
                      routeInfo.pathname === "/poll" ? (
                        <PollIconActive />
                      ) : (
                        <PollIcon />
                      )
                    }
                    <Text style={[{ fontSize: 12, fontFamily: "Gilroy-Medium", fontWeight: 500}, routeInfo.pathname === "/poll" ? { color: "#1A99FF", fontFamily: "Gilroy-SemiBold"} : { color: "#D2D2D2"}]}>So’rovnoma</Text>
                  </Pressable>
                </View>
              </View>
            ),
            animation: "shift"
          }}
        />

        {/* 🌟 LOGO (CargoAdd) */}
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "",
            tabBarLabelStyle: {
              display: "none"
            },
            tabBarButton: () => (
              <View style={{
                width: "100%",
                height: 84,
                justifyContent: "center",
                alignItems: "center",
                // paddingRight: 39,
              }}>
                <View style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  height: 84,
                  // width: 133,
                }}>
                  <Pressable
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      rowGap: 4,
                      columnGap: 13,
                      width: "100%",
                      height: "100%",
                    }}
                    onPress={() => router.push("/profile")}
                  >
                    {routeInfo.pathname === "/profile" ? (
                      <View>
                        <ProfileIconActive />
                      </View>
                    ) : (
                      <View>
                        <ProfileIcon />
                      </View>
                    )}
                    <Text style={[{ fontSize: 12, fontFamily: "Gilroy-Medium", fontWeight: 500}, routeInfo.pathname === "/profile" ? { color: "#1A99FF", fontFamily: "Gilroy-SemiBold"} : { color: "#D2D2D2"}]}>Profil</Text>
                  </Pressable>
                </View>
              </View>
            ),
            animation: "shift"
          }}
        />
        
      </Tabs>
    </View>
  );
}