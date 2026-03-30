# Tassulokero Seuraavat Paatokset

## Tarkein uusi paatos

Tuotteen ensivaiheen kaupallinen linja:

- devissa ja ensivaiheen tuotteessa kaikki ydinkaytto on ilmainen
- maksumuuria ei laiteta viela kayttoon
- koodi ja tietomalli rakennetaan niin, etta maksumuuri voidaan lisata myohemmin ilman suurta refaktorointia

Tama tarkoittaa kaytannossa:

- kaikki voivat ottaa appin kayttoon helposti
- kaikki voivat vastaanottaa jaettuja tietoja helposti
- kasvu ja kaytettavyys menevat nyt rahan edelle
- ansainta pidetaan arkkitehtuurissa mahdollisena, mutta ei aktiivisena

## Namat kannattaa paattaa seuraavaksi

1. mikä on MVP:n pienin julkaistava ydin
2. mitä tietokantaa käytetään
3. tehdäänkö backend Supabasella vai omana palveluna
4. tuleeko muistutukset heti v1:een vai vasta v1.1:een
5. tuleeko perhekäyttö heti MVP:hen
6. tuleeko hoitajajako heti MVP:hen vai heti sen jälkeen
7. miten future paywall huomioidaan tietomallissa ja koodissa ilman että sitä aktivoidaan vielä

## Suositusjarjestys

1. lukitkaa MVP
2. lukitkaa tietomalli
3. lukitkaa stack
4. lukitkaa jakoroolit
5. lukitkaa future monetization -rajapinta
6. piirtakaa 5 tarkeinta nayttoa
7. vasta sitten aloittakaa varsinainen koodaus

## Mita "future monetization ready" tarkoittaa

Tehkaa jo nyt valmiiksi ajatus naista:

- kayttajalla voi olla myohemmin `plan`
- ominaisuuksia voidaan myohemmin rajata feature flag -tyylisesti
- mahdollinen maksullisuus ei saa sotkea ydindataa tai kayttooikeusmallia

Hyva perusmalli myohemmaksi:

- `free`
- `premium`
- mahdollisesti myohemmin `family_plus`

Mutta:

- naita ei tarvitse viela nayttaa kayttajalle
- naita ei tarvitse viela myyda kayttajalle

## Kaytannon toteutuslinja

Tehkaa koodi niin, etta myohemmin voi lisata:

- `users.plan`
- `users.plan_status`
- `feature_access`-tarkistukset sovelluslogiikkaan
- payment-provider integraation ilman että ydintauluja pitaa muuttaa rajusti

Mutta tehkaa samalla niin, etta:

- kaikki feature checkit palauttavat nyt kaytannossa `true`
- appi pysyy koko dev-vaiheen ajan ilmaisena

## Mitä ei kannata tehdä vielä

- ei Stripe- tai RevenueCat-integraatiota heti
- ei paywall-näkymiä heti
- ei turhaa pricing-UI:ta heti
- ei free/premium-copya appiin vielä

## Käytännön seuraava askel

Seuraava oikea tehtävä ei ole vielä koodaus.

Se on:

`piirtakaa tietokanta, jakomalli, kayttooikeusmalli ja future paywall -valmius kerran kunnolla lapi`

Kun tama tehdään hyvin:

- ensiversio pysyy kevyena
- kasvu ei tukehdu liian aikaiseen maksumuuriin
- rahan tekeminen voidaan lisata nopeasti myohemmin

## Lukitut tuotepaatokset 2026-03-27

### Jakoroolit

- vain lemmikin luoja eli owner voi poistaa koko lemmikin
- `family` voi saada admin-oikeudet
- jos `family`-kayttajalla on admin-oikeudet, han voi kaytannossa hallita kaikkea muuta paitsi poistaa koko lemmikin
- `caretaker` nakkee vain ne osiot, jotka owner tai admin erikseen jakaa
- `caretaker` voi lisata kommentteja lemmikista
- `caretaker` voi lisata myos kuvia
- `caretaker`-sisalto nakyy kaikille, joille lemmikki on jaettu

### Muistutukset

- perheen puolella muistutukset kuuluvat oletuksena kaikille, joille lemmikki on jaettu family-tyyppisesti

### Etusivu

- etusivu ei perustu yhteen valittuun lemmikkiin
- etusivulla nakyy sommiteltu lista omista lemmikeista
- lemmikilla on esimerkiksi pyorea kuva ja nimi
- muistutukset nakyvat samassa kokonaisuudessa
- jos kayttajalla on vain yksi lemmikki, se voidaan nayttaa isompana

### V1-linja

- liitteet ja kuvat tulevat mukaan jo v1:een
- tavoitteena on tehda kunnollinen v1, ei liian riisuttua demo-MVP:ta
- tuotetta ei silti saa paisuttaa turhaan ominaisuuksilla, jotka eivat tue ydinkayttoa

- rotu
- ika
- kuva
- julkaisut
- kuvat
- muut erikseen julkistetut asiat

Omistajan ja kasvattajan tiedot nakyvat vain niissa jaoissa ja linkityksissa, joihin on annettu oikeus.

### Julkaisut

- julkaisu voi olla tehty koiran profiiliin
- julkaisu voi olla tehty omistajan profiiliin
### Koiran omistajuus ja kasvattajalinkitys

- koiralla on aina yksi varsinainen profiilin omistaja
- omistaja voi olla tavallinen owner tai breeder
- koiran profiili on yksi yhteinen profiili, ei erillisia kopioita omistajalle ja kasvattajalle
- kasvattaja voidaan linkata koiraan
- kasvattaja voi luoda profiilin ensin ja siirtaa omistajuuden myohemmin uudelle omistajalle
- siirron jalkeen kasvattaja jaa linkitetyksi
- kasvattajalle voidaan jattaa oikeuksia profiiliin
- kasvattajalinkityksen hyväksyntä tehdään yksinkertaisella hyväksy tai hylkää -flowlla, ei monimutkaisella kutsuketjulla

### Breeder access

- kasvattajalla on oletusoikeudet, joita voi laajentaa tai supistaa per koira
- oletuksena kasvattaja saa nahda ja muokata juoksutietoja
- oletuksena kasvattaja saa nahda terveystiedot mutta ei muokata niita
- oletuksena kasvattaja ei nae muistutuksia
- omistaja voi halutessaan antaa kasvattajalle muistutusoikeuksia

### Kasvattajalinkitys koiraan

- kasvattajaprofiilissa on `kasvatit`-osio
- omistaja voi hyvaksyä tai hylata, nakyyko koira kasvattajan kasvattina
- kasvattajalinkitys pitää hyväksyä ylipäätään

### Juoksut ja kasvattajalogiiikka

- juoksut näkyvät vain perheelle ja oikeudet saaneille
- juoksusta voi kirjata:
  - vain alkamispaivan
  - alku- ja loppupaivan
  - alku- ja loppupaivan + muistiinpanot tai oireet
- seuraavien juoksujen arvio tarkentuu historian karttuessa

### Onboarding

- onboarding haarautuu kahteen polkuun:
  - owner
  - breeder
- owner-polku luo tavallisen omistajaprofiilin
- breeder-polku luo kasvattajaprofiilin, johon voi lisata kennel-tiedon
- roolia voi muuttaa myohemmin asetuksista
