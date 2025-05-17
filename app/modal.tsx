import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

import DropdownIcon from "@/assets/images/dropdown-icon.svg";
import CloseIcon from "@/assets/images/close-icon.svg";
import DropDownPicker from 'react-native-dropdown-picker';
import { RegionDropdown } from '@/components/RegionDropdown';


export default function Modal() {
  const [selectedRegion, setSelectedRegion] = useState('Viloyat');
  const [selectedBranch, setSelectedBranch] = useState('Filial');

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      { label: 'Toshkent', value: 'Toshkent' },
      { label: 'Samarqand', value: 'Samarqand' },
      { label: 'Buxoro', value: 'Buxoro' },
    ]);

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000040',
      }}
    >
      {/* Dismiss modal when pressing outside */}
      <Link href={'/'} asChild>
        <Pressable style={StyleSheet.absoluteFill} />
      </Link>

      <Animated.View
        entering={SlideInDown}
        style={{
          width: '90%',
          height: '80%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
        }}
      >
        <RegionDropdown
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />

        <Text style={styles.label}>Filial</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedBranch}
            onValueChange={(itemValue) => setSelectedBranch(itemValue)}
            style={styles.picker}
            mode="dropdown"
            
          >
            <Picker.Item label="Filial" value="Filial" />
            <Picker.Item label="Asosiy filial" value="Asosiy filial" />
            <Picker.Item label="Qo‘shimcha filial" value="Qo‘shimcha filial" />
          </Picker>
        </View>

        <Text style={{ fontWeight: 'bold', marginVertical: 20 }}>Modal Screen</Text>
        <Link href="/">
          <Text>← Go back</Text>
        </Link>
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
