import { ImageBackground, StyleSheet, View, Text, Dimensions } from "react-native";

export default function Login() {
  return (
    <ImageBackground
      source={require("@/assets/images/auth-bg.png")} // or use { uri: "https://..." }
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Text style={styles.text}>Kirish</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    backgroundColor: "#FFFFFFCC",
    width: Dimensions.get('window').width - 32,
    marginLeft: "auto",
    marginRight: "auto",
  },
  text: {
    color: "#3E97FF",
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    fontWeight: "bold",
  },
});
