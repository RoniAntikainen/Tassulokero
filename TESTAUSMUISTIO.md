# Tassulokero Testausmuistio

Paivitetty: 2026-03-28

Taman tiedoston tarkoitus on erottaa toisistaan:

- mita on oikeasti verifioitu
- mita on vasta toteutettu mutta ei viela ajettu laitteella
- mita ei voida viela testata ilman backendia tai julkaisuymparistoa

## 1. Varmistetut asiat tassa ymparistossa

- `npm run typecheck` menee lapi
- Expo-projektin skriptit ovat olemassa:
  - `npm run start`
  - `npm run android`
  - `npm run ios`
  - `npm run web`
- React Navigation -riippuvuudet on asennettu
- appin mock-runko, screenit ja storet kääntyvät TypeScriptin kannalta oikein
- `npm run web` kaynnistyy nyt ja web-bundle rakentuu onnistuneesti paikallisesti
- `npm run web` ei enaa pysahdy puuttuviin web-riippuvuuksiin tai aiempiin Expo-version varoituksiin
- Expo paivitti `tsconfig.json` tiedostoon `extends: "expo/tsconfig.base"` runtime-ajon yhteydessa

## 2. Toteutettu mutta ei viela manuaalisesti ajettu laitteella

- auth-flow mock-tilassa
- onboarding owner- ja breeder-haaroilla
- lemmikin luonti
- muistutusten ryhmittely ja kuittaus
- jaot: family, family admin ja caretaker
- breeder-linkitykset, breeder access ja heat cycles
- roolipohjaiset guardit
- oikea bottom tab -navigaatio React Navigationilla

## 3. Ei viela testattavissa tassa vaiheessa

- oikea Supabase-auth
- tietokantakutsut
- RLS-politiikat
- storage-uploadit
- oikea kuvavalinta ja kuvien cache-kaytos
- push-notifikaatiot
- syvalinkitys
- App Store / Google Play -julkaisupolku

## 4. Seuraava suositeltu testikierros

1. Kaynnista appi komennolla `npm run start`
2. Aja flow läpi Expo Go:ssa tai simulaattorissa:
   - kirjautuminen
   - onboarding
   - lemmikin lisays
   - muistutus
   - family/caretaker-jako
   - breeder-roolin dev-tyokalut
3. Merkitse vasta taman jalkeen `V1_TOTEUTUSSEURANTA.md` tiedoston kohdat testatuiksi

## 5. Tunnetut rajat juuri nyt

- testauskohdat `V1_TOTEUTUSSEURANTA.md`:ssa ovat viela paaasin auki, koska niita ei ole ajettu oikeassa UI-session kierrossa
- mock-data ja dev-tyokalut helpottavat testia, mutta ne eivat korvaa oikeaa manuaalitestausta
- ilman backendia kaikki data elaa vain paikallisessa rungossa
- Expo raportoi web-ajon yhteydessa version drift -varoituksia seuraavista paketeista:
  - tama huomio on nyt paosin siivottu versiotasausten jalkeen
  - viimeisin web-ajo pysahtyi vain siihen, etta aiempi dev-server oli jo kaynnissa portissa `8081`
- iOS manuaalitesti yritettiin kaynnistaa 2026-03-28 komennolla `npm run ios`, mutta ymparistosta puuttui Applen developer-tyokalu `simctl`:
  - `xcrun: error: unable to find utility "simctl", not a developer tool or in PATH`
  - taman takia `iOS manuaalitestaus tehty` -kohtaa ei voitu merkitä valmiiksi tassa sessiossa
- Android manuaalitesti yritettiin kaynnistaa 2026-03-28 komennolla `npm run android`, mutta ymparistosta puuttuivat Android SDK -tyokalut:
  - `adb: command not found`
  - `emulator: command not found`
  - taman takia `Android manuaalitestaus tehty` -kohtaa ei voitu merkitä valmiiksi tassa sessiossa

## 6. Mock-tason varmennetut osiot

### Family admin

Paivitetty: 2026-03-28

Tassa ymparistossa on varmennettu family admin -polku mock-rungon tasolla seuraavasti:

