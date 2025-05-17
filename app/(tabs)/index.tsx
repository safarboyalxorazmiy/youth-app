import { useIsFocused } from "@react-navigation/native";
import { use } from "i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View, TextInput, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import FilterIcon from "@/assets/images/filter-icon.svg";
import AddIcon from "@/assets/images/add-icon.svg";
import UserCard from "@/components/UserCard";
import UserSkeleton from "@/components/UserSkeleton";
import RotatingIcon from "@/components/RotatingIcon";
import RotatingIconDark from "@/components/RotatingIconDark";
import SearchIcon from "@/assets/images/search-icon.svg";
import Constants from 'expo-constants';


const statusBarHeight = Constants.statusBarHeight;

export default function Index() {
  const isFocused = useIsFocused();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  const searchInputRef = useRef<TextInput>(null);

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

  const fetchUsersBySearchQuery = useCallback(async (searchQuery: string) => {
    if (loading) return;

    setLoading(true);
    try {
      const userToken = await AsyncStorage.getItem("access_token");
      if (!userToken) return;

      const response = await fetch(
        `https://dev-api.yoshtadbirkorlar.uz/api/dashboard/users/?search=${encodeURIComponent(searchQuery)}&page=${page}&page_size=10&is_myid_verified=false&is_verified=false`,
        {
          headers: {
            Accept: "application/json",
            "Content-Language": "uz",
            Authorization: `Bearer ${userToken}`,
          }
        }
      );

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
    } finally {
      setLoading(false);
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
    <View style={{ marginTop: Platform.OS === "ios" ? statusBarHeight : 0,  }}>
      <FlatList
        ListHeaderComponent={
          <View style={{ paddingBottom: 16, backgroundColor: "transparent"}}>
            <View style={{backgroundColor: "#FFF", padding: 12, borderRadius: 12, marginTop: 16}}>
              <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{width: 119, height: 42, borderRadius: 48, overflow: "hidden", display: "flex", flexDirection: "row", }}>
                <Pressable
                  onPress={() => router.push("/modal")}
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


            <Pressable 
              onPress={() => {
                searchInputRef.current?.focus();
              }}
              style={{marginTop: 12, backgroundColor: searchInputFocused ? "#FFF" : "#F9F9F9", flexDirection: "row", alignItems: "center", justifyContent: "space-between",  borderWidth: searchInputFocused ? 1.8 : 1, borderColor: searchInputFocused ? "#1A99FF" :"#E8E6ED", borderRadius: 12, height: 44, width: "100%"}}>
                <TextInput 
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    setLoading(false);
                    setSearchQuery(e.nativeEvent.text);
                    setUsers([]);
                    fetchUsersBySearchQuery(e.nativeEvent.text);
                  }}
                  onFocus={() => {
                    setSearchInputFocused(true);
                  }}
                  onBlur={() => {
                    setSearchInputFocused(false);
                  }}
                  placeholder="Qidiruv..." 
                  placeholderTextColor="#8D8D8D"
                  style={{ 
                    fontFamily: "Gilroy-Regular", 
                    fontSize: 14, 
                    color: "#000", 
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
              </Pressable>
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
        renderItem={({ item }) =>
          loading && page === 1 ? (
            <UserSkeleton />
          ) : (
            <UserCard item={item} />
          )
        }        
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
              fetchUsers();
            }}
            tintColor="#1A99FF" // iOS spinner color
            colors={['#1A99FF']} // Android spinner color
            title="Yangilanmoqda..."
            titleColor="#1A99FF"
          />
        }

      />
    </View>
  );
}