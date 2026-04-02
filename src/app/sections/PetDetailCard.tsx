import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  AppButton,
  Card,
  DatePickerField,
  EmptyState,
  InlineMessage,
  PickerField,
  Pill,
  SectionTitle,
  SegmentedControl,
  TextField,
} from "../../components/ui";
import { formatDueDate } from "../../lib/date";
import { searchUsersByDisplayName } from "../../lib/db";
import { canManageHeat, canManageHealth, canManagePetProfile, canManageReminders, canManageSharing as hasSharingManagementAccess } from "../../lib/permissions";
import { colors, radii, spacing, typography } from "../../theme/tokens";
import { useAppStore } from "../../state/appStore";
import { useAuthStore } from "../../state/authStore";
import { useBreederStore } from "../../state/breederStore";
import { useHealthStore } from "../../state/healthStore";
import { getReminderGroup, useReminderStore } from "../../state/reminderStore";
import { usePetStore } from "../../state/petStore";
import { useSharingStore } from "../../state/sharingStore";
import { useUpdateStore } from "../../state/updateStore";
import { HeatCycleRecord, Pet, PetSection, Reminder, VaccinationRecord } from "../../types/domain";

const baseSectionOptions: { label: string; value: PetSection }[] = [
  { label: "Profiili", value: "overview" },
  { label: "Rokotukset", value: "health" },
  { label: "Muistutukset", value: "care" },
  { label: "Jako", value: "sharing" },
];

const heatSectionOption: { label: string; value: PetSection } = { label: "Juoksut", value: "updates" };

function isFemalePet(sex?: string) {
  const normalized = sex?.trim().toLowerCase();
  return normalized === "female" || normalized === "tyttö" || normalized === "naaras" || normalized === "narttu";
}

