import { create } from "zustand";

import {
  deleteMedicationById,
  deleteVaccinationById,
  deleteVetVisitById,
  listHealthDataForUser,
  saveHealthNote as saveHealthNoteToDb,
  saveMedication as saveMedicationToDb,
  saveVaccination as saveVaccinationToDb,
  saveVetVisit as saveVetVisitToDb,
} from "../lib/db";
import { HealthNoteRecord, InsuranceRecord, MedicationRecord, VaccinationRecord, VetVisitRecord } from "../types/domain";

interface HealthState {
  vaccinations: VaccinationRecord[];
  medications: MedicationRecord[];
  vetVisits: VetVisitRecord[];
  healthNotes: HealthNoteRecord[];
  insuranceRecords: InsuranceRecord[];
  hydrateHealth: (dbUserId: string) => Promise<void>;
  addVaccination: (values: Omit<VaccinationRecord, "id">) => void;
  updateVaccination: (vaccinationId: string, values: Partial<Omit<VaccinationRecord, "id" | "petId">>) => void;
  removeVaccination: (vaccinationId: string) => void;
  addMedication: (values: Omit<MedicationRecord, "id">) => void;
  updateMedication: (medicationId: string, values: Partial<Omit<MedicationRecord, "id" | "petId">>) => void;
  removeMedication: (medicationId: string) => void;
  addVetVisit: (values: Omit<VetVisitRecord, "id">) => void;
  updateVetVisit: (visitId: string, values: Partial<Omit<VetVisitRecord, "id" | "petId">>) => void;
  removeVetVisit: (visitId: string) => void;
  addInsuranceRecord: (values: Omit<InsuranceRecord, "id">) => void;
  addHealthNote: (values: Omit<HealthNoteRecord, "id">) => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  vaccinations: [],
  medications: [],
  vetVisits: [],
  healthNotes: [],
  insuranceRecords: [],
  hydrateHealth: async (dbUserId) => {
    const data = await listHealthDataForUser(dbUserId);

    set({
      vaccinations: data.vaccinations.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        vaccineName: row.vaccine_name,
        administeredOn: row.administered_on,
        validUntil: row.valid_until ?? undefined,
        clinicName: row.clinic_name ?? undefined,
        notes: row.notes ?? undefined,
      })),
      medications: data.medications.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        medicationName: row.medication_name,
        dosage: row.dosage ?? undefined,
        instructions: row.instructions ?? undefined,
        startDate: row.start_date ?? undefined,
        endDate: row.end_date ?? undefined,
        status: row.status,
        notes: row.notes ?? undefined,
      })),
      vetVisits: data.vetVisits.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        visitDate: row.visit_date,
        clinicName: row.clinic_name ?? undefined,
        veterinarianName: row.veterinarian_name ?? undefined,
        reason: row.reason ?? undefined,
        summary: row.summary ?? undefined,
        followUpDate: row.follow_up_date ?? undefined,
      })),
      healthNotes: data.healthNotes.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        type: row.type,
        title: row.title,
        content: row.content,
      })),
      insuranceRecords: [],
    });
  },
  addVaccination: (values) => {
    const nextItem: VaccinationRecord = { id: crypto.randomUUID(), ...values };
    set((state) => ({
      vaccinations: [nextItem, ...state.vaccinations],
    }));
    void saveVaccinationToDb(nextItem);
  },
  updateVaccination: (vaccinationId, values) => {
    let nextItem: VaccinationRecord | undefined;
    set((state) => ({
      vaccinations: state.vaccinations.map((item) => {
        if (item.id !== vaccinationId) return item;
        nextItem = { ...item, ...values };
        return nextItem;
      }),
    }));
    if (nextItem) void saveVaccinationToDb(nextItem);
  },
  removeVaccination: (vaccinationId) => {
    set((state) => ({
      vaccinations: state.vaccinations.filter((item) => item.id !== vaccinationId),
    }));
    void deleteVaccinationById(vaccinationId);
  },
  addMedication: (values) => {
    const nextItem: MedicationRecord = { id: crypto.randomUUID(), ...values };
    set((state) => ({
      medications: [nextItem, ...state.medications],
    }));
    void saveMedicationToDb(nextItem);
  },
  updateMedication: (medicationId, values) => {
    let nextItem: MedicationRecord | undefined;
    set((state) => ({
      medications: state.medications.map((item) => {
        if (item.id !== medicationId) return item;
        nextItem = { ...item, ...values };
        return nextItem;
      }),
    }));
    if (nextItem) void saveMedicationToDb(nextItem);
  },
  removeMedication: (medicationId) => {
    set((state) => ({
      medications: state.medications.filter((item) => item.id !== medicationId),
    }));
    void deleteMedicationById(medicationId);
  },
  addVetVisit: (values) => {
    const nextItem: VetVisitRecord = { id: crypto.randomUUID(), ...values };
    set((state) => ({
      vetVisits: [nextItem, ...state.vetVisits],
    }));
    void saveVetVisitToDb(nextItem);
  },
  updateVetVisit: (visitId, values) => {
    let nextItem: VetVisitRecord | undefined;
    set((state) => ({
      vetVisits: state.vetVisits.map((item) => {
        if (item.id !== visitId) return item;
        nextItem = { ...item, ...values };
        return nextItem;
      }),
    }));
    if (nextItem) void saveVetVisitToDb(nextItem);
  },
  removeVetVisit: (visitId) => {
    set((state) => ({
      vetVisits: state.vetVisits.filter((item) => item.id !== visitId),
    }));
    void deleteVetVisitById(visitId);
  },
  addInsuranceRecord: (values) =>
    set((state) => ({
      insuranceRecords: [
        {
          id: `ins-${Date.now()}`,
          ...values,
        },
        ...state.insuranceRecords,
      ],
    })),
  addHealthNote: (values) => {
    const nextItem: HealthNoteRecord = { id: crypto.randomUUID(), ...values };
    set((state) => ({
      healthNotes: [nextItem, ...state.healthNotes],
    }));
    void saveHealthNoteToDb(nextItem);
  },
}));
