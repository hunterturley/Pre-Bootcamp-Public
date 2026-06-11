import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Viewfinder } from '../../components/Viewfinder';
import { PROCESSING_HEADINGS, PROCESSING_STEPS } from '../../constants';
import { useScanStore } from '../../store/scanStore';
import { colors, fonts, type } from '../../theme';

export function ProcessingScreen() {
  const insets = useSafeAreaInsets();
  const cardImageUri = useScanStore((s) => s.cardImageUri);
  const stepStates = useScanStore((s) => s.stepStates);
  const [headingIndex, setHeadingIndex] = useState(0);

  // Heading cycles independently of step progress for a lively feel.
  useEffect(() => {
    const t = setInterval(() => {
      setHeadingIndex((i) => Math.min(i + 1, PROCESSING_HEADINGS.length - 1));
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <Text style={[type.screenTitle, styles.heading]}>{PROCESSING_HEADINGS[headingIndex]}</Text>

      <Viewfinder imageUri={cardImageUri} sweeping />

      <View style={styles.steps}>
        {PROCESSING_STEPS.map((label, i) => (
          <Step key={label} label={label} state={stepStates[i]} />
        ))}
      </View>
    </View>
  );
}

function Step({ label, state }: { label: string; state: 'pending' | 'active' | 'done' }) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (state !== 'active') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state, pulse]);

  const done = state === 'done';
  const active = state === 'active';

  return (
    <View style={styles.stepRow}>
      <Animated.View
        style={[
          styles.dot,
          done && styles.dotDone,
          active && styles.dotActive,
          active && { opacity: pulse },
        ]}
      >
        {done && <Ionicons name="checkmark" size={13} color="#fff" />}
      </Animated.View>
      <Text style={[styles.stepLabel, (done || active) && styles.stepLabelOn]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, gap: 24 },
  heading: { textAlign: 'center' },
  steps: { gap: 16, marginTop: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: { borderColor: colors.accent },
  dotDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  stepLabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, letterSpacing: 0.3 },
  stepLabelOn: { color: colors.ink },
});
