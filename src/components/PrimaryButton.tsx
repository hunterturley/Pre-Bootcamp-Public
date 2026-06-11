import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, primaryShadow, radii } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

/** Accent-green fill, white text, scale to 0.98 on press, brand shadow. */
export function PrimaryButton({ label, onPress, icon, loading, disabled, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 0 }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, primaryShadow, style]}>
      <Pressable
        onPressIn={() => animateTo(0.98)}
        onPressOut={() => animateTo(1)}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.button, (disabled || loading) && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon && <Ionicons name={icon} size={18} color="#fff" />}
            <Text style={styles.label}>{label}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: radii.buttonLg,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabled: { opacity: 0.6 },
  label: { color: '#fff', fontFamily: fonts.sansBold, fontSize: 15 },
});
