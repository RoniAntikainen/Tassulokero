# Tassulokero Entiteetit Ja Data

## Ydinajatus

Tietomallin ydin on:

- käyttäjä omistaa lemmikkejä
- lemmikillä on tapahtumia, terveystietoja ja muistutuksia
- lemmikillä voi olla myös muita käyttäjiä, joille tietoja on jaettu

## Pääentiteetit

### User

Edustaa sovelluksen käyttäjää.

Keskeiset kentät:

- id
- email
- display_name
- created_at
- updated_at

### Pet

Edustaa yhtä lemmikkiä.

Keskeiset kentät:

- id
- owner_user_id
- name
- species
- breed
- sex
- birth_date
- birth_date_is_estimate
- weight_kg
- color_markings
- chip_id
- is_neutered
- photo_url
- notes
- created_at
- updated_at

### PetAccess

Määrittää, kuka muu saa nähdä tai muokata lemmikin tietoja.

Keskeiset kentät:

- id
- pet_id
- user_id
- role
- can_edit_profile
- can_edit_health
- can_manage_reminders
- can_view_private_notes
- created_at

Rooliesimerkkejä:

- owner
- family
- caretaker
- viewer

### VaccinationRecord

Yksi rokotetieto yhdelle lemmikille.

Keskeiset kentät:

- id
- pet_id
- vaccine_name
- administered_on
- valid_until
- clinic_name
- veterinarian_name
- notes
- created_at

### MedicationRecord

Yksi lääkitys tai lääkekuuritieto.

Keskeiset kentät:

- id
- pet_id
- medication_name
- dosage
- instructions
- start_date
- end_date
- status
- notes
- created_at

### VetVisit

Yksi eläinlääkärikäynti.

Keskeiset kentät:

- id
- pet_id
- visit_date
- clinic_name
- veterinarian_name
- reason
- summary
- follow_up_date
- created_at

### HealthNote

Muu tärkeä terveystieto tai huomio.

Keskeiset kentät:

- id
- pet_id
- type
- title
- content
- created_at
- updated_at

Esimerkkejä tyypeistä:

- allergy
- chronic_condition
- diet_note
- behaviour_note
- other

### CareInstruction

Erillinen hoitajalle tai perheelle tärkeä käytännön ohje.

Keskeiset kentät:

- id
- pet_id
- type
- title
- content
- sort_order
- is_shared_with_caretakers
- created_at
- updated_at

### InsurancePolicy

Vakuutukseen liittyvät tiedot.

Keskeiset kentät:

- id
- pet_id
- provider_name
- policy_number
- valid_from
- valid_to
- phone_number
- notes
- created_at

### Reminder

Muistutus yhdelle käyttäjälle liittyen yhteen lemmikkiin.

Keskeiset kentät:

- id
- user_id
- pet_id
- source_type
- source_id
- title
- description
- due_at
- status
- notify_push
- notify_email
- completed_at
- created_at

`source_type` voi viitata esim.:

- vaccination
- medication
- vet_visit
- manual

### Attachment

Mahdollinen tiedosto tai kuva.

Keskeiset kentät:

- id
- pet_id
- related_type
- related_id
- file_url
- file_name
- mime_type
- created_at

## Suhteet

- yhdellä käyttäjällä voi olla monta lemmikkiä
- yhdellä lemmikillä voi olla monta käyttöoikeusriviä
- yhdellä lemmikillä voi olla monta rokotetta
- yhdellä lemmikillä voi olla monta lääkitystä
- yhdellä lemmikillä voi olla monta eläinlääkärikäyntiä
- yhdellä lemmikillä voi olla monta terveysmuistiota
- yhdellä lemmikillä voi olla monta hoito-ohjetta
- yhdellä lemmikillä voi olla monta muistutusta

## Tärkeä päätös

Muistutus kannattaa mallintaa omaksi taulukseen, ei vain muiden tietojen sivutuotteeksi.

Syy:

- käyttäjä tarvitsee yhden paikan josta näkee mitä on tulossa
- muistutuksia pitää voida kuitata valmiiksi
- muistutuksilla on oma elinkaarensa

## Toinen tärkeä päätös

Jakaminen ei saa perustua siihen, että kaikille annetaan sama täysi näkyvyys.

Tarvitaan oikea käyttöoikeusmalli, jotta:

- perhe voi muokata yhdessä
- hoitaja näkee vain tarvittavat tiedot
- osa muistiinpanoista voidaan halutessa rajata
