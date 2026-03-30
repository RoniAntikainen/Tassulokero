# Tassulokero Database Suunnitelma

## Peruslinja

Suositus ensiversioon:

- relaatiotietokanta
- PostgreSQL

Syy:

- data on selkeasti rakenteista
- suhteita on paljon
- muistutukset, lemmikit ja jakaminen hyotyvat relaatioista
- tietomalli pysyy ymmarrettavana myos myohemmin

## Tavoite ensiversiolle

Tietokannan pitaa tukea naita ydinkayttotapauksia:

- kayttaja voi luoda useita lemmikkeja
- kayttaja voi tallentaa tarkeimmat terveys- ja hoitotiedot
- kayttaja voi luoda muistutuksia
- kayttaja voi jakaa lemmikin tiedot perheenjasenelle tai hoitajalle
- oikeudet voidaan rajata ilman monimutkaista yritystason permission-jarjestelmaa

## Suositeltu v1-tietomallin runko

Pakolliset taulut ensiversioon:

- users
- pets
- pet_access
- vaccinations
- medications
- vet_visits
- care_instructions
- reminders

Hyodylliset mutta optionaaliset jo v1:ssa:

- health_notes
- insurance_policies

Mukana jo v1:ssa nykyisen paatoksen mukaan:

- attachments
- tykkaykset
- seuraukset
- breeder-linkitykset
- heat_cycles

Ei ensiversioon:

- chat
- social feed
- monimutkaiset integraatiot
- liian raskas audit log

## Relaatiot lyhyesti

- yhdella kayttajalla voi olla monta lemmikkia
- yhdella lemmikilla on yksi varsinainen omistaja
- yhdella lemmikilla voi olla monta muuta kayttajaa `pet_access`-taulun kautta
- yhdella lemmikilla voi olla monta rokotetta, laakitysta, kayntia, hoito-ohjetta ja muistutusta

## Taulut

### users

Tarkoitus:

- yksi sovelluksen kayttaja

Kentat:

- id uuid primary key
- email text unique not null
- display_name text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Huomio:

- auth-providerin oma tunnus voi tulla myohemmin erillisena kenttana kuten `auth_provider_user_id`

### pets

Tarkoitus:

- yksi lemmikki

Kentat:

- id uuid primary key
- owner_user_id uuid not null references users(id) on delete cascade
- name text not null
- species text not null
- breed text
- sex text
- birth_date date
- birth_date_is_estimate boolean not null default false
- weight_kg numeric(5,2)
- color_markings text
- chip_id text
- is_neutered boolean
- photo_url text
- notes text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Huomio:

- `owner_user_id` pidetaan mukana, vaikka jakaminen mallinnetaan erikseen
- tama yksinkertaistaa omistajuuden paattelya ensiversiossa

### pet_access

Tarkoitus:

- maarittaa ketka muut kayttajat paasevat tietyn lemmikin tietoihin

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- user_id uuid not null references users(id) on delete cascade
- role text not null
- can_edit_profile boolean not null default false
- can_edit_health boolean not null default false
- can_manage_reminders boolean not null default false
- can_view_private_notes boolean not null default false
- created_at timestamptz not null default now()

Rajoitteet:

- unique(pet_id, user_id)

Suositus:

- owneria ei tarvitse tallentaa tahan tauluun pakolla ensiversiossa
- owner tulee `pets.owner_user_id`-kentasta
- family ja caretaker tulevat tahan tauluun
- family-roolille voidaan lisata erillinen `is_admin` boolean, jos halutaan erottaa tavallinen perhejasen ja admin-perhejasen toisistaan

### vaccinations

Tarkoitus:

- yksi rokotetieto yhdelle lemmikille

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- vaccine_name text not null
- administered_on date not null
- valid_until date
- clinic_name text
- veterinarian_name text
- notes text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

### medications

Tarkoitus:

- yksi laakitys tai laakekuuri

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- medication_name text not null
- dosage text
- instructions text
- start_date date
- end_date date
- status text not null default 'active'
- notes text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Huomio:

- `status` voi olla esimerkiksi `active`, `completed`, `paused`

### vet_visits

Tarkoitus:

