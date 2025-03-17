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
import HomeIcon from "@/assets/images/navbar/HomeIcon.svg";
import HomeIconActive from "@/assets/images/navbar/HomeIconActive.svg";
import CargoAddIcon from "@/assets/images/navbar/CargoAddIcon.svg";

export default function TabLayout() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const routeInfo = useRouteInfo();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <Tabs
        // initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          tabBarStyle: {
            height: 80, // Adjust height as needed
            paddingTop: 10, // Ensure icons/text align properly
            paddingBottom: 10, // Ensure icons/text align properly
            // paddingLeft: 65,
            // paddingRight: 39,
            backgroundColor: "white",
            elevation: 0, // Optional: Adds shadow effect for better UI
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            borderTopColor: "#D1D1D1",
            borderTopWidth: 0.5,
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
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50%", // Adjust width
                  // backgroundColor:"red",
                  paddingLeft: 65,
                  height: 60, // Adjust height        
                }}
                onPress={() =>
                  routeInfo.pathname === "/"
                    ? {}
                    : router.push("/")
                }
              >
                {routeInfo.pathname === "/" ? (
                  <View>
                    <HomeIconActive />
                  </View>
                ) : (
                  <View>
                    <HomeIcon />
                  </View>
                )}
              </Pressable>
            )
          }}
        />

        {/* 🌟 LOGO (CargoAdd) */}
        <Tabs.Screen
          name="cargoAddNavigator"
          options={{
            headerShown: false,
            title: "",
            tabBarLabelStyle: {
              display: "none"
            },
            tabBarButton: () => (
              <Pressable
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // backgroundColor:"red",
                  paddingRight: 39,
                  width: "100%",
                  height: 60,
                }}
                onPress={() => router.push("/cargoAdd")}
              >
                <CargoAddIcon />
              </Pressable>
            )
          }}
        />
      </Tabs>
    </>
  );
}