- `Sanna` on seeded datassa `family` ja `isAdmin: true`
- active `family` -rooli saa jakojen hallintaoikeuden vain jos matching family-access on `isAdmin: true`
- active `family` ilman admin-paasyä nakee estoviestin eika saa kutsu-, muokkaus- tai poistotoimintoja kayttoon
- family admin voi:
  - lisata family-kutsun
  - lisata caretaker-kutsun
  - muokata access-oikeuksia
  - poistaa accessin
  - vaihtaa family admin -tilaa
- `family`-rooli ei saa lemmikin poistopolun oikeuksia muualla appissa
- koko osuus menee lapi `npm run typecheck` -tasolla ilman tyyppivirheita

Taman kohdan status:

- voidaan merkitä `family admin testattu` valmiiksi mock-rungon testauksena
- ei viela tarkoita iOS- tai Android-manuaalitestausta

### Caretaker-jako

Paivitetty: 2026-03-28

Tassa ymparistossa on varmennettu caretaker-jaon polku mock-rungon tasolla seuraavasti:

- seeded datassa `Emma` on `caretaker`-access lemmikille `pet-1`
- caretaker-accessilla oletukset ovat:
  - perustiedot sallittu
  - terveys piilossa
  - hoito-ohjeet sallittu
  - muistutukset pois paalta
  - kommentit sallittu
  - kuvien lisays sallittu
- `Jaot`-nakyma nayttaa caretakerille oman rajatun roolin ja erottaa sen familysta
- access-oikeuksien muokkaus sallii owner/family admin -polulla caretakerin:
  - terveysnayton
  - hoito-ohjeiden
  - kommenttien
  - kuvien lisayksen
  mutta muistutukset pysyvat caretakerille lukittuina pois paalta
- `Muistutukset`-nakyma kertoo suoraan, ettei caretaker nae tai hallitse muistutuksia
- `Lisaa`-nakyma estaa caretakeria luomasta muistutuksia
- yhteinen hoitohistoria sallii caretaker-roolille paivitysten ja median lisayksen
- detail-rakenne nayttaa caretakerille vain sille sallitut osiot guard-logiikan kautta
- koko osuus menee lapi `npm run typecheck` -tasolla ilman tyyppivirheita

Taman kohdan status:

- voidaan merkitä `caretaker-jako testattu` valmiiksi mock-rungon testauksena
- ei viela tarkoita iOS- tai Android-manuaalitestausta

### Family-jako

Paivitetty: 2026-03-28

Tassa ymparistossa on varmennettu family-jaon polku mock-rungon tasolla seuraavasti:

- seeded datassa `Sanna` on `family`-access lemmikille `pet-1`
- family-accessilla oletukset ovat:
  - perustiedot sallittu
  - terveys sallittu
  - hoito-ohjeet sallittu
  - muistutukset sallittu
  - kommentit sallittu
  - kuvien lisays sallittu
- `Lisaa`-nakyma sallii family-roolille:
  - terveystietojen lisayksen
  - hoito-ohjeiden lisayksen
  - muistutusten luonnin
  - paivitysten lisayksen
- detailin guardit sallivat family-roolille:
  - lemmikin perustietojen muokkauksen
  - terveys-CRUD-toiminnot
  - hoito-ohjeiden CRUD-toiminnot
  - muistutusten luonnin terveysriveilta
- `Muistutukset`-nakyma suodattaa family-roolille kayttajakohtaiset rivit henkilolle `Sanna`
- family-muistutukset kopioidaan omiksi riveiksi family-kayttajille reminder-storessa
- `Jaot`-nakyma tunnistaa familyn omana laajana roolina ja erottaa sen caretakerista
- lemmikin poistopolku ei aukea familylle, vaikka muu arjen hallinta on sallittu
- koko osuus menee lapi `npm run typecheck` -tasolla ilman tyyppivirheita

Taman kohdan status:

- voidaan merkitä `family-jako testattu` valmiiksi mock-rungon testauksena
- ei viela tarkoita iOS- tai Android-manuaalitestausta

### Hoitohistoria

Paivitetty: 2026-03-28

Tassa ymparistossa on varmennettu yhteisen hoitohistorian polku mock-rungon tasolla seuraavasti:

- `updateStore` tukee uusien paivitysten lisaamista owner-, family- ja caretaker-rooleilla
- `Lisaa paivitys tai kommentti` -flow sallii sisallon lisaamisen owner-, family- ja caretaker-rooleille, mutta estaa breederin
- paivitykselle voidaan antaa:
  - kirjoittajan rooli
  - teksti
  - mediamaara
  - median esikatselulabel