- yksi elainlaakarikaynti

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- visit_date date not null
- clinic_name text
- veterinarian_name text
- reason text
- summary text
- follow_up_date date
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

### care_instructions

Tarkoitus:

- hoitajalle tai perheelle tarkeat kaytannon ohjeet

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- type text not null
- title text not null
- content text not null
- sort_order integer not null default 0
- is_shared_with_caretakers boolean not null default true
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Esimerkkeja:

- feeding
- commands
- routine
- warning
- general

### reminders

Tarkoitus:

- yksi muistutus yhdelle kayttajalle yhdesta asiasta

Kentat:

- id uuid primary key
- user_id uuid not null references users(id) on delete cascade
- pet_id uuid references pets(id) on delete cascade
- source_type text
- source_id uuid
- title text not null
- description text
- due_at timestamptz not null
- status text not null default 'pending'
- notify_push boolean not null default true
- notify_email boolean not null default false
- completed_at timestamptz
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Miksi `user_id` on mukana:

- muistutukset voivat olla kayttajakohtaisia
- kaikille ei valttamatta haluta samaa muistutusta
- perheenjasenelle voi tulla oma muistutus samasta lemmikista

### health_notes

Tarkoitus:

- muu tarkea terveys- tai kayttaytymishuomio

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- type text not null
- title text not null
- content text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Esimerkkeja:

- allergy
- chronic_condition
- diet_note
- behaviour_note
- other

### insurance_policies

Tarkoitus:

- vakuutustiedot

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- provider_name text not null
- policy_number text
- valid_from date
- valid_to date
- phone_number text
- notes text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

### attachments

Tarkoitus:

- liitteet ja tiedostot

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- related_type text
- related_id uuid
- file_url text not null
- file_name text
- mime_type text
- created_at timestamptz not null default now()

Huomio:

- ensiversiossa tallennetaan vain tiedoston metadata
- itse tiedosto menee object storageen
- liitteet voivat olla myos caretakerin lisaamia
- liitteilla kannattaa olla myohemmin `uploaded_by_user_id`-kentta, jos halutaan erottaa kuka lisasi materiaalin

### heat_cycles

Tarkoitus:

- juoksujen kirjaaminen ja historian seuranta
- pohja seuraavan juoksun arvioinnille

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- started_on date
- ended_on date
- is_estimated_start boolean not null default false
- notes text
- symptoms text
- created_by_user_id uuid not null references users(id)
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Huomio:

- v1:ssa voi kirjata vain arvioidun aloituksen
- ennuste lasketaan aiemman historian perusteella sovelluslogiikassa

### pet_breeder_links

Tarkoitus:

- linkittaa koira kasvattajaan
- mahdollistaa hyvaksyntaprosessin ja kasvattajaoikeudet

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- breeder_user_id uuid not null references users(id) on delete cascade
- approved_at timestamptz
- approved_by_user_id uuid references users(id)
- breeder_access_enabled boolean not null default true
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Huomio:

- linkitys pitää hyväksyä

### blocks

Tarkoitus:

- estot jaettujen suhteiden puolella

Kentat:

- id uuid primary key
- blocker_user_id uuid not null references users(id) on delete cascade
- blocked_user_id uuid not null references users(id) on delete cascade
- created_at timestamptz not null default now()

Huomio:

- estetty kayttaja saa nahda vain ne tiedot, joihin silla on edelleen oikeus
- estetty kayttaja ei voi kommentoida tai osallistua

### reports

Tarkoitus:

- sisallon ilmianto tai reporttaus

Kentat:

- id uuid primary key
- reporter_user_id uuid not null references users(id) on delete cascade
- target_type text not null
- target_id uuid not null
- reason text
- created_at timestamptz not null default now()

### pet_updates

Tarkoitus:

- yhteinen kommentti- ja paivitysvirta lemmikille
- tukee sita, etta caretaker voi lisata kaikille nakyvia kommentteja ja kuvia

Kentat:

- id uuid primary key
- pet_id uuid not null references pets(id) on delete cascade
- author_user_id uuid not null references users(id) on delete cascade
- body text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Huomio:

- jos haluatte pitaa v1:n yksinkertaisena, kuvat voidaan ensimmaisessa versiossa liittaa `pet_updates`-riviin `attachments`-taulun kautta
- taman avulla caretaker ei muokkaa ydinterveystietoja, vaan tuottaa yhteista hoitohistoriaa

