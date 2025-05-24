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


export function RegionDropdown({
  selectedRegion,
  setSelectedRegion,
}: {
  selectedRegion: any;
  setSelectedRegion: (value: any) => void;
}) {
  const [items, setItems] = useState<Object[]>([]);
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

  const handleSelect = (item: Object) => {
    setSelectedRegion(item);
    toggleDropdown();
  };

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const access_token = await AsyncStorage.getItem('access_token');
        if (!access_token) {
          console.warn('Access token not found');
          return;
        }

        const response = await fetch('https://dev-api.yoshtadbirkorlar.uz/api/user/regions/', {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Accept-Language': 'uz',
            Authorization: 'Bearer ' + access_token,
            Origin: 'https://dev-admin.yoshtadbirkorlar.uz',
            Referer: 'https://dev-admin.yoshtadbirkorlar.uz/all-users',
          },
        });

        const json = await response.json();

        if (json.success && Array.isArray(json.data)) {
          setItems(json.data);
        } else {
          console.warn('Failed to load regions:', json.message);
        }
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };

    fetchRegions();
  }, []);

  return (
    <View style={{
      marginBottom: 8
    }}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>
          {selectedRegion.name || 'Viloyat'}
        </Text>
        <DropdownIcon width={14} height={14} style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      <Animated.View style={[styles.dropdownList, animatedStyle]}>
        <FlatList
          style={{ width: '100%' }}
          data={items}
          keyExtractor={(item: any) => item.id}
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
    backgroundColor: '#FBFBFB',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
  },
  item: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#FBFBFB',
    height: 44,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    fontWeight: '500',
  },
});
