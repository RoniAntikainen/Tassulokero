import { create } from "zustand";

import { deleteCareInstructionById, listCareInstructionsForUser, saveCareInstruction as saveCareInstructionToDb } from "../lib/db";
import { CareInstructionRecord } from "../types/domain";

interface CareState {
  careInstructions: CareInstructionRecord[];
  hydrateCare: (dbUserId: string) => Promise<void>;
  addCareInstruction: (values: Omit<CareInstructionRecord, "id" | "sortOrder">) => void;
  updateCareInstruction: (
    instructionId: string,
    values: Partial<Omit<CareInstructionRecord, "id" | "petId" | "sortOrder">>,
  ) => void;
  removeCareInstruction: (instructionId: string) => void;
}

export const useCareStore = create<CareState>((set) => ({
  careInstructions: [],
  hydrateCare: async (dbUserId) => {
    const rows = await listCareInstructionsForUser(dbUserId);
    set({
      careInstructions: rows.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        type: row.type,
        title: row.title,
        content: row.content,
        sortOrder: row.sort_order,
        isSharedWithCaretakers: row.is_shared_with_caretakers,
      })),
    });
  },
  addCareInstruction: (values) =>
    set((state) => {
      const sortOrder =
        state.careInstructions
          .filter((item) => item.petId === values.petId)
          .reduce((max, item) => Math.max(max, item.sortOrder), 0) + 1;

      const nextItem: CareInstructionRecord = {
        id: crypto.randomUUID(),
        sortOrder,
        ...values,
      };

      void saveCareInstructionToDb(nextItem);

      return {
        careInstructions: [nextItem, ...state.careInstructions],
      };
    }),
  updateCareInstruction: (instructionId, values) => {
    let nextItem: CareInstructionRecord | undefined;
    set((state) => ({
      careInstructions: state.careInstructions.map((item) => {
        if (item.id !== instructionId) {
          return item;
        }

        nextItem = {
          ...item,
          ...values,
        };

        return nextItem;
      }),
    }));
    if (nextItem) void saveCareInstructionToDb(nextItem);
  },
  removeCareInstruction: (instructionId) => {
    set((state) => ({
      careInstructions: state.careInstructions.filter((item) => item.id !== instructionId),
    }));
    void deleteCareInstructionById(instructionId);
  },
}));
