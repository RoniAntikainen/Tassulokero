import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const { width } = useWindowDimensions();
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const viewerRole = useAppStore((state) => state.viewerRole);
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const signOut = useAuthStore((state) => state.signOut);
  const hydrateBreederData = useBreederStore((state) => state.hydrateBreederData);
  const hydrateCare = useCareStore((state) => state.hydrateCare);
  const hydrateHealth = useHealthStore((state) => state.hydrateHealth);
  const hydrateMedia = useMediaStore((state) => state.hydrateMedia);
  const hydratePets = usePetStore((state) => state.hydratePets);
  const pets = usePetStore((state) => state.pets);
  const hydrateReminders = useReminderStore((state) => state.hydrateReminders);
  const reminders = useReminderStore((state) => state.reminders);
  const hydrateAccesses = useSharingStore((state) => state.hydrateAccesses);
  const hydrateUpdates = useUpdateStore((state) => state.hydrateUpdates);
  const hydrateProfile = useProfileStore((state) => state.hydrateProfile);
  const headerName = sessionUser?.displayName ?? "Käyttäjä";
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

  const firstName = headerName.split(" ")[0];
  const compactTabBar = width < 440;
  const compactHeader = width < 560;
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingReminders = reminders.filter((item) => item.status === "pending").length;
  const headerContextLabel = getHeaderContextLabel(activeTab);
  const selectedPetName = activeTab === "pets" ? pets.find((pet) => pet.id === selectedPetId)?.name ?? pets[0]?.name : undefined;
  const headerStatusText = getHeaderStatusText({
    activeTab,
    firstName,
    petsCount: pets.length,
    pendingReminders,
    selectedPetName,
    viewerRole,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, compactHeader && styles.headerCompact]}>
        <View style={styles.headerMainRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Tassulokero</Text>
            <Text style={styles.title}>{headerContextLabel}</Text>
            <Text style={styles.subtitle}>{headerStatusText}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.avatar} onPress={() => setMenuOpen(true)}>
              <Text style={styles.avatarText}>{headerName.slice(0, 1)}</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.headerMetaRow, compactHeader && styles.headerMetaRowCompact]}>
          <View style={styles.headerStat}>
            <Ionicons name="paw-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.headerStatText}>{pets.length} lemmikkiä</Text>
          </View>
          <Pressable style={styles.headerStat} onPress={() => setActiveTab("reminders")}>
            <Ionicons name="notifications-outline" size={15} color={pendingReminders ? colors.brandPrimaryHover : colors.textSecondary} />
            <Text style={[styles.headerStatText, pendingReminders ? styles.headerStatTextActive : undefined]}>
              {formatReminderCountLabel(pendingReminders)}
            </Text>
          </Pressable>
        </View>
      </View>
      <Modal visible={menuOpen} transparent animationType="none" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.menuSheet} onPress={() => undefined}>
            <Text style={styles.menuTitle}>Valikko</Text>
            <MenuItem
              icon="home-outline"
              label="Koti"
              onPress={() => {
                setActiveTab("home");
                setMenuOpen(false);
              }}
            />
            <MenuItem
              icon="paw-outline"
              label="Lemmikit"
              onPress={() => {
                setActiveTab("pets");
                setMenuOpen(false);
              }}
            />
            <MenuItem
              icon="notifications-outline"
              label="Muistutukset"
              onPress={() => {
                setActiveTab("reminders");
                setMenuOpen(false);
              }}
            />
            <MenuItem
              icon="person-circle-outline"
              label="Profiili ja asetukset"
              onPress={() => {
                setActiveTab("profile");
                setMenuOpen(false);
              }}
            />
            <MenuItem
              icon="settings-outline"
              label="Tiliasetukset"
              onPress={() => {
                setActiveTab("profile");
                setMenuOpen(false);
              }}
            />
            <MenuItem
              icon="log-out-outline"
              label="Kirjaudu ulos"
              danger
              onPress={() => {
                setMenuOpen(false);
                void signOut();
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
          tabBar={(props) => <AppTabBar {...props} compact={compactTabBar} />}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            sceneStyle: styles.scene,
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

function MenuItem({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.textPrimary} />
        <Text style={[styles.menuItemText, danger && styles.menuItemTextDanger]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

function getHeaderContextLabel(tab: TabKey) {
  if (tab === "home") return "Yleisnäkymä";
  if (tab === "pets") return "Lemmikit";
  if (tab === "reminders") return "Muistutukset";
  return "Oma profiili";
}

function getHeaderStatusText({
  activeTab,
  firstName,
  petsCount,
  pendingReminders,
  selectedPetName,
  viewerRole,
}: {
  activeTab: TabKey;
  firstName: string;
  petsCount: number;
  pendingReminders: number;
  selectedPetName?: string;
  viewerRole: ReturnType<typeof useAppStore.getState>["viewerRole"];
}) {
  if (activeTab === "home") {
    return `Hei, ${firstName}. ${pendingReminders} avointa muistutusta.`;
  }

  if (activeTab === "pets") {
    return selectedPetName ? `Valittuna ${selectedPetName}. ${petsCount} lemmikkiä yhteensä.` : `${petsCount} lemmikkiä yhteensä.`;
  }

  if (activeTab === "reminders") {
    return `${pendingReminders} avointa muistutusta juuri nyt.`;
  }

  if (viewerRole === "breeder") {
    return "Hallitse profiilia, ilmoituksia ja tiliasetuksia.";
  }

  return "Hallitse profiilia, ilmoituksia ja asetuksia.";
}

function formatReminderCountLabel(count: number) {
  if (count === 1) {
    return "1 muistutus";
  }

  return `${count} muistutusta`;
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

function AppTabBar({
  state,
  descriptors,
  navigation,
  compact,
}: BottomTabBarProps & { compact: boolean }) {
  return (
    <View style={[styles.tabBar, compact && styles.tabBarCompact]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const color = focused ? colors.brandPrimaryHover : colors.textSecondary;
        const label =
          descriptors[route.key].options.tabBarAccessibilityLabel ??
          descriptors[route.key].options.title ??
          route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={label}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarButton}
          >
            <View style={[styles.tabPill, compact && styles.tabPillCompact]}>
              <View style={styles.tabIconWrap}>
                <TabIcon routeKey={route.name as TabKey} color={color} size={27} />
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
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
    gap: spacing[3],
    backgroundColor: colors.bgSubtle,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  headerCompact: {
    paddingHorizontal: spacing[4],
  },
  headerMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCopy: {
    gap: spacing[1],
    flex: 1,
  },
  headerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  headerMetaRowCompact: {
    gap: spacing[1],
  },
  scene: {
    backgroundColor: colors.bgSubtle,
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgElevated,
    height: 64,
    paddingTop: spacing[1],
    paddingBottom: spacing[1],
    paddingHorizontal: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
  },
  tabBarCompact: {
    height: 58,
    paddingHorizontal: spacing[1],
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabPill: {
    width: "100%",
    minWidth: 0,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[1],
  },
  tabPillCompact: {
    height: 36,
  },
  tabIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: typography.size.sm,
    color: colors.brandPrimaryHover,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  headerStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing[3],
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  headerStatText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  headerStatTextActive: {
    color: colors.brandPrimaryHover,
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
  menuOverlay: {
    flex: 1,
    backgroundColor: colors.overlayScrimSoft,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 86,
    paddingRight: spacing[4],
    paddingLeft: spacing[4],
  },
  menuSheet: {
    width: 280,
    maxWidth: "100%",
    backgroundColor: colors.surfaceRaised,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[3],
    gap: spacing[1],
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  menuTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    paddingHorizontal: spacing[2],
    paddingTop: spacing[1],
    paddingBottom: spacing[2],
  },
  menuItem: {
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  menuItemText: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  menuItemTextDanger: {
    color: colors.danger,
  },
});
