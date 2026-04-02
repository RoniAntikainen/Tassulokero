import { Dispatch, SetStateAction } from "react";
import { Pressable, Text } from "react-native";

import { AppButton, DatePickerField, InlineMessage, PickerField, TextField } from "../../../components/ui";
import { AddSectionCard } from "./AddSectionCard";
import { styles } from "./styles";

export function AddReminderSection(props: {
  allowed: boolean;
  petsCount: number;
  reminderPetId: string;
  setReminderPetId: Dispatch<SetStateAction<string>>;
  reminderPetOptions: { label: string; value: string }[];
  reminderType: "manual" | "vaccination" | "medication" | "vet_visit";
  setReminderType: Dispatch<SetStateAction<"manual" | "vaccination" | "medication" | "vet_visit">>;
  reminderTitle: string;
  setReminderTitle: Dispatch<SetStateAction<string>>;
  reminderTitlePlaceholder: string;
  reminderDueAt: string;
  setReminderDueAt: Dispatch<SetStateAction<string>>;
  showReminderOptional: boolean;
  setShowReminderOptional: Dispatch<SetStateAction<boolean>>;
  reminderDescription: string;
  setReminderDescription: Dispatch<SetStateAction<string>>;
  reminderDescriptionPlaceholder: string;
  reminderErrorMessage: string | null;
  reminderSuccessMessage: string | null;
  onAddReminder: () => void;
}) {
  return (
    <AddSectionCard
      title="Luo muistutus"
      allowed={props.allowed}
      deniedMessage="Muistutusten luonti kuuluu omistajalle ja perheelle."
    >
      {props.petsCount > 1 ? (
        <PickerField
          label="Lemmikki"
          value={props.reminderPetId}
          onChange={props.setReminderPetId}
          options={props.reminderPetOptions}
        />
      ) : null}
      <PickerField
        label="Muistutuksen tyyppi"
        value={props.reminderType}
        onChange={(value) => props.setReminderType(value as "manual" | "vaccination" | "medication" | "vet_visit")}
        options={[
          { label: "Yleinen", value: "manual" },
          { label: "Rokotus", value: "vaccination" },
          { label: "Lääkitys", value: "medication" },
          { label: "Käynti", value: "vet_visit" },
        ]}
      />
      <TextField label="Otsikko" value={props.reminderTitle} onChangeText={props.setReminderTitle} placeholder={props.reminderTitlePlaceholder} />
      <DatePickerField label="Ajankohta" value={props.reminderDueAt} onChange={props.setReminderDueAt} yearStart={2024} />
      <Pressable onPress={() => props.setShowReminderOptional((value) => !value)} style={styles.inlineToggle}>
        <Text style={styles.inlineToggleLabel}>{props.showReminderOptional ? "Piilota lisätiedot" : "Lisää tarkennus"}</Text>
      </Pressable>
      {props.showReminderOptional ? (
        <TextField
          label="Kuvaus"
          value={props.reminderDescription}
          onChangeText={props.setReminderDescription}
          placeholder={props.reminderDescriptionPlaceholder}
        />
      ) : null}
      {props.reminderErrorMessage ? <InlineMessage tone="warning" message={props.reminderErrorMessage} /> : null}
      {props.reminderSuccessMessage ? <InlineMessage tone="info" message={props.reminderSuccessMessage} /> : null}
      <AppButton label="Tallenna muistutus" onPress={props.onAddReminder} />
    </AddSectionCard>
  );
}
