import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card, EmptyState, MockMediaPreview, Pill, Screen, SectionTitle } from "../../components/ui";
import { useAppStore } from "../../state/appStore";
import { usePetStore } from "../../state/petStore";
import { useHealthStore } from "../../state/healthStore";
import { getReminderGroup, useReminderStore } from "../../state/reminderStore";
import { colors, radii, spacing, typography } from "../../theme/tokens";
import { PetDetailCard } from "../sections/PetDetailCard";
import { AddScreen } from "./AddScreen";

export function PetsScreen() {
  const pets = usePetStore((state) => state.pets);
  const reminders = useReminderStore((state) => state.reminders);
  const vaccinations = useHealthStore((state) => state.vaccinations);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const pendingPetDetailOpen = useAppStore((state) => state.pendingPetDetailOpen);
  const setSelectedPetId = useAppStore((state) => state.setSelectedPetId);
  const setPendingPetDetailOpen = useAppStore((state) => state.setPendingPetDetailOpen);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setPendingAddSection = useAppStore((state) => state.setPendingAddSection);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? pets[0];

  useEffect(() => {
    if (!pets.length) {
      setIsDetailOpen(false);
      return;
    }

    if (!selectedPetId && pets[0]) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId, setSelectedPetId]);

  useEffect(() => {
    if (!pendingPetDetailOpen) {
      return;
    }

    setIsDetailOpen(true);
    setPendingPetDetailOpen(false);
  }, [pendingPetDetailOpen, setPendingPetDetailOpen]);

  function openAddPet() {
    setPendingAddSection("pet");
    setActiveTab("pets");
  }

  function openPetDetail(petId: string) {
    setSelectedPetId(petId);
    setPendingPetDetailOpen(false);
    setIsDetailOpen(true);
  }

  return (
    <Screen>
      <AddScreen embedded />
      {!isDetailOpen ? (
        <>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Eläimet</Text>
            <Text style={styles.title}>Kaikki lemmikit</Text>
          </View>

          <View style={styles.grid}>
            {pets.map((pet) => {
              const petReminders = reminders.filter((reminder) => reminder.petId === pet.id && reminder.status === "pending");
              const overdueCount = petReminders.filter((reminder) => getReminderGroup(reminder) === "overdue").length;
              const activeVaccinations = vaccinations.filter((item) => item.petId === pet.id && item.validUntil);
              const expiringVaccinations = activeVaccinations.filter((item) => {
                if (!item.validUntil) {
                  return false;
                }

                const now = new Date();
                const validUntil = new Date(item.validUntil);
                const days = Math.round(
                  (new Date(validUntil.getFullYear(), validUntil.getMonth(), validUntil.getDate()).getTime() -
                    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
                    (1000 * 60 * 60 * 24),
                );
                return days <= 30;
              }).length;

              const nextBadgeLabel =
                overdueCount > 0
                  ? `${overdueCount} myöhässä`
                  : expiringVaccinations > 0
                    ? `${expiringVaccinations} rokotetta seurattava`
                    : petReminders.length > 0
                      ? `${petReminders.length} muistutusta`
                      : "Kaikki kunnossa";
              const nextBadgeTone =
                overdueCount > 0 ? "danger" : expiringVaccinations > 0 ? "warning" : petReminders.length > 0 ? "brand" : "success";

              return (
                <Pressable
                  key={pet.id}
                  onPress={() => openPetDetail(pet.id)}
                  style={styles.petTile}
                >
                  <View style={[styles.avatar, { backgroundColor: pet.avatarColor }]}>
                    <Text style={styles.avatarText}>{pet.name.slice(0, 1)}</Text>
                  </View>
                  <View style={styles.tileBody}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petMeta}>{pet.breed ?? pet.species}</Text>
                    <Pill label={nextBadgeLabel} tone={nextBadgeTone} />
                    {pet.photoLabel ? <MockMediaPreview label={pet.photoLabel} compact /> : null}
                  </View>
                </Pressable>
              );
            })}
            <Pressable style={[styles.petTile, styles.addTile]} onPress={openAddPet}>
              <View style={styles.addTileInner}>
                <View style={styles.addAvatar}>
                  <Text style={styles.addAvatarText}>+</Text>
                </View>
                <Text style={styles.petName}>Lisää lemmikki</Text>
              </View>
            </Pressable>
          </View>
        </>
      ) : selectedPet ? (
        <>
          <View style={styles.detailHeader}>
            <Pressable onPress={() => setIsDetailOpen(false)} style={styles.backButton}>
              <Text style={styles.backButtonLabel}>Takaisin</Text>
            </Pressable>
            <View style={styles.detailHeaderCopy}>
              <Text style={styles.eyebrow}>Eläimet</Text>
              <Text style={styles.title}>{selectedPet.name}</Text>
            </View>
          </View>
          <PetDetailCard pet={selectedPet} />
        </>
      ) : (
        <Card>
          <EmptyState
            title="Ei vielä lemmikkejä"
            message="Lisää ensimmäinen lemmikki aloittaaksesi."
            actionLabel="Lisää ensimmäinen lemmikki"
            onAction={openAddPet}
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 28,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[2],
  },
  eyebrow: {
    fontSize: typography.size.sm,
    color: colors.textTertiary,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  petTile: {
    width: "48%",
    minHeight: 170,
    borderRadius: 20,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
    gap: spacing[4],
  },
  addTile: {
    alignItems: "center",
    justifyContent: "center",
  },
  addTileInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  addAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandPrimarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  addAvatarText: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: typography.weight.semibold,
    color: colors.brandPrimaryHover,
  },
  tileBody: {
    gap: spacing[2],
  },
  petName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  petMeta: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  detailHeader: {
    gap: spacing[3],
  },
  detailHeaderCopy: {
    gap: spacing[2],
  },
  backButton: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 999,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  backButtonLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
