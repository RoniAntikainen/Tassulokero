# Tassulokero v1 Toteutusseuranta

Taman tiedoston tarkoitus on seurata koko v1-toteutusta niin, etta jokainen vaihe voidaan merkita tehdyksi.

Kaytto:

- merkitse valmis kohta: `[x]`
- kesken oleva kohta: `[ ]`
- jos jokin vaihe muuttuu, paivita tama tiedosto samalla

---

## 1. Tekninen perusta

- [x] Expo-projektin perusrunko luotu
- [x] TypeScript kaytossa
- [x] package.json ja riippuvuudet lisatty
- [x] TanStack Query lisatty
- [x] Zustand lisatty
- [x] design token -pohja lisatty
- [x] reusable UI-komponenttien alku luotu
- [x] oikea mobiilinavigaatio valittu ja asennettu
- [x] env-rakenne lisatty
- [x] Supabase client lisatty
- [x] error boundary / yleinen virhekasittely lisatty
- [x] loading- ja empty-state peruspohjat viimeistelty

## 2. Tietokanta ja Supabase

- [x] alustava Supabase SQL -skeema luotu
- [ ] Supabase-projekti luotu
- [ ] tietokantataulut ajettu ymparistoon
- [ ] storage bucketit luotu
- [ ] auth asetettu
- [ ] RLS-politiikat lisatty
- [ ] dev-ympariston testidata luotu
- [ ] appin ja Supabasen yhteys testattu

### 2.1 Ydintaulut

- [x] users
- [x] pets
- [x] pet_access
- [x] vaccinations
- [x] medications
- [x] vet_visits
- [x] health_notes
- [x] care_instructions
- [x] reminders
- [x] pet_updates
- [x] attachments

### 2.2 Breeder v1 -taulut

- [x] breeder_links
- [x] heat_cycles

## 3. Auth

- [x] rekisteroitymisen UI-runko email + salasana
- [x] kirjautumisen UI-runko
- [x] uloskirjautuminen
- [x] salasanan palautuksen UI-runko
- [x] session-pohja mock-tilassa
- [x] protected navigation
- [x] auth loading state
- [x] auth error state

## 4. Onboarding

- [x] splash / app start
- [x] owner vs breeder valinta
- [x] owner-profiilin luonti
- [x] breeder-profiilin luonti
- [x] kennel-nimen kysyminen breederille
- [x] ensimmaisen lemmikin luonti onboardingissa
- [x] ohjaus kotiin ensimmaisen lemmikin luonnin jalkeen

## 5. Koti

- [x] koti toimii kirjautumisen jalkeisena päänäkymänä
- [x] lemmikkilista tai lemmikkikortit
- [x] yhden lemmikin hero-tyylinen esitys
- [x] tulevat muistutukset kotiin
- [x] viimeisimmat tärkeät tapahtumat kotiin
- [x] siirtyma lemmikin detail-sivulle
- [x] siirtyma muistutuksiin
- [x] siirtyma uuden lemmikin luontiin

## 6. Lemmikin luonti ja hallinta

- [x] uuden lemmikin luonti
- [x] usean lemmikin tuki
- [x] lemmikin muokkaus
- [x] vain owner voi poistaa lemmikin
- [x] lemmikin kuvan lisays

### 6.1 Lemmikin perustiedot

- [x] nimi
- [x] laji
- [x] rotu
- [x] syntymaaika
- [x] arvioitu syntymaaika
- [x] sukupuoli
- [x] paino
- [x] vari / tuntomerkit
- [x] sirunumero
- [x] sterilointi / kastrointi
- [x] muistiinpanot

## 7. Lemmikin detail-sivu

- [x] detail-sivun header
- [x] yleiskatsaus-osio
- [x] terveys-osio
- [x] hoito-osio
- [x] paivitykset-osio
- [x] media-osio
- [x] jako-osio
- [x] muokkauspolku toimii

## 8. Terveystiedot

### 8.1 Rokotukset

- [x] rokotusten listaus
- [x] rokotuksen lisays
- [x] rokotuksen muokkaus
- [x] rokotuksen poisto
- [x] valid_until-tuki

