import "react-native-gesture-handler";

import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "./src/app/ErrorBoundary";
import { AuthGate } from "./src/app/auth/AuthGate";
import { saveDevicePushToken } from "./src/lib/db";
import { configureNotifications, getDevicePushTokenSnapshot, requestPushPermissions } from "./src/lib/notifications";
import { useAuthStore } from "./src/state/authStore";
import { useProfileStore } from "./src/state/profileStore";

const queryClient = new QueryClient();

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const pushEnabled = useProfileStore((state) => state.notificationSettings.pushEnabled);

  useEffect(() => {
    configureNotifications();
    void requestPushPermissions();
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const userId = sessionUser?.dbUserId;

    if (!userId || !pushEnabled) {
      return;
    }

    void (async () => {
      const token = await getDevicePushTokenSnapshot();

      if (!token) {
        return;
      }

      await saveDevicePushToken({
        userId,
        token: token.token,
        tokenType: token.tokenType,
        deviceName: token.deviceName,
        deviceOs: token.deviceOs,
      });
    })();
  }, [pushEnabled, sessionUser?.dbUserId]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <StatusBar style="dark" />
          <AuthGate />
        </ErrorBoundary>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
