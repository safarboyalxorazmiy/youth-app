import React, { useEffect, useState } from 'react';
import { View, Animated, useWindowDimensions, Easing } from 'react-native';

const DropdownSkeleton = () => {
  const { width } = useWindowDimensions();
  const [animation] = useState(new Animated.Value(0));

  // Animation to create a smooth fade-in effect for the loader
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0.5,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
      {[...Array(5)].map((_, i) => (
        <View
          key={i}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 10,
            backgroundColor: '#E0E0E0',
            marginBottom: 15,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#f2f2f2',
              opacity: animation,
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default DropdownSkeleton;