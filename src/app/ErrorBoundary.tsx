import { Component, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton, Card, Screen } from "../components/ui";
import { colors, spacing, typography } from "../theme/tokens";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Tassulokero boundary caught an error:", error);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Screen>
          <Card>
            <View style={styles.stack}>
              <Text style={styles.eyebrow}>Virhetilanne</Text>
              <Text style={styles.title}>Jokin meni pieleen tässä näkymässä</Text>
              <Text style={styles.body}>
                Appi kaatui odottamattomaan virheeseen. Voit yrittää ladata näkymän uudelleen tällä painikkeella.
              </Text>
              <AppButton label="Yrita uudelleen" onPress={this.handleReset} />
            </View>
          </Card>
        </Screen>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing[3],
  },
  eyebrow: {
    color: colors.danger,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  body: {
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: typography.size.md,
  },
});
