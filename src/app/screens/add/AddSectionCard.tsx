import { ReactNode } from "react";
import { Text, View } from "react-native";

import { Card, InlineMessage } from "../../../components/ui";
import { styles } from "./styles";

export function AddSectionCard({
  title,
  allowed = true,
  deniedMessage,
  children,
}: {
  title: string;
  allowed?: boolean;
  deniedMessage?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <Text style={styles.formTitle}>{title}</Text>
      {allowed ? (
        <View style={styles.form}>{children}</View>
      ) : (
        <View style={styles.form}>
          <InlineMessage tone="warning" message={deniedMessage ?? "Sinulla ei ole oikeutta tähän toimintoon."} />
        </View>
      )}
    </Card>
  );
}
