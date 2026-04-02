import { create } from "zustand";

import { PetSection, TabKey, UserRole } from "../types/domain";

interface AppState {
  activeTab: TabKey;
  pendingAddSection: "pet" | "health" | "care" | "reminders" | "updates" | null;
  pendingReminderDetailId: string | null;
  pendingPetEditorId: string | null;
  pendingPetDetailOpen: boolean;
  selectedPetId: string;
  selectedPetSection: PetSection;
  viewerRole: UserRole | "breeder";
  flashMessage: string | null;
  setActiveTab: (tab: TabKey) => void;
  setPendingAddSection: (section: "pet" | "health" | "care" | "reminders" | "updates" | null) => void;
  setPendingReminderDetailId: (reminderId: string | null) => void;
  setPendingPetEditorId: (petId: string | null) => void;
  setPendingPetDetailOpen: (value: boolean) => void;
  setSelectedPetId: (petId: string) => void;
  setSelectedPetSection: (section: PetSection) => void;
  setViewerRole: (role: UserRole | "breeder") => void;
  setFlashMessage: (message: string | null) => void;
  resetAppState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "home",
  pendingAddSection: null,
  pendingReminderDetailId: null,
  pendingPetEditorId: null,
  pendingPetDetailOpen: false,
  selectedPetId: "",
  selectedPetSection: "overview",
  viewerRole: "owner",
  flashMessage: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  setPendingAddSection: (pendingAddSection) => set({ pendingAddSection }),
  setPendingReminderDetailId: (pendingReminderDetailId) => set({ pendingReminderDetailId }),
  setPendingPetEditorId: (pendingPetEditorId) => set({ pendingPetEditorId }),
  setPendingPetDetailOpen: (pendingPetDetailOpen) => set({ pendingPetDetailOpen }),
  setSelectedPetId: (selectedPetId) =>
    set({
      selectedPetId,
      selectedPetSection: "overview",
    }),
  setSelectedPetSection: (selectedPetSection) => set({ selectedPetSection }),
  setViewerRole: (viewerRole) => set({ viewerRole }),
  setFlashMessage: (flashMessage) => set({ flashMessage }),
  resetAppState: () =>
    set({
      activeTab: "home",
      pendingAddSection: null,
      pendingReminderDetailId: null,
      pendingPetEditorId: null,
      pendingPetDetailOpen: false,
      selectedPetId: "",
      selectedPetSection: "overview",
      viewerRole: "owner",
      flashMessage: null,
    }),
}));
