import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

import { hasSupabaseEnv } from "../lib/env";
import { ensureUserProfile, getDbClient } from "../lib/db";
import { AuthFormValues, AuthMode, SessionUser } from "../types/auth";
import { useAppStore } from "./appStore";
import { usePetStore } from "./petStore";
import { useProfileStore } from "./profileStore";

interface AuthState {
  authMode: AuthMode;
  sessionUser: SessionUser | null;
  isAuthReady: boolean;
  onboardingCompleted: boolean;
  kennelName: string | null;
  breederBio: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  initializeAuth: () => Promise<void>;
  setAuthMode: (mode: AuthMode) => void;
  clearError: () => void;
  signInMock: (values: Pick<AuthFormValues, "email" | "password">) => Promise<void>;
  signUpMock: (values: AuthFormValues) => Promise<void>;
  requestPasswordResetMock: (email: string) => Promise<void>;
  completeOnboarding: (values: { roleProfile: SessionUser["roleProfile"]; kennelName?: string; breederBio?: string }) => void;
  setMockSessionRole: (roleProfile: SessionUser["roleProfile"]) => void;
  signOut: () => Promise<void>;
}

async function buildSessionUser(user: User) {
  const profile = await ensureUserProfile({
    authUserId: user.id,
    email: user.email ?? "",
    displayName: (user.user_metadata?.display_name as string | undefined) ?? undefined,
    roleProfile: (user.user_metadata?.role_profile as SessionUser["roleProfile"] | undefined) ?? "owner",
  });

  const dbUserId = profile?.id ?? (user.user_metadata?.db_user_id as string | undefined) ?? undefined;

  return {
    sessionUser: {
      id: user.id,
      dbUserId,
      displayName: (user.user_metadata?.display_name as string | undefined) ?? profile?.display_name ?? user.email ?? "Käyttäjä",
      email: user.email ?? "",
      roleProfile: (user.user_metadata?.role_profile as SessionUser["roleProfile"] | undefined) ?? profile?.role_profile ?? "owner",
    } satisfies SessionUser,
    onboardingCompleted: Boolean(user.user_metadata?.onboarding_completed),
    kennelName: (user.user_metadata?.kennel_name as string | undefined) ?? null,
    breederBio: (user.user_metadata?.breeder_bio as string | undefined) ?? null,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  authMode: "sign-in",
  sessionUser: null,
  isAuthReady: false,
  onboardingCompleted: false,
  kennelName: null,
  breederBio: null,
  isLoading: false,
  errorMessage: null,
  initializeAuth: async () => {
    if (!hasSupabaseEnv()) {
      set({
        isAuthReady: true,
        sessionUser: null,
        onboardingCompleted: false,
      });
      return;
    }

    const client = getDbClient();

    if (!client) {
      set({
        isAuthReady: true,
        errorMessage: "Supabase-yhteyttä ei voitu alustaa.",
      });
      return;
    }

    const {
      data: { session },
    } = await client.auth.getSession();

    if (session?.user) {
      const nextSession = await buildSessionUser(session.user);
      set({
        ...nextSession,
        isAuthReady: true,
        errorMessage: null,
      });
    } else {
      set({
        sessionUser: null,
        onboardingCompleted: false,
        kennelName: null,
        breederBio: null,
        isAuthReady: true,
        errorMessage: null,
      });
    }

    client.auth.onAuthStateChange((_event, nextSession: Session | null) => {
      if (!nextSession?.user) {
        usePetStore.getState().clearPets();
        useAppStore.getState().resetAppState();
        useProfileStore.getState().resetProfile();

        set({
          sessionUser: null,
          onboardingCompleted: false,
          kennelName: null,
          breederBio: null,
          isAuthReady: true,
          errorMessage: null,
          isLoading: false,
        });
        return;
      }

      void (async () => {
        const mapped = await buildSessionUser(nextSession.user);
        set({
          ...mapped,
          isAuthReady: true,
          errorMessage: null,
          isLoading: false,
        });
      })();
    });
  },
  setAuthMode: (authMode) => set({ authMode, errorMessage: null }),
  clearError: () => set({ errorMessage: null }),
  signInMock: async ({ email, password }) => {
    set({ isLoading: true, errorMessage: null });

    try {
      if (!hasSupabaseEnv()) {
        set({
          isLoading: false,
          errorMessage: "Kirjautuminen vaatii Supabase-yhteyden. Lisää ympäristömuuttujat ennen käyttöä.",
        });
        return;
      }

      const client = getDbClient();

      if (!client) {
        set({ isLoading: false, errorMessage: "Supabase-yhteyttä ei voitu alustaa." });
        return;
      }

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false, errorMessage: error.message });
        return;
      }

      if (data.user) {
        const mapped = await buildSessionUser(data.user);
        usePetStore.getState().clearPets();

        set({
          ...mapped,
          authMode: "sign-in",
          errorMessage: null,
          isLoading: false,
        });
        return;
      }

      set({
        isLoading: false,
        errorMessage: "Kirjautuminen ei palauttanut käyttäjää. Tarkista tunnus ja salasana.",
      });
    } catch (error) {
      set({
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : "Kirjautuminen epäonnistui.",
      });
    }
  },
  signUpMock: async ({ displayName, email, password, roleProfile }) => {
    set({ isLoading: true, errorMessage: null });

    try {
      if (!hasSupabaseEnv()) {
        set({
          isLoading: false,
          errorMessage: "Tilin luonti vaatii Supabase-yhteyden. Lisää ympäristömuuttujat ennen käyttöä.",
        });
        return;
      }

      const client = getDbClient();

      if (!client) {
        set({ isLoading: false, errorMessage: "Supabase-yhteyttä ei voitu alustaa." });
        return;
      }

      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role_profile: roleProfile,
            onboarding_completed: false,
          },
        },
      });

      if (error) {
        set({ isLoading: false, errorMessage: error.message });
        return;
      }

      if (data.user) {
        const mapped = await buildSessionUser(data.user);
        set({
          ...mapped,
          onboardingCompleted: false,
          authMode: "sign-in",
          errorMessage: data.session ? null : "Tili luotiin. Tarkista sähköpostisi ja vahvista osoite ennen kirjautumista.",
          isLoading: false,
        });
        return;
      }

      set({
        isLoading: false,
        errorMessage: "Tilin luonti ei palauttanut käyttäjää. Tarkista Auth-asetukset Supabasessa.",
      });
    } catch (error) {
      set({
        isLoading: false,
        errorMessage:
          error instanceof Error
            ? `Tilin luonti epäonnistui: ${error.message}`
            : "Tilin luonti epäonnistui.",
      });
    }
  },
  requestPasswordResetMock: async (email) => {
    set({ isLoading: true, errorMessage: null });

    if (!hasSupabaseEnv()) {
      set({
        isLoading: false,
        errorMessage: "Salasanan palautus vaatii Supabase-yhteyden. Lisää ympäristömuuttujat ennen käyttöä.",
      });
      return;
    }

    const client = getDbClient();

    if (!client) {
      set({ isLoading: false, errorMessage: "Supabase-yhteyttä ei voitu alustaa." });
      return;
    }

    const { error } = await client.auth.resetPasswordForEmail(email);

    if (error) {
      set({ isLoading: false, errorMessage: error.message });
      return;
    }

    set({
      errorMessage: `Palautuslinkki lähetettiin osoitteeseen ${email}.`,
      authMode: "reset-password",
      isLoading: false,
    });
  },
  completeOnboarding: ({ roleProfile, kennelName, breederBio }) => {
    const sessionUser = useAuthStore.getState().sessionUser;
    const client = getDbClient();

    if (client && sessionUser) {
      void client.auth.updateUser({
        data: {
          role_profile: roleProfile,
          onboarding_completed: true,
          kennel_name: kennelName || null,
          breeder_bio: breederBio || null,
        },
      });
    }

    set((state) => ({
      sessionUser: state.sessionUser
        ? {
            ...state.sessionUser,
            roleProfile,
          }
        : null,
      onboardingCompleted: true,
      kennelName: kennelName || null,
      breederBio: breederBio || null,
      errorMessage: null,
    }));
  },
  setMockSessionRole: (roleProfile) =>
    set((state) => ({
      sessionUser: state.sessionUser
        ? {
            ...state.sessionUser,
            roleProfile,
          }
        : state.sessionUser,
      kennelName: roleProfile === "breeder" ? state.kennelName ?? "Mock Kennel" : null,
      breederBio:
        roleProfile === "breeder"
          ? state.breederBio ?? "Mock-breeder profiili testausta varten."
          : null,
    })),
  signOut: async () => {
    const client = getDbClient();
    if (client) {
      await client.auth.signOut();
    }

    useAppStore.getState().resetAppState();
    usePetStore.getState().clearPets();

    set({
      sessionUser: null,
      onboardingCompleted: false,
      kennelName: null,
      breederBio: null,
      authMode: "sign-in",
      errorMessage: null,
      isLoading: false,
    });
  },
}));
