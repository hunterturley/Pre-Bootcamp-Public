import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, radii, type } from '../theme';

/**
 * Review-screen field: leading icon, DM Mono key label, editable value.
 */
export function EditableField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'words' | 'sentences';
}) {
  return (
    <View style={styles.field}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={16} color={colors.accent} />
      </View>
      <View style={styles.body}>
        <Text style={type.fieldKey}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.field,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  input: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.ink, paddingVertical: 2, marginTop: 1 },
});
