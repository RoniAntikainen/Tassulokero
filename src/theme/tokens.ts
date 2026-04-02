export const colors = {
  bgBase: "#FFFFFF",
  bgSubtle: "#F6F7F4",
  bgCard: "#FFFFFF",
  bgElevated: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  surfaceMuted: "#F3F5F1",
  surfaceSoft: "#FCFDFB",
  surfaceAccent: "#EEF6EE",
  surfaceAccentMuted: "#F7FAF6",
  surfaceSuccess: "#EEF8F1",
  surfaceWarning: "#FFF8EC",
  surfaceDanger: "#FFF4EF",
  surfaceInfo: "#F7FAFC",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  textInverse: "#FFFFFF",
  textWarning: "#B45309",
  borderDefault: "#E5E7EB",
  borderStrong: "#D1D5DB",
  borderFocus: "#7FA883",
  borderAccent: "#D6E6D7",
  borderSuccess: "#D3E8D9",
  borderWarning: "#EFD9A6",
  borderDanger: "#EDC7BA",
  brandPrimary: "#7FA883",
  brandPrimaryHover: "#5E8462",
  brandPrimarySoft: "#EEF6EE",
  brandSecondarySoft: "#F8FBF8",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC6B4D",
  info: "#3B82F6",
  overlayScrim: "rgba(17, 17, 17, 0.48)",
  overlayScrimSoft: "rgba(17, 24, 39, 0.18)",
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.45,
    relaxed: 1.6,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: "#101828",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
} as const;
