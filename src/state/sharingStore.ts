import { create } from "zustand";

import { deletePetAccessById, listPetAccessForOwnedPets, savePetAccess } from "../lib/db";
import { PetAccess } from "../types/domain";

interface InviteAccessValues {
  petId: string;
  userId: string;
  personName: string;
  role: "family" | "caretaker";
}

interface SharingState {
  accesses: PetAccess[];
  hydrateAccesses: (dbUserId: string) => Promise<void>;
  inviteAccess: (values: InviteAccessValues) => void;
  toggleFamilyAdmin: (accessId: string) => void;
  removeAccess: (accessId: string) => void;
  updateAccessPermissions: (accessId: string, updates: Partial<PetAccess>) => void;
}

export const useSharingStore = create<SharingState>((set) => ({
  accesses: [],
  hydrateAccesses: async (dbUserId) => {
    const rows = await listPetAccessForOwnedPets(dbUserId);

    set({
      accesses: rows.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        userId: row.user_id,
        personName: row.users?.display_name ?? row.user_id,
        role: row.role,
        isAdmin: row.is_admin ?? undefined,
        canViewProfile: row.can_view_profile ?? undefined,
        canViewHealth: row.can_view_health ?? undefined,
        canViewCareInstructions: row.can_view_care_instructions ?? undefined,
        canViewReminders: row.can_view_reminders ?? undefined,
      })),
    });
  },
  inviteAccess: (values) => {
    const accessId = crypto.randomUUID();
    const nextAccess: PetAccess = {
      id: accessId,
      petId: values.petId,
      userId: values.userId,
      personName: values.personName,
      role: values.role,
      isAdmin: values.role === "family" ? false : undefined,
      canViewProfile: true,
      canViewHealth: values.role === "family",
      canViewCareInstructions: true,
      canViewReminders: values.role === "family",
      canComment: true,
      canUploadMedia: true,
    };

    set((state) => ({
      accesses: [nextAccess, ...state.accesses],
    }));

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string } | null;
    if (sessionUser?.dbUserId) {
      void savePetAccess({
        id: nextAccess.id,
        petId: nextAccess.petId,
        userId: nextAccess.userId,
        role: nextAccess.role as "family" | "caretaker",
        isAdmin: nextAccess.isAdmin,
        canViewProfile: nextAccess.canViewProfile,
        canViewHealth: nextAccess.canViewHealth,
        canViewCareInstructions: nextAccess.canViewCareInstructions,
        canViewReminders: nextAccess.canViewReminders,
      });
    }
  },
  toggleFamilyAdmin: (accessId) =>
    set((state) => ({
      accesses: state.accesses.map((access) =>
        access.id === accessId && access.role === "family"
          ? {
              ...access,
              isAdmin: !access.isAdmin,
            }
          : access,
      ),
    })),
  removeAccess: (accessId) => {
    set((state) => ({
      accesses: state.accesses.filter((access) => access.id !== accessId),
    }));
    void deletePetAccessById(accessId);
  },
  updateAccessPermissions: (accessId, updates) => {
    let nextAccess: PetAccess | undefined;

    set((state) => ({
      accesses: state.accesses.map((access) => {
        if (access.id !== accessId) {
          return access;
        }

        nextAccess = {
          ...access,
          ...updates,
        };

        return nextAccess;
      }),
    }));

    if (nextAccess) {
      void savePetAccess({
        id: nextAccess.id,
        petId: nextAccess.petId,
        userId: nextAccess.userId,
        role: nextAccess.role as "family" | "caretaker",
        isAdmin: nextAccess.isAdmin,
        canViewProfile: nextAccess.canViewProfile,
        canViewHealth: nextAccess.canViewHealth,
        canViewCareInstructions: nextAccess.canViewCareInstructions,
        canViewReminders: nextAccess.canViewReminders,
      });
    }
  },
}));
