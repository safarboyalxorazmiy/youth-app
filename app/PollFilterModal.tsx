import { Link, useRouter } from 'expo-router';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

import DropdownIcon from "@/assets/images/dropdown-icon.svg";
import CloseIcon from "@/assets/images/close-icon.svg";
import DropDownPicker from 'react-native-dropdown-picker';
import { RegionDropdown } from '@/components/RegionDropdown';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';

import Constants from 'expo-constants';
import { BankBranchDropdown } from '@/components/BranchDropdown';
import { TouchableRipple } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const statusBarHeight = Constants.statusBarHeight;

export default function PollFilterModal() {
  const [selectedRegion, setSelectedRegion] = useState<any>({} as const);
  const [selectedBranch, setSelectedBranch] = useState<any>({} as const);

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

    router.push("/(tabs)/poll");
  }

  const clear = async () => {
    await AsyncStorage.removeItem("region");
    await AsyncStorage.removeItem("regionId");
    await AsyncStorage.removeItem("bank_branch");
    await AsyncStorage.removeItem("branchId");

    router.push("/(tabs)/poll");
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
          router.push("/(tabs)/poll");
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
          borderRadius: 16
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <Text style={{ fontFamily: "Gilroy-SemiBold", fontWeight: 'bold', color: "#303131", fontSize: 20, marginLeft: 16 }}>Filter</Text>
          
          <TouchableRipple 
            onPress={() => {
              console.log("What did you expect mf?");
              router.push("/(tabs)/poll");
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

          <View style={{
            flexDirection: "row", 
            marginTop: 16, 
            justifyContent: "space-between",
            marginBottom: 16
          }}>
            <TouchableRipple 
              underlayColor="rgba(0,0,0,0.1)"
              borderless={true}
              rippleColor={'rgba(0,0,0,0.1)'}
              style={{ width: (SCREEN_WIDTH / 2) - 32 - 8, height: 45, alignItems: "center", justifyContent: "center", backgroundColor: "#e7000b1a", borderRadius: 12, paddingVertical: 8}}
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
                console.log("What did you expect mf?");
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
