import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, radii } from '../theme';

/**
 * Viewfinder card (aspect ratio 1.7). Shows a dashed ghost-card placeholder
 * with an animated green scan sweep line and green corner brackets. When an
 * image is captured it fills the card.
 */
export function Viewfinder({ imageUri, sweeping = true }: { imageUri?: string | null; sweeping?: boolean }) {
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!sweeping) return;
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 2200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [sweeping, sweep]);

  const translateY = sweep.interpolate({ inputRange: [0, 1], outputRange: ['0%', '92%'] });

  return (
    <View style={styles.card}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.ghost}>
          <Ionicons name="card-outline" size={34} color={colors.accentMid} />
          <Text style={styles.ghostText}>Point at a business card</Text>
        </View>
      )}

      {sweeping && (
        <Animated.View style={[styles.sweep, { transform: [{ translateY }] }]} />
      )}

      {/* Green corner brackets */}
      <View style={[styles.corner, styles.tl]} />
      <View style={[styles.corner, styles.tr]} />
      <View style={[styles.corner, styles.bl]} />
      <View style={[styles.corner, styles.br]} />
    </View>
  );
}

const BR = 18;
const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 1.7,
    borderRadius: radii.card,
    backgroundColor: colors.faint,
    borderWidth: 1.5,
    borderColor: colors.accentLine,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  ghost: { alignItems: 'center', gap: 8 },
  ghostText: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted, letterSpacing: 0.4 },
  sweep: {
    position: 'absolute',
    top: 4,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: colors.accentLight,
    shadowColor: colors.accentLight,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  corner: { position: 'absolute', width: BR, height: BR, borderColor: colors.accent },
  tl: { top: 8, left: 8, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderTopLeftRadius: 6 },
  tr: { top: 8, right: 8, borderTopWidth: 2.5, borderRightWidth: 2.5, borderTopRightRadius: 6 },
  bl: { bottom: 8, left: 8, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderBottomLeftRadius: 6 },
  br: { bottom: 8, right: 8, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderBottomRightRadius: 6 },
});
