import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton, Card, DatePickerField, InlineMessage, MockMediaPreview, PickerField, Screen, SegmentedControl, TextField } from "../../components/ui";
import {
  canCreateUpdates,
  canManageCare,
  canManageHealth,
  canManagePets,
  canManageReminders,
  getUpdateAuthorRole,
} from "../../lib/permissions";
import { getPetPhotoPresetLabel, normalizePetPhotoLabel, pickPetPhoto } from "../../lib/petPhoto";
import { validateRequired } from "../../lib/validation";
import { AddActionMenuCard } from "./add/AddActionMenuCard";
import { AddHealthSections } from "./add/AddHealthSections";
import { AddReminderSection } from "./add/AddReminderSection";
import { AddSectionCard } from "./add/AddSectionCard";
import { AddUpdateSection } from "./add/AddUpdateSection";
import { useAppStore } from "../../state/appStore";
import { useCareStore } from "../../state/careStore";
import { useHealthStore } from "../../state/healthStore";
import { useMediaStore } from "../../state/mediaStore";
import { usePetStore } from "../../state/petStore";
import { useReminderStore } from "../../state/reminderStore";
import { useUpdateStore } from "../../state/updateStore";
import { useAuthStore } from "../../state/authStore";
import { colors, spacing, typography } from "../../theme/tokens";

