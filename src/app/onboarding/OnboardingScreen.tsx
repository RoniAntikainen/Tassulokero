import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton, Card, InlineMessage, Screen, SegmentedControl, TextField } from "../../components/ui";
import { validateRequired } from "../../lib/validation";
import { useAppStore } from "../../state/appStore";
import { useAuthStore } from "../../state/authStore";
import { usePetStore } from "../../state/petStore";
import { useUpdateStore } from "../../state/updateStore";
import { colors, radii, spacing, typography } from "../../theme/tokens";
import { RoleProfile } from "../../types/auth";

const roleOptions: { label: string; value: RoleProfile }[] = [
  { label: "Omistaja", value: "owner" },
  { label: "Kasvattaja", value: "breeder" },
];

export function OnboardingScreen() {
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const addPet = usePetStore((state) => state.addPet);
  const setSelectedPetId = useAppStore((state) => state.setSelectedPetId);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const addSystemUpdate = useUpdateStore((state) => state.addSystemUpdate);

  const [roleProfile, setRoleProfile] = useState<RoleProfile>(sessionUser?.roleProfile ?? "owner");
  const [kennelName, setKennelName] = useState("");
  const [breederBio, setBreederBio] = useState("");
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleContinue() {
    const petNameError = validateRequired("Lemmikin nimi", petName);
    if (petNameError) {
      setErrorMessage(petNameError);
      return;
    }

    const speciesError = validateRequired("Laji", species);
    if (speciesError) {
      setErrorMessage(speciesError);
      return;
    }

    if (roleProfile === "breeder" && kennelName.trim() && kennelName.trim().length < 3) {
      setErrorMessage("Kennel-nimessä tulee olla vähintään 3 merkkiä.");
      return;
    }

    const petId = addPet({
      name: petName.trim(),
      species: species.trim(),
      breed: breed.trim() || undefined,
    });

    addSystemUpdate(petId, `${petName.trim()} lisättiin.`);
    setSelectedPetId(petId);
    setActiveTab("pets");
    setErrorMessage(null);
    completeOnboarding({
      roleProfile,
      kennelName: roleProfile === "breeder" ? kennelName.trim() : undefined,
      breederBio: roleProfile === "breeder" ? breederBio.trim() : undefined,
    });
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Aloitus</Text>
        <Text style={styles.title}>Luodaan profiili ja ensimmäinen lemmikki</Text>
        <Text style={styles.body}>Aloitetaan olennaisista tiedoista.</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>1. Valitse profiilityyppi</Text>
        <SegmentedControl options={roleOptions} value={roleProfile} onChange={(value) => setRoleProfile(value as RoleProfile)} />

        <View style={styles.stack}>
          <InlineMessage
            tone="info"
            message={
              roleProfile === "owner"
                ? "Omistajaprofiili sopii arjen seurantaan ja lemmikin tietoihin."
                : "Kasvattajaprofiili kokoaa kennelin ja kasvatukseen liittyvät tiedot."
            }
          />
          {roleProfile === "breeder" ? (
            <>
              <TextField
                label="Kennel-nimi"
                value={kennelName}
                onChangeText={setKennelName}
                placeholder="Kennelin nimi"
              />
              <TextField
                label="Kasvattajan esittely"
                value={breederBio}
                onChangeText={setBreederBio}
                placeholder="Lyhyt esittely kennelistä"
              />
            </>
          ) : null}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>2. Luo ensimmäinen lemmikki</Text>
        <View style={styles.stack}>
          <TextField label="Nimi" value={petName} onChangeText={setPetName} placeholder="Lemmikin nimi" />
          <TextField label="Laji" value={species} onChangeText={setSpecies} placeholder="Koira, kissa..." />
          <TextField label="Rotu (valinnainen)" value={breed} onChangeText={setBreed} placeholder="Rotu" />

          <InlineMessage
            tone="info"
            message="Voit lisätä kuvan lemmikille myöhemmin."
          />

          {errorMessage ? <InlineMessage tone="warning" message={errorMessage} /> : null}

          <AppButton label="Valmis, jatka kotiin" onPress={handleContinue} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 28,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[3],
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  eyebrow: {
    fontSize: typography.size.sm,
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: typography.size["2xl"],
    lineHeight: 32,
    color: colors.textPrimary,
    fontWeight: typography.weight.bold,
    letterSpacing: -0.6,
  },
  body: {
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: typography.size.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    letterSpacing: -0.3,
  },
  stack: {
    marginTop: spacing[4],
    gap: spacing[4],
  },
});