### 8.2 Laakitykset

- [x] laakitysten listaus
- [x] laakityksen lisays
- [x] laakityksen muokkaus
- [x] laakityksen poisto
- [x] aktiivinen / completed / paused status

### 8.3 Elainlaakarikaynnit

- [x] kayntien listaus
- [x] kaynnin lisays
- [x] kaynnin muokkaus
- [x] kaynnin poisto
- [x] follow_up_date-tuki

### 8.4 Muut terveystiedot

- [x] allergiat
- [x] krooniset huomiot
- [x] diet note / ruokahuomiot
- [x] muut terveysmuistiot

### 8.5 Vakuutustiedot

- [x] vakuutustietojen tietomalli tarkennettu
- [x] vakuutustietojen UI lisatty
- [x] vakuutustietojen CRUD toteutettu

## 9. Hoito-ohjeet

- [x] hoito-ohjeiden listaus
- [x] hoito-ohjeen lisays
- [x] hoito-ohjeen muokkaus
- [x] hoito-ohjeen poisto
- [x] sort order
- [x] caretakerille jaettavan ohjeen merkinta

### 9.1 Hoito-ohjeiden tyypit

- [x] feeding
- [x] commands
- [x] routine
- [x] warning
- [x] general

## 10. Muistutukset

- [x] muistutuslista
- [x] muistutuksen lisays
- [x] muistutuksen muokkaus
- [x] muistutuksen peruutus
- [x] muistutuksen kuittaus
- [x] muistutuksen detaljinakyma
- [x] lemmikkisuodatus

### 10.1 Muistutustyypit

- [x] manual
- [x] vaccination
- [x] medication
- [x] vet_visit

### 10.2 Muistutusryhmat UI:ssa

- [x] tanaan
- [x] tulossa
- [x] myohassa
- [x] valmiit

### 10.3 Muistutuslogiikka

- [x] family-muistutukset kopioidaan omiksi riveiksi perhekayttajille
- [x] kuittaus on kayttajakohtainen
- [x] caretaker ei voi luoda muistutuksia
- [x] caretaker ei voi hallita muistutuksia
- [x] rokotuksesta voidaan luoda muistutus
- [x] laakityksesta voidaan luoda muistutus
- [x] kaynnista voidaan luoda muistutus

## 11. Push-notifikaatiot

- [x] Expo Notifications asennettu ja kaytossa
- [ ] laitetoken tallennetaan
- [x] push-permissio pyydetaan oikein
- [ ] muistutusnotifikaation ajoitus toimii
- [ ] syvalinkitys oikeaan nakymaan toimii
- [x] ilmoitusasetukset profiilissa

## 12. Jakaminen

- [x] Jaot-screen toimii
- [x] kutsu toiselle kayttajalle
- [x] paasyjen listaus per lemmikki
- [x] paasyjen poisto
- [x] paasyjen muokkaus

### 12.1 Family

- [x] family-kutsu
- [x] family nakee kaiken tarvittavan
- [x] family voi muokata
- [ ] family ei voi poistaa lemmikkia

### 12.2 Family admin

- [x] family admin -merkinta
- [x] family admin voi hallita jakoa
- [x] family admin ei voi poistaa lemmikkia

### 12.3 Caretaker

- [x] caretaker-kutsu
- [x] caretakerin osiorajaukset
- [x] caretaker voi nahda vain jaetut osiot
- [x] caretaker ei voi muokata ydinterveystietoja
- [x] caretaker ei voi muokata perustietoja
- [x] caretaker voi lisata kommentteja
- [x] caretaker voi lisata kuvia

### 12.4 Jaettavat osiot caretakerille

- [x] perustiedot
- [x] terveys
- [x] hoito-ohjeet
- [ ] muistutusten nakyma, jos sallitaan

## 13. Yhteinen hoitohistoria

- [x] paivitysvirta lemmikin detail-sivulle
- [x] kommentin lisays
- [x] kommentin listaus
- [x] family voi lisata sisaltoa
- [x] caretaker voi lisata sisaltoa
- [x] lisatty sisalto nakyy kaikille joille lemmikki on jaettu

## 14. Media

