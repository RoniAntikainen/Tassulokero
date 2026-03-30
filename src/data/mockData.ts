import {
  HealthNoteRecord,
  InsuranceRecord,
  MedicationRecord,
  Pet,
  PetAccess,
  PetUpdate,
  Reminder,
  CareInstructionRecord,
  VaccinationRecord,
  VetVisitRecord,
} from "../types/domain";

export const currentUser = {
  id: "user-1",
  displayName: "Roni",
  email: "roni@example.com",
};

export const pets: Pet[] = [
  {
    id: "pet-1",
    name: "Luna",
    species: "Dog",
    breed: "Border Collie",
    photoLabel: "luna-kevatlenkki.jpg",
    photoPreset: "square_400",
    birthDate: "2023-11-12",
    isBirthDateEstimated: false,
    sex: "Female",
    ageLabel: "2 v 4 kk",
    weightKg: 17.8,
    colorMarkings: "Black and white",
    chipId: "985141000123456",
    isNeutered: false,
    avatarColor: "#CFEDEA",
    nextImportantThing: "Rokote vanhenee 5.4.",
    notes: "Herkkä vatsalle, tykkää rauhallisista lähdöistä.",
    breederName: "Northern Tails",
    breederLinkStatus: "approved",
  },
  {
    id: "pet-2",
    name: "Milo",
    species: "Dog",
    breed: "Finnish Lapphund",
    photoLabel: "milo-sohvalla.jpg",
    photoPreset: "square_400",
    birthDate: "2021-03-01",
    isBirthDateEstimated: true,
    sex: "Male",
    ageLabel: "5 v",
    weightKg: 21.4,
    colorMarkings: "Brown",
    chipId: "985141000789111",
    isNeutered: true,
    avatarColor: "#FBE3BF",
    nextImportantThing: "Matolääke maanantaina",
    breederName: "Northern Tails",
    breederLinkStatus: "pending",
  },
];

export const reminders: Reminder[] = [
  {
    id: "rem-1",
    petId: "pet-1",
    title: "Rokotteen tehoste",
    description: "Varaa aika eläinlääkärille ensi viikolle.",
    dueAt: "2026-04-05T10:00:00.000Z",
    status: "pending",
    type: "vaccination",
    assigneeLabel: "Kaikki perhekäyttäjät",
  },
  {
    id: "rem-2",
    petId: "pet-2",
    title: "Anna matolääke",
    description: "Tabletti aamuruuan yhteydessä.",
    dueAt: "2026-03-29T08:00:00.000Z",
    status: "pending",
    type: "medication",
    assigneeLabel: "Roni",
  },
  {
    id: "rem-3",
    petId: "pet-1",
    title: "Kontrollikäynti",
    description: "Tarkistetaan tassun paraneminen.",
    dueAt: "2026-03-20T09:00:00.000Z",
    status: "pending",
    type: "vet_visit",
    assigneeLabel: "Roni",
  },
  {
    id: "rem-4",
    petId: "pet-2",
    title: "Osta uusi ruoka",
    dueAt: "2026-03-25T17:00:00.000Z",
    status: "completed",
    type: "manual",
    assigneeLabel: "Roni",
  },
];

export const petAccessList: PetAccess[] = [
  {
    id: "acc-1",
    petId: "pet-1",
    personName: "Sanna",
    role: "family",
    isAdmin: true,
    canViewProfile: true,
    canViewHealth: true,
    canViewCareInstructions: true,
    canViewReminders: true,
    canComment: true,
    canUploadMedia: true,
  },
  {
    id: "acc-2",
    petId: "pet-1",
    personName: "Emma",
    role: "caretaker",
    canViewProfile: true,
    canViewHealth: false,
    canViewCareInstructions: true,
    canViewReminders: false,
    canComment: true,
    canUploadMedia: true,
  },
];

export const petUpdates: PetUpdate[] = [
  {
    id: "upd-1",
    petId: "pet-1",
    authorName: "Emma",
    authorRole: "caretaker",
    text: "Luna söi hyvin ja käytiin pitkä iltalenkki. Lisäsin yhden kuvan hoitohistoriaan.",
    createdAt: "2026-03-28T15:30:00.000Z",
    mediaCount: 1,
  },
  {
    id: "upd-2",
    petId: "pet-1",
    authorName: "Roni",
    authorRole: "owner",
    text: "Tassu näyttää jo paljon paremmalta.",
    createdAt: "2026-03-27T19:10:00.000Z",
  },
];

