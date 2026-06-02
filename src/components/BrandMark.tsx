import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

import { colors, fonts, radii } from '../theme';

/**
 * Switchboard brand mark: rounded green square with the routing-lines icon
 * (three horizontal lines + two offset nodes), followed by the
 * `switch` (ink) + `board` (accent) wordmark.
 */
export function BrandMark({ size = 34, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.mark,
          { width: size, height: size, borderRadius: radii.brandMark },
        ]}
      >
        <RoutingLines size={size * 0.6} />
      </View>
      {showWordmark && (
        <Text style={styles.wordmark}>
          <Text style={styles.switch}>switch</Text>
          <Text style={styles.board}>board</Text>
        </Text>
      )}
    </View>
  );
}

function RoutingLines({ size }: { size: number }) {
  const s = size;
  const stroke = '#FFFFFF';
  const sw = Math.max(1.6, s * 0.085);
  const y = [s * 0.22, s * 0.5, s * 0.78];
  const node = s * 0.12;
  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Line x1={0} y1={y[0]} x2={s} y2={y[0]} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={0} y1={y[1]} x2={s} y2={y[1]} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={0} y1={y[2]} x2={s} y2={y[2]} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <Circle cx={s * 0.32} cy={y[0]} r={node} fill={colors.accent} stroke={stroke} strokeWidth={sw * 0.7} />
      <Circle cx={s * 0.68} cy={y[2]} r={node} fill={colors.accent} stroke={stroke} strokeWidth={sw * 0.7} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { fontFamily: fonts.mono, fontSize: 16, letterSpacing: -0.2 },
  switch: { color: colors.ink },
  board: { color: colors.accent },
});
