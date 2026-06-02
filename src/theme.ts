/**
 * Switchboard brand design tokens.
 * Mirrors the switchboard-scanner-app.html prototype exactly.
 */

export const colors = {
  accent: '#2D6A4F', // forest green - primary
  accentMid: '#40916C',
  accentLight: '#52B788',
  accentBg: 'rgba(45,106,79,0.07)',
  accentLine: 'rgba(45,106,79,0.18)',
  bg: '#F6F5F2', // warm parchment - app background
  surface: '#EDEDEA',
  card: '#FFFFFF',
  ink: '#141412', // near-black text
  mid: '#3D3C39',
  muted: '#8A8984',
  faint: '#F0EFEC',
  line: 'rgba(20,20,18,0.10)',
  lineSoft: 'rgba(20,20,18,0.05)',
  danger: '#B23A3A',
} as const;

export const fonts = {
  sans: 'PlusJakartaSans', // headings, body, buttons
  sansBold: 'PlusJakartaSans_700Bold',
  sansExtra: 'PlusJakartaSans_800ExtraBold',
  mono: 'DMMono', // labels, wordmark, stats, tags
  monoMedium: 'DMMono_500Medium',
} as const;

export const radii = {
  card: 12,
  field: 12,
  button: 14,
  buttonLg: 15,
  pill: 20,
  brandMark: 9,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/** Type scale lifted from the prototype. */
export const type = {
  hero: { fontFamily: fonts.sansExtra, fontSize: 28, letterSpacing: -0.84, color: colors.ink },
  screenTitle: { fontFamily: fonts.sansExtra, fontSize: 22, color: colors.ink },
  body: { fontFamily: fonts.sans, fontSize: 14, color: colors.mid },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: colors.muted,
  },
  fieldValue: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.ink },
  fieldKey: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
    color: colors.muted,
  },
} as const;

/** Primary button shadow, ready to spread into a style object. */
export const primaryShadow = {
  shadowColor: '#2D6A4F',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.28,
  shadowRadius: 18,
  elevation: 6,
} as const;

export type ThemeColors = typeof colors;
