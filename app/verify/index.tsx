import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Verify({ route }: { route: { params: { phone: string; rememberMe: boolean } } }) {
  const { phone, rememberMe } = useLocalSearchParams();

  return (
    <><Text>{phone}</Text></>
  );
}
