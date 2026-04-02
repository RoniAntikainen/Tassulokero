import { Pressable, Text, View } from "react-native";

import { Card } from "../../../components/ui";
import { styles } from "./styles";

export function AddActionMenuCard({
  onEditPet,
  onAddCare,
  onAddReminder,
  onAddUpdate,
}: {
  onEditPet: () => void;
  onAddCare: () => void;
  onAddReminder: () => void;
  onAddUpdate: () => void;
}) {
  return (
    <Card>
      <Text style={styles.formTitle}>Toiminnot</Text>
      <View style={styles.form}>
        <Pressable style={styles.actionTile} onPress={onEditPet}>
          <Text style={styles.actionTitle}>Muokkaa perustietoja</Text>
        </Pressable>
        <Pressable style={styles.actionTile} onPress={onAddCare}>
          <Text style={styles.actionTitle}>Lisää hoito-ohje</Text>
        </Pressable>
        <Pressable style={styles.actionTile} onPress={onAddReminder}>
          <Text style={styles.actionTitle}>Lisää muistutus</Text>
        </Pressable>
        <Pressable style={styles.actionTile} onPress={onAddUpdate}>
          <Text style={styles.actionTitle}>Lisää merkintä</Text>
        </Pressable>
      </View>
    </Card>
  );
}
