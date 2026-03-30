import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../../theme/tokens";
import { AppButton, Card, EmptyState, InlineMessage, Pill, Screen, SectionTitle } from "../../components/ui";
import { formatDueDate } from "../../lib/date";
import { useAppStore } from "../../state/appStore";
import { usePetStore } from "../../state/petStore";
import { getReminderGroup, useReminderStore } from "../../state/reminderStore";
import { useUpdateStore } from "../../state/updateStore";

export function HomeScreen() {
  const pets = usePetStore((state) => state.pets);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setPendingAddSection = useAppStore((state) => state.setPendingAddSection);
  const flashMessage = useAppStore((state) => state.flashMessage);
  const setFlashMessage = useAppStore((state) => state.setFlashMessage);
  const reminders = useReminderStore((state) => state.reminders);
  const updates = useUpdateStore((state) => state.updates);
  const [petMessage, setPetMessage] = useState<string | null>(null);

  const upcoming = useMemo(
    () =>
      reminders
        .filter((reminder) => reminder.status === "pending")
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
        .slice(0, 3),
    [reminders],
  );
  const latestEvents = useMemo(
    () =>
      updates
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3),
    [updates],
  );
  const activePetCount = pets.length;
  const pendingReminderCount = reminders.filter((reminder) => reminder.status === "pending").length;
  const hasPets = pets.length > 0;

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
        <View style={styles.primaryHero}>
          <Text style={styles.heroEyebrow}>Koti</Text>
          <Text style={styles.primaryHeroTitle}>Lisää ensimmäinen lemmikki</Text>
          <Text style={styles.primaryHeroText}>Kun ensimmäinen lemmikki on lisätty, muistutukset ja tapahtumat näkyvät täällä.</Text>
          <View style={styles.primaryHeroActions}>
            <AppButton label="Lisää ensimmäinen lemmikki" onPress={openAddPet} />
          </View>
        </View>
      ) : (
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>Koti</Text>
          <Text style={styles.heroTitle}>Koti</Text>
          <Text style={styles.heroText}>Pidä tärkeimmät asiat yhdessä näkymässä.</Text>
        </View>
      )}

      {hasPets ? (
        <>
          <View style={styles.summaryStrip}>
            <SummaryCard label="Lemmikit" value={String(activePetCount)} tone="default" />
            <SummaryCard label="Muistutuksia" value={String(pendingReminderCount)} tone="default" />
            {upcoming[0] ? <SummaryCard label="Seuraava muistutus" value={formatDueDate(upcoming[0].dueAt)} tone="default" /> : null}
          </View>

          <Card style={styles.quickActionsCard}>
            <Text style={styles.quickActionsTitle}>Jatka tästä</Text>
            <View style={styles.quickActionsGrid}>
              <QuickActionTile title="Avaa eläimet" subtitle="Kaikki lemmikit" onPress={() => setActiveTab("pets")} />
              <QuickActionTile title="Lisää muistutus" subtitle="Seuraava muistettava asia" onPress={openAddReminder} />
              <QuickActionTile title="Kirjaa merkintä" subtitle="Uusi tapahtuma tai huomio" onPress={openAddUpdate} />
            </View>
          </Card>
        </>
      ) : null}

      {hasPets ? <SectionTitle title="Seuraavat muistutukset" actionLabel={upcoming.length ? "Näytä kaikki" : undefined} /> : null}
      {hasPets && !upcoming.length ? (
        <Card>
          <EmptyState title="Ei tulevia muistutuksia" message="Kun lisäät muistutuksen, se näkyy täällä." actionLabel="Luo ensimmäinen muistutus" onAction={openAddReminder} />
        </Card>
      ) : null}
      {hasPets && upcoming.map((reminder) => (
        <Card key={reminder.id} style={styles.contentCard}>
          <View style={styles.row}>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <Text style={styles.reminderPetName}>
                {pets.find((pet) => pet.id === reminder.petId)?.name ?? "Lemmikki"}
              </Text>
              <Text style={styles.reminderDescription}>{reminder.description}</Text>
            </View>
            <Pill
              label={getReminderGroup(reminder) === "today" ? "Tänään" : getReminderGroup(reminder) === "overdue" ? "Myöhässä" : "Tulossa"}
              tone={getReminderGroup(reminder) === "overdue" ? "danger" : getReminderGroup(reminder) === "today" ? "warning" : "brand"}
            />
          </View>
          <Text style={styles.reminderMeta}>{formatDueDate(reminder.dueAt)}</Text>
        </Card>
      ))}

      {hasPets ? <SectionTitle title="Viimeisimmät tärkeät tapahtumat" actionLabel={latestEvents.length ? "Päivitykset" : undefined} /> : null}
      {hasPets && !latestEvents.length ? (
        <Card>
          <EmptyState title="Ei vielä tapahtumia" message="Merkinnät ja tärkeät muutokset näkyvät täällä." actionLabel="Kirjaa ensimmäinen merkintä" onAction={openAddUpdate} />
        </Card>
      ) : null}
      {hasPets && latestEvents.map((event) => {
        const eventPet = pets.find((pet) => pet.id === event.petId);

        return (
          <Card key={event.id} style={styles.contentCard}>
            <View style={styles.row}>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{eventPet?.name ?? "Lemmikki"}</Text>
                <Text style={styles.reminderPetName}>{getEventMetaLabel(event.authorName, event.authorRole)}</Text>
                <Text style={styles.reminderDescription}>{event.text}</Text>
              </View>
              {event.mediaCount ? (
                <Pill label={`${event.mediaCount} kuvaa`} tone="brand" />
              ) : (
                <Pill label="Päivitys" />
              )}
            </View>
            <Text style={styles.reminderMeta}>{formatDueDate(event.createdAt)}</Text>
          </Card>
        );
      })}
    </Screen>
  );
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

