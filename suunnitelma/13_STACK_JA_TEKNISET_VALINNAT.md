# Tassulokero Stack Ja Tekniset Valinnat

## Tavoite

Tama tiedosto lukitsee ensiversion tekniset paatokset:

- milla frontend rakennetaan
- milla backend rakennetaan
- miten auth tehdaan
- miten data haetaan
- miten state hallitaan
- mitka asiat tulevat v1:een ja mitka valmistellaan myohempaa varten

## Lukitut valinnat

### Frontend

Suositus ja paatos:

- `React Native + Expo`

Miksi:

- sopii hyvin nykyiseen React- ja web-taustaan
- nopeampi ja varmempi tie oikeaan julkaistavaan appiin
- hyva tuki iOS + Android -julkaisuun
- pystyy ihan oikeasti hienoon ja laadukkaaseen lopputulokseen

### Backend

Suositus ja paatos:

- `Supabase`

Miksi:

- valmiina auth
- valmiina PostgreSQL
- valmiina storage
- halvempi ja nopeampi alku kuin oma backend
- riittaa hyvin taman tuotteen ensiversioon

### Tietokanta

Suositus ja paatos:

- `PostgreSQL` Supabasen kautta

Miksi:

- datamalli on rakenteinen
- suhteita on paljon
- lemmikit, jaot, muistutukset ja hoitotiedot sopivat hyvin relaatioihin

### Auth

V1:

- `email + salasana`

Myohemmin helposti lisattavaksi:

- Google login
- Apple login

Paatetty linja:

- v1 pidetaan yksinkertaisena
- auth-rakenne tehdaan niin, etta social loginit on helppo lisata myohemmin

### State management

Suositus ja paatos:

- `Zustand`

Miksi:

- kevyt mutta selkea
- sopii hyvin appin UI- ja paikallisen tilan hallintaan
- auttaa pitamaan koodin siistimpana kun appi kasvaa

### Server-state ja datan haku

Suositus ja paatos:

- `TanStack Query`

Miksi:

- datan haku pysyy siistina
- cache toimii paremmin
- detail-sivut, listat ja muistutukset pysyvat helpommin synkassa
- parempi skaalautuvuus kuin kokonaan kasin tehdyssa fetch-logiikassa

## Media

V1:

- teksti
- kuvat

Ei viela v1:

- ei erillista laajaa mediatukea

Suositus:

- kuvat tallennetaan Supabase Storageen
- tietokantaan tallennetaan vain metadata

## Ilmoitukset

V1:

- push-notifikaatiot mukana heti

Miksi:

- muistutukset ovat tuotteen ydintoiminto
- pelkka appin sisainen lista ei riita tuottamaan oikeaa arvoa

## Future-ready linjaukset

Naita ei tehda heti, mutta arkkitehtuuri valmistellaan niille:

### 1. Monetisointi

- kaikki ydinkaytto on ensivaiheessa ilmaista
- koodi rakennetaan niin, etta plan- tai feature-gating voidaan lisata myohemmin

### 2. Social login

- Google
- Apple

### 3. Kuvapainotteinen media

- media pidetaan ensivaiheessa kuvapainotteisena ja helposti laajennettavana

## Suositeltu tekninen kokonaisuus

Jos kirjoitetaan koko ensiversion stack yhteen riviin, se on:

- React Native
- Expo
- TypeScript
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Zustand
- TanStack Query

## Mita ei lukita viela liian aikaisin

Naista ei tarvitse paattaa juuri nyt:

- tarkka navigaatiokirjasto
- tarkka komponenttikirjasto
- maksupalvelu
- analytics-palvelu
- crash reporting -palvelu

Ne voidaan paattaa seuraavassa teknisessa vaiheessa.

## Selkein suositus

Teidan kannattaa lahtea rakentamaan tassa jarjestyksessa:

1. Expo + React Native -projekti
2. Supabase-projekti
3. auth valmiiksi email + salasana
4. tietokannan perustaulujen luonti
5. Zustand- ja TanStack Query -pohja
6. ensimmaiset screenit

Tama on todella vahva ja realistinen ensiversion tekninen pohja.
