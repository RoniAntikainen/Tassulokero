import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton, Card, ErrorState, InlineMessage, LoadingState, Screen, SegmentedControl, TextField } from "../../components/ui";
import { hasSupabaseEnv } from "../../lib/env";
import { validateEmail, validatePassword, validateRequired } from "../../lib/validation";
import { useAuthStore } from "../../state/authStore";
import { colors, radii, spacing, typography } from "../../theme/tokens";
import { AuthMode, RoleProfile } from "../../types/auth";

const roleOptions: { label: string; value: RoleProfile }[] = [
  { label: "Omistaja", value: "owner" },
  { label: "Kasvattaja", value: "breeder" },
];

const authOptions: { label: string; value: AuthMode; hint: string }[] = [
  { label: "Kirjaudu", value: "sign-in", hint: "Jatka sisään" },
  { label: "Luo tili", value: "sign-up", hint: "Uusi käyttäjä" },
  { label: "Palauta", value: "reset-password", hint: "Unohtunut salasana" },
];

export function AuthScreen() {
  const authMode = useAuthStore((state) => state.authMode);
  const setAuthMode = useAuthStore((state) => state.setAuthMode);
  const signInMock = useAuthStore((state) => state.signInMock);
  const signUpMock = useAuthStore((state) => state.signUpMock);
  const requestPasswordResetMock = useAuthStore((state) => state.requestPasswordResetMock);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleProfile, setRoleProfile] = useState<RoleProfile>("owner");

  const helperText = useMemo(() => {
    if (hasSupabaseEnv()) {
      return "Voit jatkaa kirjautumalla sisään.";
    }

    return "Voit kokeilla kirjautumista heti tässä esikatselussa.";
  }, []);

  async function handleSubmit() {
    if (isLoading) return;

    const emailError = validateEmail(email);
    if (emailError) {
      useAuthStore.setState({ errorMessage: emailError });
      return;
    }

    if (authMode !== "reset-password") {
      const passwordError = validatePassword(password);
      if (passwordError) {
        useAuthStore.setState({ errorMessage: passwordError });
        return;
      }
    }

    if (authMode === "sign-in") {
      await signInMock({ email, password });
      return;
    }

    if (authMode === "sign-up") {
      const displayNameError = validateRequired("Näyttönimi", displayName);
      if (displayNameError) {
        useAuthStore.setState({ errorMessage: displayNameError });
        return;
      }

      await signUpMock({ displayName, email, password, roleProfile });
      return;
    }

    await requestPasswordResetMock(email);
  }

  return (
    <Screen>
      <View style={styles.authShell}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Tassulokero</Text>
          <Text style={styles.title}>Lemmikin arki yhdessä paikassa</Text>
          <Text style={styles.body}>Kirjaudu sisään tai luo tili jatkaaksesi.</Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.modeSwitcher}>
            {authOptions.map((option) => {
              const active = option.value === authMode;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => setAuthMode(option.value)}
                  style={[styles.modeOption, active && styles.modeOptionActive]}
                >
                  <Text style={[styles.modeLabel, active && styles.modeLabelActive]}>{option.label}</Text>
                  <Text style={[styles.modeHint, active && styles.modeHintActive]}>{option.hint}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.form}>
            {isLoading ? <LoadingState title="Kirjautuminen käynnissä" message="Käsitellään pyyntöä turvallisesti." /> : null}
            {authMode === "sign-up" ? (
              <>
                <TextField
                  label="Näyttönimi"
                  value={displayName}
                  onChangeText={(value) => {
                    clearError();
                    setDisplayName(value);
                  }}
                  placeholder="Näyttönimi"
                  editable={!isLoading}
                />
                <SegmentedControl options={roleOptions} value={roleProfile} onChange={(value) => setRoleProfile(value as RoleProfile)} />
              </>
            ) : null}

            <TextField
              label="Sähköposti"
              value={email}
              onChangeText={(value) => {
                clearError();
                setEmail(value);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="oma@email.fi"
              editable={!isLoading}
            />

            {authMode !== "reset-password" ? (
              <TextField
                label="Salasana"
                value={password}
                onChangeText={(value) => {
                  clearError();
                  setPassword(value);
                }}
                placeholder="Salasana"
                secureTextEntry
                editable={!isLoading}
              />
            ) : null}

            <InlineMessage tone="info" message={helperText} />
            {errorMessage ? <ErrorState title="Kirjautuminen" message={errorMessage} /> : null}

            <AppButton
              label={isLoading ? getLoadingLabel(authMode) : getPrimaryLabel(authMode)}
              onPress={() => {
                void handleSubmit();
              }}
              disabled={isLoading}
            />
          </View>
        </Card>
      </View>
    </Screen>
  );
}

function getPrimaryLabel(mode: AuthMode) {
  if (mode === "sign-in") return "Kirjaudu sisään";
  if (mode === "sign-up") return "Luo tili";
  return "Lähetä palautuslinkki";
}

function getLoadingLabel(mode: AuthMode) {
  if (mode === "sign-in") return "Kirjaudutaan...";
  if (mode === "sign-up") return "Luodaan tiliä...";
  return "Lähetetään...";
}

const styles = StyleSheet.create({
  authShell: {
    gap: spacing[5],
    paddingTop: spacing[4],
  },
  hero: {
    backgroundColor: colors.brandPrimarySoft,
    borderRadius: 30,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[2],
  },
  eyebrow: {
    fontSize: typography.size.sm,
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: typography.size["3xl"],
    lineHeight: 40,
    color: colors.textPrimary,
    fontWeight: typography.weight.bold,
    letterSpacing: -0.9,
  },
  body: {
    marginTop: spacing[1],
    color: colors.textSecondary,
    fontSize: typography.size.md,
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: spacing[5],
  },
  modeSwitcher: {
    flexDirection: "row",
    gap: spacing[2],
    paddingBottom: spacing[2],
  },
  modeOption: {
    flex: 1,
    minHeight: 76,
    borderRadius: 22,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    justifyContent: "center",
    gap: spacing[1],
  },
  modeOptionActive: {
    backgroundColor: colors.brandPrimarySoft,
    borderColor: "rgba(127, 168, 131, 0.2)",
  },
  modeLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    letterSpacing: -0.2,
  },
  modeLabelActive: {
    color: colors.brandPrimaryHover,
  },
  modeHint: {
    color: colors.textSecondary,
    fontSize: typography.size.xs,
    lineHeight: 18,
  },
  modeHintActive: {
    color: colors.brandPrimaryHover,
  },
  form: {
    marginTop: spacing[4],
    gap: spacing[4],
  },
});
