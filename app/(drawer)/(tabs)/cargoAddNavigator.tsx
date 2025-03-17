import { router } from "expo-router";
import { useEffect } from "react";
import { useIsFocused } from '@react-navigation/native';

export default function CargoAddNavigator() {
  const isFocused = useIsFocused();
  
  useEffect(() => {
    router.push("/cargoAdd");
  }, [isFocused])
  return (
    <></>
  )
}