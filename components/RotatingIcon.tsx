import React, { useEffect, useRef } from 'react';
import { Animated, View, Image, StyleSheet, Easing } from 'react-native';

export default function RotatingIcon() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000, // 2 seconds for a full rotation
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('@/assets/images/spinner.png')} // use your own image
        style={[styles.image, { transform: [{ rotate: spin }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  
  image: {
    width: 50,
    height: 50,
  },
});
