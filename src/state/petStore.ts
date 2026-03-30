import { create } from "zustand";

import { pets as initialPets } from "../data/mockData";
import { deletePetById, listPetsForUser, savePet as savePetToDb } from "../lib/db";
import { normalizePetPhotoLabel, PET_PROFILE_PHOTO_PRESET } from "../lib/petPhoto";
import { Pet } from "../types/domain";

export interface CreatePetValues {
  name: string;
  species: string;
  breed?: string;
  photoLabel?: string;
}

export interface UpdatePetValues {
  name?: string;
  species?: string;
  breed?: string;
  photoLabel?: string;
  birthDate?: string;
  isBirthDateEstimated?: boolean;
  sex?: string;
  weightKg?: number;
  colorMarkings?: string;
  chipId?: string;
  isNeutered?: boolean;
  notes?: string;
}

interface PetState {
  pets: Pet[];
  seedDemoPets: () => void;
  clearPets: () => void;
  hydratePets: (dbUserId: string) => Promise<void>;
  addPet: (values: CreatePetValues) => string;
  updatePet: (petId: string, values: UpdatePetValues) => void;
  removePet: (petId: string) => void;
  updatePetBreederLink: (
    petId: string,
    values: Partial<Pick<Pet, "breederName" | "breederLinkStatus">>,
  ) => void;
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  seedDemoPets: () => set({ pets: initialPets }),
  clearPets: () => set({ pets: [] }),
  hydratePets: async (dbUserId) => {
    const rows = await listPetsForUser(dbUserId);

    set({
      pets: rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        species: row.species,
        breed: row.breed ?? undefined,
        photoLabel: row.photo_url ?? undefined,
        photoPreset: row.photo_url ? PET_PROFILE_PHOTO_PRESET : undefined,
        birthDate: row.birth_date ?? undefined,
        isBirthDateEstimated: row.birth_date_is_estimate ?? undefined,
        sex: row.sex ?? undefined,
        weightKg: row.weight_kg ?? undefined,
        colorMarkings: row.color_markings ?? undefined,
        chipId: row.chip_id ?? undefined,
        isNeutered: row.is_neutered ?? undefined,
        notes: row.notes ?? undefined,
        avatarColor: "#D8F3F1",
      })),
    });
  },
  addPet: (values) => {
    const id = crypto.randomUUID();
    const normalizedPhotoLabel = normalizePetPhotoLabel(values.photoLabel ?? "");
    const newPet: Pet = {
      id,
      name: values.name,
      species: values.species,
      breed: values.breed,
      photoLabel: normalizedPhotoLabel,
      photoPreset: normalizedPhotoLabel ? PET_PROFILE_PHOTO_PRESET : undefined,
      avatarColor: "#D8F3F1",
      nextImportantThing: "Ei muistutuksia viela",
    };

    set((state) => ({
      pets: [newPet, ...state.pets],
    }));

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string } | null;
    if (sessionUser?.dbUserId) {
      void savePetToDb({
        id,
        ownerUserId: sessionUser.dbUserId,
        name: newPet.name,
        species: newPet.species,
        breed: newPet.breed,
        photoUrl: newPet.photoLabel,
      });
    }

    return id;
  },
  updatePet: (petId, values) => {
    let nextPet: Pet | undefined;

    set((state) => ({
      pets: state.pets.map((pet) => {
        if (pet.id !== petId) {
          return pet;
        }

        nextPet = {
          ...pet,
          ...values,
          photoLabel:
            values.photoLabel !== undefined
              ? normalizePetPhotoLabel(values.photoLabel)
              : pet.photoLabel,
          photoPreset:
            values.photoLabel !== undefined
              ? normalizePetPhotoLabel(values.photoLabel)
                ? PET_PROFILE_PHOTO_PRESET
                : undefined
              : pet.photoPreset,
        };

        return nextPet;
      }),
    }));

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string } | null;
    if (sessionUser?.dbUserId && nextPet) {
      void savePetToDb({
        id: nextPet.id,
        ownerUserId: sessionUser.dbUserId,
        name: nextPet.name,
        species: nextPet.species,
        breed: nextPet.breed,
        photoUrl: nextPet.photoLabel,
        birthDate: nextPet.birthDate,
        isBirthDateEstimated: nextPet.isBirthDateEstimated,
        sex: nextPet.sex,
        weightKg: nextPet.weightKg,
        colorMarkings: nextPet.colorMarkings,
        chipId: nextPet.chipId,
        isNeutered: nextPet.isNeutered,
        notes: nextPet.notes,
      });
    }
  },
  removePet: (petId) => {
    set((state) => ({
      pets: state.pets.filter((pet) => pet.id !== petId),
    }));
    void deletePetById(petId);
  },
  updatePetBreederLink: (petId, values) =>
    set((state) => ({
      pets: state.pets.map((pet) =>
        pet.id === petId
          ? {
              ...pet,
              ...values,
            }
          : pet,
      ),
    })),
}));
