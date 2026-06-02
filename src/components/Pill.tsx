import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, radii } from '../theme';

/** Selectable tag pill (DM Mono label). Filled green when active. */
export function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active ? styles.active : styles.inactive]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  active: { backgroundColor: colors.accent, borderColor: colors.accent },
  inactive: { backgroundColor: colors.card, borderColor: colors.line },
  label: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.2 },
  labelActive: { color: '#fff' },
  labelInactive: { color: colors.mid },
});
