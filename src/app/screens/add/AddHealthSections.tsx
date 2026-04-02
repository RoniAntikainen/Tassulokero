import { Dispatch, SetStateAction } from "react";
import { Text, View } from "react-native";

import {
  AppButton,
  Card,
  DatePickerField,
  InlineMessage,
  PickerField,
  TextField,
} from "../../../components/ui";
import { styles } from "./styles";

export function AddHealthSections(props: {
  allowed: boolean;
  vaccinationName: string;
  setVaccinationName: Dispatch<SetStateAction<string>>;
  vaccinationDate: string;
  setVaccinationDate: Dispatch<SetStateAction<string>>;
  vaccinationValidUntil: string;
  setVaccinationValidUntil: Dispatch<SetStateAction<string>>;
  vaccinationClinic: string;
  setVaccinationClinic: Dispatch<SetStateAction<string>>;
  vaccinationErrorMessage: string | null;
  vaccinationSuccessMessage: string | null;
  onAddVaccination: () => void;
  medicationName: string;
  setMedicationName: Dispatch<SetStateAction<string>>;
  medicationDosage: string;
  setMedicationDosage: Dispatch<SetStateAction<string>>;
  medicationInstructions: string;
  setMedicationInstructions: Dispatch<SetStateAction<string>>;
  medicationStartDate: string;
  setMedicationStartDate: Dispatch<SetStateAction<string>>;
  medicationEndDate: string;
  setMedicationEndDate: Dispatch<SetStateAction<string>>;
  medicationStatus: "active" | "completed" | "paused";
  setMedicationStatus: Dispatch<SetStateAction<"active" | "completed" | "paused">>;
  medicationErrorMessage: string | null;
  medicationSuccessMessage: string | null;
  onAddMedication: () => void;
  visitDate: string;
  setVisitDate: Dispatch<SetStateAction<string>>;
  visitClinic: string;
  setVisitClinic: Dispatch<SetStateAction<string>>;
  visitVeterinarian: string;
  setVisitVeterinarian: Dispatch<SetStateAction<string>>;
  visitReason: string;
  setVisitReason: Dispatch<SetStateAction<string>>;
  visitSummary: string;
  setVisitSummary: Dispatch<SetStateAction<string>>;
  visitFollowUpDate: string;
  setVisitFollowUpDate: Dispatch<SetStateAction<string>>;
  visitErrorMessage: string | null;
  visitSuccessMessage: string | null;
  onAddVetVisit: () => void;
  insuranceProviderName: string;
  setInsuranceProviderName: Dispatch<SetStateAction<string>>;
  insurancePolicyNumber: string;
  setInsurancePolicyNumber: Dispatch<SetStateAction<string>>;
  insuranceCoverageType: "health" | "life" | "health_and_life" | "other";
  setInsuranceCoverageType: Dispatch<SetStateAction<"health" | "life" | "health_and_life" | "other">>;
  insuranceDeductibleLabel: string;
  setInsuranceDeductibleLabel: Dispatch<SetStateAction<string>>;
  insuranceValidFrom: string;
  setInsuranceValidFrom: Dispatch<SetStateAction<string>>;
  insuranceValidUntil: string;
  setInsuranceValidUntil: Dispatch<SetStateAction<string>>;
  insuranceContactPhone: string;
  setInsuranceContactPhone: Dispatch<SetStateAction<string>>;
  insuranceNotes: string;
  setInsuranceNotes: Dispatch<SetStateAction<string>>;
  insuranceErrorMessage: string | null;
  insuranceSuccessMessage: string | null;
  onAddInsuranceRecord: () => void;
  healthType: "allergy" | "chronic_condition" | "diet_note" | "behaviour_note" | "other";
  setHealthType: Dispatch<SetStateAction<"allergy" | "chronic_condition" | "diet_note" | "behaviour_note" | "other">>;
  healthTitle: string;
  setHealthTitle: Dispatch<SetStateAction<string>>;
  healthContent: string;
  setHealthContent: Dispatch<SetStateAction<string>>;
  healthErrorMessage: string | null;
  healthSuccessMessage: string | null;
  onAddHealthNote: () => void;
}) {
  const denied = "Terveystietojen hallinta kuuluu omistajalle ja perheelle.";

  return (
    <>
      <Card>
        <Text style={styles.formTitle}>Lisää rokotus</Text>
        {props.allowed ? (
          <View style={styles.form}>
            <TextField label="Rokotteen nimi" value={props.vaccinationName} onChangeText={props.setVaccinationName} placeholder="Esim. rabies" />
            <DatePickerField label="Annettu päivänä" value={props.vaccinationDate} onChange={props.setVaccinationDate} yearStart={2010} />
            <DatePickerField label="Voimassa asti" value={props.vaccinationValidUntil} onChange={props.setVaccinationValidUntil} yearStart={2010} />
            <TextField label="Klinikka" value={props.vaccinationClinic} onChangeText={props.setVaccinationClinic} placeholder="Klinikan nimi" />
            {props.vaccinationErrorMessage ? <InlineMessage tone="warning" message={props.vaccinationErrorMessage} /> : null}
            {props.vaccinationSuccessMessage ? <InlineMessage tone="info" message={props.vaccinationSuccessMessage} /> : null}
            <AppButton label="Tallenna rokotus" onPress={props.onAddVaccination} secondary />
          </View>
        ) : (
          <View style={styles.form}>
            <InlineMessage tone="warning" message={denied} />
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.formTitle}>Lisää lääkitys</Text>
        {props.allowed ? (
          <View style={styles.form}>
            <TextField label="Lääkkeen nimi" value={props.medicationName} onChangeText={props.setMedicationName} placeholder="Lääkkeen nimi" />
            <TextField label="Annostus" value={props.medicationDosage} onChangeText={props.setMedicationDosage} placeholder="Esim. 1 tabletti" />
            <TextField label="Ohje" value={props.medicationInstructions} onChangeText={props.setMedicationInstructions} placeholder="Kirjoita ohje" />
            <DatePickerField label="Aloituspäivä" value={props.medicationStartDate} onChange={props.setMedicationStartDate} yearStart={2020} />
            <DatePickerField label="Päättymispäivä" value={props.medicationEndDate} onChange={props.setMedicationEndDate} yearStart={2020} />
            <PickerField
              label="Tila"
              value={props.medicationStatus}
              onChange={(value) => props.setMedicationStatus(value as "active" | "completed" | "paused")}
              options={[
                { label: "Aktiivinen", value: "active" },
                { label: "Tauolla", value: "paused" },
                { label: "Valmis", value: "completed" },
              ]}
            />
            {props.medicationErrorMessage ? <InlineMessage tone="warning" message={props.medicationErrorMessage} /> : null}
            {props.medicationSuccessMessage ? <InlineMessage tone="info" message={props.medicationSuccessMessage} /> : null}
            <AppButton label="Tallenna lääkitys" onPress={props.onAddMedication} secondary />
          </View>
        ) : (
          <View style={styles.form}>
            <InlineMessage tone="warning" message={denied} />
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.formTitle}>Lisää eläinlääkärikäynti</Text>
        {props.allowed ? (
          <View style={styles.form}>
            <DatePickerField label="Käyntipäivä" value={props.visitDate} onChange={props.setVisitDate} yearStart={2020} />
            <TextField label="Klinikka" value={props.visitClinic} onChangeText={props.setVisitClinic} placeholder="Klinikan nimi" />
            <TextField label="Eläinlääkäri" value={props.visitVeterinarian} onChangeText={props.setVisitVeterinarian} placeholder="Eläinlääkärin nimi" />
            <TextField label="Syy" value={props.visitReason} onChangeText={props.setVisitReason} placeholder="Miksi käynti tehtiin" />
            <TextField label="Yhteenveto" value={props.visitSummary} onChangeText={props.setVisitSummary} placeholder="Lyhyt yhteenveto käynnistä" />
            <DatePickerField label="Jatkokäynnin päivä" value={props.visitFollowUpDate} onChange={props.setVisitFollowUpDate} yearStart={2020} />
            {props.visitErrorMessage ? <InlineMessage tone="warning" message={props.visitErrorMessage} /> : null}
            {props.visitSuccessMessage ? <InlineMessage tone="info" message={props.visitSuccessMessage} /> : null}
            <AppButton label="Tallenna käynti" onPress={props.onAddVetVisit} secondary />
          </View>
        ) : (
          <View style={styles.form}>
            <InlineMessage tone="warning" message={denied} />
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.formTitle}>Lisää vakuutustieto</Text>
        {props.allowed ? (
          <View style={styles.form}>
            <TextField label="Vakuutusyhtiö" value={props.insuranceProviderName} onChangeText={props.setInsuranceProviderName} placeholder="Yhtiön nimi" />
            <TextField label="Poliisinumero" value={props.insurancePolicyNumber} onChangeText={props.setInsurancePolicyNumber} placeholder="Vakuutusnumero" />
            <PickerField
              label="Vakuutustyyppi"
              value={props.insuranceCoverageType}
              onChange={(value) => props.setInsuranceCoverageType(value as "health" | "life" | "health_and_life" | "other")}
              options={[
                { label: "Sairaus", value: "health" },
                { label: "Henki", value: "life" },
                { label: "Molemmat", value: "health_and_life" },
                { label: "Muu", value: "other" },
              ]}
            />
            <TextField label="Omavastuu" value={props.insuranceDeductibleLabel} onChangeText={props.setInsuranceDeductibleLabel} placeholder="Esim. 100 EUR" />
            <DatePickerField label="Voimassa alkaen" value={props.insuranceValidFrom} onChange={props.setInsuranceValidFrom} yearStart={2020} />
            <DatePickerField label="Voimassa asti" value={props.insuranceValidUntil} onChange={props.setInsuranceValidUntil} yearStart={2020} />
            <TextField label="Yhteysnumero" value={props.insuranceContactPhone} onChangeText={props.setInsuranceContactPhone} placeholder="Puhelinnumero" />
            <TextField label="Muistiinpanot" value={props.insuranceNotes} onChangeText={props.setInsuranceNotes} placeholder="Lisätiedot" />
            {props.insuranceErrorMessage ? <InlineMessage tone="warning" message={props.insuranceErrorMessage} /> : null}
            {props.insuranceSuccessMessage ? <InlineMessage tone="info" message={props.insuranceSuccessMessage} /> : null}
            <AppButton label="Tallenna vakuutustieto" onPress={props.onAddInsuranceRecord} secondary />
          </View>
        ) : (
          <View style={styles.form}>
            <InlineMessage tone="warning" message={denied} />
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.formTitle}>Lisää terveystieto</Text>
        {props.allowed ? (
          <View style={styles.form}>
            <PickerField
              label="Terveystiedon tyyppi"
              value={props.healthType}
              onChange={(value) => props.setHealthType(value as "allergy" | "chronic_condition" | "diet_note" | "behaviour_note" | "other")}
              options={[
                { label: "Muu", value: "other" },
                { label: "Krooninen", value: "chronic_condition" },
                { label: "Allergia", value: "allergy" },
                { label: "Ruokahuomio", value: "diet_note" },
              ]}
            />
            <TextField label="Otsikko" value={props.healthTitle} onChangeText={props.setHealthTitle} placeholder="Otsikoi merkintä" />
            <TextField label="Sisältö" value={props.healthContent} onChangeText={props.setHealthContent} placeholder="Kirjoita lisätiedot" />
            {props.healthErrorMessage ? <InlineMessage tone="warning" message={props.healthErrorMessage} /> : null}
            {props.healthSuccessMessage ? <InlineMessage tone="info" message={props.healthSuccessMessage} /> : null}
            <AppButton label="Tallenna terveystieto" onPress={props.onAddHealthNote} secondary />
          </View>
        ) : (
          <View style={styles.form}>
            <InlineMessage tone="warning" message={denied} />
          </View>
        )}
      </Card>
    </>
  );
}
