import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card, EmptyState, InlineMessage, Pill, Screen } from "../../components/ui";
import { formatDueDate } from "../../lib/date";
import { useAppStore } from "../../state/appStore";
import { usePetStore } from "../../state/petStore";
import { getReminderGroup, useReminderStore } from "../../state/reminderStore";
import { useUpdateStore } from "../../state/updateStore";
import { colors, radii, spacing, typography } from "../../theme/tokens";
import { Pet, PetUpdate, Reminder } from "../../types/domain";

export function HomeScreen() {
  const pets = usePetStore((state) => state.pets);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setPendingAddSection = useAppStore((state) => state.setPendingAddSection);
  const setPendingPetDetailOpen = useAppStore((state) => state.setPendingPetDetailOpen);
  const setPendingReminderDetailId = useAppStore((state) => state.setPendingReminderDetailId);
  const setSelectedPetId = useAppStore((state) => state.setSelectedPetId);
  const flashMessage = useAppStore((state) => state.flashMessage);
  const setFlashMessage = useAppStore((state) => state.setFlashMessage);
  const reminders = useReminderStore((state) => state.reminders);
  const updates = useUpdateStore((state) => state.updates);
  const [petMessage] = useState<string | null>(null);

  const hasPets = pets.length > 0;
  const pendingReminders = useMemo(
    () => reminders.filter((reminder) => reminder.status === "pending"),
    [reminders],
  );
  const upcoming = useMemo(
    () =>
      pendingReminders
        .slice()
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()),
    [pendingReminders],
  );
  const latestEvents = useMemo(
    () =>
      updates
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [updates],
  );
  const topReminder = upcoming[0];
  const overdueCount = pendingReminders.filter((reminder) => getReminderGroup(reminder) === "overdue").length;

  useEffect(() => {
    if (!flashMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      setFlashMessage(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [flashMessage, setFlashMessage]);

  function openAddPet() {
    setPendingAddSection("pet");
    setActiveTab("pets");
  }

  function openAddReminder() {
    setPendingAddSection("reminders");
    setActiveTab("pets");
  }

  function openAddUpdate() {
    setPendingAddSection("updates");
    setActiveTab("pets");
  }

  function openPetDetail(petId: string) {
    setSelectedPetId(petId);
    setPendingPetDetailOpen(true);
    setActiveTab("pets");
  }

  function openReminderDetail(reminderId: string) {
    setPendingReminderDetailId(reminderId);
    setActiveTab("reminders");
  }

  return (
    <Screen>
      {petMessage ? (
        <Card>
          <InlineMessage tone="info" message={petMessage} />
        </Card>
      ) : null}
      {flashMessage ? (
        <Card>
          <InlineMessage tone="info" message={flashMessage} />
        </Card>
      ) : null}

      {!hasPets ? (
        <>
          <View style={styles.emptyHomeTop}>
            <View style={styles.emptyHomeIcon}>
              <Ionicons name="paw-outline" size={24} color={colors.brandPrimaryHover} />
            </View>
            <Text style={styles.emptyHomeTitle}>Lisää ensimmäinen lemmikki</Text>
          </View>
          <Card>
            <EmptyState
              title="Ei vielä lemmikkejä"
              message="Lisää lemmikki"
              actionLabel="Lisää lemmikki"
              onAction={openAddPet}
            />
          </Card>
        </>
      ) : (
        <>
          {topReminder ? (
            <Pressable onPress={() => openReminderDetail(topReminder.id)} style={({ pressed }) => [styles.primaryTaskCard, pressed && styles.pressed]}>
              <View style={styles.primaryTaskLeading}>
                <View style={styles.primaryTaskIcon}>
                  <Ionicons
                    name={overdueCount > 0 ? "alert-outline" : "time-outline"}
                    size={18}
                    color={overdueCount > 0 ? colors.danger : colors.warning}
                  />
                </View>
                <View style={styles.primaryTaskCopy}>
                  <Text style={styles.primaryTaskTitle}>{topReminder.title}</Text>
                  <Text style={styles.primaryTaskMeta}>
                    {pets.find((pet) => pet.id === topReminder.petId)?.name ?? "Lemmikki"} • {formatDueDate(topReminder.dueAt)}
                  </Text>
                </View>
              </View>
              <Pill
                label={getReminderPillLabel(topReminder)}
                tone={getReminderGroup(topReminder) === "overdue" ? "danger" : getReminderGroup(topReminder) === "today" ? "warning" : "brand"}
              />
            </Pressable>
          ) : null}

          <View style={styles.actionsRow}>
            <ActionChip icon="notifications-outline" label="Muistutus" onPress={openAddReminder} />
            <ActionChip icon="chatbubble-ellipses-outline" label="Päivitys" onPress={openAddUpdate} />
            <ActionChip icon="add-circle-outline" label="Lemmikki" onPress={openAddPet} />
          </View>

          <Card style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleTitle}>Lemmikit</Text>
              <Pressable onPress={() => setActiveTab("pets")} style={styles.inlineLink}>
                <Text style={styles.inlineLinkText}>Kaikki</Text>
              </Pressable>
            </View>
            <View style={styles.petGrid}>
              {pets.map((pet) => {
                const petPending = pendingReminders.filter((reminder) => reminder.petId === pet.id);
                const petGroup = petPending[0] ? getReminderGroup(petPending[0]) : null;
                const petUpdates = updates.filter((update) => update.petId === pet.id).length;

                return (
                  <Pressable
                    key={pet.id}
                    onPress={() => openPetDetail(pet.id)}
                    style={({ pressed }) => [styles.petTile, pressed && styles.pressed]}
                  >
                    <View style={styles.petTileTop}>
                      <View style={[styles.petTileAvatar, { backgroundColor: pet.avatarColor }]}>
                        <Text style={styles.petTileAvatarText}>{pet.name.slice(0, 1)}</Text>
                      </View>
                    </View>
                    <View style={styles.petTileBody}>
                      <Text numberOfLines={1} style={styles.petTileName}>
                        {pet.name}
                      </Text>
                      <Text numberOfLines={1} style={styles.petTileMeta}>
                        {pet.breed ?? pet.species}
                      </Text>
                    </View>
                    <View style={styles.petTileStats}>
                      <View style={styles.petStat}>
                        <Ionicons name="notifications-outline" size={14} color={colors.textTertiary} />
                        <Text style={styles.petStatText}>{petPending.length}</Text>
                      </View>
                      <View style={styles.petStat}>
                        <Ionicons name="chatbubble-ellipses-outline" size={14} color={colors.textTertiary} />
                        <Text style={styles.petStatText}>{petUpdates}</Text>
                      </View>
                    </View>
                    {petPending.length ? (
                      <View style={styles.petTileFooter}>
                        <Pill
                          label={getPetStatusLabel(petPending)}
                          tone={petGroup === "overdue" ? "danger" : petGroup === "today" ? "warning" : "brand"}
                        />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Card style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleTitle}>Muistutukset</Text>
              <Pressable onPress={() => setActiveTab("reminders")} style={styles.inlineLink}>
                <Text style={styles.inlineLinkText}>Avaa</Text>
              </Pressable>
            </View>
            <View style={styles.stackList}>
              {upcoming.slice(0, 3).length ? (
                upcoming.slice(0, 3).map((reminder) => (
                  <CompactReminderRow
                    key={reminder.id}
                    reminder={reminder}
                    pet={pets.find((pet) => pet.id === reminder.petId)}
                    onPress={() => openReminderDetail(reminder.id)}
                  />
                ))
              ) : (
                <View style={styles.inlineEmpty}>
                  <Text style={styles.inlineEmptyTitle}>Ei avoimia muistutuksia</Text>
                </View>
              )}
            </View>
          </Card>

          <Card style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleTitle}>Kuulumiset</Text>
              <Pressable onPress={() => setActiveTab("pets")} style={styles.inlineLink}>
                <Text style={styles.inlineLinkText}>Lemmikit</Text>
              </Pressable>
            </View>
            <View style={styles.stackList}>
              {latestEvents.length ? (
                latestEvents.map((event) => (
                  <CompactUpdateRow
                    key={event.id}
                    event={event}
                    pet={pets.find((pet) => pet.id === event.petId)}
                  />
                ))
              ) : (
                <View style={styles.inlineEmpty}>
                  <Text style={styles.inlineEmptyTitle}>Ei vielä päivityksiä</Text>
                </View>
              )}
            </View>
          </Card>
        </>
      )}
    </Screen>
  );
}

function ActionChip({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.actionChip, pressed && styles.pressed]}>
      <Ionicons name={icon} size={18} color={colors.brandPrimaryHover} />
      <Text style={styles.actionChipLabel}>{label}</Text>
    </Pressable>
  );
}

function CompactReminderRow({
  reminder,
  pet,
  onPress,
}: {
  reminder: Reminder;
  pet?: Pet;
  onPress: () => void;
}) {
  const group = getReminderGroup(reminder);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.rowCard, pressed && styles.pressed]}>
      <View style={styles.rowMain}>
        <View style={styles.rowCopy}>
          <Text style={styles.rowTitle}>{reminder.title}</Text>
          <Text style={styles.rowPetName}>{pet?.name ?? "Lemmikki"}</Text>
          <Text style={styles.rowMeta}>{formatDueDate(reminder.dueAt)}</Text>
        </View>
        <Pill
          label={group === "today" ? "Tänään" : group === "overdue" ? "Myöhässä" : "Tulossa"}
          tone={group === "overdue" ? "danger" : group === "today" ? "warning" : "brand"}
        />
      </View>
    </Pressable>
  );
}

