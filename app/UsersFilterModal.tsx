import { Link, useRouter } from 'expo-router';
import { Dimensions, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

import DropdownIcon from "@/assets/images/dropdown-icon.svg";
import CloseIcon from "@/assets/images/close-icon.svg";
import DropDownPicker from 'react-native-dropdown-picker';
import { RegionDropdown } from '@/components/dropdown/RegionDropdown';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';

import Constants from 'expo-constants';
import { BankBranchDropdown } from '@/components/dropdown/BranchDropdown';
import { TouchableRipple } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { RangeCalendar } from '@ui-kitten/components';
import CalendarIcon from "@/assets/images/calendar-icon.svg";
import { useIsFocused } from '@react-navigation/native';

const statusBarHeight = Constants.statusBarHeight;
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function UsersFilterModal() {
  const [selectedRegion, setSelectedRegion] = useState<any>({} as const);
  const [selectedBranch, setSelectedBranch] = useState<any>({} as const);

  const modalRef = React.useRef<ActionSheetRef>(null);

  const [fromDayInputValue, setFromDayInputValue] = useState<number>(new Date().getDate());
  const [fromMonthInputValue, setFromMonthInputValue] = useState<number>(new Date().getMonth() + 1);
  const [fromYearInputValue, setFromYearInputValue] = useState<number>(new Date().getFullYear());
  const [toDayInputValue, setToDayInputValue] = useState<number>(new Date().getDate());
  const [toMonthInputValue, setToMonthInputValue] = useState<number>(new Date().getMonth() + 1);
  const [toYearInputValue, setToYearInputValue] = useState<number>(new Date().getFullYear());
  const [range, setRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const isFocused = useIsFocused();


  useEffect(() => {
    const fetchRange = async () => {
      try {
        const start_birth_date = await AsyncStorage.getItem('start_birth_date');
        const end_birth_date = await AsyncStorage.getItem('end_birth_date');

        let start_birth_dateObj;
        if (start_birth_date == null || start_birth_date == undefined || start_birth_date == "") {
          start_birth_dateObj = null;
        } else {
          start_birth_dateObj = new Date(start_birth_date as string);
        }

        let end_birth_dateObj;
        if (end_birth_date == null || end_birth_date == undefined || end_birth_date == "") {
          end_birth_dateObj = null;
        } else {
          end_birth_dateObj = new Date(end_birth_date as string);
        }

        if (range) {
          setRange({
            startDate: start_birth_dateObj,
            endDate: end_birth_dateObj,
          });
        }
      } catch (error) {
        console.error('Failed to fetch range:', error);
      }
    };
    fetchRange();
  }, [isFocused]);

  useEffect(() => {
    const fetchSelectedRegion = async () => {
      try {
        const region = await AsyncStorage.getItem('region');
        if (region) {
          setSelectedRegion(JSON.parse(region));
        }
      } catch (error) {
        console.error('Failed to fetch selected region:', error);
      }
    };

    const fetchSelectedBranch = async () => {
      try {
        const branch = await AsyncStorage.getItem('bank_branch');
        if (branch) {
          setSelectedBranch(JSON.parse(branch));
        }
      } catch (error) {
        console.error('Failed to fetch selected branch:', error);
      }
    };

    fetchSelectedRegion();
    fetchSelectedBranch();
  }, []);

  useEffect(() => {
    const storeSelectedRegion = async () => {
      try {
        await AsyncStorage.setItem('region', JSON.stringify(selectedRegion));
      } catch (error) {
        console.error('Failed to store selected region:', error);
      }
    };

    const storeSelectedBranch = async () => {
      try {
        await AsyncStorage.setItem('bank_branch', JSON.stringify(selectedBranch));
      } catch (error) {
        console.error('Failed to store selected branch:', error);
      }
    };

    storeSelectedRegion();
    storeSelectedBranch();
  }, [selectedRegion, selectedBranch]);

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Toshkent', value: 'Toshkent' },
    { label: 'Samarqand', value: 'Samarqand' },
    { label: 'Buxoro', value: 'Buxoro' },
  ]);

  function subtractOneMonthAndFormat(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }

    // Format to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  const search = async () => {
    if (selectedRegion.id != null) {
      console.log("regionId", selectedRegion.id);
      await AsyncStorage.setItem("regionId", selectedRegion.id);
    } else {
      await AsyncStorage.removeItem("regionId");
    }

    if (selectedBranch.id != null) {
      console.log("branchId", selectedBranch.id);
      await AsyncStorage.setItem("branchId", selectedBranch.id);
    } else {
      await AsyncStorage.removeItem("branchId");
    }

    // if (range.startDate && range.endDate) {
    if (range.startDate) {
      console.log("startDate", subtractOneMonthAndFormat(range.startDate.toISOString()));
      let startDate = subtractOneMonthAndFormat(range.startDate.toISOString());
      if (startDate == null) {
        await AsyncStorage.removeItem("start_birth_date");
      } else {
        await AsyncStorage.setItem("start_birth_date", startDate as string);
      }
    } else {
      await AsyncStorage.removeItem("start_birth_date");
    }

    if (range.endDate) {
      console.log("endDate", subtractOneMonthAndFormat(range.endDate.toISOString()));

      let endDate = subtractOneMonthAndFormat(range.endDate.toISOString());
      if (endDate == null) {
        await AsyncStorage.removeItem("end_birth_date");
      } else {
        await AsyncStorage.setItem("end_birth_date", endDate as string);
      }
    } else {
      await AsyncStorage.removeItem("end_birth_date");
    }
    
    // }

    router.push("/(tabs)" as any);
  }

  const clear = async () => {
    await AsyncStorage.removeItem("region");
    await AsyncStorage.removeItem("regionId");
    await AsyncStorage.removeItem("bank_branch");
    await AsyncStorage.removeItem("branchId");
    await AsyncStorage.removeItem("start_birth_date");
    await AsyncStorage.removeItem("end_birth_date");

    router.push("/(tabs)" as any);
  }


  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000040',
        marginTop: Platform.OS === 'ios' ? statusBarHeight : 0,
      }}
    >
      {/* Dismiss modal when pressing outside */}
      {/* <Link href={'/(tabs)'} asChild> */}
        <Pressable onPress={() => {
          console.log("What did you expect mf?");
          router.push("/(tabs)" as any);
        }} style={StyleSheet.absoluteFill} />
      {/* </Link> */}

      <Animated.View
        entering={SlideInDown}
        style={{
          width: SCREEN_WIDTH - 32,
          maxHeight: '80%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 16,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <Text style={{ fontFamily: "Gilroy-SemiBold", fontWeight: 'bold', color: "#303131", fontSize: 20, marginLeft: 16 }}>Filter</Text>
          
          <TouchableRipple 
            onPress={() => {
              console.log("What did you expect mf?");
              router.push("/(tabs)" as any);
            }}
            rippleColor={'rgba(0, 0, 0, .32)'}
            underlayColor="rgba(0,0,0,0.1)"
            borderless={true}
            style={{width: 34 + 16, height: 34 + 16, right: 0, top: 0, padding: 20, alignItems: 'center', justifyContent: 'center', borderTopRightRadius: "50%", borderTopLeftRadius: "50%", borderBottomLeftRadius: "50%", borderBottomRightRadius: "50%"}}>
            <CloseIcon style={{ width: 24, height: 24 }} />
          </TouchableRipple>
        </View>
        
        
        <ScrollView style={{
          padding: 16,
          position: 'relative',
        }}>
          <RegionDropdown
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
          />

          <BankBranchDropdown 
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
          />

          <TouchableRipple 
            borderless={true}
            onPress={() => {
              modalRef.current?.show();
            }}
            style={{
              borderRadius: 12, 
              width: "100%", 
              height: 44, 
              backgroundColor: "#FBFBFB", 
              alignItems: "center", 
              justifyContent: "center", 
              marginTop: 8,
              borderWidth: 1,
              borderColor: "#EFEFEF"
            }}>
            <View style={{flexDirection: "row", columnGap: 8, alignItems: "center", justifyContent: "center" }}>
              <CalendarIcon />
              <Text style={{color: "#292929", fontSize: 14, fontFamily: "Gilroy-Medium"}}>
                {(range.startDate && range.endDate) ? `${range.startDate.toLocaleDateString()} - ${range.endDate.toLocaleDateString()}` : (range.startDate ? range.startDate.toLocaleDateString() : (range.endDate ? range.endDate.toLocaleDateString() : "Tug’ilgan sana bo'yicha filtrlash"))}
              </Text>
            </View>
          </TouchableRipple>
          
          <View style={{
            flexDirection: "row", 
            marginTop: 16, 
            justifyContent: "space-between",
            paddingBottom: 36
          }}>
            <TouchableRipple 
              underlayColor="rgba(0,0,0,0.1)"
              borderless={true}
              rippleColor={'rgba(0,0,0,0.1)'}
              style={{ 
                width: (SCREEN_WIDTH / 2) - 32 - 8, 
                height: 45, 
                alignItems: "center", 
                justifyContent: "center", 
                backgroundColor: "#e7000b1a",
                borderRadius: 12, 
                paddingVertical: 8,
                borderColor: "#e7000b",
                borderWidth: 0.2
              }}
              onPress={() => {
                clear();
              }}
            >
              <Text style={{color: "#fb2c36", fontSize: 16, fontFamily: "Gilroy-Medium"}}>Tozalash</Text>
            </TouchableRipple>

            <TouchableRipple 
              underlayColor="rgba(0,0,0,0.1)"
              borderless={true}
              rippleColor={'rgba(0,0,0,0.1)'}

              style={{ width: (SCREEN_WIDTH / 2) - 32 - 8, height: 45, alignItems: "center", justifyContent: "center", backgroundColor: "#3F9CFB", borderRadius: 12, paddingVertical: 8}}
              onPress={() => {
                // modalRef.current?.show()
                // console.log("What did you expect mf?");
                search();
                // router.push("/(tabs)");
              }}
            >
              <Text style={{color: "#FFF", fontSize: 16, fontFamily: "Gilroy-Medium"}}>Qidirish</Text>
            </TouchableRipple>
          </View>

          {/* <Text style={{ fontWeight: 'bold', marginVertical: 20 }}>Modal Screen</Text>
          <Link href="/">
            <Text>← Go back</Text>
          </Link> */}
        </ScrollView>


        <ActionSheet
					ref={modalRef}
					gestureEnabled={true}
					indicatorStyle={{
						width: 100,
					}}>
						<View
							style={{
								height: "65%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}>
							<View
								style={{
									width: screenWidth - (16 * 2),
									maxWidth: 343,
									marginLeft: "auto",
									marginRight: "auto",
									flex: 1,
									alignItems: "center",
									justifyContent: "flex-start",
                  paddingTop: 60
								}}>
								<View
									style={{
										width: "100%",
										borderRadius: 12,
										backgroundColor: "#fff",
									}}>
									<View
										style={{
											borderBottomColor: "#CAC4D0",
											borderBottomWidth: 1
										}}>
									</View>


									<RangeCalendar
										range={range}
										onSelect={(nextRange) => {
                      console.log(subtractOneMonthAndFormat(nextRange.startDate?.toISOString() as string), subtractOneMonthAndFormat(nextRange.endDate?.toISOString() as string));
                      setRange(nextRange as any);
										}}
									/>

									{/* <Calendar
										onDayPress={this.onDayPress}
										markedDates={{
											[this.state.selectingDateType === "FROM" ? this.state.fromDate : this.state.toDate]: {
												selected: true,
												selectedColor: "blue"
											},
										}}
									/> */}

									<View
										style={{
											// paddingHorizontal: 12,
											paddingTop: 8,
											// paddingBottom: 12,
											display: "flex",
											flexDirection: "row",
											justifyContent: "space-between",
											gap: 8
										}}>
										<TouchableRipple
											borderless={true}
											onPress={async () => {
                        setRange({ startDate: null, endDate: null });
                        await AsyncStorage.removeItem("start_birth_date");
                        await AsyncStorage.removeItem("end_birth_date");
												modalRef.current?.setModalVisible(false);
											}}
											style={{
												paddingHorizontal: 14,
												paddingVertical: 12,
                        backgroundColor: "#FBFBFB",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#EFEFEF",
                        width: "50%",
                        alignItems: "center",
                        justifyContent: "center",
											}}>
											<Text
												style={{
													color: "#292929",
													fontWeight: "500",
													fontSize: 16,
                          fontFamily: "Gilroy-Medium"
												}}>Tozalash</Text>
										</TouchableRipple>

										<TouchableRipple
											// rippleColor="#3E97FF"
											borderless={true}
											onPress={() => {
												modalRef.current?.setModalVisible(false);
											}}
											style={{
												paddingHorizontal: 14,
												paddingVertical: 12,
                        backgroundColor: "#3E97FF",
                        borderRadius: 12,
                        width: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        // borderWidth: 1,
                        // borderColor: "#EFEFEF"
											}}>
											<Text
												style={{
													color: "#FFF",
													fontWeight: "500",
													fontSize: 16,
                          fontFamily: "Gilroy-Medium"
												}}>Qidirish</Text>
										</TouchableRipple>
									</View>
								</View>
							</View>
						</View>
				</ActionSheet>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  label: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    fontSize: 16,
    fontFamily: 'Gilroy-SemiBold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 48,
    fontFamily: 'Gilroy-Regular',
  },
});
