import { create } from "zustand";

import { PetSection, TabKey, UserRole } from "../types/domain";

interface AppState {
  activeTab: TabKey;
  pendingAddSection: "pet" | "health" | "care" | "reminders" | "updates" | null;
  pendingPetEditorId: string | null;
  selectedPetId: string;
  selectedPetSection: PetSection;
  viewerRole: UserRole | "breeder";
  flashMessage: string | null;
  setActiveTab: (tab: TabKey) => void;
  setPendingAddSection: (section: "pet" | "health" | "care" | "reminders" | "updates" | null) => void;
  setPendingPetEditorId: (petId: string | null) => void;
  setSelectedPetId: (petId: string) => void;
  setSelectedPetSection: (section: PetSection) => void;
  setViewerRole: (role: UserRole | "breeder") => void;
  setFlashMessage: (message: string | null) => void;
  resetAppState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "home",
  pendingAddSection: null,
  pendingPetEditorId: null,
  selectedPetId: "",
  selectedPetSection: "overview",
  viewerRole: "owner",
  flashMessage: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  setPendingAddSection: (pendingAddSection) => set({ pendingAddSection }),
  setPendingPetEditorId: (pendingPetEditorId) => set({ pendingPetEditorId }),
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
      pendingPetEditorId: null,
      selectedPetId: "",
      selectedPetSection: "overview",
      viewerRole: "owner",
      flashMessage: null,
    }),
}));
