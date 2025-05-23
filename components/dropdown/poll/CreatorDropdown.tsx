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

export function CreatorDropdown({
  selectedOwners,
  setSelectedOwners,
}: {
  selectedOwners: any[];
  setSelectedOwners: (value: any[]) => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownHeight = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [isLoading, setIsLoading] = useState(true);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    dropdownHeight.value = withTiming(!isOpen ? items.length * 48 : 0, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value = withTiming(!isOpen ? 1 : 0, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: opacity.value,
  }));

  const isSelected = (item: any) =>
    selectedOwners.some((owner) => owner.id === item.id);

  const handleSelect = (item: any) => {
    if (item.id === 'all') {
      // Toggle all
      if (isSelected(item)) {
        setSelectedOwners([]);
      } else {
        setSelectedOwners(items.filter((i) => i.id !== 'all'));
      }
    } else {
      const alreadySelected = isSelected(item);
      if (alreadySelected) {
        setSelectedOwners((prev) =>
          prev.filter((owner) => owner.id !== item.id)
        );
      } else {
        setSelectedOwners((prev) => [...prev, item]);
      }
    }
  };

  const getSelectedNames = () => {
    if (selectedOwners.length === 0) return 'Yaratuvchilar';
    if (selectedOwners.length === items.length - 1) return 'Barcha';
    return selectedOwners.map((s) => s.first_name).join(', ');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setItems(JSON.parse(storedUsers));
        setIsLoading(false);
        return;
      }

      try {
        const access_token = await AsyncStorage.getItem('access_token');
        if (!access_token) return;

        const response = await fetch(
          'https://dev-api.yoshtadbirkorlar.uz/api/dashboard/users/?page=1&page_size=10000&user_role=admin&is_myid_verified=false&is_verified=false',
          {
            headers: {
              Accept: 'application/json',
              'Accept-Language': 'uz',
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const json = await response.json();
        if (json.success && Array.isArray(json.data.data)) {
          const fullList = [{ id: 'all', first_name: 'Barcha', last_name: '' }, ...json.data.data];
          setItems(fullList);
          AsyncStorage.setItem('users', JSON.stringify(fullList));
          setIsLoading(false);
          setIsOpen(true);
          dropdownHeight.value = withTiming(!isOpen ? fullList.length * 48 : 0, {
            duration: 200,
            easing: Easing.inOut(Easing.ease),
          });
          opacity.value = withTiming(!isOpen ? 1 : 0, { duration: 200 });

        } else {
          console.warn('Failed to load users');
        }
      } catch (err) {
        console.error('API error:', err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={{
      marginBottom: 16,
    }}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>{getSelectedNames()}</Text>
        <DropdownIcon width={14} height={14} style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      {
        isLoading == false ? (
          <Animated.View style={[styles.dropdownList, animatedStyle]}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View>
                  <TouchableRipple
                    
                    rippleColor="rgba(0, 0, 0, 0.09)"
                    
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.item}>
                      <Checkbox value={isSelected(item)} />
                      <Text style={styles.itemText}>
                        {item.first_name} {item.last_name}
                      </Text>
                    </View>
                  </TouchableRipple>
                </View>
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
