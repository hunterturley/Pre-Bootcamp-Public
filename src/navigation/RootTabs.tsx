import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScanTab } from '../screens/scan/ScanTab';
import { StubScreen } from '../screens/StubScreen';
import { useAuthStore } from '../store/authStore';
import { colors, fonts, radii, type } from '../theme';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Scan: 'scan-outline',
  Contacts: 'people-outline',
  Pipeline: 'git-branch-outline',
  Settings: 'settings-outline',
};

function ContactsScreen() {
  return (
    <StubScreen
      title="Contacts"
      icon="people-outline"
      blurb="Every card you scan lands here, synced from your CRM with tags and status."
    />
  );
}

function PipelineScreen() {
  return (
    <StubScreen
      title="Pipeline"
      icon="git-branch-outline"
      blurb="See new leads move through your Buyer, Seller, and Referral stages at a glance."
    />
  );
}

function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const email = useAuthStore((s) => s.email);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <View style={[styles.settings, { paddingTop: insets.top + 24 }]}>
      <Text style={type.screenTitle}>Settings</Text>

      <View style={styles.accountCard}>
        <Text style={type.fieldKey}>Signed in as</Text>
        <Text style={styles.email}>{email ?? 'Unknown account'}</Text>
      </View>

      <Text style={styles.note}>
        Default tags, default pipeline, and account preferences are coming soon.
      </Text>

      <Pressable onPress={() => signOut()} style={styles.signOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

export function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.lineSoft },
        tabBarLabelStyle: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.4 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name] ?? 'ellipse-outline'} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Scan" component={ScanTab} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Pipeline" component={PipelineScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  settings: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, gap: 18 },
  accountCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    borderRadius: radii.card,
    padding: 16,
    gap: 4,
  },
  email: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.ink },
  note: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 19, color: colors.muted },
  signOut: {
    marginTop: 'auto',
    marginBottom: 24,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  signOutText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.danger },
});