export const vaccinations: VaccinationRecord[] = [
  {
    id: "vac-1",
    petId: "pet-1",
    vaccineName: "Rabies booster",
    administeredOn: "2025-04-05",
    validUntil: "2026-04-05",
    clinicName: "Klinikka Aava",
    notes: "Seuraava tehoste muistutettu automaattisesti.",
  },
  {
    id: "vac-2",
    petId: "pet-2",
    vaccineName: "Perusrokote",
    administeredOn: "2025-09-14",
    validUntil: "2026-09-14",
    clinicName: "Elainlaakari Kaari",
  },
];

export const medications: MedicationRecord[] = [
  {
    id: "med-1",
    petId: "pet-2",
    medicationName: "Matolaake",
    dosage: "1 tabletti",
    instructions: "Annetaan aamuruuan yhteydessa.",
    startDate: "2026-03-29",
    status: "active",
  },
  {
    id: "med-2",
    petId: "pet-1",
    medicationName: "Tulehduskipulaake",
    dosage: "5 mg",
    instructions: "Iltaisin 5 paivan ajan.",
    startDate: "2026-03-18",
    endDate: "2026-03-23",
    status: "completed",
  },
];

export const vetVisits: VetVisitRecord[] = [
  {
    id: "visit-1",
    petId: "pet-1",
    visitDate: "2026-03-18",
    clinicName: "Klinikka Aava",
    veterinarianName: "Elina Saarinen",
    reason: "Tassun tarkistus",
    summary: "Haava paranee hyvin, kontrolli viikon paasta.",
    followUpDate: "2026-03-25",
  },
  {
    id: "visit-2",
    petId: "pet-2",
    visitDate: "2025-11-10",
    clinicName: "Elainlaakari Kaari",
    reason: "Vuosikontrolli",
    summary: "Perustila hyva.",
  },
];

export const healthNotes: HealthNoteRecord[] = [
  {
    id: "note-1",
    petId: "pet-1",
    type: "diet_note",
    title: "Herkkavatsaisuus",
    content: "Uudet namit pitaa ottaa kayttoon hitaasti.",
  },
  {
    id: "note-2",
    petId: "pet-1",
    type: "allergy",
    title: "Kanaepaily",
    content: "Kanapohjaiset herkut voivat kutittaa korvia.",
  },
  {
    id: "note-3",
    petId: "pet-2",
    type: "chronic_condition",
    title: "Toistuva korvaherkkyys",
    content: "Korvat kannattaa tarkistaa säännöllisesti siitepölyaikaan.",
  },
];

export const insuranceRecords: InsuranceRecord[] = [
  {
    id: "ins-1",
    petId: "pet-1",
    providerName: "Agria",
    policyNumber: "AGR-482910",
    coverageType: "health_and_life",
    deductibleLabel: "150 EUR + 25 %",
    validFrom: "2025-11-12",
    validUntil: "2026-11-12",
    contactPhone: "+358 10 123 4567",
    notes: "Vahinkoilmoitus tehdään sovelluksen kautta tai puhelimitse.",
  },
];

export const careInstructions: CareInstructionRecord[] = [
  {
    id: "care-1",
    petId: "pet-1",
    type: "feeding",
    title: "Ruokinta",
    content: "2 ateriaa paivassa. Aamulla 1,5 dl ja illalla 1,5 dl.",
    sortOrder: 1,
    isSharedWithCaretakers: true,
  },
  {
    id: "care-2",
    petId: "pet-1",
    type: "warning",
    title: "Mita valttaa",
    content: "Ei uusia herkkuja ilman hitaampaa totutusta vatsan takia.",
    sortOrder: 2,
    isSharedWithCaretakers: true,
  },
  {
    id: "care-4",
    petId: "pet-1",
    type: "routine",
    title: "Iltarutiini",
    content: "Lyhyt lenkki klo 20, sen jalkeen rauhoittuminen ilman riehakkaita leikkeja.",
    sortOrder: 3,
    isSharedWithCaretakers: true,
  },
  {
    id: "care-3",
    petId: "pet-2",
    type: "commands",
    title: "Tarkeat komennot",
    content: "Osaa hyvin odota, tänne ja irti.",
    sortOrder: 1,
    isSharedWithCaretakers: true,
  },
];
