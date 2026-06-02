import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '../../components/BrandMark';
import { CameraModal } from '../../components/CameraModal';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Viewfinder } from '../../components/Viewfinder';
import { CapturedImage, pickFromLibrary } from '../../capture';
import { useScanStore } from '../../store/scanStore';
import { colors, fonts, radii, type } from '../../theme';
import { initials } from '../../utils/phone';

export function IdleScreen() {
  const insets = useSafeAreaInsets();
  const [cameraOpen, setCameraOpen] = useState(false);
  const startProcessing = useScanStore((s) => s.startProcessing);
  const recent = useScanStore((s) => s.recent);

  const onCaptured = (img: CapturedImage) => {
    setCameraOpen(false);
    void startProcessing(img.uri, img.base64);
  };

  const onChoosePhoto = async () => {
    try {
      const img = await pickFromLibrary();
      if (img) void startProcessing(img.uri, img.base64);
    } catch (err) {
      Alert.alert('Photos', err instanceof Error ? err.message : 'Could not open photos.');
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <BrandMark />
            <Text style={styles.sublabel}>Card Scanner</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{recent.length}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={type.hero}>
            Scan a card, book the <Text style={styles.heroAccent}>lead.</Text>
          </Text>
          <Text style={styles.heroSub}>
            Point, capture, confirm. The contact lands in your CRM and the follow up starts before
            you leave the driveway.
          </Text>
        </View>

        {/* Viewfinder */}
        <Viewfinder sweeping />

        {/* Recent scans */}
        {recent.length > 0 && (
          <View style={styles.recent}>
            <Text style={[type.sectionLabel, styles.recentLabel]}>Recent scans</Text>
            {recent.slice(0, 4).map((c) => (
              <View key={c.id} style={styles.recentRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(c.firstName, c.lastName)}</Text>
                </View>
                <View style={styles.recentBody}>
                  <Text style={styles.recentName}>
                    {c.firstName} {c.lastName}
                  </Text>
                  <Text style={styles.recentCompany}>{c.company ?? 'No company'}</Text>
                </View>
                <View style={styles.syncedPill}>
                  <Text style={styles.syncedText}>synced</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action area */}
      <View style={[styles.actions, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton label="Scan Card" icon="scan" onPress={() => setCameraOpen(true)} />
        <Pressable onPress={onChoosePhoto} style={styles.secondary}>
          <Text style={styles.secondaryText}>or choose from photos</Text>
        </Pressable>
      </View>

      <CameraModal visible={cameraOpen} onClose={() => setCameraOpen(false)} onCapture={onCaptured} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 16, gap: 22 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  sublabel: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.muted, marginTop: 8, marginLeft: 2 },
  stat: { alignItems: 'flex-end' },
  statNum: { fontFamily: fonts.sansExtra, fontSize: 22, color: colors.accent },
  statLabel: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: colors.muted },
  hero: { gap: 10 },
  heroAccent: { color: colors.accent },
  heroSub: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.mid },
  recent: { gap: 10 },
  recentLabel: { marginBottom: 2 },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.card, borderWidth: 1, borderColor: colors.lineSoft, padding: 12 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.accentBg, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.mono, fontSize: 13, color: colors.accent },
  recentBody: { flex: 1 },
  recentName: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.ink },
  recentCompany: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  syncedPill: { backgroundColor: colors.accentBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  syncedText: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.accent },
  actions: { paddingHorizontal: 20, paddingTop: 8, gap: 10, borderTopWidth: 1, borderTopColor: colors.lineSoft },
  secondary: { alignItems: 'center', paddingVertical: 6 },
  secondaryText: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, letterSpacing: 0.3 },
});
