import { Dispatch, SetStateAction } from "react";
import { Pressable, Text } from "react-native";

import { AppButton, InlineMessage, PickerField, TextField } from "../../../components/ui";
import { AddSectionCard } from "./AddSectionCard";
import { styles } from "./styles";

export function AddUpdateSection(props: {
  allowed: boolean;
  updateText: string;
  setUpdateText: Dispatch<SetStateAction<string>>;
  showUpdateOptional: boolean;
  setShowUpdateOptional: Dispatch<SetStateAction<boolean>>;
  mediaLabel: string;
  setMediaLabel: Dispatch<SetStateAction<string>>;
  updateAuthorRole: "owner" | "family" | "caretaker";
  setUpdateAuthorRole: Dispatch<SetStateAction<"owner" | "family" | "caretaker">>;
  mediaAttached: boolean;
  onPickMedia: () => void;
  mediaErrorMessage: string | null;
  mediaSuccessMessage: string | null;
  updateErrorMessage: string | null;
  updateSuccessMessage: string | null;
  onAddUpdate: () => void;
}) {
  return (
    <AddSectionCard
      title="Lisää merkintä"
      allowed={props.allowed}
      deniedMessage="Kasvattaja ei voi lisätä merkintöjä tästä näkymästä."
    >
      <TextField
        label="Päivitys"
        value={props.updateText}
        onChangeText={props.setUpdateText}
        placeholder="Kirjoita päivitys"
      />
      <Pressable onPress={() => props.setShowUpdateOptional((value) => !value)} style={styles.inlineToggle}>
        <Text style={styles.inlineToggleLabel}>{props.showUpdateOptional ? "Piilota lisätiedot" : "Lisää kuva tai tarkennus"}</Text>
      </Pressable>
      {props.showUpdateOptional ? (
        <>
          <TextField
            label="Kuvan tiedostonimi"
            value={props.mediaLabel}
            onChangeText={props.setMediaLabel}
            placeholder="Esim. ulkoiluhetki"
          />
          <PickerField
            label="Kirjoittaja"
            value={props.updateAuthorRole}
            onChange={(value) => props.setUpdateAuthorRole(value as "owner" | "family" | "caretaker")}
            options={[
              { label: "Omistaja", value: "owner" },
              { label: "Perhe", value: "family" },
              { label: "Hoitaja", value: "caretaker" },
            ]}
          />
          <AppButton label={props.mediaAttached ? "Kuva valittu" : "Valitse kuva"} onPress={props.onPickMedia} secondary />
        </>
      ) : null}
      {props.mediaErrorMessage ? <InlineMessage tone="warning" message={props.mediaErrorMessage} /> : null}
      {props.mediaSuccessMessage ? <InlineMessage tone="info" message={props.mediaSuccessMessage} /> : null}
      {props.updateErrorMessage ? <InlineMessage tone="warning" message={props.updateErrorMessage} /> : null}
      {props.updateSuccessMessage ? <InlineMessage tone="info" message={props.updateSuccessMessage} /> : null}
      <AppButton label="Tallenna päivitys" onPress={props.onAddUpdate} secondary />
    </AddSectionCard>
  );
}
