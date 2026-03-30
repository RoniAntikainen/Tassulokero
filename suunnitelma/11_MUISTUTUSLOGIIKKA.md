# Tassulokero Muistutuslogiikka

## Tavoite

Tama tiedosto lukitsee:

- millaisia muistutuksia appissa on
- kenelle muistutukset kuuluvat
- miten muistutus syntyy
- miten muistutus kuitataan
- mita tehdään v1:ssa ja mita ei

Muistutukset ovat yksi tuotteen tarkeimmista ydintoiminnoista, joten niiden pitaa olla todella selkeat.

## Perusajatus

Muistutus ei ole vain pieni lisatoiminto.

Muistutus on:

- syy palata appiin
- tapa pitaa tarkeat asiat kunnossa
- tapa tehda tuotteesta oikeasti arkihyodyllinen

Siksi muistutuksilla on oma taulunsa ja oma elinkaarensa.

## Muistutusten tyypit v1:ssa

V1:ssa riittavat seuraavat muistutustyypit:

### 1. Manuaalinen muistutus

Kayttaja luo itse muistutuksen.

Esimerkkeja:

- anna laake
- varaa elainlaakari
- tarkista korvat
- osta ruokaa

### 2. Rokotusmuistutus

Muistutus liittyy rokotetietoon.

Esimerkkeja:

- rokote vanhenee
- tehoste lahestyy

### 3. Laakitysmuistutus

Muistutus liittyy laakitykseen.

Esimerkkeja:

- laake alkaa
- laake loppuu
- paivittainen muistutus

### 4. Kaynti- tai tarkastusmuistutus

Muistutus liittyy elainlaakarikayntiin tai seurantaan.

Esimerkkeja:

- kontrollikaynti
- uusintakaynti

## Muistutuksen peruskentat

Muistutuksella tulisi olla ainakin:

- otsikko
- kuvaus
- liittyva lemmikki
- deadline tai ajankohta
- tyyppi
- tila
- kenelle muistutus kuuluu

Tietokannan kannalta perusmalli:

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
- updated_at

## Kenelle muistutus kuuluu

Lukittu paatos:

- family-puolella muistutus kuuluu oletuksena kaikille, joille lemmikki on jaettu perhetasolla

Tama tarkoittaa kaytannossa:

- owner luo muistutuksen
- family-kayttajat saavat saman muistutuksen nakyviin
- caretaker ei saa samoja muistutuksia oletuksena

Suositeltu v1-toteutus:

- muistutus kopioidaan omaksi rivikseen jokaiselle asiaankuuluvalle kayttajalle

Syy:

- kuittaus voidaan teha kayttajakohtaisesti
- jokaisella on oma status
- logiikka pysyy yksinkertaisempana kuin jaetussa yhteismuistutuksessa

## Caretaker ja muistutukset

Lukittu paatos v1:een:

- caretaker ei luo omia muistutuksia
- caretaker ei hallitse muistutuksia
- caretakerin rooli on nahda jaetut tiedot ja lisata kommentteja ja kuvia

Tama pitaa caretaker-roolin selkeana.

## Muistutuksen elinkaari

Muistutuksella on selkea tila.

Suositeltu v1-tila:

- `pending`
- `completed`
- `cancelled`

Elinkaari:

1. muistutus luodaan
2. muistutus nakyy tulevana
3. deadline lahestyy
4. muistutus kuitataan valmiiksi tai perutaan

## Miten muistutus luodaan

V1:ssa muistutus voi syntya kahdella tavalla:

### 1. Kayttaja luo muistutuksen itse

Esimerkki:

- "Anna matolaake ensi maanantaina"

### 2. Muistutus luodaan jonkin muun tiedon pohjalta

Esimerkki:

- rokotukselle annetaan `valid_until`
- appi ehdottaa tai luo muistutuksen

Suositus v1:een:

- sallikaa automaattinen tai puoliautomaattinen luonti vain yksinkertaisille tapauksille
- ei liian monimutkaista recurrence enginea viela

## Toistuvuus

Tama on yksi tarkeimmista rajauksista.

Suositus:

- v1:ssa vain yksinkertainen toistuvuus tai ei toistuvuutta lainkaan

Jos toistuvuus otetaan mukaan v1:een, pitakaa se hyvin rajattuna:

- daily
- weekly
- monthly

Mutta:

- ei monimutkaisia custom repeat ruleja viela

Jos haluatte pitaa v1:n kevyempana:

- sallikaa ensin vain kertamuistutukset
- lisatkaa toistuvuus heti sen jalkeen

## Ilmoitukset

V1:ssa riittaa:

- push-ilmoitus
- mahdollisesti email myohemmin, mutta ei pakollinen heti

Muistutuksen kannalta tarkeaa ei ole vain ilmoitus, vaan:

- muistutus nakyy appissa selkeasti
- tanaan tehtavat asiat loytyvat nopeasti

## Muistutusten nayttotapa

Muistutuksia tulee nakya ainakin naissa paikoissa:

### 1. Etusivu

- yhteenveto tulevista tai tanaan ajankohtaisista muistutuksista

### 2. Muistutukset-screeni

- kaikki muistutukset
- suodatus lemmikin mukaan
- ryhmittely esimerkiksi:
  - tanaan
  - tulossa
  - myohassa
  - valmiit

### 3. Lemmikin detail-sivu

- vain taman lemmikin muistutukset

## Kuittauslogiikka

Koska muistutukset ovat kayttajakohtaisia riveja:

- jokainen family-kayttaja voi kuitata oman muistutuksensa

Jos haluatte myohemmin mallin, jossa yksi kuittaus sulkee muistutuksen kaikilta:

- se kannattaa lisata vasta myohemmin erillisena logiikkana

V1:ssa helpoin malli on:

- kuittaus on kayttajakohtainen

## Mita ei kannata tehda v1:ssa

- ei monimutkaista recurrence enginea
- ei caretakerille muistutusten hallintaa
- ei liian montaa muistutustyyppia
- ei liikaa automaattisia saantoja
- ei monimutkaista snooze- ja escalation-jarjestelmaa

## Selkein suositus

Jos haluatte pitaa v1:n hallittavana, tehkaa nain:

- manuaaliset muistutukset
- rokotuksiin liittyvat muistutukset
- laakityksiin liittyvat muistutukset
- kaynteihin liittyvat muistutukset
- muistutus kopioidaan perhekayttajille omiksi riveikseen
- caretaker ei hallitse muistutuksia
- kuittaus on kayttajakohtainen

Tama riittaa jo todella vahvaan ensiversioon.