export function AddScreen({ embedded = false }: { embedded?: boolean }) {
  const addPet = usePetStore((state) => state.addPet);
  const updatePet = usePetStore((state) => state.updatePet);
  const pets = usePetStore((state) => state.pets);
  const petCount = usePetStore((state) => state.pets.length);
  const viewerRole = useAppStore((state) => state.viewerRole);
  const addCareInstruction = useCareStore((state) => state.addCareInstruction);
  const addVaccination = useHealthStore((state) => state.addVaccination);
  const addMedication = useHealthStore((state) => state.addMedication);
  const addVetVisit = useHealthStore((state) => state.addVetVisit);
  const addInsuranceRecord = useHealthStore((state) => state.addInsuranceRecord);
  const addHealthNote = useHealthStore((state) => state.addHealthNote);
  const addMediaItem = useMediaStore((state) => state.addMediaItem);
  const addReminder = useReminderStore((state) => state.addReminder);
  const addUpdate = useUpdateStore((state) => state.addUpdate);
  const addSystemUpdate = useUpdateStore((state) => state.addSystemUpdate);
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const setSelectedPetId = useAppStore((state) => state.setSelectedPetId);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setFlashMessage = useAppStore((state) => state.setFlashMessage);
  const pendingAddSection = useAppStore((state) => state.pendingAddSection);
  const pendingPetEditorId = useAppStore((state) => state.pendingPetEditorId);
  const setPendingAddSection = useAppStore((state) => state.setPendingAddSection);
  const setPendingPetEditorId = useAppStore((state) => state.setPendingPetEditorId);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [photoLabel, setPhotoLabel] = useState("");
  const [photoOriginalName, setPhotoOriginalName] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [vaccinationName, setVaccinationName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [vaccinationValidUntil, setVaccinationValidUntil] = useState("");
  const [vaccinationClinic, setVaccinationClinic] = useState("");
  const [vaccinationSuccessMessage, setVaccinationSuccessMessage] = useState<string | null>(null);
  const [vaccinationErrorMessage, setVaccinationErrorMessage] = useState<string | null>(null);
  const [medicationName, setMedicationName] = useState("");
  const [medicationDosage, setMedicationDosage] = useState("");
  const [medicationInstructions, setMedicationInstructions] = useState("");
  const [medicationStartDate, setMedicationStartDate] = useState("");
  const [medicationEndDate, setMedicationEndDate] = useState("");
  const [medicationStatus, setMedicationStatus] = useState<"active" | "completed" | "paused">("active");
  const [medicationSuccessMessage, setMedicationSuccessMessage] = useState<string | null>(null);
  const [medicationErrorMessage, setMedicationErrorMessage] = useState<string | null>(null);
  const [visitDate, setVisitDate] = useState("");
  const [visitClinic, setVisitClinic] = useState("");
  const [visitVeterinarian, setVisitVeterinarian] = useState("");
  const [visitReason, setVisitReason] = useState("");
  const [visitSummary, setVisitSummary] = useState("");
  const [visitFollowUpDate, setVisitFollowUpDate] = useState("");
  const [visitSuccessMessage, setVisitSuccessMessage] = useState<string | null>(null);
  const [visitErrorMessage, setVisitErrorMessage] = useState<string | null>(null);
  const [insuranceProviderName, setInsuranceProviderName] = useState("");
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
  const [insuranceCoverageType, setInsuranceCoverageType] = useState<"health" | "life" | "health_and_life" | "other">("health");
  const [insuranceDeductibleLabel, setInsuranceDeductibleLabel] = useState("");
  const [insuranceValidFrom, setInsuranceValidFrom] = useState("");
  const [insuranceValidUntil, setInsuranceValidUntil] = useState("");
  const [insuranceContactPhone, setInsuranceContactPhone] = useState("");
  const [insuranceNotes, setInsuranceNotes] = useState("");
  const [insuranceSuccessMessage, setInsuranceSuccessMessage] = useState<string | null>(null);
  const [insuranceErrorMessage, setInsuranceErrorMessage] = useState<string | null>(null);
  const [healthType, setHealthType] = useState<"allergy" | "chronic_condition" | "diet_note" | "behaviour_note" | "other">("other");
  const [healthTitle, setHealthTitle] = useState("");
  const [healthContent, setHealthContent] = useState("");
  const [healthSuccessMessage, setHealthSuccessMessage] = useState<string | null>(null);
  const [healthErrorMessage, setHealthErrorMessage] = useState<string | null>(null);
  const [careType, setCareType] = useState<"feeding" | "commands" | "routine" | "warning" | "general">("general");
  const [careTitle, setCareTitle] = useState("");
  const [careContent, setCareContent] = useState("");
  const [careSuccessMessage, setCareSuccessMessage] = useState<string | null>(null);
  const [careErrorMessage, setCareErrorMessage] = useState<string | null>(null);
  const [reminderType, setReminderType] = useState<"manual" | "vaccination" | "medication" | "vet_visit">("manual");
  const [reminderPetId, setReminderPetId] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderDueAt, setReminderDueAt] = useState("");
  const [reminderSuccessMessage, setReminderSuccessMessage] = useState<string | null>(null);
  const [reminderErrorMessage, setReminderErrorMessage] = useState<string | null>(null);
  const [updateText, setUpdateText] = useState("");
  const [updateAuthorRole, setUpdateAuthorRole] = useState<"owner" | "family" | "caretaker">(getUpdateAuthorRole(viewerRole));
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<string | null>(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);
  const [mediaLabel, setMediaLabel] = useState("");
  const [mediaAttached, setMediaAttached] = useState(false);
  const [mediaSuccessMessage, setMediaSuccessMessage] = useState<string | null>(null);
  const [mediaErrorMessage, setMediaErrorMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<
    "pet" | "health" | "care" | "reminders" | "updates"
  >("pet");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayMode, setOverlayMode] = useState<"actions" | "form">("form");
  const [selectedActionPetId, setSelectedActionPetId] = useState("");
  const [showReminderOptional, setShowReminderOptional] = useState(false);
  const [showUpdateOptional, setShowUpdateOptional] = useState(false);
  const reminderTitlePlaceholder =
    reminderType === "vaccination"
      ? "Rokotuksen uusinta"
      : reminderType === "medication"
        ? "Lääkkeen anto"
        : reminderType === "vet_visit"
          ? "Kontrollikäynti"
          : "Uusi muistutus";
  const reminderDescriptionPlaceholder =
    reminderType === "vaccination"
      ? "Lisää tarkennus tarvittaessa."
      : reminderType === "medication"
        ? "Lisää ohje tarvittaessa."
        : reminderType === "vet_visit"
          ? "Lisää käynnin tarkennus."
          : "Lyhyt kuvaus";
  const canManagePetsAccess = canManagePets(viewerRole);
  const canManageHealthAccess = canManageHealth(viewerRole);
  const canManageCareAccess = canManageCare(viewerRole);
  const canManageRemindersAccess = canManageReminders(viewerRole);
  const canCreateUpdatesAccess = canCreateUpdates(viewerRole);
  const reminderPetOptions = useMemo(
    () => pets.map((pet) => ({ label: pet.name, value: pet.id })),
    [pets],
  );
  const selectedActionPet = pets.find((pet) => pet.id === selectedActionPetId) ?? pets[0];
  const editingPet = pets.find((pet) => pet.id === (pendingPetEditorId ?? selectedActionPetId));
  const isEditingPetBasics = activeSection === "pet" && Boolean(editingPet);

  function handleAddPet() {
    const nameError = validateRequired("Lemmikin nimi", name);
    if (nameError) {
      setErrorMessage(nameError);
      setSuccessMessage(null);
      return;
    }

    const speciesError = validateRequired("Laji", species);
    if (speciesError) {
      setErrorMessage(speciesError);
      setSuccessMessage(null);
      return;
    }

    if (editingPet) {
      updatePet(editingPet.id, {
        name: name.trim(),
        species: species.trim(),
        breed: breed.trim() || undefined,
        photoLabel: normalizePetPhotoLabel(photoLabel) ?? undefined,
      });
      setSelectedPetId(editingPet.id);
      setFlashMessage(`${name.trim()} päivitettiin.`);
    } else {
      const petId = addPet({
        name: name.trim(),
        species: species.trim(),
        breed: breed.trim() || undefined,
        photoLabel: normalizePetPhotoLabel(photoLabel) ?? undefined,
      });

      addSystemUpdate(petId, `${name.trim()} lisättiin.`);
      setSelectedPetId(petId);
      setFlashMessage(`${name.trim()} lisättiin lemmikkeihin.`);
      setActiveTab("pets");
    }

    setName("");
    setSpecies("");
    setBreed("");
    setPhotoLabel("");
    setPhotoOriginalName("");
    setErrorMessage(null);
    setSuccessMessage("Lemmikki tallennettiin.");
    setOverlayVisible(false);
    setPendingPetEditorId(null);
  }

  async function handlePickPetPhoto() {
    const pickedPhoto = await pickPetPhoto();

    if (!pickedPhoto) {
      return;
    }

    setPhotoLabel(pickedPhoto.storedName);
    setPhotoOriginalName(pickedPhoto.originalName);
    setErrorMessage(null);
  }

  function handleAddHealthNote() {
    const targetPet = selectedActionPet;

    if (!targetPet) {
      setHealthErrorMessage("Lisää ensin lemmikki, niin voit tallentaa terveystiedon.");
      setHealthSuccessMessage(null);
      return;
    }

    const healthTitleError = validateRequired("Otsikko", healthTitle);
    const healthContentError = validateRequired("Sisältö", healthContent);
    if (healthTitleError || healthContentError) {
      setHealthErrorMessage(healthTitleError ?? healthContentError);
      setHealthSuccessMessage(null);
      return;
    }

    addHealthNote({
      petId: targetPet.id,
      type: healthType,
      title: healthTitle.trim(),
      content: healthContent.trim(),
    });

    setHealthType("other");
    setHealthTitle("");
    setHealthContent("");
    setHealthErrorMessage(null);
    setHealthSuccessMessage("Terveystieto tallennettiin.");
    setSelectedPetId(targetPet.id);
    setActiveTab("home");
    setOverlayVisible(false);
  }

  function handleAddVaccination() {
    const targetPet = selectedActionPet;

    if (!targetPet) {
      setVaccinationErrorMessage("Lisää ensin lemmikki, niin voit tallentaa rokotuksen.");
      setVaccinationSuccessMessage(null);
      return;
    }

    const vaccinationNameError = validateRequired("Rokotteen nimi", vaccinationName);
    const vaccinationDateError = validateRequired("Annettu paivana", vaccinationDate);
    if (vaccinationNameError || vaccinationDateError) {
      setVaccinationErrorMessage(vaccinationNameError ?? vaccinationDateError);
      setVaccinationSuccessMessage(null);
      return;
    }

    addVaccination({
      petId: targetPet.id,
      vaccineName: vaccinationName.trim(),
      administeredOn: vaccinationDate.trim(),
      validUntil: vaccinationValidUntil.trim() || undefined,
      clinicName: vaccinationClinic.trim() || undefined,
    });

    setVaccinationName("");
    setVaccinationDate("");
    setVaccinationValidUntil("");
    setVaccinationClinic("");
    setVaccinationErrorMessage(null);
    setVaccinationSuccessMessage("Rokotus lisattiin.");
    setSelectedPetId(targetPet.id);
    setActiveTab("home");
    setOverlayVisible(false);
  }

  function handleAddCareInstruction() {
    const targetPet = selectedActionPet;

    if (!targetPet) {
      setCareErrorMessage("Lisää ensin lemmikki, niin voit tallentaa hoito-ohjeen.");
      setCareSuccessMessage(null);
      return;
    }

    const careTitleError = validateRequired("Otsikko", careTitle);
    const careContentError = validateRequired("Sisältö", careContent);
    if (careTitleError || careContentError) {
      setCareErrorMessage(careTitleError ?? careContentError);
      setCareSuccessMessage(null);
      return;
    }

    addCareInstruction({
      petId: targetPet.id,
      type: careType,
      title: careTitle.trim(),
      content: careContent.trim(),
      isSharedWithCaretakers: true,
    });

    setCareType("general");
    setCareTitle("");
    setCareContent("");
    setCareErrorMessage(null);
    setCareSuccessMessage("Hoito-ohje tallennettiin.");
    setSelectedPetId(targetPet.id);
    setActiveTab("home");
    setOverlayVisible(false);
  }

  function handleAddMedication() {
    const targetPet = selectedActionPet;

    if (!targetPet) {
      setMedicationErrorMessage("Lisää ensin lemmikki, niin voit tallentaa lääkityksen.");
      setMedicationSuccessMessage(null);
      return;
    }

    const medicationNameError = validateRequired("Lääkkeen nimi", medicationName);
    if (medicationNameError) {
      setMedicationErrorMessage(medicationNameError);
      setMedicationSuccessMessage(null);
      return;
    }

    addMedication({
      petId: targetPet.id,
      medicationName: medicationName.trim(),
      dosage: medicationDosage.trim() || undefined,
      instructions: medicationInstructions.trim() || undefined,
      startDate: medicationStartDate.trim() || undefined,
      endDate: medicationEndDate.trim() || undefined,
      status: medicationStatus,
    });

    setMedicationName("");
    setMedicationDosage("");
    setMedicationInstructions("");
    setMedicationStartDate("");
    setMedicationEndDate("");
    setMedicationStatus("active");
    setMedicationErrorMessage(null);
    setMedicationSuccessMessage("Lääkitys lisättiin.");
    setSelectedPetId(targetPet.id);
    setActiveTab("home");
    setOverlayVisible(false);
  }

  function handleAddVetVisit() {
    const targetPet = selectedActionPet;

    if (!targetPet) {
      setVisitErrorMessage("Lisää ensin lemmikki, niin voit tallentaa käynnin.");
      setVisitSuccessMessage(null);
      return;
    }

    const visitDateError = validateRequired("Käyntipäivä", visitDate);
    const visitReasonError = validateRequired("Syy", visitReason);
    if (visitDateError || visitReasonError) {
      setVisitErrorMessage(visitDateError ?? visitReasonError);
      setVisitSuccessMessage(null);
      return;
    }

    addVetVisit({
      petId: targetPet.id,
      visitDate: visitDate.trim(),
      clinicName: visitClinic.trim() || undefined,
      veterinarianName: visitVeterinarian.trim() || undefined,
      reason: visitReason.trim(),
      summary: visitSummary.trim() || undefined,
      followUpDate: visitFollowUpDate.trim() || undefined,
    });

    setVisitDate("");
    setVisitClinic("");
    setVisitVeterinarian("");
    setVisitReason("");
    setVisitSummary("");
    setVisitFollowUpDate("");
    setVisitErrorMessage(null);
    setVisitSuccessMessage("Käynti lisättiin.");
    setSelectedPetId(targetPet.id);
    setActiveTab("home");
    setOverlayVisible(false);
  }

  function handleAddInsuranceRecord() {
    const targetPet = selectedActionPet;

    if (!targetPet) {
      setInsuranceErrorMessage("Lisää ensin lemmikki, niin voit tallentaa vakuutustiedon.");
      setInsuranceSuccessMessage(null);
      return;
    }

    const providerError = validateRequired("Vakuutusyhtio", insuranceProviderName);
    if (providerError) {
      setInsuranceErrorMessage(providerError);
      setInsuranceSuccessMessage(null);
      return;
    }

    addInsuranceRecord({
      petId: targetPet.id,
      providerName: insuranceProviderName.trim(),
      policyNumber: insurancePolicyNumber.trim() || undefined,
      coverageType: insuranceCoverageType,
      deductibleLabel: insuranceDeductibleLabel.trim() || undefined,
      validFrom: insuranceValidFrom.trim() || undefined,
      validUntil: insuranceValidUntil.trim() || undefined,
      contactPhone: insuranceContactPhone.trim() || undefined,
      notes: insuranceNotes.trim() || undefined,
    });

    setInsuranceProviderName("");
    setInsurancePolicyNumber("");
    setInsuranceCoverageType("health");
    setInsuranceDeductibleLabel("");
    setInsuranceValidFrom("");
    setInsuranceValidUntil("");
    setInsuranceContactPhone("");
    setInsuranceNotes("");
    setInsuranceErrorMessage(null);
    setInsuranceSuccessMessage("Vakuutustieto tallennettiin.");
    setSelectedPetId(targetPet.id);
    setActiveTab("home");
    setOverlayVisible(false);
  }

  function handleAddReminder() {
    const targetPet = pets.find((pet) => pet.id === reminderPetId) ?? selectedActionPet;

    if (!targetPet) {
      setReminderErrorMessage("Lisää ensin lemmikki, niin voit luoda muistutuksen.");
      setReminderSuccessMessage(null);
      return;
    }

    const reminderTitleError = validateRequired("Otsikko", reminderTitle);
    const reminderDueError = validateRequired("Ajankohta", reminderDueAt);
    if (reminderTitleError || reminderDueError) {
      setReminderErrorMessage(reminderTitleError ?? reminderDueError);
      setReminderSuccessMessage(null);
      return;
    }

    addReminder({
      petId: targetPet.id,
      title: reminderTitle.trim(),
      description: reminderDescription.trim() || undefined,
      dueAt: new Date(`${reminderDueAt}T09:00:00`).toISOString(),
      type: reminderType,
    });
    addSystemUpdate(targetPet.id, `${reminderTitle.trim()} lisättiin muistutuksiin.`);

    setReminderType("manual");
    setReminderPetId("");
    setReminderTitle("");
    setReminderDescription("");
    setReminderDueAt("");
    setReminderErrorMessage(null);
    setReminderSuccessMessage("Muistutus tallennettiin.");
    setSelectedPetId(targetPet.id);
    setFlashMessage(`${reminderTitle.trim()} lisättiin muistutuksiin.`);
    setActiveTab("reminders");
    setOverlayVisible(false);
    setShowReminderOptional(false);
  }

  function handleAddUpdate() {
    const targetPet = selectedActionPet;

    if (!targetPet) {
      setUpdateErrorMessage("Lisää ensin lemmikki, niin voit lisätä päivityksen.");
      setUpdateSuccessMessage(null);
      return;
    }

    const updateTextError = validateRequired("Päivitys", updateText);
    if (updateTextError) {
      setUpdateErrorMessage(updateTextError);
      setUpdateSuccessMessage(null);
      return;
    }

    addUpdate({
      petId: targetPet.id,
      authorName: sessionUser?.displayName ?? "Sinä",
      authorRole: updateAuthorRole,
      text: updateText.trim(),
      mediaCount: mediaAttached ? 1 : undefined,
      mediaPreviewLabel: mediaAttached ? mediaLabel.trim() || "kuva" : undefined,
    });

    if (mediaAttached) {
      addMediaItem({
        petId: targetPet.id,
        authorName: sessionUser?.displayName ?? "Sinä",
        sourceLabel: mediaLabel.trim() || "kuva",
      });
    }

    setUpdateText("");
    setMediaAttached(false);
    setMediaLabel("");
    setUpdateErrorMessage(null);
    setUpdateSuccessMessage("Päivitys lisättiin.");
    setSelectedPetId(targetPet.id);
    setActiveTab("home");
    setOverlayVisible(false);
    setShowUpdateOptional(false);
  }

  function handleMockPickMedia() {
    if (!pets.length) {
      setMediaErrorMessage("Lisää ensin lemmikki, niin voit liittää kuvan.");
      setMediaSuccessMessage(null);
      return;
    }

    setMediaAttached(true);
    setMediaErrorMessage(null);
    setMediaSuccessMessage("Päivitykseen liitetään kuva.");
  }

  function openSection(section: "pet" | "health" | "care" | "reminders" | "updates", petId?: string) {
    setActiveSection(section);
    setOverlayMode("form");
    if (petId) {
      setSelectedActionPetId(petId);
      if (section === "pet") {
        setPendingPetEditorId(petId);
      }
      if (section === "reminders") {
        setReminderPetId(petId);
      }
    } else if (section === "pet") {
      setPendingPetEditorId(null);
    }
    setOverlayVisible(true);
  }

  function openPetActions(petId: string) {
    setSelectedActionPetId(petId);
    setReminderPetId(petId);
    setOverlayMode("actions");
    setOverlayVisible(true);
  }

  useEffect(() => {
    if (!pendingAddSection) {
      return;
    }

    setActiveSection(pendingAddSection);
    setOverlayMode("form");
    if (pendingAddSection === "pet") {
      setPendingPetEditorId(null);
    }
    setOverlayVisible(true);
    setPendingAddSection(null);
  }, [pendingAddSection, setPendingAddSection, setPendingPetEditorId]);

  useEffect(() => {
    if (!overlayVisible || activeSection !== "pet") {
      return;
    }

    if (editingPet) {
      setName(editingPet.name);
      setSpecies(editingPet.species);
      setBreed(editingPet.breed ?? "");
      setPhotoLabel(editingPet.photoLabel ?? "");
      setPhotoOriginalName(editingPet.photoLabel ?? "");
    } else {
      setName("");
      setSpecies("");
      setBreed("");
      setPhotoLabel("");
      setPhotoOriginalName("");
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [activeSection, editingPet, overlayVisible]);

  const overlay = (
    <Modal
        visible={overlayVisible}
        animationType="none"
        transparent
        onRequestClose={() => setOverlayVisible(false)}
      >
        <View style={styles.overlayBackdrop}>
          <Pressable style={styles.overlayDismissArea} onPress={() => setOverlayVisible(false)} />
          <View style={styles.overlaySheet}>
            <View style={styles.overlayHeader}>
              <View>
                <Text style={styles.overlayEyebrow}>Lisää</Text>
                <Text style={styles.overlayTitle}>
                  {overlayMode === "actions" && selectedActionPet
                    ? selectedActionPet.name
                    : activeSection === "pet"
                    ? "Lemmikki"
                    : activeSection === "health"
                      ? "Terveystieto"
                      : activeSection === "care"
                        ? "Hoito-ohje"
                        : activeSection === "reminders"
                          ? "Muistutus"
                          : "Merkintä"}
                </Text>
              </View>
              <Pressable onPress={() => setOverlayVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonLabel}>Sulje</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.overlayContent} showsVerticalScrollIndicator={false}>
      {overlayMode === "actions" && selectedActionPet ? (
        <AddActionMenuCard
          onEditPet={() => openSection("pet", selectedActionPet.id)}
          onAddCare={() => openSection("care", selectedActionPet.id)}
          onAddReminder={() => openSection("reminders", selectedActionPet.id)}
          onAddUpdate={() => openSection("updates", selectedActionPet.id)}
        />
      ) : null}

      {activeSection === "pet" ? (
      <AddSectionCard
        title={isEditingPetBasics ? "Perustiedot" : "Lisää lemmikki"}
        allowed={canManagePetsAccess}
        deniedMessage="Lemmikin lisääminen kuuluu omistajalle."
      >
          <TextField label="Nimi" value={name} onChangeText={setName} placeholder="Lemmikin nimi" />
          <TextField label="Laji" value={species} onChangeText={setSpecies} placeholder="Koira, kissa..." />
          <TextField label="Rotu" value={breed} onChangeText={setBreed} placeholder="Rotu" />
          <AppButton label={photoLabel ? "Vaihda kuva" : "Valitse kuva"} onPress={() => void handlePickPetPhoto()} secondary />
          <InlineMessage tone="info" message={`Profiilikuva tallennetaan automaattisesti neliönä ${getPetPhotoPresetLabel()}.`} />
          {photoLabel.trim() ? (
            <View style={styles.photoSelectionCard}>
              <MockMediaPreview label={photoOriginalName || photoLabel.trim()} compact />
              <Text style={styles.photoSelectionMeta}>Tallennetaan nimellä {photoLabel.trim()}</Text>
            </View>
          ) : null}
          {errorMessage ? <InlineMessage tone="warning" message={errorMessage} /> : null}
          {successMessage ? <InlineMessage tone="info" message={successMessage} /> : null}

          <AppButton label={isEditingPetBasics ? "Tallenna perustiedot" : "Luo lemmikki"} onPress={handleAddPet} />
      </AddSectionCard>
      ) : null}

      {overlayMode === "form" && activeSection === "health" ? (
        <AddHealthSections
          allowed={canManageHealthAccess}
          vaccinationName={vaccinationName}
          setVaccinationName={setVaccinationName}
          vaccinationDate={vaccinationDate}
          setVaccinationDate={setVaccinationDate}
          vaccinationValidUntil={vaccinationValidUntil}
          setVaccinationValidUntil={setVaccinationValidUntil}
          vaccinationClinic={vaccinationClinic}
          setVaccinationClinic={setVaccinationClinic}
          vaccinationErrorMessage={vaccinationErrorMessage}
          vaccinationSuccessMessage={vaccinationSuccessMessage}
          onAddVaccination={handleAddVaccination}
          medicationName={medicationName}
          setMedicationName={setMedicationName}
          medicationDosage={medicationDosage}
          setMedicationDosage={setMedicationDosage}
          medicationInstructions={medicationInstructions}
          setMedicationInstructions={setMedicationInstructions}
          medicationStartDate={medicationStartDate}
          setMedicationStartDate={setMedicationStartDate}
          medicationEndDate={medicationEndDate}
          setMedicationEndDate={setMedicationEndDate}
          medicationStatus={medicationStatus}
          setMedicationStatus={setMedicationStatus}
          medicationErrorMessage={medicationErrorMessage}
          medicationSuccessMessage={medicationSuccessMessage}
          onAddMedication={handleAddMedication}
          visitDate={visitDate}
          setVisitDate={setVisitDate}
          visitClinic={visitClinic}
          setVisitClinic={setVisitClinic}
          visitVeterinarian={visitVeterinarian}
          setVisitVeterinarian={setVisitVeterinarian}
          visitReason={visitReason}
          setVisitReason={setVisitReason}
          visitSummary={visitSummary}
          setVisitSummary={setVisitSummary}
          visitFollowUpDate={visitFollowUpDate}
          setVisitFollowUpDate={setVisitFollowUpDate}
          visitErrorMessage={visitErrorMessage}
          visitSuccessMessage={visitSuccessMessage}
          onAddVetVisit={handleAddVetVisit}
          insuranceProviderName={insuranceProviderName}
          setInsuranceProviderName={setInsuranceProviderName}
          insurancePolicyNumber={insurancePolicyNumber}
          setInsurancePolicyNumber={setInsurancePolicyNumber}
          insuranceCoverageType={insuranceCoverageType}
          setInsuranceCoverageType={setInsuranceCoverageType}
          insuranceDeductibleLabel={insuranceDeductibleLabel}
          setInsuranceDeductibleLabel={setInsuranceDeductibleLabel}
          insuranceValidFrom={insuranceValidFrom}
          setInsuranceValidFrom={setInsuranceValidFrom}
          insuranceValidUntil={insuranceValidUntil}
          setInsuranceValidUntil={setInsuranceValidUntil}
          insuranceContactPhone={insuranceContactPhone}
          setInsuranceContactPhone={setInsuranceContactPhone}
          insuranceNotes={insuranceNotes}
          setInsuranceNotes={setInsuranceNotes}
          insuranceErrorMessage={insuranceErrorMessage}
          insuranceSuccessMessage={insuranceSuccessMessage}
          onAddInsuranceRecord={handleAddInsuranceRecord}
          healthType={healthType}
          setHealthType={setHealthType}
          healthTitle={healthTitle}
          setHealthTitle={setHealthTitle}
          healthContent={healthContent}
          setHealthContent={setHealthContent}
          healthErrorMessage={healthErrorMessage}
          healthSuccessMessage={healthSuccessMessage}
          onAddHealthNote={handleAddHealthNote}
        />
      ) : null}

      {overlayMode === "form" && activeSection === "care" ? (
      <AddSectionCard
        title="Lisää hoito-ohje"
        allowed={canManageCareAccess}
        deniedMessage="Hoito-ohjeiden hallinta kuuluu omistajalle ja perheelle."
      >
          <PickerField
            label="Ohjeen tyyppi"
            value={careType}
            onChange={(value) => setCareType(value as "feeding" | "commands" | "routine" | "warning" | "general")}
            options={[
              { label: "Yleinen", value: "general" },
              { label: "Ruokinta", value: "feeding" },
              { label: "Komennot", value: "commands" },
              { label: "Rutiini", value: "routine" },
              { label: "Varoitus", value: "warning" },
            ]}
          />
          <TextField label="Otsikko" value={careTitle} onChangeText={setCareTitle} placeholder="Otsikoi ohje" />
          <TextField
            label="Sisältö"
            value={careContent}
            onChangeText={setCareContent}
            placeholder="Kirjoita ohje"
          />
          {careErrorMessage ? <InlineMessage tone="warning" message={careErrorMessage} /> : null}
          {careSuccessMessage ? <InlineMessage tone="info" message={careSuccessMessage} /> : null}
          <AppButton label="Tallenna hoito-ohje" onPress={handleAddCareInstruction} secondary />
      </AddSectionCard>
      ) : null}

      {overlayMode === "form" && activeSection === "reminders" ? (
        <AddReminderSection
          allowed={canManageRemindersAccess}
          petsCount={pets.length}
          reminderPetId={reminderPetId || pets[0]?.id || ""}
          setReminderPetId={setReminderPetId}
          reminderPetOptions={reminderPetOptions}
          reminderType={reminderType}
          setReminderType={setReminderType}
          reminderTitle={reminderTitle}
          setReminderTitle={setReminderTitle}
          reminderTitlePlaceholder={reminderTitlePlaceholder}
          reminderDueAt={reminderDueAt}
          setReminderDueAt={setReminderDueAt}
          showReminderOptional={showReminderOptional}
          setShowReminderOptional={setShowReminderOptional}
          reminderDescription={reminderDescription}
          setReminderDescription={setReminderDescription}
          reminderDescriptionPlaceholder={reminderDescriptionPlaceholder}
          reminderErrorMessage={reminderErrorMessage}
          reminderSuccessMessage={reminderSuccessMessage}
          onAddReminder={handleAddReminder}
        />
      ) : null}

      {overlayMode === "form" && activeSection === "updates" ? (
        <AddUpdateSection
          allowed={canCreateUpdatesAccess}
          updateText={updateText}
          setUpdateText={setUpdateText}
          showUpdateOptional={showUpdateOptional}
          setShowUpdateOptional={setShowUpdateOptional}
          mediaLabel={mediaLabel}
          setMediaLabel={setMediaLabel}
          updateAuthorRole={updateAuthorRole}
          setUpdateAuthorRole={setUpdateAuthorRole}
          mediaAttached={mediaAttached}
          onPickMedia={handleMockPickMedia}
          mediaErrorMessage={mediaErrorMessage}
          mediaSuccessMessage={mediaSuccessMessage}
          updateErrorMessage={updateErrorMessage}
          updateSuccessMessage={updateSuccessMessage}
          onAddUpdate={handleAddUpdate}
        />
      ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
  );

  if (embedded) {
    return overlay;
  }

  return (
    <Screen scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Lisää</Text>
          <Text style={styles.heroTitle}>Valitse lemmikki tai lisää uusi</Text>
        </View>

        <Card style={styles.contentCard}>
          <Text style={styles.formTitle}>Lemmikit</Text>
          <View style={styles.petGrid}>
            {pets.map((pet) => (
              <Pressable key={pet.id} style={styles.petTile} onPress={() => openPetActions(pet.id)}>
                <View style={[styles.petAvatar, { backgroundColor: pet.avatarColor }]}>
                  <Text style={styles.petAvatarText}>{pet.name.slice(0, 1)}</Text>
                </View>
                <Text style={styles.petTileName}>{pet.name}</Text>
                <Text style={styles.petTileMeta}>{pet.breed ?? pet.species}</Text>
              </Pressable>
            ))}
            <Pressable style={[styles.petTile, styles.addPetTile]} onPress={() => openSection("pet")}>
              <View style={styles.addPetIcon}>
                <Text style={styles.addPetIconText}>+</Text>
              </View>
              <Text style={styles.petTileName}>Lisää lemmikki</Text>
            </Pressable>
          </View>
        </Card>

        {overlay}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[5],
    paddingBottom: spacing[8],
  },
  heroCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 28,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[4],
  },
  heroEyebrow: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.6,
  },
  contentCard: {
    backgroundColor: colors.surfaceRaised,
  },
  petGrid: {
    marginTop: spacing[4],
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  petTile: {
    width: "48%",
    minHeight: 144,
    borderRadius: 22,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
    justifyContent: "space-between",
    gap: spacing[3],
  },
  addPetTile: {
    alignItems: "flex-start",
  },
  petAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  petAvatarText: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  petTileName: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    letterSpacing: -0.2,
  },
  petTileMeta: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  addPetIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brandPrimarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  addPetIconText: {
    color: colors.brandPrimaryHover,
    fontSize: 26,
    fontWeight: typography.weight.semibold,
    lineHeight: 28,
  },
  actionTile: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
    borderRadius: 20,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  actionTileDisabled: {
    opacity: 0.45,
  },
  actionTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    letterSpacing: -0.3,
  },
  actionBody: {
    marginTop: spacing[1],
    color: colors.textSecondary,
    lineHeight: 21,
  },
  formTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    letterSpacing: -0.35,
  },
  form: {
    marginTop: spacing[4],
    gap: spacing[4],
  },
  inlineToggle: {
    alignSelf: "flex-start",
    paddingVertical: spacing[1],
  },
  inlineToggleLabel: {
    color: colors.brandPrimaryHover,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  photoSelectionCard: {
    gap: spacing[2],
  },
  photoSelectionMeta: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  overlayBackdrop: {
    flex: 1,
    backgroundColor: colors.overlayScrimSoft,
    justifyContent: "flex-end",
  },
  overlayDismissArea: {
    flex: 1,
  },
  overlaySheet: {
    maxHeight: "90%",
    backgroundColor: colors.surfaceMuted,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[8],
    gap: spacing[4],
  },
  overlayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing[4],
  },
  overlayEyebrow: {
    color: colors.textTertiary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  overlayTitle: {
    marginTop: spacing[1],
    color: colors.textPrimary,
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    letterSpacing: -0.5,
  },
  closeButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 16,
    backgroundColor: colors.bgBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  closeButtonLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  overlayContent: {
    gap: spacing[4],
    paddingBottom: spacing[4],
  },
  stepCard: {
    gap: spacing[4],
    padding: spacing[5],
    borderRadius: 20,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  stepTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  previewCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 20,
    padding: spacing[5],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[3],
  },
  previewTitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  previewName: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
  },
  previewMeta: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
