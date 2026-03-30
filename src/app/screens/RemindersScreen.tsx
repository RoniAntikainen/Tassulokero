import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton, Card, EmptyState, InlineMessage, Pill, Screen, SectionTitle, SegmentedControl, TextField } from "../../components/ui";
import { formatDueDate } from "../../lib/date";
import { useAppStore } from "../../state/appStore";
import { usePetStore } from "../../state/petStore";
import { getReminderGroup, useReminderStore } from "../../state/reminderStore";
import { colors, spacing, typography } from "../../theme/tokens";

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
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setPendingAddSection = useAppStore((state) => state.setPendingAddSection);
  const flashMessage = useAppStore((state) => state.flashMessage);
  const setFlashMessage = useAppStore((state) => state.setFlashMessage);
  const [selectedPetFilter, setSelectedPetFilter] = useState<string>("all");
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueAt, setEditDueAt] = useState("");
  const [editMessage, setEditMessage] = useState<string | null>(null);
  const canManageReminders = viewerRole === "owner" || viewerRole === "family";
  const canViewReminders = viewerRole === "owner" || viewerRole === "family";
  const currentAssigneeLabel = viewerRole === "family" ? "Sanna" : viewerRole === "owner" ? "Roni" : "";
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

  useEffect(() => {
    if (!flashMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      setFlashMessage(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [flashMessage, setFlashMessage]);

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
    setEditMessage("Muistutus päivitettiin.");
    setEditingReminderId(null);
  }

  function openAddReminder() {
    setPendingAddSection("reminders");
    setActiveTab("pets");
  }

  return (
    <Screen>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Muistutukset</Text>
        <Text style={styles.heroTitle}>Pidä tärkeät asiat hallinnassa</Text>
        <Text style={styles.heroBody}>Näe tulevat tehtävät, kuittaa ne valmiiksi ja tee muutokset yhdestä paikasta.</Text>
        {canViewReminders ? (
          <View style={styles.heroSummary}>
            <SummaryTile label="Avoinna" value={String(pendingReminders)} />
            <SummaryTile label="Valmiit" value={String(completedReminders)} />
            <SummaryTile label="Perutut" value={String(cancelledReminders)} />
          </View>
        ) : null}
      </View>
      {!canViewReminders ? (
        <Card>
          <InlineMessage
            tone="warning"
            message={
              viewerRole === "caretaker"
                ? "Hoitaja ei näe eikä voi hallita muistutuksia."
                : "Kasvattajan muistutukset ovat tässä näkymässä piilossa."
            }
          />
        </Card>
      ) : null}
      {canViewReminders ? (
        <>
      {flashMessage ? (
        <Card>
          <InlineMessage tone="info" message={flashMessage} />
        </Card>
      ) : null}
      <Card>
        <InlineMessage tone="info" message={`Tässä näkymässä näkyvät ${currentAssigneeLabel.toLowerCase()}n omat muistutukset.`} />
      </Card>
      <Card>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Rajaa lemmikin mukaan</Text>
          <SegmentedControl options={filterOptions} value={selectedPetFilter} onChange={setSelectedPetFilter} />
        </View>
      </Card>
      {!hasVisibleReminders ? (
        <Card>
          <EmptyState
            title="Ei muistutuksia"
            message="Kun lisäät ensimmäisen muistutuksen, se näkyy tässä heti."
            actionLabel="Luo muistutus"
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
              const isDetailOpen = selectedReminderId === reminder.id;

              return (
                <Card key={reminder.id} style={styles.reminderCard}>
                  {editingReminderId === reminder.id ? (
                    <View style={styles.editForm}>
                      {editMessage ? <InlineMessage tone="info" message={editMessage} /> : null}
                      <TextField label="Otsikko" value={editTitle} onChangeText={setEditTitle} placeholder="Lisää otsikko" />
                      <TextField
                        label="Kuvaus"
                        value={editDescription}
                        onChangeText={setEditDescription}
                        placeholder="Lisää kuvaus"
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
                      {isDetailOpen ? (
                        <View style={styles.detailCard}>
                          <Text style={styles.detailLabel}>Lisätiedot</Text>
                          <View style={styles.detailGrid}>
                            <DetailItem label="Tyyppi" value={formatReminderType(reminder.type)} />
                            <DetailItem label="Tila" value={formatReminderStatus(reminder.status)} />
                            <DetailItem label="Lemmikki" value={pet?.name ?? "-"} />
                            <DetailItem label="Vastuu" value={reminder.assigneeLabel} />
                          </View>
                          <View style={styles.detailBody}>
                            <Text style={styles.detailSectionLabel}>Kuvaus</Text>
                            <Text style={styles.detailText}>{reminder.description ?? "Ei tarkennuksia."}</Text>
                          </View>
                          <View style={styles.detailBody}>
                            <Text style={styles.detailSectionLabel}>Ajankohta</Text>
                            <Text style={styles.detailText}>{formatDueDate(reminder.dueAt)}</Text>
                          </View>
                        </View>
                      ) : null}
                      {reminder.status === "pending" && canManageReminders ? (
                        <View style={styles.actionRow}>
                          <Pressable
                            onPress={() => setSelectedReminderId(isDetailOpen ? null : reminder.id)}
                            style={[styles.actionButton, styles.actionButtonNeutral]}
                          >
                            <Text style={styles.actionLabel}>{isDetailOpen ? "Piilota tiedot" : "Näytä tiedot"}</Text>
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
                            onPress={() => setSelectedReminderId(isDetailOpen ? null : reminder.id)}
                            style={[styles.actionButton, styles.actionButtonNeutral]}
                          >
                            <Text style={styles.actionLabel}>{isDetailOpen ? "Piilota tiedot" : "Näytä tiedot"}</Text>
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailItemLabel}>{label}</Text>
      <Text style={styles.detailItemValue}>{value}</Text>
    </View>
  );
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
    backgroundColor: "#FCFDFE",
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
    backgroundColor: "#F7FAFC",
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
    backgroundColor: "#FCFDFE",
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
  detailCard: {
    marginTop: spacing[3],
    gap: spacing[3],
    borderRadius: 18,
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
  },
  detailLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  detailItem: {
    width: "47%",
    gap: spacing[1],
  },
  detailItemLabel: {
    color: colors.textTertiary,
    fontSize: typography.size.sm,
  },
  detailItemValue: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  detailBody: {
    gap: spacing[1],
  },
  detailSectionLabel: {
    color: colors.textTertiary,
    fontSize: typography.size.sm,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: 20,
  },
  actionRow: {
    marginTop: spacing[3],
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: "#EEF2F6",
  },
  actionButton: {
    minHeight: 40,
    borderRadius: 14,
    paddingHorizontal: spacing[4],
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonNeutral: {
    backgroundColor: "#FCFDFE",
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  actionButtonPrimary: {
    backgroundColor: "#EEF9F6",
    borderWidth: 1,
    borderColor: "#CFEDEA",
  },
  actionButtonDanger: {
    backgroundColor: "#FFF4F0",
    borderWidth: 1,
    borderColor: "#F2C9BE",
  },
  actionLabelPrimary: {
    color: colors.brandPrimaryHover,
  },
  actionLabelDanger: {
    color: "#B54708",
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