function QuickActionTile({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickActionTile, pressed && styles.quickActionTilePressed]}>
      <Text style={styles.quickActionLabel}>{title}</Text>
      <Text style={styles.quickActionText}>{subtitle}</Text>
    </Pressable>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
  tone: "default";
}) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryHero: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[5],
  },
  hero: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[4],
  },
  heroSinglePet: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[4],
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  heroSinglePetBody: {
    gap: spacing[2],
    flex: 1,
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  heroActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  heroEyebrow: {
    fontSize: typography.size.sm,
    color: colors.textTertiary,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.bgBase,
  },
  heroAvatarText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  heroTitle: {
    fontSize: typography.size["2xl"],
    lineHeight: 32,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: spacing[2],
  },
  heroText: {
    fontSize: typography.size.md,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  primaryHeroTitle: {
    fontSize: typography.size["3xl"],
    lineHeight: 36,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  primaryHeroText: {
    fontSize: typography.size.md,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  primaryHeroActions: {
    alignItems: "flex-start",
  },
  summaryStrip: {
    flexDirection: "row",
    gap: spacing[3],
    marginTop: spacing[1],
  },
  summaryCard: {
    flex: 1,
    gap: spacing[2],
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
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
  petGrid: {
    gap: spacing[4],
  },
  quickActionsCard: {
    backgroundColor: "#FFFFFF",
  },
  quickActionsTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    letterSpacing: -0.4,
  },
  quickActionsGrid: {
    marginTop: spacing[4],
    gap: spacing[3],
  },
  quickActionTile: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSubtle,
    padding: spacing[4],
    gap: spacing[2],
  },
  quickActionTilePressed: {
    opacity: 0.78,
  },
  quickActionLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  quickActionText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: 20,
  },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
    backgroundColor: "#FCFDFE",
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[5],
    shadowColor: "#101828",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  petCardActive: {
    borderColor: colors.borderFocus,
    backgroundColor: "#EEF9F6",
    transform: [{ scale: 1.01 }],
  },
  petAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  petAvatarText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  petMeta: {
    flex: 1,
    gap: spacing[2],
  },
  petActions: {
    minWidth: 96,
  },
  petName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  petBreed: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "space-between",
  },
  contentCard: {
    backgroundColor: "#FCFDFE",
  },
  reminderContent: {
    flex: 1,
    gap: spacing[2],
  },
  reminderTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  reminderDescription: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: 20,
  },
  reminderPetName: {
    color: colors.brandPrimaryHover,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  reminderMeta: {
    marginTop: spacing[3],
    color: colors.textTertiary,
    fontSize: typography.size.sm,
  },
});
