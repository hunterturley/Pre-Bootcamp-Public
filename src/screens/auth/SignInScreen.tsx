import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '../../components/BrandMark';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuthStore } from '../../store/authStore';
import { colors, fonts, radii, type } from '../../theme';

export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const signIn = useAuthStore((s) => s.signIn);
  const submitting = useAuthStore((s) => s.submitting);
  const error = useAuthStore((s) => s.error);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.top}>
          <BrandMark size={40} />
          <Text style={styles.sublabel}>Card Scanner</Text>
        </View>

        <View style={styles.middle}>
          <Text style={type.hero}>
            Sign in to <Text style={styles.accent}>Switchboard.</Text>
          </Text>
          <Text style={styles.body}>
            Use the email tied to your Switchboard account. Your scans sync to that CRM location.
          </Text>

          <View style={styles.fieldWrap}>
            <Text style={type.fieldKey}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@brokerage.com"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              style={styles.input}
              onSubmitEditing={() => signIn(email)}
              returnKeyType="go"
            />
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.bottom}>
          <PrimaryButton
            label="Continue"
            icon="arrow-forward"
            loading={submitting}
            onPress={() => signIn(email)}
          />
          <Text style={styles.legal}>
            Card images are sent to Switchboard's server for reading. Contact data is stored in your CRM.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  top: { gap: 6 },
  sublabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
    marginLeft: 2,
  },
  middle: { gap: 14 },
  accent: { color: colors.accent },
  body: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.mid },
  fieldWrap: {
    marginTop: 8,
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.field,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.ink, padding: 0 },
  error: { fontFamily: fonts.sans, fontSize: 13, color: colors.danger },
  bottom: { gap: 14 },
  legal: { fontFamily: fonts.mono, fontSize: 9, lineHeight: 14, letterSpacing: 0.2, color: colors.muted, textAlign: 'center' },
});
