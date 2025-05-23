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
  { title: "Sog'ligi bilan bog'liq holatlar", value: "Sog'ligi bilan bog'liq holatlar" },
  { title: "Ota-onasining kredit olishga rozilik bermasligi", value: "Ota-onasining kredit olishga rozilik bermasligi" },
  { title: "O'z mablag'i hisobidan kelajakda tadbirkorlik faoliyatini amalga oshirishi mumkinligi", value: "O'z mablag'i hisobidan kelajakda tadbirkorlik faoliyatini amalga oshirishi mumkinligi" },
  { title: "Turmush o'rtog'i tomonidan kredit olish yoki tadbirkorlik bilan shug'ullanishga ruxsat bermaslik holatlari", value: "Turmush o'rtog'i tomonidan kredit olish yoki tadbirkorlik bilan shug'ullanishga ruxsat bermaslik holatlari" },
  { title: "O'zida kredit olish yoki tadbirkorlik qilish istagining hozircha yo'qligi", value: "O'zida kredit olish yoki tadbirkorlik qilish istagining hozircha yo'qligi" },
  { title: "Kredit munosabatlariga ijtimoiy qarashlarining mos kelmasligi (diniy masalalar)", value: "Kredit munosabatlariga ijtimoiy qarashlarining mos kelmasligi (diniy masalalar)" },
  { title: "Bank tizimiga ishonmaslik bilan bog'liq sabablar", value: "Bank tizimiga ishonmaslik bilan bog'liq sabablar" },
  { title: "Islom moliyasi tamoyillari asosida Bank xizmatlaridan foydalanish istagi mavjudligi", value: "Islom moliyasi tamoyillari asosida Bank xizmatlaridan foydalanish istagi mavjudligi" },
  { title: "Fuqaro rejalashtirgan faoliyat turining o'zini o'zi band qilgan shaxslar uchun faoliyat turlari tarkibida mavjud emasligi", value: "Fuqaro rejalashtirgan faoliyat turining o'zini o'zi band qilgan shaxslar uchun faoliyat turlari tarkibida mavjud emasligi" },
  { title: "Yuridik shaxs ta'sischilari orasida bo'lib (rasman divident olmagan), tadbirkorlik bilan shug'ullanib kelmoqda", value: "Yuridik shaxs ta'sischilari orasida bo'lib (rasman divident olmagan), tadbirkorlik bilan shug'ullanib kelmoqda" },
  { title: "Boshqa", value: "another" }
];

export function CauseDropdown({
  selectedStatus,
  setSelectedStatus,
}: {
  selectedStatus: { title: string; value: string };
  setSelectedStatus: (value: { title: string; value: string }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleDropdown = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    dropdownHeight.value = withTiming(opening ? (employStatus.length) * 54 : 0, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value = withTiming(opening ? 1 : 0, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: opacity.value,
  }));

  const handleSelect = (item: { title: string; value: string | boolean }) => {
    setSelectedStatus(item as any);
    toggleDropdown();
  };

  return (
    <>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>
          {selectedStatus?.title || "Variantni tanlang"}
        </Text>
        <DropdownIcon width={14} height={14} style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      <Animated.View style={[styles.dropdownList, animatedStyle]}>
        <FlatList
          data={employStatus}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          
          renderItem={({ item }) => (
            <TouchableRipple
              rippleColor="rgba(0, 0, 0, .32)"
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <View>
                <Text style={styles.itemText}>{item.title}</Text>
              </View>
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
    height: 54,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    fontWeight: '500',
  },
});
