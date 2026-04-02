import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton, Card, EmptyState, InlineMessage, Pill, Screen, SectionTitle, SegmentedControl, TextField } from "../../components/ui";
import { formatDueDate } from "../../lib/date";
import { canManageReminders, canViewReminders } from "../../lib/permissions";
import { useAppStore } from "../../state/appStore";
import { usePetStore } from "../../state/petStore";
import { getReminderGroup, useReminderStore } from "../../state/reminderStore";
import { useAuthStore } from "../../state/authStore";
import { colors, radii, spacing, typography } from "../../theme/tokens";

const groupLabels = {
  today: "Tänään",
  upcoming: "Tulossa",
  overdue: "Myöhässä",
  completed: "Valmiit",
} as const;

export function RemindersScreen() {
  const pets = usePetStore((state) => state.pets);
  const reminders = useReminderStore((state) => state.reminders);
  const updateReminder = useReminderStore((state) => state.updateReminder);
  const completeReminder = useReminderStore((state) => state.completeReminder);
  const cancelReminder = useReminderStore((state) => state.cancelReminder);
  const viewerRole = useAppStore((state) => state.viewerRole);
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setPendingAddSection = useAppStore((state) => state.setPendingAddSection);
  const pendingReminderDetailId = useAppStore((state) => state.pendingReminderDetailId);
  const setPendingReminderDetailId = useAppStore((state) => state.setPendingReminderDetailId);
  const flashMessage = useAppStore((state) => state.flashMessage);
  const setFlashMessage = useAppStore((state) => state.setFlashMessage);
  const [selectedPetFilter, setSelectedPetFilter] = useState<string>("all");
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueAt, setEditDueAt] = useState("");
  const [editMessage, setEditMessage] = useState<string | null>(null);
  const canManageRemindersAccess = canManageReminders(viewerRole);
  const canViewRemindersAccess = canViewReminders(viewerRole);
  const currentAssigneeLabel = sessionUser?.displayName ?? "Sinä";
  const pendingReminders = groupedCount(reminders, currentAssigneeLabel, "pending");
  const completedReminders = groupedCount(reminders, currentAssigneeLabel, "completed");
  const cancelledReminders = groupedCount(reminders, currentAssigneeLabel, "cancelled");

  const filterOptions = useMemo(
    () => [{ label: "Kaikki", value: "all" }, ...pets.map((pet) => ({ label: pet.name, value: pet.id }))],
    [pets],
  );
  const groupedReminders = useMemo(
    () =>
      Object.entries(groupLabels).map(([groupKey, label]) => ({
        groupKey,
        label,
        items: reminders.filter((reminder) => {
          const matchesPet = selectedPetFilter === "all" || reminder.petId === selectedPetFilter;
          const matchesViewer = reminder.assigneeLabel === currentAssigneeLabel;
          return matchesPet && matchesViewer && getReminderGroup(reminder) === groupKey;
        }),
      })),
    [currentAssigneeLabel, reminders, selectedPetFilter],
  );
  const hasVisibleReminders = groupedReminders.some((group) => group.items.length > 0);
  const selectedReminder = reminders.find((item) => item.id === selectedReminderId) ?? null;
  const selectedReminderPet = selectedReminder ? pets.find((item) => item.id === selectedReminder.petId) : undefined;

  useEffect(() => {
    if (!flashMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      setFlashMessage(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [flashMessage, setFlashMessage]);

  useEffect(() => {
    if (!pendingReminderDetailId) {
      return;
    }

    setSelectedReminderId(pendingReminderDetailId);
    setEditingReminderId(null);
    setPendingReminderDetailId(null);
  }, [pendingReminderDetailId, setPendingReminderDetailId]);

  function beginReminderEdit(reminderId: string) {
    const reminder = reminders.find((item) => item.id === reminderId);

    if (!reminder) {
      return;
    }

    setEditingReminderId(reminderId);
    setSelectedReminderId(reminderId);
    setEditTitle(reminder.title);
    setEditDescription(reminder.description ?? "");
    setEditDueAt(formatReminderInputValue(reminder.dueAt));
    setEditMessage(null);
  }

  function handleSaveReminder() {
    if (!editingReminderId) {
      return;
    }

    const nextTitle = editTitle.trim();
    const nextDueAt = editDueAt.trim();

    if (!nextTitle || !nextDueAt) {
      setEditMessage("Otsikko ja ajankohta ovat pakolliset.");
      return;
    }

    const parsedDate = new Date(nextDueAt);
    if (Number.isNaN(parsedDate.getTime())) {
      setEditMessage("Ajankohdan muodoksi sopii esimerkiksi 2026-04-01T09:00.");
      return;
    }

    updateReminder(editingReminderId, {
      title: nextTitle,
      description: editDescription.trim() || undefined,
      dueAt: parsedDate.toISOString(),
    });
      setEditMessage("Muistutus tallennettu.");
    setEditingReminderId(null);
  }

  function openAddReminder() {
    setPendingAddSection("reminders");
    setActiveTab("pets");
  }

  function returnToReminderList() {
    setSelectedReminderId(null);
    setEditingReminderId(null);
    setSelectedPetFilter("all");
    setActiveTab("reminders");
  }

  return (
    <Screen>
      {!selectedReminder ? (
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Muistutukset</Text>
          <Text style={styles.heroTitle}>Kaikki muistutukset yhdessä paikassa</Text>
          <Text style={styles.heroBody}>Näe tulevat tehtävät, päivitä niitä ja kuittaa valmiiksi.</Text>
          {canViewRemindersAccess ? (
            <View style={styles.heroSummary}>
              <SummaryTile label="Avoinna" value={String(pendingReminders)} />
              <SummaryTile label="Valmiit" value={String(completedReminders)} />
              <SummaryTile label="Perutut" value={String(cancelledReminders)} />
            </View>
          ) : null}
        </View>
      ) : null}
      {!canViewRemindersAccess ? (
        <Card>
          <InlineMessage
            tone="warning"
            message={
              viewerRole === "caretaker"
                ? "Hoitaja ei näe muistutuksia."
                : "Kasvattajan muistutukset on piilotettu tästä näkymästä."
            }
          />
        </Card>
      ) : null}
      {canViewRemindersAccess ? (
        <>
      {selectedReminder && editingReminderId !== selectedReminder.id ? (
        <>
          <View style={styles.detailScreenHeader}>
            <Pressable
              onPress={returnToReminderList}
              style={styles.detailBackButton}
            >
              <Text style={styles.detailBackLabel}>Takaisin</Text>
            </Pressable>
            {canManageRemindersAccess ? (
              <Pressable onPress={openAddReminder} style={styles.detailAddButton}>
                <Text style={styles.detailAddLabel}>Lisää muistutus</Text>
              </Pressable>
            ) : null}
          </View>
          <Card style={styles.selectedReminderCard}>
            <View style={styles.selectedReminderTop}>
              <View style={styles.selectedReminderCopy}>
                <Text style={styles.selectedReminderTitle}>{selectedReminder.title}</Text>
                <Text style={styles.selectedReminderPet}>{selectedReminderPet?.name ?? "Lemmikki"}</Text>
                <Text style={styles.selectedReminderDate}>{formatDueDate(selectedReminder.dueAt)}</Text>
              </View>
              <Pill
                label={formatReminderStatus(selectedReminder.status)}
                tone={
                  selectedReminder.status === "completed"
                    ? "success"
                    : getReminderGroup(selectedReminder) === "overdue"
                      ? "danger"
                      : getReminderGroup(selectedReminder) === "today"
                        ? "warning"
                        : "brand"
                }
              />
            </View>

            <View style={styles.selectedReminderMetaRow}>
              <Pill label={formatReminderType(selectedReminder.type)} tone="neutral" />
              <Text style={styles.selectedReminderMetaText}>{selectedReminder.assigneeLabel}</Text>
            </View>

            <View style={styles.selectedReminderSection}>
              <Text style={styles.selectedReminderSectionLabel}>Kuvaus</Text>
              <Text style={styles.selectedReminderSectionText}>
                {selectedReminder.description ?? "Ei lisätietoja"}
              </Text>
            </View>

            <View style={styles.selectedReminderSection}>
              <Text style={styles.selectedReminderSectionLabel}>Ajankohta</Text>
              <Text style={styles.selectedReminderSectionText}>{formatDueDate(selectedReminder.dueAt)}</Text>
            </View>

            {selectedReminder.status === "pending" && canManageRemindersAccess ? (
              <View style={styles.actionRow}>
                <Pressable onPress={() => completeReminder(selectedReminder.id)} style={[styles.actionButton, styles.actionButtonPrimary]}>
                  <Text style={[styles.actionLabel, styles.actionLabelPrimary]}>Kuittaa valmiiksi</Text>
                </Pressable>
                <Pressable onPress={() => beginReminderEdit(selectedReminder.id)} style={[styles.actionButton, styles.actionButtonNeutral]}>
                  <Text style={styles.actionLabel}>Muokkaa</Text>
                </Pressable>
                <Pressable onPress={() => cancelReminder(selectedReminder.id)} style={[styles.actionButton, styles.actionButtonDanger]}>
                  <Text style={[styles.actionLabel, styles.actionLabelDanger]}>Peruuta</Text>
                </Pressable>
              </View>
            ) : null}
          </Card>
        </>
      ) : null}
      {!selectedReminder ? (
        <>
      {flashMessage ? (
        <Card>
          <InlineMessage tone="info" message={flashMessage} />
        </Card>
      ) : null}
      <Card>
        <InlineMessage tone="info" message="Näkymässä näkyvät sinun omat muistutuksesi." />
      </Card>
      <Card>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Rajaa lemmikin mukaan</Text>
          <SegmentedControl options={filterOptions} value={selectedPetFilter} onChange={setSelectedPetFilter} />
        </View>
      </Card>
      {canManageRemindersAccess ? (
        <AppButton label="Lisää muistutus" onPress={openAddReminder} />
      ) : null}
      {!hasVisibleReminders ? (
        <Card>
          <EmptyState
            title="Ei muistutuksia"
            message="Lisää muistutus, niin se näkyy tässä."
            actionLabel="Lisää muistutus"
            onAction={openAddReminder}
          />
        </Card>
      ) : null}
      {groupedReminders.map(({ groupKey, label, items }) => {
        if (!items.length) return null;

        return (
          <View key={groupKey} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{label}</Text>
              <Pill label={`${items.length}`} tone={groupKey === "overdue" ? "warning" : groupKey === "completed" ? "success" : "brand"} />
            </View>
            {items.map((reminder) => {
              const pet = pets.find((item) => item.id === reminder.petId);

              return (
                <Card key={reminder.id} style={styles.reminderCard}>
                  {editingReminderId === reminder.id ? (
                    <View style={styles.editForm}>
                      {editMessage ? <InlineMessage tone="info" message={editMessage} /> : null}
                      <TextField label="Otsikko" value={editTitle} onChangeText={setEditTitle} placeholder="Otsikko" />
                      <TextField
                        label="Kuvaus"
                        value={editDescription}
                        onChangeText={setEditDescription}
                        placeholder="Kuvaus"
                      />
                      <TextField label="Ajankohta" value={editDueAt} onChangeText={setEditDueAt} placeholder="2026-04-01T09:00" />
                      <View style={styles.editActionRow}>
                          <AppButton label="Tallenna muutokset" onPress={handleSaveReminder} />
                        <AppButton
                          label="Peruuta"
                          onPress={() => {
                            setEditingReminderId(null);
                            setEditMessage(null);
                          }}
                          secondary
                        />
                      </View>
                    </View>
                  ) : (
                    <>
                      <Pressable onPress={() => setSelectedReminderId(reminder.id)} style={({ pressed }) => [styles.reminderPressable, pressed && styles.reminderPressablePressed]}>
                        <View style={styles.topRow}>
                          <View style={styles.content}>
                            <Text style={styles.title}>{reminder.title}</Text>
                            <Text style={styles.description}>
                              {reminder.description ?? "Ei tarkennuksia"}
                            </Text>
                          </View>
                          <Pill
                            label={reminder.status === "completed" ? "Kuitattu" : reminder.assigneeLabel}
                            tone={reminder.status === "completed" ? "success" : "brand"}
                          />
                        </View>
                        <View style={styles.metaRow}>
                          <Text style={styles.metaText}>{pet?.name}</Text>
                          <Text style={styles.metaText}>{formatDueDate(reminder.dueAt)}</Text>
                        </View>
                        <View style={styles.cardMetaRow}>
                          <Pill label={formatReminderType(reminder.type)} tone="neutral" />
                          <Text style={styles.cardMetaText}>{formatReminderStatus(reminder.status)}</Text>
                        </View>
                      </Pressable>
                      {reminder.status === "pending" && canManageRemindersAccess ? (
                        <View style={styles.actionRow}>
                          <Pressable
                            onPress={() => setSelectedReminderId(reminder.id)}
                            style={[styles.actionButton, styles.actionButtonNeutral]}
                          >
                            <Text style={styles.actionLabel}>Avaa</Text>
                          </Pressable>
                          <Pressable onPress={() => completeReminder(reminder.id)} style={[styles.actionButton, styles.actionButtonPrimary]}>
                            <Text style={[styles.actionLabel, styles.actionLabelPrimary]}>Kuittaa valmiiksi</Text>
                          </Pressable>
                          <Pressable onPress={() => beginReminderEdit(reminder.id)} style={[styles.actionButton, styles.actionButtonNeutral]}>
                            <Text style={styles.actionLabel}>Muokkaa</Text>
                          </Pressable>
                          <Pressable onPress={() => cancelReminder(reminder.id)} style={[styles.actionButton, styles.actionButtonDanger]}>
                            <Text style={[styles.actionLabel, styles.actionLabelDanger]}>Peruuta</Text>
                          </Pressable>
                        </View>
                      ) : null}
                      {reminder.status !== "pending" ? (
                        <View style={styles.actionRow}>
                          <Pressable
                            onPress={() => setSelectedReminderId(reminder.id)}
                            style={[styles.actionButton, styles.actionButtonNeutral]}
                          >
                            <Text style={styles.actionLabel}>Avaa</Text>
                          </Pressable>
                        </View>
                      ) : null}
                    </>
                  )}
                </Card>
              );
            })}
          </View>
        );
      })}
        </>
      ) : null}
        </>
      ) : null}
    </Screen>
  );
}

function formatReminderInputValue(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function groupedCount(
  reminders: ReturnType<typeof useReminderStore.getState>["reminders"],
  assigneeLabel: string,
  status: "pending" | "completed" | "cancelled",
) {
  return reminders.filter((item) => item.assigneeLabel === assigneeLabel && item.status === status).length;
}

function formatReminderType(value: "manual" | "vaccination" | "medication" | "vet_visit") {
  switch (value) {
    case "vaccination":
      return "Rokotus";
    case "medication":
      return "Lääkitys";
    case "vet_visit":
      return "Käynti";
    default:
      return "Yleinen";
  }
}

function formatReminderStatus(value: "pending" | "completed" | "cancelled") {
  switch (value) {
    case "completed":
      return "Kuitattu";
    case "cancelled":
      return "Peruttu";
    default:
      return "Avoin";
  }
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryTile}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    gap: spacing[4],
    borderRadius: 28,
    backgroundColor: colors.surfaceSoft,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    shadowColor: colors.brandPrimaryHover,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  heroEyebrow: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.brandPrimary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: typography.size["2xl"],
    lineHeight: 34,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  heroBody: {
    fontSize: typography.size.md,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  heroSummary: {
    flexDirection: "row",
    gap: spacing[3],
  },
  summaryTile: {
    flex: 1,
    gap: spacing[2],
    borderRadius: 20,
    backgroundColor: colors.surfaceInfo,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  summaryLabel: {
    color: colors.textTertiary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    letterSpacing: -0.4,
  },
  filterSection: {
    gap: spacing[3],
  },
  filterLabel: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  group: {
    gap: spacing[3],
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  groupTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  reminderCard: {
    backgroundColor: colors.surfaceSoft,
  },
  reminderPressable: {
    gap: spacing[1],
  },
  reminderPressablePressed: {
    opacity: 0.8,
  },
  detailScreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  detailBackButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    paddingHorizontal: spacing[4],
    borderRadius: radii.full,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    justifyContent: "center",
  },
  detailBackLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  detailAddButton: {
    minHeight: 40,
    paddingHorizontal: spacing[4],
    borderRadius: radii.full,
    backgroundColor: colors.surfaceAccent,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    justifyContent: "center",
  },
  detailAddLabel: {
    color: colors.brandPrimaryHover,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  selectedReminderCard: {
    backgroundColor: colors.surfaceSoft,
    gap: spacing[4],
  },
  selectedReminderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  selectedReminderCopy: {
    flex: 1,
    gap: spacing[2],
  },
  selectedReminderTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  selectedReminderPet: {
    fontSize: typography.size.md,
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
  },
  selectedReminderDate: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  selectedReminderMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  selectedReminderMetaText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  selectedReminderSection: {
    gap: spacing[1],
  },
  selectedReminderSectionLabel: {
    color: colors.textTertiary,
    fontSize: typography.size.sm,
  },
  selectedReminderSectionText: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    lineHeight: 22,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  content: {
    flex: 1,
    gap: spacing[2],
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  description: {
    fontSize: typography.size.sm,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  metaRow: {
    marginTop: spacing[3],
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    color: colors.textTertiary,
    fontSize: typography.size.sm,
  },
  cardMetaRow: {
    marginTop: spacing[3],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  cardMetaText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  actionRow: {
    marginTop: spacing[3],
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
  },
  actionButton: {
    minHeight: 40,
    borderRadius: 14,
    paddingHorizontal: spacing[4],
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonNeutral: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  actionButtonPrimary: {
    backgroundColor: colors.surfaceAccent,
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  actionButtonDanger: {
    backgroundColor: colors.surfaceDanger,
    borderWidth: 1,
    borderColor: colors.borderDanger,
  },
  actionLabelPrimary: {
    color: colors.brandPrimaryHover,
  },
  actionLabelDanger: {
    color: colors.textWarning,
  },
  actionLabel: {
    paddingHorizontal: spacing[4],
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  editForm: {
    gap: spacing[3],
  },
  editActionRow: {
    flexDirection: "row",
    gap: spacing[3],
  },
});
