import React, { useEffect, useRef } from 'react';
import { Animated, View, Image, StyleSheet, Easing } from 'react-native';

export default function RotatingIconDark({ size = 50 }: { size?: number }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
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
        source={require('@/assets/images/spinner-dark.png')}
        style={{
          width: size,
          height: size,
          transform: [{ rotate: spin }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
