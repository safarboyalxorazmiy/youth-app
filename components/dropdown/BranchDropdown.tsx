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
import DropdownIcon from '@/assets/images/dropdown-icon.svg';
import { TouchableRipple } from 'react-native-paper';

interface Branch {
  id: string;
  name: string;
}

export function BankBranchDropdown({
  selectedBranch,
  setSelectedBranch,
}: {
  selectedBranch: Branch;
  setSelectedBranch: (value: Branch) => void;
}) {
  const [items, setItems] = useState<Branch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    dropdownHeight.value = withTiming(isOpen ? 0 : items.length * 44, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value = withTiming(isOpen ? 0 : 1, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: opacity.value,
  }));

  const handleSelect = (item: Branch) => {
    setSelectedBranch(item);
    toggleDropdown();
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          console.warn('Access token not found');
          return;
        }

        const res = await fetch('https://dev-api.yoshtadbirkorlar.uz/api/dashboard/bank-branches/?page_size=1000', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        const json = await res.json();

        const branches = json?.data?.data;
        if (Array.isArray(branches)) {
          setItems(branches);
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
      marginTop: 4,
    }}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>
          {selectedBranch?.name  || 'Filialni tanlang'}
        </Text>
        <DropdownIcon width={14} height={14} style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      <Animated.View style={[styles.dropdownList, animatedStyle]}>
        <FlatList
          style={{
            width: '100%', 
           }}
          data={items}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableRipple
              rippleColor="rgba(0, 0, 0, .32)"
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableRipple>
          )}
        />
      </Animated.View>
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
    
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    fontWeight: '500',
    width: '80%',
  },
  dropdownList: {
    overflow: 'hidden',
    backgroundColor: 'red',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
    paddingBottom: 0,
    height: 0,
    marginTop: 4,
  },
  item: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#FBFBFB',
    height: 44,

    paddingHorizontal: 12,
    // paddingVertical: 12,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    fontWeight: '500',
  },
});
