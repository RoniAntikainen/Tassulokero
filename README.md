# Tassulokero app

Ensimmäinen koodipohja v1:lle.

## Stack

- Expo
- React Native
- TypeScript
- Supabase
- TanStack Query
- Zustand

## Aloitus

1. `npm install`
2. `npm run start`

## Nykyinen sisältö

- v1-runko tärkeimmille screeneille
- auth-gate ja mock-auth ilman oikeita avaimia
- onboarding owner- ja breeder-poluille
- oikea mobiilinavigaatio React Navigationilla
- mock-data, jotta flow on heti nähtävissä
- design tokenit
- Zustand-pohjainen session ja app state
- muistutukset, jaot ja breeder-runko mock-tilassa
- Supabase SQL -skeema `supabase/migrations`-kansiossa
- `.env.example` Supabase-avaimia varten

## Seuraavat askeleet

1. luo Supabase-projekti ja aja skeema
2. lisää oikeat env-avaimet
3. korvaa mock-storet queryillä ja mutaatioilla
4. kytke storage, push-notifikaatiot ja RLS

## Build-rungot

- `eas.json` sisaltaa nyt profiilit:
- `development` kehityskayttoon
- `preview` sisaisiin testibuildeihin
- `production` julkaisuun

## Julkaisuassetit

- `assets/icon.png`, `assets/adaptive-icon.png` ja `assets/splash.png` on lisatty placeholder-runkona
- ne kannattaa korvata oikeilla brandiassetilla ennen TestFlight- tai Play-buildia

## Julkaisudokumentit

- [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) sisaltaa privacy policy -luonnoksen, joka pitaa viimeistella oikeilla yhteystiedoilla, palveluntarjoajilla ja retention-saannoilla ennen julkaisua
- [TERMS.md](./TERMS.md) sisaltaa kayttoehtoluonnoksen, joka pitaa viimeistella juridisella toimijalla, yhteystiedoilla ja sovellettavalla lailla ennen julkaisua
- [STORE_LISTING.md](./STORE_LISTING.md) sisaltaa App Store- ja Google Play -tekstirungot, joita voi jatkojalostaa lopulliseen julkaisuun
- [SCREENSHOT_PLAN.md](./SCREENSHOT_PLAN.md) sisaltaa screenshot-jarjestyksen, viestit ja kuvaussession valmistelulistan store-julkaisua varten
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) kokoaa buildit, dokumentit, testauksen ja puuttuvat julkaisuasiat yhteen paikkaan
- [BUILD_RUNBOOK.md](./BUILD_RUNBOOK.md) kertoo seuraavat kaytannon komennot ja tarkistukset iOS- ja Android-buildien tekemiseen
- [DEVICE_TEST_SETUP.md](./DEVICE_TEST_SETUP.md) kokoaa minivaatimukset iOS- ja Android-manuaalitestien kaynnistamiseen paikallisessa ymparistossa
- [SMOKE_TEST_SCRIPT.md](./SMOKE_TEST_SCRIPT.md) antaa suoran testikierroksen, jolla iOS- ja Android-manuaalitestit voidaan merkitä valmiiksi heti kun ajoymparisto toimii
