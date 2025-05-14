import { useIsFocused } from "@react-navigation/native";
import { use } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import FilterIcon from "@/assets/images/filter-icon.svg";
import AddIcon from "@/assets/images/add-icon.svg";
import UserCard from "@/components/UserCard";

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
      const response = await fetch(`https://dev-api.yoshtadbirkorlar.uz/api/dashboard/users/?page=${nextPage}&page_size=10&is_myid_verified=false&is_verified=false`, {
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
      
      

      <FlatList
        ListHeaderComponent={
          <View style={{ paddingBottom: 16, backgroundColor: "#F5F5F5"}}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFF", padding: 12, borderRadius: 12, marginTop: 16}}>
              <View style={{width: 119, height: 42, borderRadius: 48, overflow: "hidden", display: "flex", flexDirection: "row", }}>
                <Pressable
                  android_ripple={{ color: "#1A99FF1A" }} 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    backgroundColor: "#1A99FF1A", 
                    display: "flex",
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    columnGap: 8
                }}>
                  <FilterIcon />
                  <Text style={{ fontFamily: "Gilroy-Medium", color: "#1A99FF", fontSize: 16, paddingHorizontal: 16, }}>Filter</Text>
                </Pressable>
              </View>

              <View style={{ width: 198, height: 42, borderRadius: 48, overflow: "hidden", display: "flex", flexDirection: "row", }}>
                <Pressable 
                  android_ripple={{ color: "#1A99FF1A" }} 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    backgroundColor: "#1A99FF", 
                    display: "flex",
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    columnGap: 8,
                    paddingHorizontal: 8, 
                    paddingVertical: 12,
                }}>
                  <AddIcon />
                  <Text style={{ fontFamily: "Gilroy-Medium", color: "#FFF", fontSize: 14, }}>Foydalanuvchi qo’shish</Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
        stickyHeaderIndices={[0]} 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ width: "100%", paddingHorizontal: 16   }}
        data={users}
        keyExtractor={(item) => item?.id?.toString() || ""}
        onEndReached={() => {
          fetchUsers();
        }}

        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        onEndReachedThreshold={5}
        renderItem={({ item }) => <UserCard item={item} />}
        removeClippedSubviews={true}
        ListFooterComponent={loading ? <Text style={{ textAlign: "center", padding: 16 }}>Loading... {page}</Text> : null}
      />
    </View>
  );
}