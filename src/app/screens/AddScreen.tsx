import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton, Card, DatePickerField, InlineMessage, MockMediaPreview, PickerField, Screen, SegmentedControl, TextField } from "../../components/ui";
import { getPetPhotoPresetLabel, normalizePetPhotoLabel, pickPetPhoto } from "../../lib/petPhoto";
import { validateRequired } from "../../lib/validation";
import { useAppStore } from "../../state/appStore";
import { useCareStore } from "../../state/careStore";
import { useHealthStore } from "../../state/healthStore";
import { useMediaStore } from "../../state/mediaStore";
import { usePetStore } from "../../state/petStore";
import { useReminderStore } from "../../state/reminderStore";
import { useUpdateStore } from "../../state/updateStore";
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
  const [updateAuthorRole, setUpdateAuthorRole] = useState<"owner" | "family" | "caretaker">(
    viewerRole === "family" ? "family" : viewerRole === "caretaker" ? "caretaker" : "owner",
  );
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
  const canManagePets = viewerRole === "owner";
  const canManageHealth = viewerRole === "owner" || viewerRole === "family";
  const canManageCare = viewerRole === "owner" || viewerRole === "family";
  const canManageReminders = viewerRole === "owner" || viewerRole === "family";
  const canCreateUpdates = viewerRole !== "breeder";
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
      authorName: updateAuthorRole === "caretaker" ? "Emma" : updateAuthorRole === "family" ? "Sanna" : "Roni",
      authorRole: updateAuthorRole,
      text: updateText.trim(),
      mediaCount: mediaAttached ? 1 : undefined,
      mediaPreviewLabel: mediaAttached ? mediaLabel.trim() || "kuva" : undefined,
    });

    if (mediaAttached) {
      addMediaItem({
        petId: targetPet.id,
        authorName: updateAuthorRole === "caretaker" ? "Emma" : updateAuthorRole === "family" ? "Sanna" : "Roni",
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
        animationType="slide"
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
      <Card>
        <Text style={styles.formTitle}>Toiminnot</Text>
        <View style={styles.form}>
          <Pressable style={styles.actionTile} onPress={() => openSection("pet", selectedActionPet.id)}>
            <Text style={styles.actionTitle}>Muokkaa perustietoja</Text>
          </Pressable>
          <Pressable style={styles.actionTile} onPress={() => openSection("care", selectedActionPet.id)}>
            <Text style={styles.actionTitle}>Lisää hoito-ohje</Text>
          </Pressable>
          <Pressable style={styles.actionTile} onPress={() => openSection("reminders", selectedActionPet.id)}>
            <Text style={styles.actionTitle}>Lisää muistutus</Text>
          </Pressable>
          <Pressable style={styles.actionTile} onPress={() => openSection("updates", selectedActionPet.id)}>
            <Text style={styles.actionTitle}>Lisää merkintä</Text>
          </Pressable>
        </View>
      </Card>
      ) : null}

      {activeSection === "pet" ? (
      <Card>
        <Text style={styles.formTitle}>{isEditingPetBasics ? "Perustiedot" : "Lisää lemmikki"}</Text>

        {canManagePets ? <View style={styles.form}>
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
        </View> : <View style={styles.form}><InlineMessage tone="warning" message="Lemmikin lisääminen kuuluu omistajalle." /></View>}
      </Card>
      ) : null}

      {overlayMode === "form" && activeSection === "health" ? (
      <>
      <Card>
        <Text style={styles.formTitle}>Lisää rokotus</Text>

        {canManageHealth ? <View style={styles.form}>
          <TextField label="Rokotteen nimi" value={vaccinationName} onChangeText={setVaccinationName} placeholder="Esim. rabies" />
          <DatePickerField label="Annettu päivänä" value={vaccinationDate} onChange={setVaccinationDate} yearStart={2010} />
          <DatePickerField label="Voimassa asti" value={vaccinationValidUntil} onChange={setVaccinationValidUntil} yearStart={2010} />
          <TextField label="Klinikka" value={vaccinationClinic} onChangeText={setVaccinationClinic} placeholder="Klinikan nimi" />
          {vaccinationErrorMessage ? <InlineMessage tone="warning" message={vaccinationErrorMessage} /> : null}
          {vaccinationSuccessMessage ? <InlineMessage tone="info" message={vaccinationSuccessMessage} /> : null}
          <AppButton label="Tallenna rokotus" onPress={handleAddVaccination} secondary />
        </View> : <View style={styles.form}><InlineMessage tone="warning" message="Rokotusten hallinta kuuluu omistajalle ja perheelle." /></View>}
      </Card>

      <Card>
        <Text style={styles.formTitle}>Lisää lääkitys</Text>

        {canManageHealth ? <View style={styles.form}>
          <TextField label="Lääkkeen nimi" value={medicationName} onChangeText={setMedicationName} placeholder="Lääkkeen nimi" />
          <TextField label="Annostus" value={medicationDosage} onChangeText={setMedicationDosage} placeholder="Esim. 1 tabletti" />
          <TextField
            label="Ohje"
            value={medicationInstructions}
            onChangeText={setMedicationInstructions}
            placeholder="Kirjoita ohje"
          />
          <DatePickerField label="Aloituspäivä" value={medicationStartDate} onChange={setMedicationStartDate} yearStart={2020} />
          <DatePickerField label="Päättymispäivä" value={medicationEndDate} onChange={setMedicationEndDate} yearStart={2020} />
          <PickerField
            label="Tila"
            value={medicationStatus}
            onChange={(value) => setMedicationStatus(value as "active" | "completed" | "paused")}
            options={[
              { label: "Aktiivinen", value: "active" },
              { label: "Tauolla", value: "paused" },
              { label: "Valmis", value: "completed" },
            ]}
          />
          {medicationErrorMessage ? <InlineMessage tone="warning" message={medicationErrorMessage} /> : null}
          {medicationSuccessMessage ? <InlineMessage tone="info" message={medicationSuccessMessage} /> : null}
          <AppButton label="Tallenna lääkitys" onPress={handleAddMedication} secondary />
        </View> : <View style={styles.form}><InlineMessage tone="warning" message="Lääkitysten hallinta kuuluu omistajalle ja perheelle." /></View>}
      </Card>

      <Card>
        <Text style={styles.formTitle}>Lisää eläinlääkärikäynti</Text>

        {canManageHealth ? <View style={styles.form}>
          <DatePickerField label="Käyntipäivä" value={visitDate} onChange={setVisitDate} yearStart={2020} />
          <TextField label="Klinikka" value={visitClinic} onChangeText={setVisitClinic} placeholder="Klinikan nimi" />
          <TextField label="Eläinlääkäri" value={visitVeterinarian} onChangeText={setVisitVeterinarian} placeholder="Eläinlääkärin nimi" />
          <TextField label="Syy" value={visitReason} onChangeText={setVisitReason} placeholder="Miksi käynti tehtiin" />
          <TextField label="Yhteenveto" value={visitSummary} onChangeText={setVisitSummary} placeholder="Lyhyt yhteenveto käynnistä" />
          <DatePickerField label="Jatkokäynnin päivä" value={visitFollowUpDate} onChange={setVisitFollowUpDate} yearStart={2020} />
          {visitErrorMessage ? <InlineMessage tone="warning" message={visitErrorMessage} /> : null}
          {visitSuccessMessage ? <InlineMessage tone="info" message={visitSuccessMessage} /> : null}
          <AppButton label="Tallenna käynti" onPress={handleAddVetVisit} secondary />
        </View> : <View style={styles.form}><InlineMessage tone="warning" message="Käyntien hallinta kuuluu omistajalle ja perheelle." /></View>}
      </Card>

      <Card>
        <Text style={styles.formTitle}>Lisää vakuutustieto</Text>

        {canManageHealth ? <View style={styles.form}>
          <TextField label="Vakuutusyhtiö" value={insuranceProviderName} onChangeText={setInsuranceProviderName} placeholder="Yhtiön nimi" />
          <TextField label="Poliisinumero" value={insurancePolicyNumber} onChangeText={setInsurancePolicyNumber} placeholder="Vakuutusnumero" />
          <PickerField
            label="Vakuutustyyppi"
            value={insuranceCoverageType}
            onChange={(value) => setInsuranceCoverageType(value as "health" | "life" | "health_and_life" | "other")}
            options={[
              { label: "Sairaus", value: "health" },
              { label: "Henki", value: "life" },
              { label: "Molemmat", value: "health_and_life" },
              { label: "Muu", value: "other" },
            ]}
          />
          <TextField label="Omavastuu" value={insuranceDeductibleLabel} onChangeText={setInsuranceDeductibleLabel} placeholder="Esim. 100 €" />
          <DatePickerField label="Voimassa alkaen" value={insuranceValidFrom} onChange={setInsuranceValidFrom} yearStart={2020} />
          <DatePickerField label="Voimassa asti" value={insuranceValidUntil} onChange={setInsuranceValidUntil} yearStart={2020} />
          <TextField label="Yhteysnumero" value={insuranceContactPhone} onChangeText={setInsuranceContactPhone} placeholder="Puhelinnumero" />
          <TextField label="Muistiinpanot" value={insuranceNotes} onChangeText={setInsuranceNotes} placeholder="Lisätiedot" />
          {insuranceErrorMessage ? <InlineMessage tone="warning" message={insuranceErrorMessage} /> : null}
          {insuranceSuccessMessage ? <InlineMessage tone="info" message={insuranceSuccessMessage} /> : null}
          <AppButton label="Tallenna vakuutustieto" onPress={handleAddInsuranceRecord} secondary />
        </View> : <View style={styles.form}><InlineMessage tone="warning" message="Vakuutustietojen hallinta kuuluu omistajalle ja perheelle." /></View>}
      </Card>

      <Card>
        <Text style={styles.formTitle}>Lisää terveystieto</Text>

        {canManageHealth ? <View style={styles.form}>
          <PickerField
            label="Terveystiedon tyyppi"
            value={healthType}
            onChange={(value) => setHealthType(value as "allergy" | "chronic_condition" | "diet_note" | "behaviour_note" | "other")}
            options={[
              { label: "Muu", value: "other" },
              { label: "Krooninen", value: "chronic_condition" },
              { label: "Allergia", value: "allergy" },
              { label: "Ruokahuomio", value: "diet_note" },
            ]}
          />
          <TextField label="Otsikko" value={healthTitle} onChangeText={setHealthTitle} placeholder="Otsikoi merkintä" />
          <TextField
            label="Sisältö"
            value={healthContent}
            onChangeText={setHealthContent}
            placeholder="Kirjoita lisätiedot"
          />
          {healthErrorMessage ? <InlineMessage tone="warning" message={healthErrorMessage} /> : null}
          {healthSuccessMessage ? <InlineMessage tone="info" message={healthSuccessMessage} /> : null}
          <AppButton label="Tallenna terveystieto" onPress={handleAddHealthNote} secondary />
        </View> : <View style={styles.form}><InlineMessage tone="warning" message="Terveystietojen hallinta kuuluu omistajalle ja perheelle." /></View>}
      </Card>
      </>
      ) : null}

      {overlayMode === "form" && activeSection === "care" ? (
      <Card>
        <Text style={styles.formTitle}>Lisää hoito-ohje</Text>

        {canManageCare ? <View style={styles.form}>
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
        </View> : <View style={styles.form}><InlineMessage tone="warning" message="Hoito-ohjeiden hallinta kuuluu omistajalle ja perheelle." /></View>}
      </Card>
      ) : null}

      {overlayMode === "form" && activeSection === "reminders" ? (
      <Card>
        <Text style={styles.formTitle}>Luo muistutus</Text>

        {canManageReminders ? <View style={styles.form}>
          {pets.length > 1 ? (
            <PickerField
              label="Lemmikki"
              value={reminderPetId || pets[0]?.id || ""}
              onChange={setReminderPetId}
              options={reminderPetOptions}
            />
          ) : null}
          <PickerField
            label="Muistutuksen tyyppi"
            value={reminderType}
            onChange={(value) => setReminderType(value as "manual" | "vaccination" | "medication" | "vet_visit")}
            options={[
              { label: "Yleinen", value: "manual" },
              { label: "Rokotus", value: "vaccination" },
              { label: "Lääkitys", value: "medication" },
              { label: "Käynti", value: "vet_visit" },
            ]}
          />
          <TextField label="Otsikko" value={reminderTitle} onChangeText={setReminderTitle} placeholder={reminderTitlePlaceholder} />
          <DatePickerField label="Ajankohta" value={reminderDueAt} onChange={setReminderDueAt} yearStart={2024} />
          <Pressable onPress={() => setShowReminderOptional((value) => !value)} style={styles.inlineToggle}>
            <Text style={styles.inlineToggleLabel}>{showReminderOptional ? "Piilota lisätiedot" : "Lisää tarkennus"}</Text>
          </Pressable>
          {showReminderOptional ? (
            <TextField
              label="Kuvaus"
              value={reminderDescription}
              onChangeText={setReminderDescription}
              placeholder={reminderDescriptionPlaceholder}
            />
          ) : null}
          {reminderErrorMessage ? <InlineMessage tone="warning" message={reminderErrorMessage} /> : null}
          {reminderSuccessMessage ? <InlineMessage tone="info" message={reminderSuccessMessage} /> : null}
          <AppButton label="Tallenna muistutus" onPress={handleAddReminder} />
        </View> : <View style={styles.form}><InlineMessage tone="warning" message="Muistutusten luonti kuuluu omistajalle ja perheelle." /></View>}
      </Card>
      ) : null}

      {overlayMode === "form" && activeSection === "updates" ? (
      <Card>
        <Text style={styles.formTitle}>Lisää merkintä</Text>

        {canCreateUpdates ? <View style={styles.form}>
          <TextField
            label="Päivitys"
            value={updateText}
            onChangeText={setUpdateText}
            placeholder="Kirjoita päivitys"
          />
          <Pressable onPress={() => setShowUpdateOptional((value) => !value)} style={styles.inlineToggle}>
            <Text style={styles.inlineToggleLabel}>{showUpdateOptional ? "Piilota lisätiedot" : "Lisää kuva tai tarkennus"}</Text>
          </Pressable>
          {showUpdateOptional ? (
            <>
              <TextField
                label="Kuvan tiedostonimi"
                value={mediaLabel}
                onChangeText={setMediaLabel}
                placeholder="Esim. ulkoiluhetki"
              />
              <PickerField
                label="Kirjoittaja"
                value={updateAuthorRole}
                onChange={(value) => setUpdateAuthorRole(value as "owner" | "family" | "caretaker")}
                options={[
                  { label: "Omistaja", value: "owner" },
                  { label: "Perhe", value: "family" },
                  { label: "Hoitaja", value: "caretaker" },
                ]}
              />
              <AppButton label={mediaAttached ? "Kuva valittu" : "Valitse kuva"} onPress={handleMockPickMedia} secondary />
            </>
          ) : null}
          {mediaErrorMessage ? <InlineMessage tone="warning" message={mediaErrorMessage} /> : null}
          {mediaSuccessMessage ? <InlineMessage tone="info" message={mediaSuccessMessage} /> : null}
          {updateErrorMessage ? <InlineMessage tone="warning" message={updateErrorMessage} /> : null}
          {updateSuccessMessage ? <InlineMessage tone="info" message={updateSuccessMessage} /> : null}
          <AppButton label="Tallenna päivitys" onPress={handleAddUpdate} secondary />
        </View> : <View style={styles.form}><InlineMessage tone="warning" message="Kasvattaja ei voi lisätä merkintöjä tästä näkymästä." /></View>}
      </Card>
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
          <Text style={styles.heroTitle}>Valitse lemmikki</Text>
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "rgba(20, 28, 38, 0.28)",
    justifyContent: "flex-end",
  },
  overlayDismissArea: {
    flex: 1,
  },
  overlaySheet: {
    maxHeight: "90%",
    backgroundColor: "#F3F4F6",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  stepTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
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
