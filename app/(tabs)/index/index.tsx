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
import { TouchableRipple } from "react-native-paper";


const statusBarHeight = Constants.statusBarHeight;

export default function Index() {
  const isFocused = useIsFocused();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [fullyLoaded, setFullyLoaded] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  
  const [regionId, setRegionId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);

  const [start_birth_date, setStartBirthDate] = useState<string | null>(null);
  const [end_birth_date, setEndBirthDate] = useState<string | null>(null);

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
          const filtered = newUsers.filter((user: any) => !existingIds.has(user.id));
          return [...prevUsers, ...filtered];
        });
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      setFullyLoaded(true);
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
          const filtered = newUsers.filter((user: any) => !existingIds.has(user.id));
          return [...prevUsers, ...filtered];
        });
      }

    } catch (error) {
      console.log("Error fetching users:", error);
      setFullyLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  const fetchUsersByFilterParams = useCallback(async ({
    regionId,
    bankBranchId,
    start_birth_date,
    end_birth_date
  }: {
    regionId: string | null;
    bankBranchId: string | null;
    start_birth_date: string | null;
    end_birth_date: string | null;
  }) => {
    if (loading) return;

    setLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('access_token');
      if (!userToken) return;

      const url = new URL('https://dev-api.yoshtadbirkorlar.uz/api/dashboard/users/');
      url.searchParams.append('page', String(page));
      url.searchParams.append('page_size', '10');
      if (start_birth_date) url.searchParams.append('start_birth_date', start_birth_date);
      if (end_birth_date) url.searchParams.append('end_birth_date', end_birth_date);
      url.searchParams.append('user_role', 'ordinary_user');
      if (regionId) url.searchParams.append('region', regionId);
      if (bankBranchId) url.searchParams.append('bank_branch', bankBranchId);
      // url.searchParams.append('source', 'from_excel');
      url.searchParams.append('is_myid_verified', 'false');
      url.searchParams.append('is_verified', 'false');

      console.log(url.toString())

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const json = await response.json();
      const newUsers = json?.data?.data || [];

      if (newUsers.length > 0) {
        setUsers(prevUsers => {
          const existingIds = new Set(prevUsers.map(user => user.id));
          const filtered = newUsers.filter((user: any) => !existingIds.has(user.id));
          return [...prevUsers, ...filtered];
        });
      }
    } catch (err) {
      console.log('Error fetching filtered users:', err);
      setFullyLoaded(true);
      setLoading(false);
      // setUsers([])
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  const fetchUsersByFilterParamsAndSearchQuery = useCallback(async ({
    regionId,
    bankBranchId,
    searchQuery,
    start_birth_date,
    end_birth_date,
    page
  }: {
    regionId: string | null;
    bankBranchId: string | null;
    start_birth_date: string | null;
    end_birth_date: string | null;
    searchQuery: string,
    page: number
  }) => {
    if (loading) return;

    setLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('access_token');
      if (!userToken) return;

      const url = new URL('https://dev-api.yoshtadbirkorlar.uz/api/dashboard/users/');
      url.searchParams.append('search', searchQuery);
      console.log(page)
      url.searchParams.append('page', String(page));
      url.searchParams.append('page_size', '10');
      if (regionId) url.searchParams.append('region', regionId);

      if (start_birth_date) url.searchParams.append('start_birth_date', start_birth_date);
      if (end_birth_date) url.searchParams.append('end_birth_date', end_birth_date);
      console.log(start_birth_date, end_birth_date)



      if (bankBranchId) url.searchParams.append('bank_branch', bankBranchId);
      url.searchParams.append('is_myid_verified', 'false');
      url.searchParams.append('is_verified', 'false');

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const json = await response.json();
      const newUsers = json?.data?.data || [];

      if (newUsers.length > 0) {
        setUsers(prevUsers => {
          const existingIds = new Set(prevUsers.map(user => user.id));
          const filtered = newUsers.filter((user: any) => !existingIds.has(user.id));
          return [...prevUsers, ...filtered];
        });
      }
    } catch (err) {
      console.log('Error fetching filtered users:', err);
      setFullyLoaded(true);
      // setUsers([])
      setLoading(false);
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
    };

    if (isFocused) {
      checkToken();
    }
  }, [isFocused]);

  return (
    <View style={{ marginTop: statusBarHeight  }}>
      <FlatList
        ListHeaderComponent={
          <View style={{ paddingBottom: 16, backgroundColor: "transparent"}}>
            <View style={{backgroundColor: "#FFF", padding: 12, borderRadius: 12, marginTop: 16}}>
              <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{width: 119, height: 42, borderRadius: 48, overflow: "hidden", display: "flex", flexDirection: "row", }}>
                <Pressable
                  onPress={() => router.push("/UsersFilterModal")}
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
                  onChange={async (e) => {
                    // let start_birth_date = await AsyncStorage.getItem("start_birth_date");
                    // let end_birth_date = await AsyncStorage.getItem("end_birth_date");

                    setPage(1);
                    setLoading(false);
                    setFullyLoaded(false);
                    setSearchQuery(e.nativeEvent.text);
                    setUsers([]);

                    // if (regionId || branchId) {
                    //   fetchUsersByFilterParamsAndSearchQuery({ regionId: regionId, bankBranchId: branchId, start_birth_date: start_birth_date, end_birth_date: end_birth_date,  searchQuery: e.nativeEvent.text, page: 1 });
                    //   return;
                    // }

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
        onEndReached={async () => {
          if (fullyLoaded) return;
          
          const regionFromStorage = await AsyncStorage.getItem("regionId");
          const bankBranchFromStorage = await AsyncStorage.getItem("branchId");
          const start_birth_dateFromStorage = await AsyncStorage.getItem("start_birth_date");
          const end_birth_dateFromStorage = await AsyncStorage.getItem("end_birth_date");

          if (regionFromStorage != regionId || bankBranchFromStorage != branchId || start_birth_dateFromStorage != start_birth_date || end_birth_dateFromStorage != end_birth_date) {
            // console.log("DATE CAMEEEEE!!!!", start_birth_date, end_birth_date);
            try {
              const region = await AsyncStorage.getItem("regionId");
              const bankBranch = await AsyncStorage.getItem("branchId");
              const start_birth_date = await AsyncStorage.getItem("start_birth_date");
              const end_birth_date = await AsyncStorage.getItem("end_birth_date");

              if (region || bankBranch || start_birth_date || end_birth_date) {
                setBranchId(bankBranch);
                setRegionId(region);
                setStartBirthDate(start_birth_date);
                setEndBirthDate(end_birth_date);
                setPage(0);
                setSearchQuery("");
                setUsers([]);
                setLoading(false);
                setFullyLoaded(false);

                if (searchQuery !== "") {
                  await fetchUsersByFilterParamsAndSearchQuery({ regionId: region, bankBranchId: bankBranch, start_birth_date: start_birth_date, end_birth_date: end_birth_date, searchQuery: searchQuery, page: 1 });
                  return;
                }

                await fetchUsersByFilterParams({ regionId: region, bankBranchId: bankBranch, start_birth_date: start_birth_date, end_birth_date: end_birth_date });
                } else {
                  if (searchQuery !== "") {
                    await fetchUsersBySearchQuery(searchQuery);
                    return;
                  }

                  await fetchUsers();
                }
            } catch (error) {
              console.log("Error fetching region or branch ID from storage:", error);
            }
          } else {
            if (!fullyLoaded) {
              if (searchQuery !== "") {
                await fetchUsersByFilterParamsAndSearchQuery({ regionId: regionId, bankBranchId: branchId, start_birth_date: start_birth_date, end_birth_date: end_birth_date, searchQuery: searchQuery, page });
                return;
              }

              await fetchUsersByFilterParams({
                regionId,
                bankBranchId: branchId,
                start_birth_date: start_birth_date, 
                end_birth_date: end_birth_date, 
              });
            }
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
            <TouchableRipple 
                rippleColor={'rgba(0, 0, 0, .32)'}
                underlayColor="rgba(0,0,0,0.1)"
                borderless={true} 
                style={{marginBottom: 8, borderRadius: 16, }} 
                onPress={() => {
                  router.push({
                    pathname: "/userItem" as any,
                    params: { item: JSON.stringify(item) },
                  });

                }}>
              <UserCard item={item} />
            </TouchableRipple>
          )
        }        
        removeClippedSubviews={true}
        ListFooterComponent={loading ? (
          <UserSkeleton />
        ) : null}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={async () => {
              setPage(0);
              setLoading(false);
              setFullyLoaded(false);
              setUsers([]);

              const regionFromStorage = await AsyncStorage.getItem("regionId");
              const bankBranchFromStorage = await AsyncStorage.getItem("branchId");
              const start_birth_dateFromStorage = await AsyncStorage.getItem("start_birth_date");
              const end_birth_dateFromStorage = await AsyncStorage.getItem("end_birth_date");

              if (regionFromStorage != regionId || bankBranchFromStorage != branchId || start_birth_dateFromStorage != start_birth_date || end_birth_dateFromStorage != end_birth_date) {
                // console.log("DATE CAMEEEEE!!!!", start_birth_date, end_birth_date);
                
                try {
                  const region = await AsyncStorage.getItem("regionId");
                  const bankBranch = await AsyncStorage.getItem("branchId");
                  const start_birth_date = await AsyncStorage.getItem("start_birth_date");
                  const end_birth_date = await AsyncStorage.getItem("end_birth_date");

                  if (region || bankBranch || start_birth_date || end_birth_date) {
                    setBranchId(bankBranch);
                    setRegionId(region);
                    setStartBirthDate(start_birth_date);
                    setEndBirthDate(end_birth_date);
                    setPage(0);
                    setSearchQuery("");
                    setUsers([]);
                    setLoading(false);
                    setFullyLoaded(false);

                    if (searchQuery !== "") {
                      await fetchUsersByFilterParamsAndSearchQuery({ regionId: region, bankBranchId: bankBranch, start_birth_date: start_birth_date, end_birth_date: end_birth_date, searchQuery: searchQuery, page: 1 });
                      return;
                    }

                    await fetchUsersByFilterParams({ regionId: region, bankBranchId: bankBranch, start_birth_date: start_birth_date, end_birth_date: end_birth_date });
                  } else {
                    if (searchQuery !== "") {
                      await fetchUsersBySearchQuery(searchQuery);
                      return;
                    }

                    await fetchUsers();
                  }
                } catch (error) {
                  console.log("Error fetching region or branch ID from storage:", error);
                }
              } else {
                if (!fullyLoaded) {
                  if (searchQuery !== "") {
                    await fetchUsersByFilterParamsAndSearchQuery({ regionId: regionId, bankBranchId: branchId, start_birth_date: start_birth_date, end_birth_date: end_birth_date, searchQuery: searchQuery, page });
                    return;
                  }

                  await fetchUsersByFilterParams({
                    regionId,
                    bankBranchId: branchId,
                    start_birth_date: start_birth_date, 
                    end_birth_date: end_birth_date, 
                  });
                }
              }
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