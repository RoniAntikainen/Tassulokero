export type UserRole = "owner" | "family" | "caretaker";
export type ReminderStatus = "pending" | "completed" | "cancelled";
export type ReminderGroup = "today" | "upcoming" | "overdue" | "completed";
export type TabKey = "home" | "pets" | "reminders" | "profile";
export type PetSection =
  | "overview"
  | "health"
  | "care"
  | "updates"
  | "media"
  | "sharing";

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  photoLabel?: string;
  photoPreset?: "square_400";
  birthDate?: string;
  isBirthDateEstimated?: boolean;
  sex?: string;
  ageLabel?: string;
  weightKg?: number;
  colorMarkings?: string;
  chipId?: string;
  isNeutered?: boolean;
  notes?: string;
  avatarColor: string;
  nextImportantThing?: string;
  breederName?: string;
  breederLinkStatus?: "none" | "pending" | "approved" | "rejected";
}

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  description?: string;
  dueAt: string;
  status: ReminderStatus;
  type: "manual" | "vaccination" | "medication" | "vet_visit";
  assigneeLabel: string;
}

export interface PetAccess {
  id: string;
  petId: string;
  userId: string;
  personName: string;
  role: UserRole;
  isAdmin?: boolean;
  canViewProfile?: boolean;
  canViewHealth?: boolean;
  canViewCareInstructions?: boolean;
  canViewReminders?: boolean;
  canComment?: boolean;
  canUploadMedia?: boolean;
}

export interface PetUpdate {
  id: string;
  petId: string;
  authorName: string;
  authorRole?: "owner" | "family" | "caretaker";
  text: string;
  createdAt: string;
  mediaCount?: number;
  mediaPreviewLabel?: string;
}

export interface VaccinationRecord {
  id: string;
  petId: string;
  vaccineName: string;
  administeredOn: string;
  validUntil?: string;
  clinicName?: string;
  notes?: string;
}

export interface MedicationRecord {
  id: string;
  petId: string;
  medicationName: string;
  dosage?: string;
  instructions?: string;
  startDate?: string;
  endDate?: string;
  status: "active" | "completed" | "paused";
  notes?: string;
}

export interface VetVisitRecord {
  id: string;
  petId: string;
  visitDate: string;
  clinicName?: string;
  veterinarianName?: string;
  reason?: string;
  summary?: string;
  followUpDate?: string;
}

export interface HealthNoteRecord {
  id: string;
  petId: string;
  type: "allergy" | "chronic_condition" | "diet_note" | "behaviour_note" | "other";
  title: string;
  content: string;
}

export interface InsuranceRecord {
  id: string;
  petId: string;
  providerName: string;
  policyNumber?: string;
  coverageType?: "health" | "life" | "health_and_life" | "other";
  deductibleLabel?: string;
  validFrom?: string;
  validUntil?: string;
  contactPhone?: string;
  notes?: string;
}

export interface CareInstructionRecord {
  id: string;
  petId: string;
  type: "feeding" | "commands" | "routine" | "warning" | "general";
  title: string;
  content: string;
  sortOrder: number;
  isSharedWithCaretakers: boolean;
}

export interface BreederAccessSettings {
  petId: string;
  breederName: string;
  canViewHealth: boolean;
  canEditHeatCycles: boolean;
  canViewReminders: boolean;
}

export interface HeatCycleRecord {
  id: string;
  petId: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  estimatedNextStartDate?: string;
}
