import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, SIZES } from '../../theme/typography';

export default function SplashScreen({ navigation }) {
  const loaderAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(loaderAnim, { toValue: 1, duration: 1800, useNativeDriver: false }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#0a1f16', '#1a7a5e', '#25a87f']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>💸</Text>
        </View>
        <Text style={styles.appName}>Hisaab</Text>
        <Text style={styles.tagline}>Apna Hisaab, Apne Haath ✨</Text>
        <View style={styles.loaderTrack}>
          <Animated.View
            style={[
              styles.loaderFill,
              { width: loaderAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', gap: 16 },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 44 },
  appName: {
    fontFamily: FONTS.nunito.black,
    fontSize: 30,
    color: '#fff',
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: FONTS.dmSans.regular,
    fontSize: SIZES.md,
    color: 'rgba(255,255,255,0.65)',
    marginTop: -8,
  },
  loaderTrack: {
    width: 48,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 99,
    overflow: 'hidden',
    marginTop: 40,
  },
  loaderFill: { height: '100%', backgroundColor: '#fff', borderRadius: 99 },
});
