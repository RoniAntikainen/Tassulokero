import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { getSupabaseClient } from "./supabase";

export type DbClient = SupabaseClient<Database>;

export function getDbClient(): DbClient | null {
  return getSupabaseClient();
}

export async function getCurrentDbUser() {
  const client = getDbClient();
  if (!client) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

export async function ensureUserProfile(input: {
  authUserId: string;
  email: string;
  displayName?: string;
  roleProfile?: "owner" | "breeder";
}) {
  const client = getDbClient();
  if (!client) {
    return null;
  }

  const { data, error } = await (client as any)
    .from("users")
    .upsert(
      {
        auth_user_id: input.authUserId,
        email: input.email,
        display_name: input.displayName ?? null,
        role_profile: input.roleProfile ?? "owner",
      },
      {
        onConflict: "auth_user_id",
      },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserProfileByAuthUserId(authUserId: string) {
  const client = getDbClient();
  if (!client) {
    return null;
  }

  const { data, error } = await (client as any)
    .from("users")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserProfileById(userId: string) {
  const client = getDbClient();
  if (!client) {
    return null;
  }

  const { data, error } = await (client as any)
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateUserProfile(input: {
  id: string;
  displayName?: string;
  bio?: string;
  pushEnabled?: boolean;
  reminderPushEnabled?: boolean;
  updatePushEnabled?: boolean;
  marketingPushEnabled?: boolean;
}) {
  const client = getDbClient();
  if (!client) {
    return null;
  }

  const payload: Record<string, unknown> = {
    id: input.id,
  };

  if (input.displayName !== undefined) payload.display_name = input.displayName;
  if (input.bio !== undefined) payload.bio = input.bio;
  if (input.pushEnabled !== undefined) payload.push_enabled = input.pushEnabled;
  if (input.reminderPushEnabled !== undefined) payload.reminder_push_enabled = input.reminderPushEnabled;
  if (input.updatePushEnabled !== undefined) payload.update_push_enabled = input.updatePushEnabled;
  if (input.marketingPushEnabled !== undefined) payload.marketing_push_enabled = input.marketingPushEnabled;

  const { data, error } = await (client as any)
    .from("users")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveDevicePushToken(input: {
  userId: string;
  token: string;
  tokenType: string;
  deviceName?: string;
  deviceOs?: string;
}) {
  const client = getDbClient();
  if (!client) {
    return null;
  }

  const { data, error } = await (client as any)
    .from("device_push_tokens")
    .upsert(
      {
        user_id: input.userId,
        token: input.token,
        token_type: input.tokenType,
        device_name: input.deviceName ?? null,
        device_os: input.deviceOs ?? null,
      },
      { onConflict: "user_id,token" },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listPetsForUser(dbUserId: string) {
  const client = getDbClient();
  if (!client) {
    return [];
  }

  const { data: ownedPets, error: ownedError } = await (client as any)
    .from("pets")
    .select("*")
    .eq("owner_user_id", dbUserId)
    .order("created_at", { ascending: false });

  if (ownedError) {
    throw ownedError;
  }

  const { data: accessRows, error: accessError } = await (client as any)
    .from("pet_access")
    .select("pet_id")
    .eq("user_id", dbUserId);

  if (accessError) {
    throw accessError;
  }

  const sharedPetIds = [...new Set((accessRows ?? []).map((row: { pet_id: string }) => row.pet_id))];

  if (!sharedPetIds.length) {
    return ownedPets ?? [];
  }

  const { data: sharedPets, error: sharedError } = await (client as any)
    .from("pets")
    .select("*")
    .in("id", sharedPetIds);

  if (sharedError) {
    throw sharedError;
  }

  const merged = [...(ownedPets ?? []), ...(sharedPets ?? [])];
  const uniqueById = new Map(merged.map((pet: { id: string }) => [pet.id, pet]));
  return [...uniqueById.values()];
}

export async function savePet(input: {
  id: string;
  ownerUserId: string;
  name: string;
  species: string;
  breed?: string;
  photoUrl?: string;
  birthDate?: string;
  isBirthDateEstimated?: boolean;
  sex?: string;
  weightKg?: number;
  colorMarkings?: string;
  chipId?: string;
  isNeutered?: boolean;
  notes?: string;
}) {
  const client = getDbClient();
  if (!client) {
    return null;
  }

  const { data, error } = await (client as any)
    .from("pets")
    .upsert(
      {
        id: input.id,
        owner_user_id: input.ownerUserId,
        name: input.name,
        species: input.species,
        breed: input.breed ?? null,
        photo_url: input.photoUrl ?? null,
        birth_date: input.birthDate ?? null,
        birth_date_is_estimate: input.isBirthDateEstimated ?? false,
        sex: input.sex ?? null,
        weight_kg: input.weightKg ?? null,
        color_markings: input.colorMarkings ?? null,
        chip_id: input.chipId ?? null,
        is_neutered: input.isNeutered ?? null,
        notes: input.notes ?? null,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deletePetById(petId: string) {
  const client = getDbClient();
  if (!client) {
    return;
  }

  const { error } = await (client as any).from("pets").delete().eq("id", petId);

  if (error) {
    throw error;
  }
}

export async function listPetAccessForOwnedPets(ownerUserId: string) {
  const client = getDbClient();
  if (!client) {
    return [];
  }

  const { data, error } = await (client as any)
    .from("pet_access")
    .select("*, pets!inner(owner_user_id)")
    .eq("pets.owner_user_id", ownerUserId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function savePetAccess(input: {
  id: string;
  petId: string;
  userId: string;
  role: "family" | "caretaker";
  isAdmin?: boolean;
  canViewProfile?: boolean;
  canViewHealth?: boolean;
  canViewCareInstructions?: boolean;
  canViewReminders?: boolean;
}) {
  const client = getDbClient();
  if (!client) {
    return null;
  }

  const { data, error } = await (client as any)
    .from("pet_access")
    .upsert(
      {
        id: input.id,
        pet_id: input.petId,
        user_id: input.userId,
        role: input.role,
        is_admin: input.isAdmin ?? false,
        can_view_profile: input.canViewProfile ?? true,
        can_view_health: input.canViewHealth ?? false,
        can_view_care_instructions: input.canViewCareInstructions ?? true,
        can_view_reminders: input.canViewReminders ?? false,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deletePetAccessById(accessId: string) {
  const client = getDbClient();
  if (!client) {
    return;
  }

  const { error } = await (client as any).from("pet_access").delete().eq("id", accessId);

  if (error) {
    throw error;
  }
}

export async function listRemindersForUser(dbUserId: string) {
  const client = getDbClient();
  if (!client) {
    return [];
  }

  const { data: ownReminders, error: ownError } = await (client as any)
    .from("reminders")
    .select("*")
    .eq("user_id", dbUserId)
    .order("due_at", { ascending: true });

  if (ownError) {
    throw ownError;
  }

  const { data: ownedPets, error: petError } = await (client as any).from("pets").select("id").eq("owner_user_id", dbUserId);

  if (petError) {
    throw petError;
  }

  const ownedPetIds = [...new Set((ownedPets ?? []).map((row: { id: string }) => row.id))];

  if (!ownedPetIds.length) {
    return ownReminders ?? [];
  }

  const { data: petReminders, error: petReminderError } = await (client as any)
    .from("reminders")
    .select("*")
    .in("pet_id", ownedPetIds)
    .order("due_at", { ascending: true });

  if (petReminderError) {
    throw petReminderError;
  }

  const merged = [...(ownReminders ?? []), ...(petReminders ?? [])];
  const uniqueById = new Map(merged.map((reminder: { id: string }) => [reminder.id, reminder]));
  return [...uniqueById.values()];
}

export async function saveReminder(input: {
  id: string;
  userId: string;
  petId: string;
  title: string;
  description?: string;
  dueAt: string;
  status?: "pending" | "completed" | "cancelled";
  type?: "manual" | "vaccination" | "medication" | "vet_visit";
  completedAt?: string | null;
}) {
  const client = getDbClient();
  if (!client) {
    return null;
  }

  const { data, error } = await (client as any)
    .from("reminders")
    .upsert(
      {
        id: input.id,
        user_id: input.userId,
        pet_id: input.petId,
        source_type: input.type ?? "manual",
        title: input.title,
        description: input.description ?? null,
        due_at: input.dueAt,
        status: input.status ?? "pending",
        completed_at: input.completedAt ?? null,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listHealthDataForUser(dbUserId: string) {
  const pets = await listPetsForUser(dbUserId);
  const petIds = pets.map((pet: { id: string }) => pet.id);

  if (!petIds.length) {
    return {
      vaccinations: [],
      medications: [],
      vetVisits: [],
      healthNotes: [],
      insuranceRecords: [],
    };
  }

  const client = getDbClient();
  if (!client) {
    return {
      vaccinations: [],
      medications: [],
      vetVisits: [],
      healthNotes: [],
      insuranceRecords: [],
    };
  }

  const [vaccinationsResult, medicationsResult, vetVisitsResult, healthNotesResult] = await Promise.all([
    (client as any).from("vaccinations").select("*").in("pet_id", petIds).order("administered_on", { ascending: false }),
    (client as any).from("medications").select("*").in("pet_id", petIds).order("created_at", { ascending: false }),
    (client as any).from("vet_visits").select("*").in("pet_id", petIds).order("visit_date", { ascending: false }),
    (client as any).from("health_notes").select("*").in("pet_id", petIds).order("created_at", { ascending: false }),
  ]);

  if (vaccinationsResult.error) throw vaccinationsResult.error;
  if (medicationsResult.error) throw medicationsResult.error;
  if (vetVisitsResult.error) throw vetVisitsResult.error;
  if (healthNotesResult.error) throw healthNotesResult.error;

  return {
    vaccinations: vaccinationsResult.data ?? [],
    medications: medicationsResult.data ?? [],
    vetVisits: vetVisitsResult.data ?? [],
    healthNotes: healthNotesResult.data ?? [],
    insuranceRecords: [],
  };
}

export async function saveVaccination(input: {
  id: string;
  petId: string;
  vaccineName: string;
  administeredOn: string;
  validUntil?: string;
  clinicName?: string;
  notes?: string;
}) {
  const client = getDbClient();
  if (!client) return null;

  const { data, error } = await (client as any)
    .from("vaccinations")
    .upsert(
      {
        id: input.id,
        pet_id: input.petId,
        vaccine_name: input.vaccineName,
        administered_on: input.administeredOn,
        valid_until: input.validUntil ?? null,
        clinic_name: input.clinicName ?? null,
        notes: input.notes ?? null,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVaccinationById(id: string) {
  const client = getDbClient();
  if (!client) return;
  const { error } = await (client as any).from("vaccinations").delete().eq("id", id);
  if (error) throw error;
}

export async function saveMedication(input: {
  id: string;
  petId: string;
  medicationName: string;
  dosage?: string;
  instructions?: string;
  startDate?: string;
  endDate?: string;
  status: "active" | "completed" | "paused";
  notes?: string;
}) {
  const client = getDbClient();
  if (!client) return null;

  const { data, error } = await (client as any)
    .from("medications")
    .upsert(
      {
        id: input.id,
        pet_id: input.petId,
        medication_name: input.medicationName,
        dosage: input.dosage ?? null,
        instructions: input.instructions ?? null,
        start_date: input.startDate ?? null,
        end_date: input.endDate ?? null,
        status: input.status,
        notes: input.notes ?? null,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMedicationById(id: string) {
  const client = getDbClient();
  if (!client) return;
  const { error } = await (client as any).from("medications").delete().eq("id", id);
  if (error) throw error;
}

export async function saveVetVisit(input: {
  id: string;
  petId: string;
  visitDate: string;
  clinicName?: string;
  veterinarianName?: string;
  reason?: string;
  summary?: string;
  followUpDate?: string;
}) {
  const client = getDbClient();
  if (!client) return null;

  const { data, error } = await (client as any)
    .from("vet_visits")
    .upsert(
      {
        id: input.id,
        pet_id: input.petId,
        visit_date: input.visitDate,
        clinic_name: input.clinicName ?? null,
        veterinarian_name: input.veterinarianName ?? null,
        reason: input.reason ?? null,
        summary: input.summary ?? null,
        follow_up_date: input.followUpDate ?? null,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVetVisitById(id: string) {
  const client = getDbClient();
  if (!client) return;
  const { error } = await (client as any).from("vet_visits").delete().eq("id", id);
  if (error) throw error;
}

export async function saveHealthNote(input: {
  id: string;
  petId: string;
  type: "allergy" | "chronic_condition" | "diet_note" | "behaviour_note" | "other";
  title: string;
  content: string;
}) {
  const client = getDbClient();
  if (!client) return null;

  const { data, error } = await (client as any)
    .from("health_notes")
    .upsert(
      {
        id: input.id,
        pet_id: input.petId,
        type: input.type,
        title: input.title,
        content: input.content,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listCareInstructionsForUser(dbUserId: string) {
  const pets = await listPetsForUser(dbUserId);
  const petIds = pets.map((pet: { id: string }) => pet.id);
  if (!petIds.length) return [];

  const client = getDbClient();
  if (!client) return [];

  const { data, error } = await (client as any)
    .from("care_instructions")
    .select("*")
    .in("pet_id", petIds)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function saveCareInstruction(input: {
  id: string;
  petId: string;
  type: "feeding" | "commands" | "routine" | "warning" | "general";
  title: string;
  content: string;
  sortOrder: number;
  isSharedWithCaretakers: boolean;
}) {
  const client = getDbClient();
  if (!client) return null;

  const { data, error } = await (client as any)
    .from("care_instructions")
    .upsert(
      {
        id: input.id,
        pet_id: input.petId,
        type: input.type,
        title: input.title,
        content: input.content,
        sort_order: input.sortOrder,
        is_shared_with_caretakers: input.isSharedWithCaretakers,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCareInstructionById(id: string) {
  const client = getDbClient();
  if (!client) return;
  const { error } = await (client as any).from("care_instructions").delete().eq("id", id);
  if (error) throw error;
}

export async function listUpdatesForUser(dbUserId: string) {
  const pets = await listPetsForUser(dbUserId);
  const petIds = pets.map((pet: { id: string }) => pet.id);
  if (!petIds.length) return [];

  const client = getDbClient();
  if (!client) return [];

  const { data, error } = await (client as any)
    .from("pet_updates")
    .select("*")
    .in("pet_id", petIds)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function savePetUpdate(input: {
  id: string;
  petId: string;
  authorUserId: string;
  body: string;
  visibility?: "shared" | "private";
}) {
  const client = getDbClient();
  if (!client) return null;

  const { data, error } = await (client as any)
    .from("pet_updates")
    .upsert(
      {
        id: input.id,
        pet_id: input.petId,
        author_user_id: input.authorUserId,
        body: input.body,
        visibility: input.visibility ?? "shared",
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listMediaForUser(dbUserId: string) {
  const pets = await listPetsForUser(dbUserId);
  const petIds = pets.map((pet: { id: string }) => pet.id);
  if (!petIds.length) return [];

  const client = getDbClient();
  if (!client) return [];

  const { data, error } = await (client as any)
    .from("attachments")
    .select("*")
    .in("pet_id", petIds)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function saveMediaItem(input: {
  id: string;
  petId: string;
  relatedType: string;
  relatedId: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
}) {
  const client = getDbClient();
  if (!client) return null;

  const { data, error } = await (client as any)
    .from("attachments")
    .upsert(
      {
        id: input.id,
        pet_id: input.petId,
        related_type: input.relatedType,
        related_id: input.relatedId,
        file_url: input.fileUrl,
        file_name: input.fileName,
        mime_type: input.mimeType ?? "image/jpeg",
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listBreederLinksForUser(dbUserId: string) {
  const pets = await listPetsForUser(dbUserId);
  const petIds = pets.map((pet: { id: string }) => pet.id);
  if (!petIds.length) return [];

  const client = getDbClient();
  if (!client) return [];

  const { data, error } = await (client as any)
    .from("breeder_links")
    .select("*")
    .in("pet_id", petIds)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function saveBreederLink(input: {
  petId: string;
  breederName: string;
  status?: "pending" | "accepted" | "rejected";
  canViewHealth: boolean;
  canEditHeatCycles: boolean;
  canViewReminders: boolean;
}) {
  const client = getDbClient();
  if (!client) return null;

  const { data, error } = await (client as any)
    .from("breeder_links")
    .upsert(
      {
        pet_id: input.petId,
        breeder_name: input.breederName,
        status: input.status ?? "accepted",
        can_view_health: input.canViewHealth,
        can_edit_heat_cycles: input.canEditHeatCycles,
        can_view_reminders: input.canViewReminders,
      },
      { onConflict: "pet_id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listHeatCyclesForUser(dbUserId: string) {
  const pets = await listPetsForUser(dbUserId);
  const petIds = pets.map((pet: { id: string }) => pet.id);
  if (!petIds.length) return [];

  const client = getDbClient();
  if (!client) return [];

  const { data, error } = await (client as any)
    .from("heat_cycles")
    .select("*")
    .in("pet_id", petIds)
    .order("started_on", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function saveHeatCycle(input: {
  id: string;
  petId: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}) {
  const client = getDbClient();
  if (!client) return null;

  const { data, error } = await (client as any)
    .from("heat_cycles")
    .upsert(
      {
        id: input.id,
        pet_id: input.petId,
        started_on: input.startDate,
        ended_on: input.endDate ?? null,
        notes: input.notes ?? null,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
