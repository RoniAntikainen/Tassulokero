import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { currentUser } from "../data/mockData";
import { useAuthStore } from "../state/authStore";
import { useBreederStore } from "../state/breederStore";
import { useHealthStore } from "../state/healthStore";
import { usePetStore } from "../state/petStore";
import { useReminderStore } from "../state/reminderStore";
import { useSharingStore } from "../state/sharingStore";
import { useCareStore } from "../state/careStore";
import { useMediaStore } from "../state/mediaStore";
import { useUpdateStore } from "../state/updateStore";
import { colors, spacing, typography } from "../theme/tokens";
import { TabKey } from "../types/domain";
import { HomeScreen } from "./screens/HomeScreen";
import { PetsScreen } from "./screens/PetsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { RemindersScreen } from "./screens/RemindersScreen";
import { useAppStore } from "../state/appStore";
import { useProfileStore } from "../state/profileStore";
type RootTabParamList = {
  home: undefined;
  pets: undefined;
  reminders: undefined;
  profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabTitles: Record<TabKey, string> = {
  home: "Koti",
  pets: "Lemmikit",
  reminders: "Muistutukset",
  profile: "Profiili",
};

export function AppShell() {
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const hydrateBreederData = useBreederStore((state) => state.hydrateBreederData);
  const hydrateCare = useCareStore((state) => state.hydrateCare);
  const hydrateHealth = useHealthStore((state) => state.hydrateHealth);
  const hydrateMedia = useMediaStore((state) => state.hydrateMedia);
  const hydratePets = usePetStore((state) => state.hydratePets);
  const hydrateReminders = useReminderStore((state) => state.hydrateReminders);
  const hydrateAccesses = useSharingStore((state) => state.hydrateAccesses);
  const hydrateUpdates = useUpdateStore((state) => state.hydrateUpdates);
  const hydrateProfile = useProfileStore((state) => state.hydrateProfile);
  const headerName = sessionUser?.displayName ?? currentUser.displayName;
  const navigationRef = useNavigationContainerRef<RootTabParamList>();

  useEffect(() => {
    if (!navigationRef.isReady()) {
      return;
    }

    const currentRoute = navigationRef.getCurrentRoute()?.name as TabKey | undefined;
    if (activeTab !== currentRoute) {
      navigationRef.navigate(activeTab);
    }
  }, [activeTab, navigationRef]);

  useEffect(() => {
    if (!sessionUser?.dbUserId) {
      return;
    }

    void hydratePets(sessionUser.dbUserId);
    void hydrateCare(sessionUser.dbUserId);
    void hydrateBreederData(sessionUser.dbUserId);
    void hydrateHealth(sessionUser.dbUserId);
    void hydrateMedia(sessionUser.dbUserId);
    void hydrateReminders(sessionUser.dbUserId);
    void hydrateAccesses(sessionUser.dbUserId);
    void hydrateUpdates(sessionUser.dbUserId);
    void hydrateProfile(sessionUser.dbUserId, { displayName: sessionUser.displayName });
  }, [
    hydrateAccesses,
    hydrateBreederData,
    hydrateCare,
    hydrateHealth,
    hydrateMedia,
    hydratePets,
    hydrateProfile,
    hydrateReminders,
    hydrateUpdates,
    sessionUser?.dbUserId,
    sessionUser?.displayName,
  ]);

  const headerActionLabel = useMemo(() => tabTitles[activeTab], [activeTab]);
  const firstName = headerName.split(" ")[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Tassulokero</Text>
          <Text style={styles.title}>Hei, {firstName}</Text>
          <Text style={styles.subtitle}>{tabTitles[activeTab]}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{headerActionLabel}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{headerName.slice(0, 1)}</Text>
          </View>
        </View>
      </View>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          const routeName = navigationRef.getCurrentRoute()?.name as TabKey | undefined;
          if (routeName && routeName !== activeTab) {
            setActiveTab(routeName);
          }
        }}
      >
        <Tab.Navigator
          initialRouteName={activeTab}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.brandPrimaryHover,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: styles.tabBar,
            tabBarShowLabel: false,
            tabBarItemStyle: styles.tabBarItem,
            sceneStyle: styles.scene,
            tabBarIcon: ({ focused, color, size }) => {
              return (
                <View style={[styles.tabPill, focused ? styles.tabPillActive : styles.tabPillInactive]}>
                  <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
                    <TabIcon routeKey={route.name as TabKey} color={color} size={size - 1} />
                  </View>
                  <Text style={[styles.tabPillLabel, focused ? styles.tabPillLabelActive : styles.tabPillLabelInactive]}>
                    {tabTitles[route.name as TabKey]}
                  </Text>
                </View>
              );
            },
          })}
        >
          <Tab.Screen name="home" options={{ title: "Koti" }}>
            {() => <HomeScreen />}
          </Tab.Screen>
          <Tab.Screen name="pets" options={{ title: "Eläimet" }}>
            {() => <PetsScreen />}
          </Tab.Screen>
          <Tab.Screen name="reminders" options={{ title: "Muistutukset" }}>
            {() => <RemindersScreen />}
          </Tab.Screen>
          <Tab.Screen name="profile" options={{ title: "Profiili" }}>
            {() => <ProfileScreen />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

function TabIcon({
  routeKey,
  color,
  size,
}: {
  routeKey: TabKey;
  color: string;
  size: number;
}) {
  const iconName: Record<TabKey, React.ComponentProps<typeof Ionicons>["name"]> = {
    home: "home-outline",
    pets: "paw-outline",
    reminders: "notifications-outline",
    profile: "person-circle-outline",
  };

  return <Ionicons name={iconName[routeKey]} size={size} color={color} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgSubtle,
  },
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F6F7F4",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  headerCopy: {
    gap: spacing[1],
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  scene: {
    backgroundColor: colors.bgSubtle,
  },
  tabBar: {
    position: "absolute",
    left: spacing[5],
    right: spacing[5],
    bottom: spacing[4],
    borderTopColor: "transparent",
    backgroundColor: "rgba(255,255,255,0.98)",
    height: 82,
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(16, 24, 40, 0.07)",
    shadowColor: "#101828",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  tabBarItem: {
    borderRadius: 24,
    marginHorizontal: 1,
    paddingTop: 0,
  },
  tabPill: {
    minWidth: 74,
    height: 50,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    transform: [{ scale: 1 }],
  },
  tabPillActive: {
    backgroundColor: colors.brandPrimarySoft,
    borderWidth: 1,
    borderColor: "rgba(127, 168, 131, 0.18)",
  },
  tabPillInactive: {
    backgroundColor: "transparent",
  },
  tabIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconWrapActive: {
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  tabPillLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.1,
  },
  tabPillLabelActive: {
    color: colors.brandPrimaryHover,
  },
  tabPillLabelInactive: {
    color: colors.textSecondary,
  },
  eyebrow: {
    fontSize: typography.size.sm,
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  headerBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 999,
    backgroundColor: colors.brandSecondarySoft,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  headerBadgeText: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brandPrimarySoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  avatarText: {
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.md,
  },
});