## Kayttooikeusmalli

Ensiversion yksinkertainen malli:

- `owner`
  - kaikki oikeudet
- `family`
  - voi olla tavallinen family tai admin-family
  - admin-family voi hallita kaytannossa kaikkea muuta paitsi poistaa koko lemmikin
- `caretaker`
  - voi nahda jaetut tiedot
- voi lisata kommentteja ja kuvia yhteiseen hoitohistoriaan
- `viewer`
  - vain lukuoikeus

Suositus ensiversioon:

- tehkaa aluksi vain `family` ja `caretaker`
- `family`-roolissa voidaan erottaa admin booleanilla hallintaoikeudet
- `viewer` voidaan lisata myohemmin jos sille on oikea kayttotilanne

## Enum-tyyppiset arvot

Aluksi naita ei ole pakko tehda oikeiksi database enum -tyypeiksi.
Teksti + sovellustason validointi riittaa hyvin ensiversioon.

Esimerkkeja:

- pets.species
  - dog
  - cat
  - other

- pet_access.role
  - family
  - caretaker
  - viewer

- medications.status
  - active
  - completed
  - paused

- reminders.status
  - pending
  - completed
  - cancelled

- care_instructions.type
  - feeding
  - commands
  - routine
  - warning
  - general

## Indeksit

Vahintaan:

- users(email)
- pets(owner_user_id)
- pet_access(pet_id)
- pet_access(user_id)
- vaccinations(pet_id)
- medications(pet_id)
- vet_visits(pet_id)
- care_instructions(pet_id)
- reminders(user_id, due_at)
- reminders(pet_id, due_at)
- reminders(status, due_at)

Lisaksi hyodylliset:

- unique(pet_access.pet_id, pet_access.user_id)
- index on medications(status)
- index on vaccinations(valid_until)

## Poistologiikka

Ensiversion suositus:

- jos lemmikki poistetaan, siihen liittyvat tiedot poistuvat cascade-logiikalla
- jos kayttaja poistetaan:
  - jos kayttaja on vain family tai caretaker, hanen `pet_access`-rivit poistuvat
  - jos kayttaja on lemmikin owner, koko lemmikki voidaan poistaa ensiversiossa

Huomio:

- tata voi myohemmin pehmentaa soft delete -mallilla
- mutta ensiversioon yksinkertainen cascade-logiikka on ihan ok

## Tarkeat tietomallipaatokset

### 1. Kaikkea ei laiteta yhteen notes-kenttaan

Pitää erottaa:

- rakenteinen data
- muistutettava data
- vapaamuotoinen muistiinpanodata

Muuten tuotteen tarkein arvo katoaa nopeasti.

### 2. Jakaminen ei saa perustua vain siihen, etta kaikille annetaan kaikki

Siksi `pet_access` on oma taulunsa.

### 3. Muistutukset ovat oma taulunsa

Niita ei kannata mallintaa vain rokotusten tai laakitysten sivutuotteeksi.

Syy:

- kayttaja tarvitsee yhden paikan josta nakyy mita on tulossa
- muistutuksia pitaa voida kuitata
- muistutuksilla on oma elinkaarensa

## Mita jattaisin tarkoituksella pois v1:sta

Naiden puuttuminen yksinkertaistaa tietomallia paljon:

- invitation-taulu jakokutsuille
- erillinen household- tai family-taulu
- monimutkainen permission matrix
- audit log kaikelle
- automaattisesti generoitu reminder recurrence engine

Vaikka kasvattajapuoli tulee nyt mukaan v1-ajatteluun, siina kannattaa pitaa logiikka mahdollisimman yksinkertaisena ensiversiossa.

Namat voi lisata myohemmin kun ydintuote toimii.

## Selkein suositus

Jos haluatte pitaa ensiversion hallittavana, rakentakaa ensin tama ydin:

- users
- pets
- pet_access
- vaccinations
- medications
- vet_visits
- care_instructions
- reminders
- pet_updates
- attachments

Ja lisatkaa vasta sen jalkeen:

- health_notes
- insurance_policies

Tama riittaa jo tosi vahvaan ensiversioon.
