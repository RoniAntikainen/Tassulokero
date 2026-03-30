# Tassulokero Kayttooikeusmalli

## Tavoite

Tama tiedosto lukitsee:

- ketka voivat nahda lemmikin tiedot
- ketka voivat muokata mita
- ketka voivat hallita jakamista
- mita `family`, `family admin` ja `caretaker` kaytannossa tarkoittavat

Tarkoitus on pitaa malli tarpeeksi yksinkertaisena v1:een, mutta silti tarpeeksi tarkkana oikeaan tuotteeseen.

## Roolit

Ensiversion kayttajatyypit:

- `owner`
- `family`
- `family admin`
- `caretaker`

Mahdollinen myohempi rooli:

- `viewer`

## Roolien merkitys

### owner

Lemmikin alkuperainen luoja ja varsinainen omistaja sovelluksessa.

Owner:

- voi tehda kaiken
- voi poistaa koko lemmikin
- voi hallita kaikkia kayttooikeuksia
- on korkein oikeustaso

### family

Perheenjasen tai muu lahella oleva kayttaja, jolla on laaja paasy lemmikin tietoihin.

Family:

- voi nahda kaytannossa kaiken tarpeellisen
- voi muokata tietoja
- ei voi poistaa koko lemmikkia
- ei valttamatta voi hallita jakamista ilman admin-oikeutta

### family admin

Family-kayttaja, jolla on lisaksi jakamisen hallintaoikeudet.

Family admin:

- voi tehda kaytannossa melkein kaiken saman kuin owner
- ei voi poistaa koko lemmikkia
- voi kutsua uusia kayttajia
- voi hallita muiden oikeuksia ownerin asettamissa rajoissa

### caretaker

Tilapainen tai rajattu hoitaja, joka saa vain ne tiedot joita han tarvitsee.

Caretaker:

- nakkee vain erikseen jaetut osiot
- ei voi muokata ydinterveystietoja tai perustietoja
- voi lisata kommentteja
- voi lisata kuvia
- caretakerin lisaama sisalto nakyy kaikille lemmikin jaetuille kayttajille

## Kayttooikeustaulukko

### 1. Lemmikin perustiedot

- owner: saa nahda
- owner: saa muokata
- family: saa nahda
- family: saa muokata
- family admin: saa nahda
- family admin: saa muokata
- caretaker: saa nahda vain jos osio on jaettu
- caretaker: ei saa muokata

Esimerkkeja:

- nimi
- laji
- rotu
- syntymaaika
- sirunumero

### 2. Terveystiedot

- owner: saa nahda
- owner: saa muokata
- family: saa nahda
- family: saa muokata
- family admin: saa nahda
- family admin: saa muokata
- caretaker: saa nahda vain jos osio on jaettu
- caretaker: ei saa muokata

Esimerkkeja:

- rokotukset
- laakitykset
- elainlaakarikaynnit
- allergiat

### 3. Hoito-ohjeet

- owner: saa nahda
- owner: saa muokata
- family: saa nahda
- family: saa muokata
- family admin: saa nahda
- family admin: saa muokata
- caretaker: saa nahda jos ohje on jaettu caretakerille
- caretaker: ei saa muokata

Esimerkkeja:

- ruokinta
- annoskoko
- komennot
- mita valttaa
- paivarutiini

### 4. Muistutukset

- owner: saa nahda
- owner: saa luoda
- owner: saa muokata
- family: saa nahda
- family: saa luoda
- family: saa muokata
- family admin: saa nahda
- family admin: saa luoda
- family admin: saa muokata
- caretaker: ei saa luoda ensiversiossa
- caretaker: ei saa muokata ensiversiossa

Paatetty peruslinja:

- family-puolella muistutukset kuuluvat oletuksena kaikille joille lemmikki on jaettu perhetasolla

### 5. Kommentit ja kuvat

- owner: saa nahda
- owner: saa lisata
- family: saa nahda
- family: saa lisata
- family admin: saa nahda
- family admin: saa lisata
- caretaker: saa lisata
- caretaker: saa nahda

Paatetty peruslinja:

- caretakerin lisaamat kommentit ja kuvat nakyvat kaikille lemmikin jaetuille kayttajille

Tama sisalto kuuluu yhteiseen hoitohistoriaan tai paivitysvirtaan.

### 6. Jakamisen hallinta

- owner: saa kutsua uusia kayttajia
- owner: saa poistaa kayttooikeuksia
- owner: saa muuttaa rooleja
- family: ei saa hallita jakoa oletuksena
- family admin: saa kutsua uusia kayttajia
- family admin: saa hallita jakoa
- caretaker: ei saa hallita jakoa

### 7. Lemmikin poisto

- owner: saa poistaa koko lemmikin
- family: ei saa poistaa koko lemmikkia
- family admin: ei saa poistaa koko lemmikkia
- caretaker: ei saa poistaa koko lemmikkia

Tama on yksi selkeimmista lukituista saannoista.

## Tarkeat lisasaannot

### 1. Caretaker ei saa kaikkea oletuksena

Caretakerin idea ei ole "halvempi perheenjasen", vaan rajattu hoitokaytto.

Siksi:

- caretakerille jaetaan vain ne osiot joita tarvitaan
- osioiden jakaminen kannattaa mallintaa valittavina blokkeina tai oikeuslippuina

### 2. Family admin ei ole sama kuin owner

Vaikka family admin voi hallita paljon:

- owner pysyy lemmikin varsinaisena luojana
- vain owner voi poistaa koko lemmikin

### 3. Kommentointi erotetaan ydindatan muokkauksesta

Tama on tarkea tuote- ja tietomallipaatos.

Caretaker:

- ei muokkaa esimerkiksi rokotuksia tai laakitystietoja
- mutta voi lisata havaintoja, kommentteja ja kuvia

Tama pitaa tuotteen turvallisempana ja selkeampana.

## Suositeltu tietomallin toteutus

V1:ssa tama voidaan toteuttaa yksinkertaisesti:

- `pets.owner_user_id`
- `pet_access.role`
- `pet_access.is_admin`
- tarvittaessa muutama lisalippu caretakerin rajauksille

Esimerkkeja caretaker-jakoon:

- can_view_profile
- can_view_health
- can_view_care_instructions
- can_view_reminders

Kaikkia mahdollisia oikeuksia ei kannata tehda liian hienojakoisiksi heti.

## Selkein suositus

Jos haluatte pitaa v1:n hallittavana, tehkaa oikeustasot nain:

- owner
- family
- family admin
- caretaker

Ja pitakaa muistissa nama kolme ydinsaantoa:

1. vain owner voi poistaa koko lemmikin
2. caretaker nakkee vain erikseen jaetut osiot
3. caretaker voi lisata yhteiseen hoitohistoriaan kommentteja ja kuvia, mutta ei muokkaa ydinterveystietoja
