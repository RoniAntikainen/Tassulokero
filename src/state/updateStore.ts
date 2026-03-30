import { create } from "zustand";

import { currentUser } from "../data/mockData";
import { listUpdatesForUser, savePetUpdate as savePetUpdateToDb } from "../lib/db";
import { PetUpdate } from "../types/domain";

interface AddUpdateValues {
  petId: string;
  authorName: string;
  authorRole: "owner" | "family" | "caretaker";
  text: string;
  mediaCount?: number;
  mediaPreviewLabel?: string;
}

interface UpdateState {
  updates: PetUpdate[];
  hydrateUpdates: (dbUserId: string) => Promise<void>;
  addUpdate: (values: AddUpdateValues) => void;
  addSystemUpdate: (petId: string, text: string) => void;
}

export const useUpdateStore = create<UpdateState>((set) => ({
  updates: [],
  hydrateUpdates: async (dbUserId) => {
    const rows = await listUpdatesForUser(dbUserId);
    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string; displayName?: string } | null;
    set({
      updates: rows.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        authorName: row.author_user_id === dbUserId ? sessionUser?.displayName ?? currentUser.displayName : String(row.author_user_id),
        authorRole: row.author_user_id === dbUserId ? "owner" : undefined,
        text: row.body,
        createdAt: row.created_at,
      })),
    });
  },
  addUpdate: (values) => {
    const nextItem: PetUpdate = {
      id: crypto.randomUUID(),
      petId: values.petId,
      authorName: values.authorName,
      authorRole: values.authorRole,
      text: values.text,
      createdAt: new Date().toISOString(),
      mediaCount: values.mediaCount,
      mediaPreviewLabel: values.mediaPreviewLabel,
    };

    set((state) => ({
      updates: [nextItem, ...state.updates],
    }));

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string } | null;
    if (sessionUser?.dbUserId) {
      void savePetUpdateToDb({
        id: nextItem.id,
        petId: nextItem.petId,
        authorUserId: sessionUser.dbUserId,
        body: nextItem.text,
        visibility: "shared",
      });
    }
  },
  addSystemUpdate: (petId, text) => {
    const nextItem: PetUpdate = {
      id: crypto.randomUUID(),
      petId,
      authorName: "Tassulokero",
      text,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      updates: [nextItem, ...state.updates],
    }));

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string } | null;
    if (sessionUser?.dbUserId) {
      void savePetUpdateToDb({
        id: nextItem.id,
        petId: nextItem.petId,
        authorUserId: sessionUser.dbUserId,
        body: nextItem.text,
        visibility: "private",
      });
    }
  },
}));
