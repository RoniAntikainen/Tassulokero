import { create } from "zustand";

import { listBreederLinksForUser, listHeatCyclesForUser, saveBreederLink as saveBreederLinkToDb, saveHeatCycle as saveHeatCycleToDb } from "../lib/db";
import { BreederAccessSettings, HeatCycleRecord } from "../types/domain";

interface BreederState {
  breederAccess: BreederAccessSettings[];
  heatCycles: HeatCycleRecord[];
  hydrateBreederData: (dbUserId: string) => Promise<void>;
  updateBreederAccess: (petId: string, values: Partial<BreederAccessSettings>) => void;
  addHeatCycle: (values: Omit<HeatCycleRecord, "id">) => void;
}

export const useBreederStore = create<BreederState>((set) => ({
  breederAccess: [],
  heatCycles: [],
  hydrateBreederData: async (dbUserId) => {
    const [links, heatCycles] = await Promise.all([listBreederLinksForUser(dbUserId), listHeatCyclesForUser(dbUserId)]);
    set({
      breederAccess: links.map((row: any) => ({
        petId: row.pet_id,
        breederName: row.breeder_name,
        canViewHealth: row.can_view_health,
        canEditHeatCycles: row.can_edit_heat_cycles,
        canViewReminders: row.can_view_reminders,
      })),
      heatCycles: heatCycles.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        startDate: row.started_on,
        endDate: row.ended_on ?? undefined,
        notes: row.notes ?? undefined,
      })),
    });
  },
  updateBreederAccess: (petId, values) =>
    set((state) => {
      const nextItem = state.breederAccess.some((item) => item.petId === petId)
        ? state.breederAccess.map((item) =>
            item.petId === petId
              ? {
                  ...item,
                  ...values,
                }
              : item,
          )
        : [
            ...state.breederAccess,
            {
              petId,
              breederName: values.breederName ?? "Kasvattaja",
              canViewHealth: values.canViewHealth ?? true,
              canEditHeatCycles: values.canEditHeatCycles ?? true,
              canViewReminders: values.canViewReminders ?? false,
            },
          ];

      const persisted =
        nextItem.find((item) => item.petId === petId) ?? {
          petId,
          breederName: values.breederName ?? "Kasvattaja",
          canViewHealth: values.canViewHealth ?? true,
          canEditHeatCycles: values.canEditHeatCycles ?? true,
          canViewReminders: values.canViewReminders ?? false,
        };
      void saveBreederLinkToDb({
        petId: persisted.petId,
        breederName: persisted.breederName,
        canViewHealth: persisted.canViewHealth,
        canEditHeatCycles: persisted.canEditHeatCycles,
        canViewReminders: persisted.canViewReminders,
      });

      return {
        breederAccess: nextItem,
      };
    }),
  addHeatCycle: (values) => {
    const nextItem: HeatCycleRecord = {
      id: crypto.randomUUID(),
      ...values,
    };

    set((state) => ({
      heatCycles: [nextItem, ...state.heatCycles],
    }));
    void saveHeatCycleToDb(nextItem);
  },
}));
