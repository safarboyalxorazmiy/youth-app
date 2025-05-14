// components/UserCard.tsx
import React from "react";
import { View, Text } from "react-native";

interface Props {
  item: any; // 👈 item is any
}

const UserCard = ({ item }: Props) => {
  return (
    <View style={{ borderRadius: 16, backgroundColor: "#FFF", padding: 12, marginBottom: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#1A99FF", fontSize: 14 }}>
          {item.first_name.toUpperCase() + " " + item.last_name.toUpperCase()}
        </Text>
        <Text style={{ fontFamily: "Gilroy-Medium", color: "#44D015", fontSize: 12 }}>
          {item.roles?.[0]?.name || "-"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, gap: 36 }}>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>Telefon raqami</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {item.phone_number || "-"}
          </Text>
        </View>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>Tug'ilgan sana</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {item.birth_date || "-"}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 36 }}>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>Kraudfanding arizalari</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {item.crowdfundings_count || "-"}
          </Text>
        </View>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>Startup arizalari</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {item.startup_applications_count || "-"}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 36 }}>
        <View style={{ width: 141 }}>
          <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, color: "#8C8D8D" }}>Yaratilgan vaqt</Text>
          <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2 }}>
            {item.created_time}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(UserCard);
