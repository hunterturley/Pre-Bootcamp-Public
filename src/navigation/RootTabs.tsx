import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { ScanTab } from '../screens/scan/ScanTab';
import { StubScreen } from '../screens/StubScreen';
import { colors, fonts } from '../theme';

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
  return (
    <StubScreen
      title="Settings"
      icon="settings-outline"
      blurb="Default tags, default pipeline, and your connected Switchboard account live here."
    />
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
