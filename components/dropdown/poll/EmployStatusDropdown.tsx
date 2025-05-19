import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { TouchableRipple } from 'react-native-paper';
import DropdownIcon from '@/assets/images/dropdown-icon.svg';

const employStatus = [
  { title: 'Barchasi', value: '' },
  { title: 'Rasmiy ish bilan band', value: 'official_employee' },
  { title: 'Norasmiy ish bilan band', value: 'unofficial_employee' },
  { title: 'Ishsiz', value: 'unemployed' },
];

export function EmployStatusDropdown({
  selectedEmployStatus,
  setSelectedEmployStatus,
}: {
  selectedEmployStatus: { title: string; value: string };
  setSelectedEmployStatus: (value: { title: string; value: string }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    dropdownHeight.value = withTiming(!isOpen ? employStatus.length * 44 : 0, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value = withTiming(!isOpen ? 1 : 0, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: opacity.value,
  }));

  const handleSelect = (item: { title: string; value: string }) => {
    setSelectedEmployStatus(item);
    toggleDropdown();
  };

  return (
    <>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>
          {selectedEmployStatus?.title || 'Bandlik Holati'}
        </Text>
        <DropdownIcon width={14} height={14} style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      <Animated.View style={[styles.dropdownList, animatedStyle]}>
        <FlatList
          data={employStatus}
          keyExtractor={(item) => item.value || 'all'}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableRipple
              rippleColor="rgba(0, 0, 0, .32)"
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.itemText}>{item.title}</Text>
            </TouchableRipple>
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
    marginBottom: 16,
  },
  item: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#FBFBFB',
    height: 44,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    fontWeight: '500',
  },
});
