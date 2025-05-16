import { useIsFocused } from "@react-navigation/native";
import { use } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import FilterIcon from "@/assets/images/filter-icon.svg";
import SearchIcon from "@/assets/images/search-icon.svg";
import UserCard from "@/components/UserCard";
import PollCard from "@/components/PollCard";
import UserSkeleton from "@/components/UserSkeleton";

export default function Poll() {
  const isFocused = useIsFocused();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    let userToken = await AsyncStorage.getItem("access_token");

    try {
      const nextPage = page;
      const response = await fetch(`https://dev-api.yoshtadbirkorlar.uz/api/dashboard/youth-survey/?desire_work_uzbekistan=&has_stable_job=&needs_vocational_training=&page=${page}&page_size=10&region=&abroad_country=&search=&created_by=&bank_branch=&status=&start_created_time=&purpose=`, {
        headers: {
          Accept: "application/json",
          "Content-Language": "uz",
          Authorization: `Bearer ${userToken}`,
        }
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const data = await response.json();
      // console.log("data", data.data.data);
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

  const fetchUsersBySearchQuery = useCallback(async (searchQuery: string) => {
    if (loading) return;

    setLoading(true);
    let userToken = await AsyncStorage.getItem("access_token");

    try {
      const nextPage = page;
      const response = await fetch(`https://dev-api.yoshtadbirkorlar.uz/api/dashboard/youth-survey/?desire_work_uzbekistan=&has_stable_job=&needs_vocational_training=&page=1&page_size=${nextPage}&region=&abroad_country=&search=${searchQuery}&created_by=&bank_branch=&status=&start_created_time=&purpose=`, {
        headers: {
          Accept: "application/json",
          "Content-Language": "uz",
          Authorization: `Bearer ${userToken}`,
        }
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const data = await response.json();
      // console.log("data", data.data.data);
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
              <View style={{backgroundColor: "#F9F9F9", flexDirection: "row", alignItems: "center", justifyContent: "space-between",  borderWidth: 1, borderColor: "#E8E6ED", borderRadius: 12, height: 44, width: 265}}>
                <TextInput 
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    setLoading(false);
                    setSearchQuery(e.nativeEvent.text);
                    setUsers([]);
                    fetchUsersBySearchQuery(e.nativeEvent.text);
                  }}
                  placeholder="Ism, Pasport yoki PINFL qidirish" 
                  placeholderTextColor="#8D8D8D"
                  style={{ 
                    fontFamily: "Gilroy-Regular", 
                    fontSize: 14, 
                    color: "#8D8D8D", 
                    width: 197 + 16 + 10 + 10,
                    // backgroundColor: "red",
                    paddingHorizontal: 16, 
                    paddingVertical: 12,
                    // backgroundColor: "red",
                    height: "100%" 
                  }}
                  cursorColor={"#1A99FF"}
                  editable={true}
                  // caretHidden={false}

                />

                <SearchIcon style={{marginRight: 16,}} />
              </View>
              
              <View style={{width: 42, height: 42, borderRadius: 12, borderColor: "#E8E6ED", borderWidth: 1, overflow: "hidden", display: "flex", flexDirection: "row", }}>
                <Pressable
                  android_ripple={{ color: "#1A99FF1A" }} 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    backgroundColor: "#F9F9F9", 
                    display: "flex",
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    columnGap: 8
                }}>
                  <FilterIcon />
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
          if (searchQuery !== "") {
            fetchUsersBySearchQuery(searchQuery);
          } else {
            fetchUsers();
          }
        }}

        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        onEndReachedThreshold={5}
        renderItem={({ item }) => loading && page === 1 ? (
          <UserSkeleton />
        ) : (
          <PollCard item={item} />
        )}
        removeClippedSubviews={true}
        ListFooterComponent={loading ? (
          <UserSkeleton />
        ) : null}      
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              setPage(1);
              setUsers([]);
              setLoading(true);
              if (searchQuery !== "") {
                fetchUsersBySearchQuery(searchQuery);
              }  else {
                fetchUsers();
              }
            }}
            tintColor="#1A99FF" // iOS spinner color
            colors={['#1A99FF']} // Android spinner color
            title="Yangilanmoqda..."
            titleColor="#1A99FF"
          />
        }/>
    </View>
  );
}