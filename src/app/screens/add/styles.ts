import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "../../../theme/tokens";

export const styles = StyleSheet.create({
  content: {
    gap: spacing[5],
    paddingBottom: spacing[8],
  },
  heroCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 28,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[4],
  },
  heroEyebrow: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.6,
  },
  contentCard: {
    backgroundColor: colors.surfaceRaised,
  },
  petGrid: {
    marginTop: spacing[4],
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  petTile: {
    width: "48%",
    minHeight: 144,
    borderRadius: 22,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
    justifyContent: "space-between",
    gap: spacing[3],
  },
  addPetTile: {
    alignItems: "flex-start",
  },
  petAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  petAvatarText: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  petTileName: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    letterSpacing: -0.2,
  },
  petTileMeta: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  addPetIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brandPrimarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  addPetIconText: {
    color: colors.brandPrimaryHover,
    fontSize: 26,
    lineHeight: 28,
    fontWeight: typography.weight.semibold,
  },
  overlayBackdrop: {
    flex: 1,
    backgroundColor: colors.overlayScrimSoft,
    justifyContent: "flex-end",
  },
  overlayDismissArea: {
    flex: 1,
  },
  overlaySheet: {
    backgroundColor: colors.bgSubtle,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[6],
    maxHeight: "88%",
    gap: spacing[4],
  },
  overlayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overlayEyebrow: {
    color: colors.textTertiary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  overlayTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginTop: spacing[1],
  },
  closeButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 999,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  closeButtonLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  overlayContent: {
    gap: spacing[4],
    paddingBottom: spacing[8],
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  form: {
    gap: spacing[3],
    marginTop: spacing[4],
  },
  actionTile: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 18,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  actionTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  photoSelectionCard: {
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: 18,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  photoSelectionMeta: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  inlineToggle: {
    alignSelf: "flex-start",
  },
  inlineToggleLabel: {
    color: colors.brandPrimaryHover,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
