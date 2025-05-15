// components/UserCard.tsx
import React from "react";
import { View, Text } from "react-native";

interface Props {
  item: any; // 👈 item is any
}

const formatToUzbekDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const UserCard = ({ item }: Props) => {
  return (
    <View style={{ borderRadius: 16, backgroundColor: "#FFF", padding: 12, marginBottom: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 36 }}>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>To’liq ismi</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {item.user.first_name || ""} {item.user.last_name || ""}
          </Text>
        </View>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>Pasport</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {item.user.passport_series || ""}{item.user.passport_number || ""}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 36 }}>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>PINFL</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {item.user.pinfl || "-"}
          </Text>
        </View>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>Bandlik hoalti</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {item.has_stable_job == "unemployee" ? "ishsiz" : item.has_stable_job == "unofficial_employee" ? "Norasmiy ish bilan band" : item.has_stable_job}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 36 }}>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>Viloyat</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            -
          </Text>
        </View>
        
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>Yaratilgan vaqt</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {formatToUzbekDate(item.created_time)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(UserCard);