function CompactUpdateRow({
  event,
  pet,
}: {
  event: PetUpdate;
  pet?: Pet;
}) {
  return (
    <View style={styles.rowCard}>
      <View style={styles.rowMain}>
        <View style={styles.rowCopy}>
          <Text style={styles.rowTitle}>{pet?.name ?? "Lemmikki"}</Text>
          <Text style={styles.rowMeta}>{getEventMetaLabel(event.authorName, event.authorRole)}</Text>
        </View>
        <Pill label={event.mediaCount ? `${event.mediaCount} kuvaa` : "Päivitys"} tone="brand" />
      </View>
      <Text style={styles.rowBody} numberOfLines={3}>
        {event.text}
      </Text>
    </View>
  );
}

function getReminderPillLabel(reminder: Reminder) {
  const group = getReminderGroup(reminder);
  if (group === "overdue") return "Myöhässä";
  if (group === "today") return "Tänään";
  return "Tulossa";
}

function getPetStatusLabel(pending: Reminder[]) {
  const first = pending[0];
  if (!first) return "";
  const group = getReminderGroup(first);
  if (group === "overdue") return "Huomio";
  if (group === "today") return "Tänään";
  return `${pending.length} tehtävää`;
}

function getRoleLabel(role?: "owner" | "family" | "caretaker") {
  if (role === "owner") return "omistaja";
  if (role === "family") return "perhe";
  if (role === "caretaker") return "hoitaja";
  return "päivitys";
}

