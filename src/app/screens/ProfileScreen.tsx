import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { AppButton, Card, InlineMessage, Pill, Screen, TextField } from "../../components/ui";
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
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [pushPermissionState, setPushPermissionState] = useState<"unknown" | "granted" | "denied" | "web_unsupported" | "simulator_unsupported">("unknown");
  const [pushPermissionMessage, setPushPermissionMessage] = useState<string | null>(null);

  useEffect(() => {
    setDisplayNameInput(profileSettings.displayName);
  }, [profileSettings.displayName]);

  useEffect(() => {
    void (async () => {
      const snapshot = await getPushPermissionSnapshot();
      setPushPermissionState(snapshot.reason);
    })();
  }, []);

  function handleSaveProfile() {
    updateProfile({
      displayName: displayNameInput.trim() || profile.displayName,
      bio: profileSettings.bio,
    });
    setSaveMessage("Tiedot tallennettu.");
  }

  async function handleRequestPushPermission() {
    const result = await requestPushPermissions();
    setPushPermissionState(result.reason);
    setPushPermissionMessage(
      result.reason === "granted"
        ? "Ilmoitukset sallittu tällä laitteella."
        : result.reason === "web_unsupported"
          ? "Selaimessa ilmoituslupaa ei voi pyytää."
          : result.reason === "simulator_unsupported"
            ? "Ilmoitukset vaativat fyysisen laitteen."
            : "Ilmoituksia ei sallittu.",
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
          <Pill label={notificationSettings.pushEnabled ? "Ilmoitukset päällä" : "Ilmoitukset pois"} />
        </View>
        {kennelName ? <Text style={styles.kennel}>Kennel {kennelName}</Text> : null}
      </View>

      <Card style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Perustiedot</Text>
        <View style={styles.actionList}>
          <TextField label="Näyttönimi" value={displayNameInput} onChangeText={setDisplayNameInput} placeholder="Nimi" />
          {saveMessage ? <InlineMessage tone="info" message={saveMessage} /> : null}
          <AppButton label="Tallenna muutokset" onPress={handleSaveProfile} secondary />
        </View>
      </Card>

      <Card style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Ilmoitukset</Text>
        <View style={styles.actionList}>
          <InlineMessage
            tone={pushPermissionState === "granted" ? "info" : "warning"}
            message={
              pushPermissionState === "granted"
                ? "Ilmoitukset ovat käytössä."
                : pushPermissionState === "web_unsupported"
                  ? "Ilmoitukset eivät ole käytössä selaimessa."
                  : pushPermissionState === "simulator_unsupported"
                    ? "Ilmoitukset vaativat fyysisen laitteen."
                    : pushPermissionState === "denied"
                      ? "Ilmoituksia ei ole sallittu."
                      : "Tarkistetaan ilmoitusten tila."
            }
          />
          {pushPermissionMessage ? <InlineMessage tone="info" message={pushPermissionMessage} /> : null}
          <NotificationSettingRow
            label="Push-ilmoitukset"
            description="Sallii ilmoitukset tälle laitteelle."
            value={notificationSettings.pushEnabled}
            onChange={(value) => updateNotificationSettings({ pushEnabled: value })}
          />
          <NotificationSettingRow
            label="Muistutukset"
            description="Näyttää tulevat hoito- ja arjen muistutukset."
            value={notificationSettings.reminderPushEnabled}
            onChange={(value) => updateNotificationSettings({ reminderPushEnabled: value })}
          />
          <NotificationSettingRow
            label="Päivitykset"
            description="Ilmoittaa uusista merkinnöistä ja muutoksista."
            value={notificationSettings.updatePushEnabled}
            onChange={(value) => updateNotificationSettings({ updatePushEnabled: value })}
          />
          <NotificationSettingRow
            label="Markkinointi"
            description="Tarjoukset ja muut ei-välttämättömät viestit."
            value={notificationSettings.marketingPushEnabled}
            onChange={(value) => updateNotificationSettings({ marketingPushEnabled: value })}
          />
          <AppButton label="Salli ilmoitukset" onPress={handleRequestPushPermission} secondary />
        </View>
      </Card>

      <Card style={styles.accountCard}>
        <Text style={styles.sectionTitle}>Tili</Text>
        <View style={styles.actionList}>
          <AppButton label="Kirjaudu ulos" onPress={signOut} />
        </View>
      </Card>
    </Screen>
  );
}

function NotificationSettingRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingCopy}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.borderStrong, true: colors.brandPrimary }}
        thumbColor={colors.surfaceRaised}
        ios_backgroundColor={colors.borderStrong}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surfaceRaised,
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
    backgroundColor: colors.surfaceMuted,
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
  kennel: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  contentCard: {
    backgroundColor: colors.surfaceSoft,
  },
  accountCard: {
    backgroundColor: colors.surfaceAccentMuted,
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[4],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderRadius: 20,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  settingCopy: {
    flex: 1,
    gap: spacing[1],
  },
  settingLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  settingDescription: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: 20,
  },
});
