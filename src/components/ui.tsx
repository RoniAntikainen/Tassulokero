import React, { ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

import { colors, radii, shadows, spacing, typography } from "../theme/tokens";

export function Screen({
  children,
  scrollable = true,
}: {
  children: ReactNode;
  scrollable?: boolean;
}) {
  if (!scrollable) {
    return <View style={styles.screen}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({
  title,
  actionLabel,
}: {
  title: string;
  actionLabel?: string;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <View style={styles.sectionActionBadge}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function Pill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "brand" | "warning" | "danger" | "success";
}) {
  return (
    <View
      style={[
        styles.pill,
        tone === "brand" && styles.pillBrand,
        tone === "warning" && styles.pillWarning,
        tone === "danger" && styles.pillDanger,
        tone === "success" && styles.pillSuccess,
      ]}
    >
      <Text style={[styles.pillText, tone === "brand" && styles.pillTextBrand]}>
        {label}
      </Text>
    </View>
  );
}

export function AppButton({
  label,
  secondary,
  onPress,
  accessibilityLabel,
  disabled,
}: {
  label: string;
  secondary?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[
        styles.button,
        secondary && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  accessibilityHint,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  accessibilityHint?: string;
  editable?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        style={[styles.input, !editable && styles.inputDisabled]}
      />
    </View>
  );
}

export function PickerField<TValue extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = "Valitse",
  compact = false,
  hideLabel = false,
}: {
  label: string;
  value?: TValue;
  onChange: (value: TValue) => void;
  options: { label: string; value: TValue }[];
  placeholder?: string;
  compact?: boolean;
  hideLabel?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.fieldWrap}>
      {!hideLabel ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <Pressable onPress={() => setOpen((current) => !current)} style={[styles.pickerButton, compact && styles.pickerButtonCompact]}>
        <Text style={[styles.pickerButtonText, !selected && styles.pickerButtonPlaceholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <Text style={styles.pickerChevron}>{open ? "˄" : "˅"}</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlayScrim} onPress={() => setOpen(false)}>
          <Pressable style={styles.overlayCard} onPress={() => undefined}>
            <View style={styles.overlayHeader}>
              <Text style={styles.overlayTitle}>{label}</Text>
              <Pressable onPress={() => setOpen(false)} style={styles.overlayClose}>
                <Text style={styles.overlayCloseText}>Sulje</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.overlayScroll} contentContainerStyle={styles.overlayScrollContent}>
              {options.map((option) => {
                const active = option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    style={[styles.overlayOption, active && styles.overlayOptionActive]}
                  >
                    <Text style={[styles.overlayOptionText, active && styles.overlayOptionTextActive]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function DatePickerField({
  label,
  value,
  onChange,
  placeholder = "Valitse päivämäärä",
  yearStart = 2010,
  yearEnd = new Date().getFullYear() + 2,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  yearStart?: number;
  yearEnd?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const initialDate = React.useMemo(() => {
    if (value) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  }, [value]);
  const [visibleMonth, setVisibleMonth] = React.useState(initialDate.getMonth());
  const [visibleYear, setVisibleYear] = React.useState(initialDate.getFullYear());

  React.useEffect(() => {
    setVisibleMonth(initialDate.getMonth());
    setVisibleYear(initialDate.getFullYear());
  }, [initialDate]);

  const selectedValue = React.useMemo(() => {
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [value]);

  const monthLabel = new Intl.DateTimeFormat("fi-FI", {
    month: "long",
    year: "numeric",
  }).format(new Date(visibleYear, visibleMonth, 1));

  const days = React.useMemo(() => {
    const firstWeekday = (new Date(visibleYear, visibleMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
    const result: Array<{ key: string; value?: string; label?: number }> = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      result.push({ key: `empty-${index}` });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const nextValue = `${String(visibleYear)}-${String(visibleMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      result.push({ key: nextValue, value: nextValue, label: day });
    }

    return result;
  }, [visibleMonth, visibleYear]);

  function moveMonth(direction: -1 | 1) {
    const next = new Date(visibleYear, visibleMonth + direction, 1);
    const nextYear = next.getFullYear();
    if (nextYear < yearStart || nextYear > yearEnd) {
      return;
    }
    setVisibleYear(nextYear);
    setVisibleMonth(next.getMonth());
  }

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable onPress={() => setOpen(true)} style={styles.pickerButton}>
        <Text style={[styles.pickerButtonText, !value && styles.pickerButtonPlaceholder]}>
          {value
            ? new Intl.DateTimeFormat("fi-FI", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value))
            : placeholder}
        </Text>
        <Text style={styles.pickerChevron}>˅</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlayScrim} onPress={() => setOpen(false)}>
          <Pressable style={[styles.overlayCard, styles.calendarCard]} onPress={() => undefined}>
            <View style={styles.overlayHeader}>
              <Text style={styles.overlayTitle}>{label}</Text>
              <Pressable onPress={() => setOpen(false)} style={styles.overlayClose}>
                <Text style={styles.overlayCloseText}>Sulje</Text>
              </Pressable>
            </View>
            <View style={styles.calendarHeader}>
              <Pressable onPress={() => moveMonth(-1)} style={styles.calendarNav}>
                <Text style={styles.calendarNavText}>‹</Text>
              </Pressable>
              <Text style={styles.calendarMonthLabel}>{monthLabel}</Text>
              <Pressable onPress={() => moveMonth(1)} style={styles.calendarNav}>
                <Text style={styles.calendarNavText}>›</Text>
              </Pressable>
            </View>
            <View style={styles.calendarWeekdays}>
              {["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"].map((weekday) => (
                <Text key={weekday} style={styles.calendarWeekday}>
                  {weekday}
                </Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {days.map((item) => {
                if (!item.value) {
                  return <View key={item.key} style={styles.calendarDayEmpty} />;
                }

                const active = selectedValue?.toISOString().slice(0, 10) === item.value;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => {
                      onChange(item.value!);
                      setOpen(false);
                    }}
                    style={[styles.calendarDay, active && styles.calendarDayActive]}
                  >
                    <Text style={[styles.calendarDayText, active && styles.calendarDayTextActive]}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function SegmentedControl<TValue extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: TValue }[];
  value: TValue;
  onChange: (value: TValue) => void;
}) {
  return (
    <View style={styles.segmentedWrap}>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option.label}
            style={[styles.segmentedItem, active && styles.segmentedItemActive]}
          >
            <Text style={[styles.segmentedLabel, active && styles.segmentedLabelActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function InlineMessage({
  message,
  tone = "info",
}: {
  message: string;
  tone?: "info" | "warning";
}) {
  return (
    <View style={[styles.inlineMessage, tone === "warning" && styles.inlineMessageWarning]}>
      <Text style={styles.inlineMessageText}>{message}</Text>
    </View>
  );
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.stateCard}>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {actionLabel && onAction ? (
        <View style={styles.stateAction}>
          <AppButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

export function ErrorState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View style={[styles.stateCard, styles.stateCardDanger]}>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
    </View>
  );
}

export function LoadingState({
  title = "Ladataan",
  message = "Valmistellaan näkymää.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <View style={styles.stateCard}>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
    </View>
  );
}

export function MockMediaPreview({
  label,
  compact,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.mediaPreview, compact && styles.mediaPreviewCompact]}>
      <Text style={styles.mediaPreviewEyebrow}>Kuva</Text>
      <Text numberOfLines={compact ? 1 : 2} style={styles.mediaPreviewLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgSubtle,
  },
  screenContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: 136,
    gap: spacing[6],
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.xl,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    overflow: "hidden",
    ...shadows.card,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  sectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    letterSpacing: -0.35,
    lineHeight: 28,
  },
  sectionAction: {
    fontSize: typography.size.sm,
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
  },
  sectionActionBadge: {
    borderRadius: radii.full,
    backgroundColor: colors.brandSecondarySoft,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  pill: {
    alignSelf: "flex-start",
    borderRadius: radii.full,
    backgroundColor: colors.bgBase,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  pillBrand: {
    backgroundColor: colors.brandPrimarySoft,
    borderColor: "#DCEAD9",
  },
  pillWarning: {
    backgroundColor: "#FFF8E8",
    borderColor: "#F1DFB3",
  },
  pillDanger: {
    backgroundColor: "#FDF0EC",
    borderColor: "#EFCFC5",
  },
  pillSuccess: {
    backgroundColor: "#EEF8F1",
    borderColor: "#D3E8D9",
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  pillTextBrand: {
    color: colors.brandPrimaryHover,
  },
  button: {
    minHeight: 54,
    borderRadius: radii.xl,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[5],
    borderWidth: 1,
    borderColor: colors.brandPrimaryHover,
    shadowColor: colors.brandPrimaryHover,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  buttonSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: -0.2,
  },
  buttonTextSecondary: {
    color: colors.textSecondary,
  },
  fieldWrap: {
    gap: spacing[3],
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  input: {
    minHeight: 56,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    color: colors.textPrimary,
    fontSize: typography.size.md,
    shadowColor: "#101828",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  inputDisabled: {
    backgroundColor: colors.bgSubtle,
    color: colors.textSecondary,
  },
  segmentedWrap: {
    flexDirection: "row",
    gap: spacing[2],
    padding: spacing[1],
    borderRadius: radii.xl,
    backgroundColor: colors.brandSecondarySoft,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  segmentedItem: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.lg,
    paddingHorizontal: spacing[2],
  },
  segmentedItemActive: {
    backgroundColor: "#FCFDFE",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    shadowColor: "#101828",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  segmentedLabel: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  segmentedLabelActive: {
    color: colors.textPrimary,
    fontWeight: typography.weight.semibold,
  },
  inlineMessage: {
    borderRadius: 18,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inlineMessageWarning: {
    backgroundColor: "#FFFBF2",
    borderColor: "#F0E0B6",
  },
  inlineMessageText: {
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: typography.size.sm,
  },
  stateCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: "#FFFFFF",
    padding: spacing[6],
    gap: spacing[3],
  },
  stateCardDanger: {
    backgroundColor: "#FFF7F4",
  },
  stateTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    lineHeight: 28,
  },
  stateMessage: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: 22,
  },
  stateAction: {
    marginTop: spacing[1],
  },
  mediaPreview: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  mediaPreviewCompact: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  mediaPreviewEyebrow: {
    color: colors.brandPrimaryHover,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
  },
  mediaPreviewLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    lineHeight: 18,
    fontWeight: typography.weight.medium,
  },
  pickerButton: {
    minHeight: 56,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  pickerButtonCompact: {
    minHeight: 48,
    paddingHorizontal: spacing[4],
  },
  pickerButtonText: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    flex: 1,
  },
  pickerButtonPlaceholder: {
    color: colors.textTertiary,
  },
  pickerChevron: {
    color: colors.textTertiary,
    fontSize: typography.size.md,
    marginLeft: spacing[2],
  },
  overlayScrim: {
    flex: 1,
    backgroundColor: colors.overlayScrim,
    justifyContent: "center",
    padding: spacing[5],
  },
  overlayCard: {
    borderRadius: radii.xl,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
    shadowColor: "#101828",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  overlayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  overlayTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  overlayClose: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    backgroundColor: colors.brandSecondarySoft,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  overlayCloseText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  overlayScroll: {
    maxHeight: 320,
  },
  overlayScrollContent: {
    gap: spacing[2],
    paddingBottom: spacing[1],
  },
  overlayOption: {
    minHeight: 52,
    borderRadius: radii.lg,
    paddingHorizontal: spacing[4],
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  overlayOptionActive: {
    backgroundColor: colors.brandPrimarySoft,
    borderColor: colors.brandPrimary,
  },
  overlayOptionText: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  overlayOptionTextActive: {
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
  },
  calendarCard: {
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[4],
  },
  calendarNav: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSubtle,
  },
  calendarNavText: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
  },
  calendarMonthLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    textTransform: "capitalize",
  },
  calendarWeekdays: {
    flexDirection: "row",
    marginBottom: spacing[2],
  },
  calendarWeekday: {
    flex: 1,
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[1],
  },
  calendarDayEmpty: {
    width: "13.4%",
    aspectRatio: 1,
  },
  calendarDay: {
    width: "13.4%",
    aspectRatio: 1,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: "#FFFFFF",
  },
  calendarDayActive: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimaryHover,
  },
  calendarDayText: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  calendarDayTextActive: {
    color: colors.textInverse,
  },
});