function getEventMetaLabel(authorName: string, role?: "owner" | "family" | "caretaker") {
  if (authorName === "Tassulokero") {
    return "Järjestelmätapahtuma";
  }

  return `${authorName} • ${getRoleLabel(role)}`;
}

const styles = StyleSheet.create({
  emptyHomeTop: {
    alignItems: "center",
    gap: spacing[3],
    paddingVertical: spacing[6],
  },
  emptyHomeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandPrimarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyHomeTitle: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  primaryTaskCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  primaryTaskLeading: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  primaryTaskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceWarning,
    borderWidth: 1,
    borderColor: colors.borderWarning,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTaskCopy: {
    flex: 1,
    gap: 2,
  },
  primaryTaskTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  primaryTaskMeta: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  actionChip: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
  },
  actionChipLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  moduleCard: {
    backgroundColor: colors.surfaceRaised,
    gap: spacing[4],
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  moduleTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  inlineLink: {
    paddingVertical: spacing[2],
  },
  inlineLinkText: {
    fontSize: typography.size.sm,
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
  },
  petGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  petTile: {
    width: "48%",
    minHeight: 184,
    borderRadius: 24,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
    gap: spacing[4],
  },
  petTileTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  petTileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  petTileAvatarText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  petTileBody: {
    gap: 2,
  },
  petTileName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  petTileMeta: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  petTileStats: {
    flexDirection: "row",
    gap: spacing[4],
  },
  petStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  petStatText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  petTileFooter: {
    marginTop: "auto",
    alignItems: "flex-start",
  },
  stackList: {
    gap: spacing[2],
  },
  rowCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
    gap: spacing[3],
  },
  rowMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  rowCopy: {
    flex: 1,
    gap: spacing[1],
  },
  rowTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  rowMeta: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  rowPetName: {
    fontSize: typography.size.sm,
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
  },
  rowBody: {
    fontSize: typography.size.sm,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  inlineEmpty: {
    paddingVertical: spacing[2],
  },
  inlineEmptyTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  inlineEmptyText: {
    fontSize: typography.size.sm,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.8,
  },
});
