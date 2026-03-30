# Tassulokero Mita Puuttuu Ennen Koodausta

## Tavoite

Tama tiedosto kertoo rehellisesti:

- mita on jo suunniteltu hyvin
- mita puuttuu viela ennen varsinaista koodausta
- mitka uudet ideat kasvattavat v1:n scopea eniten

Tarkoitus ei ole jarruttaa tekemista, vaan estaa tilanne jossa rakentaminen alkaa ennen kuin vaikeimmat paatokset on tehty.

## Mita on jo hyvalla tasolla

Naista on jo riittavan hyva suunnittelupohja:

- tuotevisio
- MVP ja feature-prioriteetit
- database-rakenne
- kayttooikeusmalli
- muistutuslogiikka
- paascreenit ja navigointi
- screen flowt
- stack ja tekniset valinnat
- rakennusjarjestys

Eli tuote ei ole enaa "pelkka idea", vaan oikeasti rakennettava kokonaisuus.

## Mita puuttuu viela ennen koodausta

### 1. Kasvattajaominaisuuksien tarkka rajaus

Uusi paatos:

- appiin halutaan mukaan kasvattajan arkea helpottavia ominaisuuksia
- erityisesti juoksujen kirjaaminen ja seuraavien juoksujen arviointi

Tama vaatii viela tarkennuksen:

- kirjataanko vain juoksujen paivamaarat
- kirjataanko alku ja loppu
- kirjataanko oireita tai havaintoja
- halutaanko vain arvio tulevasta jaksosta vai oikea historiallinen seuranta
- koskeeko tama vain narttuja vai tuleeko kasvattajalogiiikkaa laajemminkin

### 2. Juoksulogiikan tietomalli

Jos kasvattajaominaisuudet tulevat v1:een, pitaa paattaa:

- tuleeko erillinen `heat_cycles`-taulu
- millaiset kentat silla on
- miten ennuste lasketaan
- voiko kayttaja muokata arvioita

Ilman tata juoksuominaisuutta ei kannata alkaa koodata puoliksi.

### 3. UI-rajaus v1:lle

Tassa kohtaa v1 on jo melko laaja.

Koska mukaan halutaan:

- lemmikkikansio
- muistutukset
- jakaminen
- kuvat
- kasvattajatyokalut

pitaisi viela paattaa:

- mitka ruudut toteutetaan ensimmaisessa rakennusjaksossa
- mitka siirretaan toiseen rakennusjaksoon saman v1:n sisalla

## Mita ehdottomasti kannattaa paattaa ennen koodia

Ennen koodausta kannattaa lukita ainakin nama:

1. Milla tietomallilla juoksut kirjataan
2. Miten juoksuennuste lasketaan ensiversiossa

## Rehellinen riskikohta

Nama kaksi lisausta kasvattavat scopea eniten:

- kasvattajalogiiikka

Ne eivat ole huonoja ideoita.

Mutta ne muuttavat tuotetta paljon:

- lemmikin tiedonhallinta-appista
- osittain kasvattajatyokaluksi

Tama on ihan mahdollinen suunta, mutta se kannattaa tiedostaa.
- kommentit
- iso somefeed

### Kasvattajapuoli v1:ssa

Pidetaan v1:ssa selkeana:

- juoksujen kirjaus
- aiempien juoksujen historia
- yksinkertainen arvio seuraavasta juoksusta historian perusteella

Ei viela pakollisesti:

- raskas jalostuslogiikka
- monimutkainen analytiikka
- liian laaja kasvattajakohtainen dashboard

## Selkein lopputuomio

Ennen koodausta puuttuu enaa muutama iso paatos, ei koko suunnitelma.

Tarkeimmat viela auki olevat kohdat ovat:

- kasvattajaominaisuuksien tarkka rajaus
- tietosuojan tarkka rajaus

Kun naihin on vastattu, teilla on jo oikeasti riittavan valmis suunnitelma aloittaa toteutus.