function formatDateLabel(value?: string) {
  if (!value) {
    return "Puuttuu";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fi-FI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatShortDate(value?: string) {
  if (!value) {
    return "Puuttuu";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fi-FI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

function getAgeLabel(birthDate?: string) {
  if (!birthDate) {
    return "Ei tiedossa";
  }

  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) {
    return "Ei tiedossa";
  }

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (now.getDate() < birth.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0) {
    return `${Math.max(months, 0)} kk`;
  }

  if (months <= 0) {
    return `${years} v`;
  }

  return `${years} v ${months} kk`;
}

function differenceInDays(targetDate: string) {
  const date = new Date(targetDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

function addDays(dateValue: string, days: number) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function estimateNextHeatStart(cycles: HeatCycleRecord[]) {
  if (!cycles.length) {
    return undefined;
  }

  const ordered = [...cycles]
    .filter((cycle) => !Number.isNaN(new Date(cycle.startDate).getTime()))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  if (!ordered.length) {
    return undefined;
  }

  if (ordered.length === 1) {
    return addDays(ordered[0].startDate, 180);
  }

  const intervals: number[] = [];
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = new Date(ordered[index - 1].startDate).getTime();
    const current = new Date(ordered[index].startDate).getTime();
    intervals.push(Math.round((current - previous) / (1000 * 60 * 60 * 24)));
  }

  const averageInterval = Math.round(intervals.reduce((sum, item) => sum + item, 0) / intervals.length);
  return addDays(ordered[ordered.length - 1].startDate, averageInterval);
}

function getVaccinationStatus(record: VaccinationRecord) {
  if (!record.validUntil) {
    return {
      label: "Ei voimassaoloaikaa",
      tone: "neutral" as const,
      urgent: false,
    };
  }

  const days = differenceInDays(record.validUntil);
  if (days === null) {
    return {
      label: "Tarkista päivämäärä",
      tone: "warning" as const,
      urgent: false,
    };
  }

  if (days < 0) {
    return {
      label: `Vanhentunut ${Math.abs(days)} pv sitten`,
      tone: "danger" as const,
      urgent: true,
    };
  }

  if (days <= 30) {
    return {
      label: `Umpeutuu ${days} pv päästä`,
      tone: "warning" as const,
      urgent: true,
    };
  }

  return {
    label: `Voimassa ${days} pv`,
    tone: "success" as const,
    urgent: false,
  };
}

function toDueAt(dateValue: string) {
  return `${dateValue}T09:00:00.000Z`;
}

export function PetDetailCard({ pet }: { pet: Pet }) {
  const selectedPetSection = useAppStore((state) => state.selectedPetSection);
  const setSelectedPetSection = useAppStore((state) => state.setSelectedPetSection);
  const viewerRole = useAppStore((state) => state.viewerRole);
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const updatePet = usePetStore((state) => state.updatePet);
  const sharing = useSharingStore((state) => state.accesses).filter((item) => item.petId === pet.id);
  const inviteAccess = useSharingStore((state) => state.inviteAccess);
  const toggleFamilyAdmin = useSharingStore((state) => state.toggleFamilyAdmin);
  const removeAccess = useSharingStore((state) => state.removeAccess);
  const updateAccessPermissions = useSharingStore((state) => state.updateAccessPermissions);
  const addSystemUpdate = useUpdateStore((state) => state.addSystemUpdate);
  const reminders = useReminderStore((state) => state.reminders).filter((item) => item.petId === pet.id);
  const addReminder = useReminderStore((state) => state.addReminder);
  const completeReminder = useReminderStore((state) => state.completeReminder);
  const cancelReminder = useReminderStore((state) => state.cancelReminder);
  const vaccinations = useHealthStore((state) => state.vaccinations).filter((item) => item.petId === pet.id);
  const addVaccination = useHealthStore((state) => state.addVaccination);
  const updateVaccination = useHealthStore((state) => state.updateVaccination);
  const removeVaccination = useHealthStore((state) => state.removeVaccination);
  const heatCycles = useBreederStore((state) => state.heatCycles).filter((item) => item.petId === pet.id);
  const addHeatCycle = useBreederStore((state) => state.addHeatCycle);

  const sortedVaccinations = useMemo(
    () =>
      [...vaccinations].sort((a, b) => {
        const aTime = new Date(a.validUntil ?? a.administeredOn).getTime();
        const bTime = new Date(b.validUntil ?? b.administeredOn).getTime();
        return aTime - bTime;
      }),
    [vaccinations],
  );

  const sortedHeatCycles = useMemo(
    () => [...heatCycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
    [heatCycles],
  );

  const sortedReminders = useMemo(
    () => [...reminders].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()),
    [reminders],
  );

  const dueVaccinations = sortedVaccinations.filter((record) => getVaccinationStatus(record).urgent);
  const nextHeatStart = estimateNextHeatStart(sortedHeatCycles);
  const nextHeatDays = nextHeatStart ? differenceInDays(nextHeatStart) : null;
  const pendingReminders = sortedReminders.filter((item) => item.status === "pending");
  const overdueReminders = pendingReminders.filter((item) => getReminderGroup(item) === "overdue");
  const currentViewerName = sessionUser?.displayName ?? null;
  const hasFamilyAdminAccess = sharing.some((access) => access.role === "family" && access.isAdmin && access.personName === currentViewerName);
  const canManageSharingAccess = hasSharingManagementAccess(viewerRole, hasFamilyAdminAccess);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [name, setName] = useState(pet.name);
  const [species, setSpecies] = useState(pet.species);
  const [breed, setBreed] = useState(pet.breed ?? "");
  const [birthDate, setBirthDate] = useState(pet.birthDate ?? "");
  const [sex, setSex] = useState(pet.sex ?? "");
  const [weightKg, setWeightKg] = useState(pet.weightKg ? String(pet.weightKg) : "");
  const [chipId, setChipId] = useState(pet.chipId ?? "");
  const [colorMarkings, setColorMarkings] = useState(pet.colorMarkings ?? "");
  const [isNeutered, setIsNeutered] = useState(pet.isNeutered ? "yes" : "no");
  const [notes, setNotes] = useState(pet.notes ?? "");

  const canManagePet = canManagePetProfile(viewerRole);
  const canManageHealthAccess = canManageHealth(viewerRole);
  const canManageRemindersAccess = canManageReminders(viewerRole);
  const canManageHeatAccess = canManageHeat(viewerRole);
  const heatTrackingEnabled = isFemalePet(pet.sex) || isFemalePet(sex);
  const sectionOptions = heatTrackingEnabled ? [...baseSectionOptions.slice(0, 3), heatSectionOption, baseSectionOptions[3]] : baseSectionOptions;

  const [vaccinationMessage, setVaccinationMessage] = useState<string | null>(null);
  const [vaccinationName, setVaccinationName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [vaccinationValidUntil, setVaccinationValidUntil] = useState("");
  const [vaccinationClinic, setVaccinationClinic] = useState("");
  const [editingVaccinationId, setEditingVaccinationId] = useState<string | null>(null);

  const [reminderMessage, setReminderMessage] = useState<string | null>(null);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderDueDate, setReminderDueDate] = useState("");
  const [reminderType, setReminderType] = useState<Reminder["type"]>("manual");

  const [heatMessage, setHeatMessage] = useState<string | null>(null);
  const [heatStartDate, setHeatStartDate] = useState("");
  const [heatEndDate, setHeatEndDate] = useState("");
  const [heatNotes, setHeatNotes] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteUserId, setInviteUserId] = useState<string | null>(null);
  const [inviteRole, setInviteRole] = useState<"family" | "caretaker">("family");
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [userSuggestions, setUserSuggestions] = useState<Array<{ id: string; display_name: string | null; email: string | null }>>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [expandedAccessId, setExpandedAccessId] = useState<string | null>(null);

  function saveProfile() {
    const nextName = name.trim();
    const nextSpecies = species.trim();
    const parsedWeight = weightKg.trim() ? Number(weightKg.replace(",", ".")) : undefined;

    if (!nextName || !nextSpecies) {
      setProfileMessage("Nimi ja laji ovat pakolliset.");
      return;
    }

    if (birthDate.trim() && Number.isNaN(new Date(birthDate).getTime())) {
      setProfileMessage("Syntymäajan pitää olla muodossa YYYY-MM-DD.");
      return;
    }

    if (weightKg.trim() && Number.isNaN(parsedWeight)) {
      setProfileMessage("Painon pitää olla numero, esimerkiksi 4.2.");
      return;
    }

    updatePet(pet.id, {
      name: nextName,
      species: nextSpecies,
      breed: breed.trim() || undefined,
      birthDate: birthDate.trim() || undefined,
      sex: sex.trim() || undefined,
      weightKg: parsedWeight,
      chipId: chipId.trim() || undefined,
      colorMarkings: colorMarkings.trim() || undefined,
      isNeutered: isNeutered === "yes",
      notes: notes.trim() || undefined,
    });

    if (isFemalePet(sex)) {
      setSelectedPetSection("updates");
    } else if (selectedPetSection === "updates") {
      setSelectedPetSection("overview");
    }

    setProfileMessage("Profiili tallennettu.");
    setIsEditingProfile(false);
  }

  function startVaccinationEdit(record: VaccinationRecord) {
    setEditingVaccinationId(record.id);
    setVaccinationName(record.vaccineName);
    setVaccinationDate(record.administeredOn);
    setVaccinationValidUntil(record.validUntil ?? "");
    setVaccinationClinic(record.clinicName ?? "");
    setVaccinationMessage(null);
  }

  function clearVaccinationForm() {
    setEditingVaccinationId(null);
    setVaccinationName("");
    setVaccinationDate("");
    setVaccinationValidUntil("");
    setVaccinationClinic("");
  }

  function saveVaccinationForm() {
    if (!vaccinationName.trim() || !vaccinationDate.trim()) {
      setVaccinationMessage("Rokotteen nimi ja annettu päivä ovat pakolliset.");
      return;
    }

    if (Number.isNaN(new Date(vaccinationDate).getTime())) {
      setVaccinationMessage("Annettu päivä pitää olla muodossa YYYY-MM-DD.");
      return;
    }

    if (vaccinationValidUntil.trim() && Number.isNaN(new Date(vaccinationValidUntil).getTime())) {
      setVaccinationMessage("Voimassa asti pitää olla muodossa YYYY-MM-DD.");
      return;
    }

    if (editingVaccinationId) {
      updateVaccination(editingVaccinationId, {
        vaccineName: vaccinationName.trim(),
        administeredOn: vaccinationDate.trim(),
        validUntil: vaccinationValidUntil.trim() || undefined,
        clinicName: vaccinationClinic.trim() || undefined,
      });
      setVaccinationMessage("Rokotus päivitetty.");
    } else {
      addVaccination({
        petId: pet.id,
        vaccineName: vaccinationName.trim(),
        administeredOn: vaccinationDate.trim(),
        validUntil: vaccinationValidUntil.trim() || undefined,
        clinicName: vaccinationClinic.trim() || undefined,
      });
      setVaccinationMessage("Rokotus lisätty.");
    }

    clearVaccinationForm();
  }

  function handleInviteAccess() {
    if (!inviteUserId || !inviteName.trim()) {
      setInviteError("Valitse käyttäjä ehdotuksista.");
      setInviteMessage(null);
      return;
    }

    inviteAccess({
      petId: pet.id,
      userId: inviteUserId,
      personName: inviteName.trim(),
      role: inviteRole,
    });
    addSystemUpdate(
      pet.id,
      inviteRole === "family"
        ? `Perhekutsu lähetettiin henkilölle ${inviteName.trim()}.`
        : `Hoitajakutsu lähetettiin henkilölle ${inviteName.trim()}.`,
    );

    setInviteName("");
    setInviteUserId(null);
    setInviteError(null);
    setUserSuggestions([]);
    setInviteMessage(inviteRole === "family" ? "Perhekutsu lähetettiin." : "Hoitajakutsu lähetettiin.");
  }

  async function handleInviteNameChange(value: string) {
    setInviteName(value);
    setInviteUserId(null);
    setInviteMessage(null);

    const normalizedValue = value.trim();
    if (normalizedValue.length < 2) {
      setUserSuggestions([]);
      return;
    }

    setIsSearchingUsers(true);
    try {
      const results = await searchUsersByDisplayName(normalizedValue, sessionUser?.dbUserId);
      const existingIds = new Set(sharing.map((access) => access.userId));
      setUserSuggestions(results.filter((item: { id: string }) => !existingIds.has(item.id)));
    } catch {
      setUserSuggestions([]);
    } finally {
      setIsSearchingUsers(false);
    }
  }

  function createVaccinationReminder(record: VaccinationRecord) {
    if (!record.validUntil) {
      setVaccinationMessage("Lisää rokotukselle voimassaolo ennen muistutusta.");
      return;
    }

    addReminder({
      petId: pet.id,
      title: `${record.vaccineName}: varaa tehoste`,
      description: "Tarkista tehosteen tarve eläinlääkäriltä.",
      dueAt: toDueAt(record.validUntil),
      type: "vaccination",
    });
    setVaccinationMessage("Rokotusmuistutus lisätty.");
  }

  function addManualReminder() {
    if (!reminderTitle.trim() || !reminderDueDate.trim()) {
      setReminderMessage("Otsikko ja päivämäärä ovat pakolliset.");
      return;
    }

    if (Number.isNaN(new Date(reminderDueDate).getTime())) {
      setReminderMessage("Päivämäärän pitää olla muodossa YYYY-MM-DD.");
      return;
    }

    addReminder({
      petId: pet.id,
      title: reminderTitle.trim(),
      description: reminderDescription.trim() || undefined,
      dueAt: toDueAt(reminderDueDate),
      type: reminderType,
    });

    setReminderTitle("");
    setReminderDescription("");
    setReminderDueDate("");
    setReminderType("manual");
    setReminderMessage("Muistutus lisätty.");
  }

  function addHeatCycleRecord() {
    if (!heatStartDate.trim()) {
      setHeatMessage("Juoksujen alkamispäivä on pakollinen.");
      return;
    }

    if (Number.isNaN(new Date(heatStartDate).getTime())) {
      setHeatMessage("Alkamispäivän pitää olla muodossa YYYY-MM-DD.");
      return;
    }

    if (heatEndDate.trim() && Number.isNaN(new Date(heatEndDate).getTime())) {
      setHeatMessage("Päättymispäivän pitää olla muodossa YYYY-MM-DD.");
      return;
    }

    addHeatCycle({
      petId: pet.id,
      startDate: heatStartDate.trim(),
      endDate: heatEndDate.trim() || undefined,
      notes: heatNotes.trim() || undefined,
    });

    setHeatStartDate("");
    setHeatEndDate("");
    setHeatNotes("");
    setHeatMessage("Juoksu tallennettu.");
  }

  return (
    <View style={styles.container}>
      <Card style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroIdentity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{pet.name.slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>{pet.name}</Text>
              <Text style={styles.heroSubtitle}>
                {[pet.species, pet.breed].filter(Boolean).join(" • ") || "Lemmikki"}
              </Text>
            </View>
          </View>
          {dueVaccinations.length ? <Pill label={`${dueVaccinations.length} rokotetta seurattavana`} tone="warning" /> : null}
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Ikä</Text>
            <Text style={styles.summaryValue}>{getAgeLabel(pet.birthDate)}</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Paino</Text>
            <Text style={styles.summaryValue}>{pet.weightKg ? `${pet.weightKg} kg` : "Puuttuu"}</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Muistutukset</Text>
            <Text style={styles.summaryValue}>{pendingReminders.length}</Text>
          </View>
          {heatTrackingEnabled ? (
            <View style={styles.summaryTile}>
              <Text style={styles.summaryLabel}>Seuraava juoksu</Text>
              <Text style={styles.summaryValue}>
                {nextHeatStart ? formatShortDate(nextHeatStart) : "Arvio tulee, kun dataa on"}
              </Text>
            </View>
          ) : null}
        </View>

        {overdueReminders.length ? (
          <InlineMessage message={`${overdueReminders.length} muistutusta on jo myöhässä.`} tone="warning" />
        ) : null}
      </Card>

      <SegmentedControl options={sectionOptions} value={selectedPetSection === "updates" && !heatTrackingEnabled ? "overview" : selectedPetSection} onChange={setSelectedPetSection} />

      {selectedPetSection === "overview" ? (
        <Card style={styles.sectionCard}>
          <SectionTitle title="Lemmikin profiili" actionLabel={canManagePet ? "Muokattava" : "Vain luku"} />
          {profileMessage ? <InlineMessage message={profileMessage} /> : null}

          {!isEditingProfile ? (
            <>
              <View style={styles.infoGrid}>
                <InfoItem label="Syntymäaika" value={pet.birthDate ? formatDateLabel(pet.birthDate) : "Puuttuu"} />
                <InfoItem label="Sukupuoli" value={pet.sex ?? "Puuttuu"} />
                <InfoItem label="Siru" value={pet.chipId ?? "Puuttuu"} />
                <InfoItem label="Steriloitu / kastroitu" value={pet.isNeutered ? "Kyllä" : "Ei tiedossa"} />
                <InfoItem label="Väri / tunnisteet" value={pet.colorMarkings ?? "Puuttuu"} />
                <InfoItem label="Muistiinpanot" value={pet.notes ?? "Ei lisätty"} />
              </View>
              {canManagePet ? <AppButton label="Muokkaa profiilia" onPress={() => setIsEditingProfile(true)} /> : null}
            </>
          ) : (
            <View style={styles.formStack}>
              <TextField label="Nimi" value={name} onChangeText={setName} />
              <TextField label="Laji" value={species} onChangeText={setSpecies} placeholder="Koira, kissa..." />
              <TextField label="Rotu" value={breed} onChangeText={setBreed} placeholder="Esim. Sheltie" />
              <DatePickerField label="Syntymäaika" value={birthDate} onChange={setBirthDate} yearStart={1990} />
              <PickerField
                label="Sukupuoli"
                value={sex}
                onChange={setSex}
                placeholder="Valitse sukupuoli"
                options={[
                  { label: "Tyttö / naaras", value: "female" },
                  { label: "Poika / uros", value: "male" },
                ]}
              />
              <TextField label="Paino (kg)" value={weightKg} onChangeText={setWeightKg} placeholder="Esim. 6.4" />
              <TextField label="Sirunumero" value={chipId} onChangeText={setChipId} />
              <TextField label="Väri / tunnisteet" value={colorMarkings} onChangeText={setColorMarkings} />
              <TextField label="Lisätiedot" value={notes} onChangeText={setNotes} placeholder="Luonne, ruokavalio, erityishuomiot" />
              <SegmentedControl
                options={[
                  { label: "Ei / ei tiedossa", value: "no" },
                  { label: "Kyllä", value: "yes" },
                ]}
                value={isNeutered}
                onChange={setIsNeutered}
              />
              <View style={styles.buttonRow}>
                <View style={styles.buttonFlex}>
                  <AppButton label="Tallenna" onPress={saveProfile} />
                </View>
                <View style={styles.buttonFlex}>
                  <AppButton label="Peruuta" secondary onPress={() => setIsEditingProfile(false)} />
                </View>
              </View>
            </View>
          )}
        </Card>
      ) : null}

      {selectedPetSection === "health" ? (
        <Card style={styles.sectionCard}>
          <SectionTitle title="Rokotukset" actionLabel={dueVaccinations.length ? "Vaatii huomiota" : "Hallinnassa"} />
          {vaccinationMessage ? <InlineMessage message={vaccinationMessage} /> : null}

          {sortedVaccinations.length ? (
            <View style={styles.listStack}>
              {sortedVaccinations.map((record) => {
                const status = getVaccinationStatus(record);
                return (
                  <View key={record.id} style={styles.listCard}>
                    <View style={styles.listHeader}>
                      <View style={styles.listHeaderCopy}>
                        <Text style={styles.listTitle}>{record.vaccineName}</Text>
                        <Text style={styles.listMeta}>
                          Annettu {formatShortDate(record.administeredOn)}
                          {record.clinicName ? ` • ${record.clinicName}` : ""}
                        </Text>
                      </View>
                      <Pill label={status.label} tone={status.tone} />
                    </View>
                    {record.validUntil ? (
                      <Text style={styles.cardBodyText}>Voimassa asti {formatShortDate(record.validUntil)}</Text>
                    ) : null}
                    {canManageHealthAccess ? (
                      <View style={styles.actionRow}>
                        <ActionLink label="Muokkaa" onPress={() => startVaccinationEdit(record)} />
                        <ActionLink label="Luo muistutus" onPress={() => createVaccinationReminder(record)} />
                        <ActionLink label="Poista" danger onPress={() => removeVaccination(record.id)} />
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : (
            <EmptyState
              title="Ei rokotuksia vielä"
              message="Lisää rokotukset tänne, niin voimassaolo ja uusinnat pysyvät seurannassa."
            />
          )}

          {canManageHealthAccess ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{editingVaccinationId ? "Muokkaa rokotetta" : "Lisää rokotus"}</Text>
              <View style={styles.formStack}>
                <TextField label="Rokotteen nimi" value={vaccinationName} onChangeText={setVaccinationName} />
                <DatePickerField label="Annettu päivä" value={vaccinationDate} onChange={setVaccinationDate} yearStart={2010} />
                <DatePickerField
                  label="Voimassa asti"
                  value={vaccinationValidUntil}
                  onChange={setVaccinationValidUntil}
                  yearStart={2010}
                />
                <TextField label="Klinikka" value={vaccinationClinic} onChangeText={setVaccinationClinic} />
                <View style={styles.buttonRow}>
                  <View style={styles.buttonFlex}>
                    <AppButton label={editingVaccinationId ? "Päivitä" : "Lisää rokotus"} onPress={saveVaccinationForm} />
                  </View>
                  {editingVaccinationId ? (
                    <View style={styles.buttonFlex}>
                      <AppButton label="Peruuta" secondary onPress={clearVaccinationForm} />
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          ) : null}
        </Card>
      ) : null}

      {selectedPetSection === "care" ? (
        <Card style={styles.sectionCard}>
          <SectionTitle title="Muistutukset" actionLabel={pendingReminders.length ? `${pendingReminders.length} aktiivista` : "Ei avoimia"} />
          {reminderMessage ? <InlineMessage message={reminderMessage} /> : null}

          {sortedReminders.length ? (
            <View style={styles.listStack}>
              {sortedReminders.map((record) => {
                const group = getReminderGroup(record);
                const tone =
                  group === "overdue"
                    ? "danger"
                    : group === "today"
                      ? "warning"
                      : group === "completed"
                        ? "success"
                        : "brand";

                return (
                  <View key={record.id} style={styles.listCard}>
                    <View style={styles.listHeader}>
                      <View style={styles.listHeaderCopy}>
                        <Text style={styles.listTitle}>{record.title}</Text>
                        <Text style={styles.listMeta}>{formatDueDate(record.dueAt)}</Text>
                      </View>
                      <Pill
                        label={
                          group === "overdue"
                            ? "Myöhässä"
                            : group === "today"
                              ? "Tänään"
                              : group === "completed"
                                ? "Valmis"
                                : "Tulossa"
                        }
                        tone={tone}
                      />
                    </View>
                    {record.description ? <Text style={styles.cardBodyText}>{record.description}</Text> : null}
                    <Text style={styles.cardMetaText}>Tyyppi: {record.type}</Text>
                    {canManageRemindersAccess && record.status === "pending" ? (
                      <View style={styles.actionRow}>
                        <ActionLink label="Merkitse tehdyksi" onPress={() => completeReminder(record.id)} />
                        <ActionLink label="Peruuta" danger onPress={() => cancelReminder(record.id)} />
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : (
            <EmptyState
              title="Ei muistutuksia"
              message="Lisää esimerkiksi eläinlääkäriaika, lääkkeenanto tai muu tärkeä tehtävä."
            />
          )}

          {canManageRemindersAccess ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Lisää muistutus</Text>
              <View style={styles.formStack}>
                <SegmentedControl
                  options={[
                    { label: "Yleinen", value: "manual" },
                    { label: "Rokotus", value: "vaccination" },
                    { label: "Lääke", value: "medication" },
                    { label: "Lääkäri", value: "vet_visit" },
                  ]}
                  value={reminderType}
                  onChange={setReminderType}
                />
                <TextField label="Otsikko" value={reminderTitle} onChangeText={setReminderTitle} placeholder="Varaa eläinlääkäri" />
                <TextField
                  label="Lisätiedot"
                  value={reminderDescription}
                  onChangeText={setReminderDescription}
                  placeholder="Esim. vuosikontrolli tai tehosterokote"
                />
                <DatePickerField label="Päivä" value={reminderDueDate} onChange={setReminderDueDate} yearStart={2024} />
                <AppButton label="Lisää muistutus" onPress={addManualReminder} />
              </View>
            </View>
          ) : null}
        </Card>
      ) : null}

      {selectedPetSection === "updates" && heatTrackingEnabled ? (
        <Card style={styles.sectionCard}>
          <SectionTitle title="Juoksuseuranta" actionLabel={nextHeatStart ? "Ennuste käytössä" : "Tarvitsee dataa"} />
          {heatMessage ? <InlineMessage message={heatMessage} /> : null}

          <>
              <View style={styles.cycleSummary}>
                <InfoItem label="Viimeisin merkintä" value={sortedHeatCycles[0] ? formatShortDate(sortedHeatCycles[0].startDate) : "Ei merkintöjä"} />
                <InfoItem
                  label="Arvio seuraavista juoksuista"
                  value={
                    nextHeatStart
                      ? nextHeatDays !== null && nextHeatDays >= 0
                        ? `${formatShortDate(nextHeatStart)} (${nextHeatDays} pv)`
                        : `${formatShortDate(nextHeatStart)}`
                      : "Lisää ensimmäinen merkintä"
                  }
                />
              </View>

              {sortedHeatCycles.length ? (
                <View style={styles.listStack}>
                  {sortedHeatCycles.map((cycle) => (
                    <View key={cycle.id} style={styles.listCard}>
                      <View style={styles.listHeader}>
                        <View style={styles.listHeaderCopy}>
                          <Text style={styles.listTitle}>Juoksu alkoi {formatShortDate(cycle.startDate)}</Text>
                          <Text style={styles.listMeta}>
                            {cycle.endDate ? `Päättyi ${formatShortDate(cycle.endDate)}` : "Päättymispäivä puuttuu"}
                          </Text>
                        </View>
                      </View>
                      {cycle.notes ? <Text style={styles.cardBodyText}>{cycle.notes}</Text> : null}
                    </View>
                  ))}
                </View>
              ) : (
                <EmptyState
                  title="Ei juoksumerkintöjä"
                  message="Kun lisäät ensimmäiset merkinnät, arvio seuraavasta juoksusta näkyy täällä."
                />
              )}

              {canManageHeatAccess ? (
                <View style={styles.formCard}>
                  <Text style={styles.formTitle}>Lisää juoksumerkintä</Text>
                  <View style={styles.formStack}>
                    <DatePickerField label="Alkamispäivä" value={heatStartDate} onChange={setHeatStartDate} yearStart={2020} />
                    <DatePickerField label="Päättymispäivä" value={heatEndDate} onChange={setHeatEndDate} yearStart={2020} />
                    <TextField label="Muistiinpanot" value={heatNotes} onChangeText={setHeatNotes} placeholder="Esim. oireet tai huomiot" />
                    <AppButton label="Tallenna juoksu" onPress={addHeatCycleRecord} />
                  </View>
                </View>
              ) : null}
          </>
        </Card>
      ) : null}

      {selectedPetSection === "sharing" ? (
        <Card style={styles.sectionCard}>
          <SectionTitle title="Jaetut oikeudet" actionLabel={sharing.length ? `${sharing.length} henkilöä` : "Vain omistaja"} />

          {canManageSharingAccess ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Kutsu käyttäjä</Text>
              <View style={styles.formStack}>
                <SegmentedControl
                  options={[
                    { label: "Perhe", value: "family" },
                    { label: "Hoitaja", value: "caretaker" },
                  ]}
                  value={inviteRole}
                  onChange={(value) => setInviteRole(value as "family" | "caretaker")}
                />
                <TextField label="Käyttäjä" value={inviteName} onChangeText={handleInviteNameChange} placeholder="Hae nimellä" />
                {userSuggestions.length ? (
                  <View style={styles.suggestionList}>
                    {userSuggestions.map((user) => (
                      <Pressable
                        key={user.id}
                        onPress={() => {
                          setInviteUserId(user.id);
                          setInviteName(user.display_name ?? user.email ?? "Käyttäjä");
                          setUserSuggestions([]);
                          setInviteError(null);
                        }}
                        style={({ pressed }) => [styles.suggestionItem, pressed && styles.suggestionItemPressed]}
                      >
                        <Text style={styles.suggestionTitle}>{user.display_name ?? "Käyttäjä"}</Text>
                        <Text style={styles.suggestionMeta}>{user.email ?? user.id}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
                {isSearchingUsers ? <InlineMessage tone="info" message="Haetaan käyttäjiä..." /> : null}
                {inviteError ? <InlineMessage tone="warning" message={inviteError} /> : null}
                {inviteMessage ? <InlineMessage tone="info" message={inviteMessage} /> : null}
                <AppButton label="Lähetä kutsu" onPress={handleInviteAccess} />
              </View>
            </View>
          ) : (
            <InlineMessage
              tone="warning"
              message={
                viewerRole === "family"
                  ? "Jakojen muokkaus vaatii perheen ylläpito-oikeuden."
                  : "Tällä roolilla jakoja ei voi muokata."
              }
            />
          )}

          {sharing.length ? (
            <View style={styles.listStack}>
              {sharing.map((access) => (
                <View key={access.id} style={styles.listCard}>
                  <Text style={styles.listTitle}>{access.personName}</Text>
                  <Text style={styles.listMeta}>
                    {access.role === "family" ? (access.isAdmin ? "Perheen ylläpitäjä" : "Perhe") : "Hoitaja"}
                  </Text>
                  <View style={styles.actionWrap}>
                    {access.canViewProfile ? <Pill label="Profiili" tone="brand" /> : null}
                    {access.canViewHealth ? <Pill label="Terveys" tone="brand" /> : null}
                    {access.canViewReminders ? <Pill label="Muistutukset" tone="brand" /> : null}
                    {access.canUploadMedia ? <Pill label="Media" tone="brand" /> : null}
                    {access.canComment ? <Pill label="Kommentit" tone="brand" /> : null}
                  </View>

                  {canManageSharingAccess ? (
                    <>
                      <AppButton
                        label={expandedAccessId === access.id ? "Piilota oikeudet" : "Muokkaa oikeuksia"}
                        onPress={() => setExpandedAccessId(expandedAccessId === access.id ? null : access.id)}
                        secondary
                      />
                      {expandedAccessId === access.id ? (
                        <View style={styles.sharingEditor}>
                          {access.role === "family" ? (
                            <AppButton
                              label={access.isAdmin ? "Poista ylläpito-oikeus" : "Anna ylläpito-oikeus"}
                              onPress={() => toggleFamilyAdmin(access.id)}
                              secondary
                            />
                          ) : null}
                          <View style={styles.editorRow}>
                            <AppButton
                              label={access.canViewHealth ? "Piilota terveys" : "Salli terveys"}
                              onPress={() => updateAccessPermissions(access.id, { canViewHealth: !access.canViewHealth })}
                              secondary
                            />
                            <AppButton
                              label={access.canViewCareInstructions ? "Piilota hoito" : "Salli hoito"}
                              onPress={() =>
                                updateAccessPermissions(access.id, { canViewCareInstructions: !access.canViewCareInstructions })
                              }
                              secondary
                            />
                          </View>
                          <View style={styles.editorRow}>
                            <AppButton
                              label={access.canComment ? "Estä kommentit" : "Salli kommentit"}
                              onPress={() => updateAccessPermissions(access.id, { canComment: !access.canComment })}
                              secondary
                            />
                            <AppButton
                              label={access.canUploadMedia ? "Estä kuvat" : "Salli kuvat"}
                              onPress={() => updateAccessPermissions(access.id, { canUploadMedia: !access.canUploadMedia })}
                              secondary
                            />
                          </View>
                          {access.role !== "caretaker" ? (
                            <AppButton
                              label={access.canViewReminders ? "Piilota muistutukset" : "Salli muistutukset"}
                              onPress={() => updateAccessPermissions(access.id, { canViewReminders: !access.canViewReminders })}
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
              title="Ei jakoja"
              message="Perheenjäsenet ja hoitajat näkyvät täällä."
            />
          )}
        </Card>
      ) : null}
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ActionLink({
  label,
  onPress,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.actionLink}>
      <Text style={[styles.actionText, danger && styles.actionTextDanger]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
    paddingBottom: spacing[12],
  },
  heroCard: {
    gap: spacing[4],
    backgroundColor: colors.surfaceAccentMuted,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  heroIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandPrimarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  heroCopy: {
    gap: spacing[1],
    flex: 1,
  },
  heroTitle: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  summaryTile: {
    width: "47%",
    minHeight: 88,
    padding: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[2],
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  sectionCard: {
    gap: spacing[4],
  },
  infoGrid: {
    gap: spacing[3],
  },
  infoItem: {
    padding: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.bgSubtle,
    gap: spacing[1],
  },
  infoLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    fontWeight: typography.weight.medium,
  },
  formCard: {
    padding: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.brandSecondarySoft,
    gap: spacing[3],
  },
  formTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  formStack: {
    gap: spacing[3],
  },
  sharingEditor: {
    gap: spacing[3],
    marginTop: spacing[2],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
  },
  editorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  suggestionList: {
    gap: spacing[2],
  },
  suggestionItem: {
    padding: spacing[3],
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[1],
  },
  suggestionItemPressed: {
    opacity: 0.8,
  },
  suggestionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  suggestionMeta: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing[3],
  },
  buttonFlex: {
    flex: 1,
  },
  listStack: {
    gap: spacing[3],
  },
  listCard: {
    gap: spacing[2],
    padding: spacing[4],
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceRaised,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing[3],
    alignItems: "flex-start",
  },
  listHeaderCopy: {
    gap: spacing[1],
    flex: 1,
  },
  listTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  listMeta: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  cardBodyText: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  cardMetaText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  actionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  actionLink: {
    paddingVertical: spacing[1],
  },
  actionText: {
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.sm,
  },
  actionTextDanger: {
    color: colors.danger,
  },
  cycleSummary: {
    gap: spacing[3],
  },
});
