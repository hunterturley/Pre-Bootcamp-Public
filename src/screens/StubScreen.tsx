import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, type } from '../theme';

/** Placeholder for Contacts / Pipeline / Settings tabs (v1 stubs). */
export function StubScreen({
  title,
  icon,
  blurb,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  blurb: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 24 }]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={30} color={colors.accent} />
      </View>
      <Text style={type.screenTitle}>{title}</Text>
      <Text style={styles.blurb}>{blurb}</Text>
      <View style={styles.soon}>
        <Text style={styles.soonText}>Coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', paddingHorizontal: 28, gap: 12 },
  iconWrap: { width: 60, height: 60, borderRadius: 16, backgroundColor: colors.accentBg, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  blurb: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.mid, textAlign: 'center' },
  soon: { marginTop: 6, backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  soonText: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: colors.muted },
});
