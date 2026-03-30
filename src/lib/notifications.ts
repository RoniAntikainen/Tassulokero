import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function configureNotifications() {
  if (Platform.OS === "android") {
    void Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function requestPushPermissions() {
  if (Platform.OS === "web" || !Device.isDevice) {
    return {
      granted: false,
      reason: Platform.OS === "web" ? "web_unsupported" : "simulator_unsupported",
    } as const;
  }

  const existing = await Notifications.getPermissionsAsync();
  let finalStatus = existing.status;

  if (finalStatus !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  return {
    granted: finalStatus === "granted",
    reason: finalStatus === "granted" ? "granted" : "denied",
  } as const;
}

export async function getPushPermissionSnapshot() {
  if (Platform.OS === "web" || !Device.isDevice) {
    return {
      granted: false,
      reason: Platform.OS === "web" ? "web_unsupported" : "simulator_unsupported",
    } as const;
  }

  const permissions = await Notifications.getPermissionsAsync();
  return {
    granted: permissions.status === "granted",
    reason: permissions.status === "granted" ? "granted" : "denied",
  } as const;
}

export async function getDevicePushTokenSnapshot() {
  if (Platform.OS === "web" || !Device.isDevice) {
    return null;
  }

  const token = await Notifications.getDevicePushTokenAsync();

  return {
    token: typeof token.data === "string" ? token.data : JSON.stringify(token.data),
    tokenType: token.type,
    deviceName: Device.deviceName ?? undefined,
    deviceOs: Platform.OS,
  } as const;
}
