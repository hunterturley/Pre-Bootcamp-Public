import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { EditableField } from '../../components/EditableField';
import { Pill } from '../../components/Pill';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AVAILABLE_TAGS } from '../../constants';
import { useScanStore } from '../../store/scanStore';
import { colors, fonts, radii, type } from '../../theme';

export function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const draft = useScanStore((s) => s.draft);
  const pipelines = useScanStore((s) => s.pipelines);
  const updateDraft = useScanStore((s) => s.updateDraft);
  const toggleTag = useScanStore((s) => s.toggleTag);
  const push = useScanStore((s) => s.push);
  const reset = useScanStore((s) => s.reset);

  if (!draft) return null;

  const confidencePct = Math.round(draft.confidence * 100);
  const syncing = draft.status === 'syncing';

  const onDiscard = () => {
    Alert.alert('Discard scan?', 'This card will not be saved.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: reset },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleRow}>
          <Text style={type.screenTitle}>Review</Text>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={12} color={colors.accent} />
            <Text style={styles.badgeText}>{confidencePct}% match</Text>
          </View>
        </View>

        <View style={styles.fields}>
          <EditableField
            icon="person-outline"
            label="Full Name"
            value={`${draft.firstName}${draft.lastName ? ' ' + draft.lastName : ''}`.trim()}
            onChangeText={(t) => {
              const [first, ...rest] = t.split(' ');
              updateDraft({ firstName: first ?? '', lastName: rest.join(' ') });
            }}
            placeholder="Jane Doe"
            autoCapitalize="words"
          />
          <EditableField
            icon="briefcase-outline"
            label="Title"
            value={draft.title ?? ''}
            onChangeText={(t) => updateDraft({ title: t })}
            placeholder="Listing Agent"
            autoCapitalize="words"
          />
          <EditableField
            icon="business-outline"
            label="Company"
            value={draft.company ?? ''}
            onChangeText={(t) => updateDraft({ company: t })}
            placeholder="Keller Williams"
            autoCapitalize="words"
          />
          <EditableField
            icon="call-outline"
            label="Phone"
            value={draft.phone ?? ''}
            onChangeText={(t) => updateDraft({ phone: t })}
            placeholder="+15551234567"
            keyboardType="phone-pad"
          />
          <EditableField
            icon="mail-outline"
            label="Email"
            value={draft.email ?? ''}
            onChangeText={(t) => updateDraft({ email: t })}
            placeholder="jane@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <EditableField
            icon="globe-outline"
            label="Website"
            value={draft.website ?? ''}
            onChangeText={(t) => updateDraft({ website: t })}
            placeholder="example.com"
            autoCapitalize="none"
          />
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={type.sectionLabel}>Tags</Text>
          <View style={styles.pills}>
            {AVAILABLE_TAGS.map((tag) => (
              <Pill
                key={tag}
                label={tag}
                active={draft.tags.includes(tag)}
                onPress={() => toggleTag(tag)}
              />
            ))}
          </View>
        </View>

        {/* Pipeline picker */}
        <View style={styles.section}>
          <Text style={type.sectionLabel}>Pipeline</Text>
          <View style={styles.pills}>
            {pipelines.map((p) => (
              <Pill
                key={p.id}
                label={p.name}
                active={draft.pipelineId === p.id}
                onPress={() =>
                  updateDraft({ pipelineId: p.id, pipelineStageId: p.stages[0]?.id })
                }
              />
            ))}
          </View>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={type.sectionLabel}>Note</Text>
          <TextInput
            value={draft.note ?? ''}
            onChangeText={(t) => updateDraft({ note: t })}
            placeholder="Met at the Maple St open house. Looking in the $400-500k range."
            placeholderTextColor={colors.muted}
            multiline
            style={styles.note}
          />
        </View>
      </ScrollView>

      {/* Action row */}
      <View style={[styles.actions, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable onPress={onDiscard} style={styles.trash} disabled={syncing}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
        <PrimaryButton
          label="Push to CRM"
          icon="cloud-upload-outline"
          loading={syncing}
          onPress={push}
          style={styles.pushBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 16, gap: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accentLine,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  badgeText: { fontFamily: fonts.mono, fontSize: 11, color: colors.accent, letterSpacing: 0.2 },
  fields: { gap: 10 },
  section: { gap: 10 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  note: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.field,
    padding: 12,
    minHeight: 84,
    textAlignVertical: 'top',
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
  },
  trash: {
    width: 52,
    height: 52,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  pushBtn: { flex: 1 },
});
