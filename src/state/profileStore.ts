import { create } from "zustand";

import { getUserProfileById, updateUserProfile as updateUserProfileInDb } from "../lib/db";

interface ProfileSettings {
  displayName: string;
  bio: string;
}

interface NotificationSettings {
  pushEnabled: boolean;
  reminderPushEnabled: boolean;
  updatePushEnabled: boolean;
  marketingPushEnabled: boolean;
}

interface ProfileState {
  profile: ProfileSettings;
  notificationSettings: NotificationSettings;
  hydrateProfile: (dbUserId: string, fallback: { displayName?: string }) => Promise<void>;
  resetProfile: () => void;
  updateProfile: (values: Partial<ProfileSettings>) => Promise<void>;
  updateNotificationSettings: (values: Partial<NotificationSettings>) => Promise<void>;
}

const defaultProfile: ProfileSettings = {
  displayName: "Käyttäjä",
  bio: "",
};

const defaultNotificationSettings: NotificationSettings = {
  pushEnabled: true,
  reminderPushEnabled: true,
  updatePushEnabled: true,
  marketingPushEnabled: false,
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile,
  notificationSettings: defaultNotificationSettings,
  hydrateProfile: async (dbUserId, fallback) => {
    const row = await getUserProfileById(dbUserId);

    set({
      profile: {
        displayName: row?.display_name ?? fallback.displayName ?? defaultProfile.displayName,
        bio: row?.bio ?? "",
      },
      notificationSettings: {
        pushEnabled: row?.push_enabled ?? defaultNotificationSettings.pushEnabled,
        reminderPushEnabled: row?.reminder_push_enabled ?? defaultNotificationSettings.reminderPushEnabled,
        updatePushEnabled: row?.update_push_enabled ?? defaultNotificationSettings.updatePushEnabled,
        marketingPushEnabled: row?.marketing_push_enabled ?? defaultNotificationSettings.marketingPushEnabled,
      },
    });
  },
  resetProfile: () =>
    set({
      profile: defaultProfile,
      notificationSettings: defaultNotificationSettings,
    }),
  updateProfile: async (values) => {
    const previous = get().profile;
    const nextProfile = {
      ...previous,
      ...values,
    };

    set({ profile: nextProfile });

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string } | null;
    if (!sessionUser?.dbUserId) {
      return;
    }

    await updateUserProfileInDb({
      id: sessionUser.dbUserId,
      displayName: nextProfile.displayName,
      bio: nextProfile.bio,
    });
  },
  updateNotificationSettings: async (values) => {
    const previous = get().notificationSettings;
    const nextSettings = {
      ...previous,
      ...values,
    };

    set({ notificationSettings: nextSettings });

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string } | null;
    if (!sessionUser?.dbUserId) {
      return;
    }

    await updateUserProfileInDb({
      id: sessionUser.dbUserId,
      pushEnabled: nextSettings.pushEnabled,
      reminderPushEnabled: nextSettings.reminderPushEnabled,
      updatePushEnabled: nextSettings.updatePushEnabled,
      marketingPushEnabled: nextSettings.marketingPushEnabled,
    });
  },
}));
