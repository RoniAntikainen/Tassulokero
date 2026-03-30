import { create } from "zustand";

import { listMediaForUser, saveMediaItem as saveMediaItemToDb } from "../lib/db";

interface PetMediaItem {
  id: string;
  petId: string;
  authorName: string;
  kind: "image";
  sourceLabel: string;
  createdAt: string;
}

interface AddMediaValues {
  petId: string;
  authorName: string;
  sourceLabel: string;
}

interface MediaState {
  mediaItems: PetMediaItem[];
  hydrateMedia: (dbUserId: string) => Promise<void>;
  addMediaItem: (values: AddMediaValues) => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  mediaItems: [],
  hydrateMedia: async (dbUserId) => {
    const rows = await listMediaForUser(dbUserId);
    set({
      mediaItems: rows.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        authorName: "Kuva",
        kind: "image",
        sourceLabel: row.file_name,
        createdAt: row.created_at,
      })),
    });
  },
  addMediaItem: (values) => {
    const nextItem: PetMediaItem = {
      id: crypto.randomUUID(),
      petId: values.petId,
      authorName: values.authorName,
      kind: "image",
      sourceLabel: values.sourceLabel,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      mediaItems: [nextItem, ...state.mediaItems],
    }));

    void saveMediaItemToDb({
      id: nextItem.id,
      petId: nextItem.petId,
      relatedType: "pet_media",
      relatedId: nextItem.petId,
      fileName: nextItem.sourceLabel,
      fileUrl: nextItem.sourceLabel,
    });
  },
}));
