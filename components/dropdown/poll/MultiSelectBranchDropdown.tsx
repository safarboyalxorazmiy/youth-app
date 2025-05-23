import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Checkbox from 'expo-checkbox';
import DropdownIcon from '@/assets/images/dropdown-icon.svg';
import { TouchableRipple } from 'react-native-paper';
import DropdownSkeleton from './DropdownSkeleton';

interface Branch {
  id: string;
  name: string;
}

export function MultiSelectBranchDropdown({
  selectedBranches,
  setSelectedBranches,
}: {
  selectedBranches: Branch[];
  setSelectedBranches: (value: Branch[]) => void;
}) {
  const [items, setItems] = useState<Branch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleDropdown = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    dropdownHeight.value = withTiming(nextState ? items.length * 48 : 0, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value = withTiming(nextState ? 1 : 0, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: opacity.value,
  }));

  const isSelected = (item: Branch) =>
    selectedBranches.some((branch) => branch.id === item.id);

  const handleSelect = (item: Branch) => {
    if (item.id === 'all') {
      if (selectedBranches.length === items.length - 1) {
        setSelectedBranches([]);
      } else {
        setSelectedBranches(items.filter((i) => i.id !== 'all'));
      }
    } else {
      if (isSelected(item)) {
        setSelectedBranches((prev) =>
          prev.filter((branch) => branch.id !== item.id)
        );
      } else {
        setSelectedBranches((prev) => [...prev, item]);
      }
    }
  };

  const getSelectedText = () => {
    if (selectedBranches.length === 0) return 'Filialni tanlang';
    if (selectedBranches.length === items.length - 1) return 'Barcha';
    return selectedBranches.map((b) => b.name).join(', ');
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const storedUsers = await AsyncStorage.getItem('bank_branches_data');
        if (storedUsers) {
          setItems(JSON.parse(storedUsers));
          setIsLoading(false);
          return;
        }

        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          console.warn('Access token not found');
          return;
        }

        const res = await fetch(
          'https://dev-api.yoshtadbirkorlar.uz/api/dashboard/bank-branches/?page_size=1000',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        const branches = json?.data?.data;
        if (Array.isArray(branches)) {
          const fullList = [{ id: 'all', name: 'Barcha' }, ...branches];
          AsyncStorage.setItem('bank_branches_data', JSON.stringify(fullList));
          setItems(fullList);
          setIsLoading(false)
        } else {
          console.warn('API format unexpected:', json);
        }
      } catch (error) {
        console.error('Failed to fetch bank branches:', error);
      }
    };

    fetchBranches();
  }, []);

  return (
    <View style={{
      marginBottom: 16,
    }}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>{getSelectedText()}</Text>
        <DropdownIcon width={14} height={14} style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      {
        isLoading == false ? (
          <Animated.View style={[styles.dropdownList, animatedStyle]}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableRipple
                  rippleColor="rgba(0, 0, 0, .1)"
                  onPress={() => handleSelect(item)}
                >
                  <View style={styles.item}>
                    <Checkbox value={isSelected(item)} />
                    <Text style={styles.itemText}>{item.name}</Text>
                  </View>
                </TouchableRipple>
              )}
            />
          </Animated.View>
        ) : isOpen == true ? <DropdownSkeleton />
        : <></>
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    backgroundColor: '#FBFBFB',
    maxHeight: 68
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    fontWeight: '500',
    width: '80%',
  },
  dropdownList: {
    overflow: 'hidden',
    backgroundColor: '#FBFBFB',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
  },
  itemText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
  },
});
