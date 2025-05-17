import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import DropdownIcon from '@/assets/images/dropdown-icon.svg';

const items = ['Toshkent', 'Samarqand', 'Buxoro'];

export function RegionDropdown({ selectedRegion, setSelectedRegion }: {
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    dropdownHeight.value = withTiming(isOpen ? 0 : items.length * 45, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value = withTiming(isOpen ? 0 : 1, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: opacity.value,
  }));

  const handleSelect = (item: string) => {
    setSelectedRegion(item);
    toggleDropdown();
  };

  return (
    <>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>
          {selectedRegion || 'Viloyat tanlang'}
        </Text>
        <DropdownIcon width={18} height={18} style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      <Animated.View style={[styles.dropdownList, animatedStyle]}>
        <FlatList
          data={items}
          keyExtractor={(item) => item}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Pressable style={styles.item} onPress={() => handleSelect(item)}>
              <Text style={styles.itemText}>{item}</Text>
            </Pressable>
          )}
        />
      </Animated.View>
    </>
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
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Gilroy-Regular',
  },
  dropdownList: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Gilroy-Regular',
  },
});
