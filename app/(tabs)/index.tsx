import { useIsFocused } from "@react-navigation/native";
import { use } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Index() {
  const isFocused = useIsFocused();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);


  const fetchUsers = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    let userToken = await AsyncStorage.getItem("access_token");

    try {
      const nextPage = page;
      const response = await fetch(`https://dev-api.yoshtadbirkorlar.uz/api/dashboard/users/?page=${nextPage}&page_size=20&is_myid_verified=false&is_verified=false`, {
        headers: {
          Accept: "application/json",
          "Content-Language": "uz",
          Authorization: `Bearer ${userToken}`,
        }
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const data = await response.json();
      const newUsers = data.data.data;

      if (newUsers.length > 0) {
        setUsers(prevUsers => {
          const existingIds = new Set(prevUsers.map(user => user.id));
          const filtered = newUsers.filter(user => !existingIds.has(user.id));
          return [...prevUsers, ...filtered];
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [loading, page]);

  useEffect(() => {
    setPage(prev => prev + 1);
    setLoading(false);
  }, [users]);

  useEffect(() => {
    const checkToken = async () => {
      let userToken = await AsyncStorage.getItem("access_token");
      if (!userToken) {
        router.push("/login");
      }
      
      fetchUsers();
    };

    if (isFocused) {
      checkToken();
    }
  }, [isFocused]);

  return (
    <View style={{  }}>
      <Text>Hello, world!</Text>
      <FlatList
        style={{ marginTop: 16, width: "100%", paddingHorizontal: 16   }}
        data={users}
        keyExtractor={(item) => item?.id?.toString() || ""}
        onEndReached={() => {
          fetchUsers();
        }}

        initialNumToRender={5}

        onEndReachedThreshold={5}
        renderItem={({ item }) => (
          <View style={{ borderRadius: 16, backgroundColor: "#FFF", padding: 12, marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#1A99FF", fontSize: 14}}>{item.first_name.toUpperCase() + " " + item.last_name.toUpperCase()}</Text>

              <Text style={{ fontFamily: "Gilroy-Medium", color: "#44D015", fontSize: 12}}>{item.roles[0]?.name || "-" }</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, gap: 36 }}>
              <View style={{width: 141, }}>
                <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, fontWeight: 400, color: "#8C8D8D" }}>Telefon raqami</Text>
                <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2}}>{item.phone_number || "-"}</Text>
              </View>
              <View style={{width: 141, }}>
                <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, fontWeight: 400, color: "#8C8D8D" }}>Tug'ilgan sana</Text>
                <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2}}>{item.birth_date || "-"}</Text>
              </View>
            </View>


            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 36 }}>
              <View style={{width: 141, }}>
                <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, fontWeight: 400, color: "#8C8D8D" }}>Kraudfanding arizalari</Text>
                <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2}}>{item.crowdfundings_count || "-"}</Text>
              </View>
              <View style={{width: 141, }}>
                <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, fontWeight: 400, color: "#8C8D8D" }}>Startup arizalari</Text>
                <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2}}>{item.startup_applications_count || "-"}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 36 }}>
              <View style={{width: 141, }}>
                <Text style={{ fontFamily: "Gilroy-Regular", fontSize: 12, fontWeight: 400, color: "#8C8D8D" }}>Yaratilgan vaqt</Text>
                <Text style={{ fontFamily: "Gilroy-SemiBold", color: "#474848", fontSize: 12, marginTop: 2}}>{item.created_time}</Text>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={loading ? <Text style={{ textAlign: "center", padding: 16 }}>Loading... {page}</Text> : null}
      />
    </View>
  );
}