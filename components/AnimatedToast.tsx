import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import SuccessIcon from "@/assets/images/success-icon.svg";

const SCREEN_WIDTH = Dimensions.get('window').width;

type ToastProps = {
  message: string;
  onClose?: () => void;
};

const AnimatedToast: React.FC<ToastProps> = ({ message, onClose }) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Slide up animation
    translateY.value = withSpring(-10);
    opacity.value = withTiming(1, { duration: 300 });

    // Auto close
    const timeout = setTimeout(() => {
      translateY.value = withTiming(100);
      opacity.value = withTiming(0, { duration: 300 });
      setTimeout(() => onClose?.(), 300);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.toastContainer, animatedStyle]}>
      <Text style={styles.toastText}>{message}</Text>
      <SuccessIcon />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 16, // Matches the position in the image
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232325', // Dark background
    height: 60,
    paddingHorizontal: 25,
    paddingVertical: 16,
    borderRadius: 12, // Smooth rounded corners
    minWidth: SCREEN_WIDTH * 0.9, // Responsive width
    maxWidth: SCREEN_WIDTH * 0.9,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  toastText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: "SfProDisplayBold",
    fontWeight: 700,
  },
});

export default AnimatedToast;
