import { useIsFocused } from "@react-navigation/native";
import { use } from "i18next";
import { useEffect } from "react";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function App() {
  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      let userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        router.push("/login")
      } 
    };

    if (isFocused) {
      checkToken();
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hello, world!</Text>
    </View>
  );
}