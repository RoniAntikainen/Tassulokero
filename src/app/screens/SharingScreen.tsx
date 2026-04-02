import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton, Card, EmptyState, InlineMessage, Pill, Screen, SectionTitle, SegmentedControl, TextField } from "../../components/ui";
import { canManageSharing as hasSharingManagementAccess } from "../../lib/permissions";
import { useAppStore } from "../../state/appStore";
import { useBreederStore } from "../../state/breederStore";
import { usePetStore } from "../../state/petStore";
import { useSharingStore } from "../../state/sharingStore";
import { useUpdateStore } from "../../state/updateStore";
import { useAuthStore } from "../../state/authStore";
import { colors, spacing, typography } from "../../theme/tokens";
import type { PetAccess } from "../../types/domain";

export function SharingScreen() {
  const pets = usePetStore((state) => state.pets);
  const accesses = useSharingStore((state) => state.accesses);
  const inviteAccess = useSharingStore((state) => state.inviteAccess);
  const toggleFamilyAdmin = useSharingStore((state) => state.toggleFamilyAdmin);
  const removeAccess = useSharingStore((state) => state.removeAccess);
  const updateAccessPermissions = useSharingStore((state) => state.updateAccessPermissions);
  const addSystemUpdate = useUpdateStore((state) => state.addSystemUpdate);
  const viewerRole = useAppStore((state) => state.viewerRole);
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const breederAccess = useBreederStore((state) => state.breederAccess);
  const currentViewerName = sessionUser?.displayName ?? null;
  const hasFamilyAdminAccess = useMemo(
    () =>
      accesses.some(
        (access) =>
          access.role === "family" &&
          access.isAdmin &&
          access.personName === currentViewerName,
      ),
    [accesses, currentViewerName],
  );
  const canManageSharing = hasSharingManagementAccess(viewerRole, hasFamilyAdminAccess);

  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id ?? "all");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"family" | "caretaker">("family");
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [expandedAccessId, setExpandedAccessId] = useState<string | null>(null);
  const activePetId = selectedPetId === "all" ? pets[0]?.id ?? "" : selectedPetId;
  const activePet = pets.find((pet) => pet.id === activePetId);
  const activeAccesses = accesses.filter((access) => access.petId === activePetId);
  const pendingCount = inviteMessage ? 1 : 0;
  const familyCount = activeAccesses.filter((access) => access.role === "family").length;
  const caretakerCount = activeAccesses.filter((access) => access.role === "caretaker").length;

  const petOptions = useMemo(
    () => pets.map((pet) => ({ label: pet.name, value: pet.id })),
    [pets],
  );

  function handleInvite() {
    if (!selectedPetId) {
      setInviteError("Valitse ensin lemmikki, jolle haluat jakaa pääsyn.");
      setInviteMessage(null);
      return;
    }

    if (!inviteName.trim()) {
      setInviteError("Lisää kutsulle nimi.");
      setInviteMessage(null);
      return;
    }

    inviteAccess({
      petId: selectedPetId,
      userId: inviteName.trim(),
      personName: inviteName.trim(),
      role: inviteRole,
    });
    addSystemUpdate(
      selectedPetId,
      inviteRole === "family"
        ? `Perhekutsu lähetettiin henkilölle ${inviteName.trim()}.`
        : `Hoitajakutsu lähetettiin henkilölle ${inviteName.trim()}.`,
    );

    setInviteName("");
    setInviteError(null);
    setInviteMessage(
      inviteRole === "family"
        ? "Perhekutsu lähetettiin."
        : "Hoitajakutsu lähetettiin.",
    );
  }

  return (
    <Screen>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Jaot</Text>
        <Text style={styles.heroTitle}>Hallitse käyttöoikeuksia</Text>
        <Text style={styles.heroBody}>Kutsu uusia käyttäjiä ja säädä pääsyjä yhdestä paikasta.</Text>
        <View style={styles.heroSummary}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{familyCount}</Text>
            <Text style={styles.summaryLabel}>Perhe</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{caretakerCount}</Text>
            <Text style={styles.summaryLabel}>Hoitajat</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>Odottaa</Text>
          </View>
        </View>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Kutsu käyttäjä</Text>
        {canManageSharing ? (
          <View style={styles.form}>
            <SegmentedControl options={petOptions} value={selectedPetId} onChange={setSelectedPetId} />
            <SegmentedControl
              options={[
                { label: "Perhe", value: "family" },
                { label: "Hoitaja", value: "caretaker" },
              ]}
              value={inviteRole}
              onChange={(value) => setInviteRole(value as "family" | "caretaker")}
            />
            <TextField label="Nimi" value={inviteName} onChangeText={setInviteName} placeholder="Nimi" />
            {inviteError ? <InlineMessage tone="warning" message={inviteError} /> : null}
            {inviteMessage ? <InlineMessage tone="info" message={inviteMessage} /> : null}
            <AppButton label="Lähetä kutsu" onPress={handleInvite} />
          </View>
        ) : (
          <View style={styles.form}>
            <InlineMessage
              tone="warning"
              message={
                viewerRole === "family"
                  ? "Jakojen muokkaus vaatii perheen ylläpito-oikeuden."
                  : "Tällä roolilla jakoja ei voi muokata."
              }
            />
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Aktiiviset jaot</Text>
        <View style={styles.form}>
          <SegmentedControl options={petOptions} value={selectedPetId} onChange={setSelectedPetId} />
          {activePet ? <Text style={styles.petSubline}>{activePet.name}</Text> : null}
          {activeAccesses.length ? (
            <View style={styles.accessList}>
              {activeAccesses.map((access) => (
                <View key={access.id} style={styles.accessCard}>
                  <View style={styles.accessHeader}>
                    <View style={styles.accessText}>
                      <Text style={styles.personName}>{access.personName}</Text>
                      <Text style={styles.permissionText}>
                        {access.role === "family"
                          ? access.isAdmin
                            ? "Perheen ylläpitäjä"
                            : "Perhe"
                          : "Hoitaja"}
                      </Text>
                    </View>
                    <View style={styles.pills}>
                      {access.canViewHealth ? <Pill label="Terveys" /> : null}
                      {access.canViewCareInstructions ? <Pill label="Hoito" /> : null}
                      {access.canViewReminders ? <Pill label="Muistutukset" /> : null}
                      {access.canComment ? <Pill label="Kommentit" /> : null}
                      {access.canUploadMedia ? <Pill label="Kuvat" /> : null}
                    </View>
                  </View>
                  <View style={styles.accessSummary}>
                    <PermissionRow
                      title="Näkee"
                      allowed
                      detail={getAccessSummary(access)}
                    />
                  </View>
                  {canManageSharing ? (
                    <>
                    <AppButton
                      label={expandedAccessId === access.id ? "Piilota oikeudet" : "Muokkaa oikeuksia"}
                      onPress={() => setExpandedAccessId(expandedAccessId === access.id ? null : access.id)}
                      secondary
                    />
                    {expandedAccessId === access.id ? (
                    <View style={styles.permissionEditor}>
                      {access.role === "family" ? (
                        <AppButton
                          label={access.isAdmin ? "Poista ylläpito-oikeus" : "Anna ylläpito-oikeus"}
                          onPress={() => toggleFamilyAdmin(access.id)}
                          secondary
                        />
                      ) : null}
                      <View style={styles.buttonRow}>
                        <AppButton
                          label={access.canViewHealth ? "Piilota terveys" : "Salli terveys"}
                          onPress={() =>
                            updateAccessPermissions(access.id, {
                              canViewHealth: !access.canViewHealth,
                            })
                          }
                          secondary
                        />
                        <AppButton
                          label={access.canViewCareInstructions ? "Piilota hoito" : "Salli hoito"}
                          onPress={() =>
                            updateAccessPermissions(access.id, {
                              canViewCareInstructions: !access.canViewCareInstructions,
                            })
                          }
                          secondary
                        />
                      </View>
                      <View style={styles.buttonRow}>
                        <AppButton
                          label={access.canComment ? "Estä kommentit" : "Salli kommentit"}
                          onPress={() =>
                            updateAccessPermissions(access.id, {
                              canComment: !access.canComment,
                            })
                          }
                          secondary
                        />
                        <AppButton
                          label={access.canUploadMedia ? "Estä kuvat" : "Salli kuvat"}
                          onPress={() =>
                            updateAccessPermissions(access.id, {
                              canUploadMedia: !access.canUploadMedia,
                            })
                          }
                          secondary
                        />
                      </View>
                      {access.role !== "caretaker" ? (
                        <AppButton
                          label={access.canViewReminders ? "Piilota muistutukset" : "Salli muistutukset"}
                          onPress={() =>
                            updateAccessPermissions(access.id, {
                              canViewReminders: !access.canViewReminders,
                            })
                          }
                          secondary
                        />
                      ) : null}
                      <AppButton label="Poista pääsy" onPress={() => removeAccess(access.id)} secondary />
                    </View>
                    ) : null}
                    </>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              title="Ei aktiivisia jakoja"
              message="Kun lähetät ensimmäisen kutsun, aktiiviset jaot näkyvät tässä."
              actionLabel={canManageSharing ? "Täytä kutsu" : undefined}
              onAction={canManageSharing ? () => setInviteError("Täytä kutsu yllä olevalla lomakkeella.") : undefined}
            />
          )}
        </View>
      </Card>

      {activePet ? (
        <Card>
          <Text style={styles.sectionTitle}>Oikeudet lyhyesti</Text>
          <View style={styles.summaryList}>
            <PermissionSummary title="Perhe" description="Laajempi pääsy arjen tietoihin. Ylläpito-oikeus voidaan antaa erikseen." />
            <PermissionSummary title="Hoitaja" description="Rajattu pääsy vain niihin tietoihin, joita arjessa tarvitaan." />
            {breederAccess.find((access) => access.petId === activePet.id) ? (
              <PermissionSummary title="Kasvattaja" description="Erilliset oikeudet, joita hallitaan erikseen." />
            ) : null}
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 28,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[4],
    shadowColor: colors.brandPrimaryHover,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  heroEyebrow: {
    color: colors.brandPrimaryHover,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    lineHeight: 32,
    letterSpacing: -0.6,
  },
  heroBody: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    letterSpacing: -0.35,
  },
  form: {
    marginTop: spacing[4],
    gap: spacing[4],
  },
  heroSummary: {
    flexDirection: "row",
    gap: spacing[3],
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: colors.surfaceInfo,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
    gap: spacing[2],
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    letterSpacing: -0.4,
  },
  summaryLabel: {
    color: colors.textTertiary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  petName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  petSubline: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  accessList: {
    gap: spacing[3],
  },
  accessCard: {
    gap: spacing[3],
    borderRadius: 22,
    backgroundColor: colors.surfaceSoft,
    padding: spacing[5],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  accessHeader: {
    gap: spacing[3],
  },
  accessText: {
    gap: spacing[1],
  },
  personName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  permissionText: {
    color: colors.textSecondary,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  accessSummary: {
    marginTop: spacing[1],
  },
  permissionEditor: {
    gap: spacing[3],
    marginTop: spacing[2],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  summaryList: {
    gap: spacing[3],
  },
  permissionRow: {
    gap: spacing[2],
    borderRadius: 18,
    backgroundColor: colors.surfaceInfo,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  permissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing[3],
  },
  permissionTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  permissionDetail: {
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: typography.size.sm,
  },
});

function PermissionRow({
  title,
  allowed,
  detail,
}: {
  title: string;
  allowed: boolean;
  detail: string;
}) {
  return (
    <View style={styles.permissionRow}>
      <View style={styles.permissionHeader}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Pill label={allowed ? "Sallittu" : "Ei sallittu"} tone={allowed ? "success" : "warning"} />
      </View>
      <Text style={styles.permissionDetail}>{detail}</Text>
    </View>
  );
}

function PermissionSummary({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={styles.permissionRow}>
      <Text style={styles.permissionTitle}>{title}</Text>
      <Text style={styles.permissionDetail}>{description}</Text>
    </View>
  );
}

function getAccessSummary(access: PetAccess) {
  const visibleAreas = [
    access.canViewHealth ? "terveyden" : null,
    access.canViewCareInstructions ? "hoito-ohjeet" : null,
    access.canViewReminders ? "muistutukset" : null,
    access.canComment ? "kommentit" : null,
    access.canUploadMedia ? "kuvat" : null,
  ].filter(Boolean);

  if (!visibleAreas.length) {
    return access.role === "family" ? "Ei aktiivisia oikeuksia." : "Näkyvyys rajattu minimiin.";
  }

  const rolePrefix =
    access.role === "family"
      ? access.isAdmin
        ? "Perheen ylläpitäjä näkee"
        : "Perhe näkee"
      : "Hoitaja näkee";

  return `${rolePrefix} ${visibleAreas.join(", ")}.`;
}
