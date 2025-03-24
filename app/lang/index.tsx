// import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import i18n, { loadLocale, setLocale, t } from '../../i18n';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha", icon: require('@/assets/uzb.png') },
  { code: 'uzCy', label: 'Ўзбекча', icon: require('@/assets/uzb.png') },
  { code: 'ru', label: 'Русский', icon: require('@/assets/rus.png') },
];

export default function LanguageScreen() {
  const router = useRouter();

  const changeLanguage = async (code: string) => {
    if (i18n.locale === code) return;
    await setLocale(code);
    
    await AsyncStorage.setItem("mainCargoLoad", "true");
    await AsyncStorage.setItem("myCargoLoad", "true");

    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('selectLanguage')}</Text>
      {LANGUAGES.map(lang => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => changeLanguage(lang.code)}
          style={i18n.locale === lang.code ? styles.buttonActive  : styles.button}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image style={{width: 25, height: 25}} source={lang.icon} />
            <Text style={i18n.locale === lang.code ? styles.textActive : styles.text}>{lang.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  title: { fontSize: 24, marginBottom: 20, fontFamily: "SfProDisplayBold", fontWeight: 700 },
  button: {
    height: 45,
    width: "100%",
    paddingHorizontal: 30,
    backgroundColor: "#FFF",
    marginTop: 10,
    borderRadius: 8,
    borderColor: "#222",
    borderWidth: 0.8,
    flexDirection: "row",
  },
  buttonActive: {
    height: 45,
    width: "100%",
    paddingHorizontal: 30,
    backgroundColor: "#2CA82A",
    marginTop: 10,
    borderRadius: 8,
    borderColor: "#2CA82A",
    borderWidth: 0.8,
    flexDirection: "row",
  },
  text: { color: '#000', fontFamily: "SfProDisplayRegular", fontWeight: 400 },
  textActive: { color: '#FFF', fontFamily: "SfProDisplayBold", fontWeight: 700 },
});