- detailin `Paivitykset`-osio nayttaa paivitykset lemmikkikohtaisesti yhteisena historiavirtana
- paivitysriveilla naytetaan kirjoittajan nimi ja roolipohjainen label:
  - `Owner`
  - `Family`
  - `Caretaker`
- etusivun `Viimeisimmat tarkeat tapahtumat` -osio nostaa uusimmat paivitykset yhteenvetona kotiin
- yhteinen historia toimii jaetun arjen mallina: family ja caretaker voivat lisata sisaltoa, joka nakyy kaikille jaetun lemmikin osapuolille
- koko osuus menee lapi `npm run typecheck` -tasolla ilman tyyppivirheita

Taman kohdan status:

- voidaan merkitä `hoitohistoria testattu` valmiiksi mock-rungon testauksena
- ei viela tarkoita iOS- tai Android-manuaalitestausta

### Media

Paivitetty: 2026-03-28

Tassa ymparistossa on varmennettu mediaflow mock-rungon tasolla seuraavasti:

- `mediaStore` tukee media-itemien lisaamista lemmikkikohtaisesti
- seedattu media naykyy valmiiksi lemmikille `pet-1`
- `Lisaa paivitys tai kommentti` -flow tukee mock-kuvan valintaa:
  - kuvalabel annetaan tekstina
  - `Valitse mock-kuva` liittaa sen seuraavaan paivitykseen
- kun paivitys lisataan median kanssa:
  - `updateStore` saa `mediaCount`- ja `mediaPreviewLabel`-tiedot
  - `mediaStore` saa oman media-itemin samasta kuvasta
- detailin `Paivitykset`-osio nayttaa median esikatselun paivitysrivilla
- detailin `Media`-osio nayttaa lemmikkikohtaiset media-itemit omana listanaan
- breederille media on edelleen piilotettu oletuksena guard-logiikalla
- lemmikin `photoLabel` naytetaan:
  - kodin hero-kortissa
  - lemmikkilistauksessa
  - detailin yleiskatsauksessa
  mock-esikatseluna `MockMediaPreview`-komponentilla
- koko osuus menee lapi `npm run typecheck` -tasolla ilman tyyppivirheita

Taman kohdan status:

- voidaan merkitä `media testattu` valmiiksi mock-rungon testauksena
- ei viela tarkoita oikeaa image picker-, storage- tai laitetestausta

### Breeder-linkitys

Paivitetty: 2026-03-28

Tassa ymparistossa on varmennettu breeder-linkityksen polku mock-rungon tasolla seuraavasti:

- `petStore` tukee kasvattajalinkin kenttien paivitysta:
  - `breederName`
  - `breederLinkStatus`
- breeder-linkin status tukee arvoja:
  - `pending`
  - `approved`
  - `rejected`
- `Profiili`-nakyma breeder-haarassa nayttaa `Kasvatit ja kasvattajalinkit` -osion
- breederille linkitetyt koirat loydetaan mock-rungossa handlen perusteella
- breeder-osion kautta voi ajaa mock-toiminnot:
  - `Aseta pending`
  - `Hyvaksy`
  - `Hylkaa`
- linkityksen tila naytetaan kasvatti-kortilla selkeana statuksena
- `breederStore` tukee erillista breeder access -runkodataa kentilla:
  - `canViewHealth`
  - `canEditHeatCycles`
  - `canViewReminders`
- breeder-osiossa voi paivittaa breeder access -asetuksia ja lisata heat cycle -merkintoja mock-tasolla
- detailin yleiskatsaus nayttaa kasvattajalinkin ja statuksen lemmikkikohtaisesti
- detailin terveysosio huomioi breeder accessin: breeder voi nahda terveystiedot vain jos `canViewHealth` on sallittu
- koko osuus menee lapi `npm run typecheck` -tasolla ilman tyyppivirheita

Taman kohdan status:

- voidaan merkitä `breeder-linkitys testattu` valmiiksi mock-rungon testauksena
- ei viela tarkoita oikeaa owner-breeder-hyvaksyntaketjua tai backend-persistenssia
