import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { PrimaryButton } from '../../components/PrimaryButton';
import { useScanStore } from '../../store/scanStore';
import { colors, fonts, radii, type } from '../../theme';

export function SuccessScreen() {
  const insets = useSafeAreaInsets();
  const draft = useScanStore((s) => s.draft);
  const reset = useScanStore((s) => s.reset);

  const ring = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(ring, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }),
      Animated.timing(slide, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start();
  }, [ring, slide]);

  if (!draft) return null;

  const titleCompany = [draft.title, draft.company].filter(Boolean).join(' · ');

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24 }]}>
      <View style={styles.center}>
        <Animated.View style={[styles.ring, { transform: [{ scale: ring }] }]}>
          <Ionicons name="checkmark" size={44} color="#fff" />
        </Animated.View>
        <Text style={[type.screenTitle, styles.title]}>Lead captured</Text>
        <Text style={styles.body}>
          {draft.firstName} was added to your CRM and enrolled in the configured nurture sequence.
        </Text>

        <Animated.View style={[styles.summary, { transform: [{ translateY: slide }] }]}>
          <Text style={styles.name}>
            {draft.firstName} {draft.lastName}
          </Text>
          {!!titleCompany && <Text style={styles.meta}>{titleCompany}</Text>}
          {!!draft.phone && <Row icon="call-outline" text={draft.phone} />}
          {!!draft.email && <Row icon="mail-outline" text={draft.email} />}

          <View style={styles.workflowRow}>
            <View style={styles.liveDot} />
            <Text style={styles.workflowText}>Workflow live</Text>
          </View>
        </Animated.View>
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton label="Scan another card" icon="scan" onPress={reset} />
      </View>
    </View>
  );
}

function Row({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={15} color={colors.muted} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  ring: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: { textAlign: 'center' },
  body: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.mid, textAlign: 'center', paddingHorizontal: 20 },
  summary: {
    alignSelf: 'stretch',
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    padding: 16,
    marginTop: 18,
    gap: 6,
  },
  name: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.ink },
  meta: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontFamily: fonts.sans, fontSize: 13, color: colors.mid },
  workflowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.lineSoft },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accentLight },
  workflowText: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', color: colors.accent },
  actions: { paddingTop: 8 },
});
