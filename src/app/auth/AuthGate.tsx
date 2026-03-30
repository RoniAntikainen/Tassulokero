import { LoadingState, Screen } from "../../components/ui";
import { useAuthStore } from "../../state/authStore";
import { AppShell } from "../AppShell";
import { AuthScreen } from "./AuthScreen";
import { OnboardingScreen } from "../onboarding/OnboardingScreen";

export function AuthGate() {
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const onboardingCompleted = useAuthStore((state) => state.onboardingCompleted);

  if (!isAuthReady) {
    return (
      <Screen>
        <LoadingState title="Tarkistetaan tiliä" message="Palautetaan aiempi sessio turvallisesti." />
      </Screen>
    );
  }

  if (!sessionUser) {
    return <AuthScreen />;
  }

  if (!onboardingCompleted) {
    return <OnboardingScreen />;
  }

  return <AppShell />;
}
