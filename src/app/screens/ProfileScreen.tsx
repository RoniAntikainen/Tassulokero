import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton, Card, InlineMessage, Pill, Screen, SegmentedControl, TextField } from "../../components/ui";
import { getPushPermissionSnapshot, requestPushPermissions } from "../../lib/notifications";
import { useAuthStore } from "../../state/authStore";
import { useProfileStore } from "../../state/profileStore";
import { colors, spacing, typography } from "../../theme/tokens";

export function ProfileScreen() {
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const signOut = useAuthStore((state) => state.signOut);
  const kennelName = useAuthStore((state) => state.kennelName);
  const profileSettings = useProfileStore((state) => state.profile);
  const notificationSettings = useProfileStore((state) => state.notificationSettings);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const updateNotificationSettings = useProfileStore((state) => state.updateNotificationSettings);

  const profile = sessionUser ?? {
    displayName: "Vieras",
    email: "ei-kirjautunut",
    roleProfile: "owner" as const,
  };

  const [displayNameInput, setDisplayNameInput] = useState(profileSettings.displayName);
  const [bioInput, setBioInput] = useState(profileSettings.bio);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [pushPermissionState, setPushPermissionState] = useState<"unknown" | "granted" | "denied" | "web_unsupported" | "simulator_unsupported">("unknown");
  const [pushPermissionMessage, setPushPermissionMessage] = useState<string | null>(null);

  useEffect(() => {
    setDisplayNameInput(profileSettings.displayName);
    setBioInput(profileSettings.bio);
  }, [profileSettings.bio, profileSettings.displayName]);

  useEffect(() => {
    void (async () => {
      const snapshot = await getPushPermissionSnapshot();
      setPushPermissionState(snapshot.reason);
    })();
  }, []);

  function handleSaveProfile() {
    updateProfile({
      displayName: displayNameInput.trim() || profile.displayName,
      bio: bioInput.trim(),
    });
    setSaveMessage("Profiilin tiedot tallennettiin.");
  }

  async function handleRequestPushPermission() {
    const result = await requestPushPermissions();
    setPushPermissionState(result.reason);
    setPushPermissionMessage(
      result.reason === "granted"
        ? "Ilmoitukset sallittiin tällä laitteella."
        : result.reason === "web_unsupported"
          ? "Ilmoituksia ei voi pyytää selaimessa."
          : result.reason === "simulator_unsupported"
            ? "Ilmoitukset vaativat fyysisen laitteen."
            : "Ilmoituksia ei sallittu tällä laitteella.",
    );
  }

  return (
    <Screen>
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroAvatarText}>{profile.displayName.slice(0, 1)}</Text>
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.heroEyebrow}>Profiili</Text>
            <Text style={styles.name}>{profile.displayName}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>
        </View>
        <View style={styles.pills}>
          <Pill label={profile.roleProfile === "breeder" ? "Kasvattaja" : "Omistaja"} tone="brand" />
          <Pill label={notificationSettings.pushEnabled ? "Ilmoitukset käytössä" : "Ilmoitukset pois"} />
        </View>
        <View style={styles.profileSummary}>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Rooli</Text>
            <Text style={styles.summaryValue}>{profile.roleProfile === "breeder" ? "Kasvattaja" : "Omistaja"}</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Muistutukset</Text>
            <Text style={styles.summaryValue}>{notificationSettings.reminderPushEnabled ? "Päällä" : "Pois"}</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Päivitykset</Text>
            <Text style={styles.summaryValue}>{notificationSettings.updatePushEnabled ? "Päällä" : "Pois"}</Text>
          </View>
        </View>
        {kennelName ? <Text style={styles.kennel}>Kennel {kennelName}</Text> : null}
      </View>

      <Card style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Omat tiedot</Text>
        <View style={styles.actionList}>
          <TextField label="Näyttönimi" value={displayNameInput} onChangeText={setDisplayNameInput} placeholder="Näkyvä nimi" />
          <TextField label="Esittely" value={bioInput} onChangeText={setBioInput} placeholder="Lyhyt esittely profiilista" />
          {saveMessage ? <InlineMessage tone="info" message={saveMessage} /> : null}
          <AppButton label="Tallenna tiedot" onPress={handleSaveProfile} secondary />
        </View>
      </Card>

      <Card style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Ilmoitukset</Text>
        <View style={styles.actionList}>
          <InlineMessage
            tone={pushPermissionState === "granted" ? "info" : "warning"}
            message={
              pushPermissionState === "granted"
                ? "Ilmoitukset ovat käytössä tällä laitteella."
                : pushPermissionState === "web_unsupported"
                  ? "Ilmoitukset eivät ole käytössä selaimessa."
                  : pushPermissionState === "simulator_unsupported"
                    ? "Ilmoitukset vaativat fyysisen laitteen."
                    : pushPermissionState === "denied"
                      ? "Ilmoituksia ei ole sallittu tällä laitteella."
                      : "Ilmoitusten tila tarkistetaan."
            }
          />
          {pushPermissionMessage ? <InlineMessage tone="info" message={pushPermissionMessage} /> : null}
          <SegmentedControl
            options={[
              { label: "Push päällä", value: "on" },
              { label: "Push pois", value: "off" },
            ]}
            value={notificationSettings.pushEnabled ? "on" : "off"}
            onChange={(value) => updateNotificationSettings({ pushEnabled: value === "on" })}
          />
          <SegmentedControl
            options={[
              { label: "Muistutukset päällä", value: "on" },
              { label: "Muistutukset pois", value: "off" },
            ]}
            value={notificationSettings.reminderPushEnabled ? "on" : "off"}
            onChange={(value) => updateNotificationSettings({ reminderPushEnabled: value === "on" })}
          />
          <SegmentedControl
            options={[
              { label: "Päivitykset päällä", value: "on" },
              { label: "Päivitykset pois", value: "off" },
            ]}
            value={notificationSettings.updatePushEnabled ? "on" : "off"}
            onChange={(value) => updateNotificationSettings({ updatePushEnabled: value === "on" })}
          />
          <SegmentedControl
            options={[
              { label: "Markkinointi pois", value: "off" },
              { label: "Markkinointi päällä", value: "on" },
            ]}
            value={notificationSettings.marketingPushEnabled ? "on" : "off"}
            onChange={(value) => updateNotificationSettings({ marketingPushEnabled: value === "on" })}
          />
          <AppButton label="Pyydä ilmoituslupa" onPress={handleRequestPushPermission} secondary />
        </View>
      </Card>

      <Card style={styles.accountCard}>
        <Text style={styles.sectionTitle}>Tili</Text>
        <View style={styles.actionList}>
          <AppButton label="Tiliasetukset" secondary />
          <AppButton label="Kirjaudu ulos" onPress={signOut} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[4],
  },
  heroTop: {
    flexDirection: "row",
    gap: spacing[4],
    alignItems: "flex-start",
  },
  heroAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: "center",
    justifyContent: "center",
  },
  heroAvatarText: {
    color: colors.brandPrimaryHover,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  heroMeta: {
    flex: 1,
    gap: spacing[2],
  },
  heroEyebrow: {
    color: colors.textTertiary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  name: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  email: {
    color: colors.textSecondary,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  profileSummary: {
    flexDirection: "row",
    gap: spacing[3],
  },
  summaryTile: {
    flex: 1,
    gap: spacing[2],
    borderRadius: 18,
    backgroundColor: "#F9FAFB",
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
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  kennel: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  contentCard: {
    backgroundColor: "#FCFDFE",
  },
  accountCard: {
    backgroundColor: "#FBFCFE",
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  body: {
    marginTop: spacing[2],
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actionList: {
    marginTop: spacing[4],
    gap: spacing[3],
  },
});