- [x] kuvan valinnan mock-flow
- [ ] kuvan upload storageen
- [ ] kuvan metadata tietokantaan
- [x] kuvan naytto media-osiossa
- [x] kuvan liittaminen paivitykseen
- [ ] useamman kuvan tuki, jos halutaan private-puolella heti

## 15. Profiili ja asetukset

- [x] profiilin perustiedot
- [x] ilmoitusasetukset
- [x] owner/breeder-roolin hallinta
- [x] logout
- [ ] future monetization -valmius pidetty datassa

## 16. Breeder-puoli

- [x] breeder onboarding
- [x] kennel-tiedot
- [x] kasvatit-osio
- [x] kasvattajalinkitys koiraan
- [x] hyvaksy / hylkaa -flow

### 16.1 Breeder access

- [x] kasvattaja voi nahda terveystiedot oletusoikeuksilla
- [x] kasvattaja ei muokkaa terveystietoja oletuksena
- [x] kasvattaja voi muokata heat cycle -tietoja
- [x] kasvattaja ei nae muistutuksia oletuksena
- [ ] omistaja voi laajentaa tai supistaa breeder accessia

### 16.2 Heat cycles

- [x] juoksun aloituspaiva
- [x] juoksun lopetuspaiva
- [x] muistiinpanot / oireet
- [x] juoksuhistoria
- [x] yksinkertainen seuraavan juoksun arvio
- [x] juoksut eivat koskaan nay muille ilman oikeuksia

## 22. Oikeusmalli ja tietoturva

- [x] owner-oikeudet toteutettu
- [x] family-oikeudet toteutettu
- [x] family admin -oikeudet toteutettu
- [x] caretaker-oikeudet toteutettu
- [x] breeder access -oikeudet toteutettu
- [x] vain owner voi poistaa lemmikin
- [ ] yksityisen datan rajat tarkistettu
- [ ] Supabase RLS kattaa yksityisen datan

## 23. Laatu ja viimeistely

- [x] loading-tilat
- [x] error-tilat
- [x] empty statet
- [x] form validation
- [x] saavutettavuus
- [x] suorituskyvyn perussiivous
- [x] kuvien suorituskyvyn tarkistus
- [x] copyjen viimeistely
- [x] designin viimeistely

## 24. Testaus

- [ ] auth flow testattu
- [ ] onboarding testattu
- [ ] ensimmainen lemmikki testattu
- [ ] useampi lemmikki testattu
- [ ] terveystiedot testattu
- [ ] hoito-ohjeet testattu
- [ ] muistutukset testattu
- [ ] pushit testattu
- [x] family-jako testattu
- [x] family admin testattu
- [x] caretaker-jako testattu
- [x] hoitohistoria testattu
- [x] media testattu
- [x] breeder-linkitys testattu
- [ ] iOS manuaalitestaus tehty
- [ ] Android manuaalitestaus tehty

## 25. Julkaisuvalmius

- [x] app iconit
- [x] splash
- [x] bundle id
- [x] Android package name
- [x] EAS build asetettu
- [ ] TestFlight build tehty
- [ ] Android internal testing build tehty
- [x] privacy policy valmiina
- [x] terms valmiina
- [x] store listingit tehty
- [ ] screenshotit tehty
- [x] julkaisuchecklist valmis

---

## Etenemisjarjestys

Tama on suositeltu toteutusjarjestys:

1. Tekninen perusta
2. Supabase ja tietokanta
3. Auth
4. Onboarding
5. Koti
6. Lemmikin luonti ja detail
7. Terveystiedot
8. Hoito-ohjeet
9. Muistutukset
10. Push-notifikaatiot
11. Jakaminen
12. Hoitohistoria ja media
13. Profiili
14. Public-puoli
15. Breeder-puoli
16. Oikeusmalli, viimeistely, testaus ja julkaisu

---

## Status yhteenveto

- [ ] Sprintti 1 valmis
- [ ] Sprintti 2 valmis
- [ ] Sprintti 3 valmis
- [ ] Sprintti 4 valmis
- [ ] Sprintti 5 valmis
- [ ] Sprintti 6 valmis
- [ ] Koko v1 valmis
