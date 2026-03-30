# Tassulokero Screen Flowt

## Tavoite

Tama tiedosto kuvaa:

- mista kayttaja aloittaa
- mihin han seuraavaksi menee
- mitka ovat sovelluksen tarkeimmat kulkureitit

Tarkoitus ei ole piirtää lopullista UI:ta, vaan lukita ruutujen ja siirtymien logiikka.

## Paaflowt

V1:n kannalta tarkeimmat flowt ovat:

1. onboarding ja ensimmainen lemmikki
2. etusivulta lemmikin tietoihin
3. muistutuksen luonti ja kuittaus
4. perhejakaminen
5. caretaker-jakaminen
6. caretakerin kayttopolku
7. kommentin tai kuvan lisaaminen
8. owner vs breeder onboarding-haarautuminen
9. kasvattajalinkityksen hyväksyntä

## Flow 1: Uusi kayttaja

Polku:

1. Splash tai app start
2. Kirjaudu sisaan tai luo tili
3. Ensimmainen onboarding-nakyma
4. Luo ensimmainen lemmikki
5. Paatyy kotiin

Tarkeat huomiot:

- kayttajan pitaa paasta nopeasti "ensimmainen lemmikki luotu" -hetkeen
- onboarding ei saa olla liian raskas

## Flow 1B: Owner vs breeder onboarding

Polku:

1. Tilin luonti
2. Valitse oletko owner vai breeder
3. Jos owner:
   - luodaan owner-profiili
4. Jos breeder:
   - luodaan breeder-profiili
   - voidaan kysya kennel-nimi tai jattaa se myohempaan
5. Jatka ensimmaisen lemmikin luontiin

Huomio:

- roolia voi muuttaa myohemmin asetuksista
- tämä ei saa estää nopeaa käyttöönottoa

Minimidata ensimmaiseen lemmikkiin:

- nimi
- laji
- kuva valinnainen

Muut tiedot voi tayttaa myohemmin.

## Flow 2: Etusivulta lemmikin detail-sivulle

Polku:

1. Koti
2. Kayttaja napauttaa lemmikkikorttia
3. Lemmikin detail-sivu avautuu

Lemmikin detail-sivun osiot:

- yleiskatsaus
- terveys
- hoito
- paivitykset
- media
- jako

Huomio:

- jos kayttajalla on yksi lemmikki, etusivun esitystapa voi olla isompi
- siirtyma on silti sama

## Flow 3: Muistutuksen luonti

Polku:

1. Koti tai Muistutukset
2. Lisaa
3. Valitse "Luo muistutus"
4. Valitse lemmikki
5. Tayta tiedot
6. Tallenna
7. Palaa muistutuksiin tai lemmikin detailiin

Tarkeat valinnat:

- otsikko
- kuvaus
- paivamaara tai aika
- muistutustyyppi

Jos muistutus liittyy suoraan rokotukseen, laakitykseen tai kayntiin:

- se voidaan luoda myos kyseisen tiedon luonnin yhteydessa

## Flow 4: Muistutuksen kuittaus

Polku:

1. Koti tai Muistutukset
2. Kayttaja avaa muistutuksen
3. Kuittaa valmiiksi
4. Muistutus siirtyy completed-tilaan

Huomio:

- family-puolella jokaisella kayttajalla on oma muistutusrivinsa
- kuittaus on kayttajakohtainen

## Flow 5: Perhejakaminen

Polku:

1. Koti
2. Lemmikin detail-sivu
3. Jako-osio
4. Kutsu uusi kayttaja
5. Valitse rooliksi family
6. Halutessa anna admin-oikeus
7. Laheta kutsu

Tuloksena:

- kutsuttu kayttaja saa paasy lemmikin tietoihin
- family-kayttaja nakee lemmikin koti- tai lemmikkilistassaan

## Flow 6: Caretaker-jakaminen

Polku:

1. Koti
2. Lemmikin detail-sivu
3. Jako-osio
4. Kutsu uusi kayttaja
5. Valitse rooliksi caretaker
6. Valitse jaettavat osiot
7. Laheta kutsu

Jaettavia osioita voivat olla esimerkiksi:

- perustiedot
- terveys
- hoito-ohjeet
- muistutusten nakyma

Huomio:

- caretaker ei saa kaikkea oletuksena
- juuri tama flow on yksi tuotteen tarkeimmista erottautumisjutuista

## Flow 7: Caretakerin kayttopolku

Polku:

1. Caretaker avaa appin
2. Nakee jaetun lemmikin
3. Avaa lemmikin detail-sivun
4. Nakee vain ne osiot jotka on jaettu
5. Voi lisata kommentin tai kuvan

Huomio:

- caretaker ei muokkaa ydinterveystietoja
- caretaker tuottaa yhteiseen hoitohistoriaan paivityksia

## Flow 8: Kommentin tai kuvan lisaaminen

Polku:

1. Lemmikin detail-sivu
2. Paivitykset tai Media
3. Lisaa kommentti tai media
4. Tallenna
5. Sisalto tulee nakyviin kaikille joille lemmikki on jaettu

Sisalto voi olla:

- pelkka kommentti
- kommentti + kuva
V1 tarkennus:

- sisaisessa lemmikkikaytossa kommentti + kuva

## Flow 9: Lemmikin tietojen muokkaus

Polku:

1. Lemmikin detail-sivu
2. Muokkaa
3. Paivita tiedot
4. Tallenna

Oikeudet:

- owner: saa muokata
- family: saa muokata
- family admin: saa muokata
- caretaker: ei saa muokata ydintietoja

## Flow 10: Lemmikin poisto

Polku:

1. Lemmikin detail-sivu
2. Asetukset tai hallinta
3. Poista lemmikki
4. Vahvista poisto

Oikeus:

- vain owner

Tama kannattaa pitaa poissa normaalin muokkauksen yhteydesta, jotta sita ei paineta vahingossa.

## Flow 11: Profiilin asetukset

Polku:

1. Profiili
2. Profiilin asetukset
3. Muokkaa:
   - nayttonimi
   - bio
   - ilmoitusasetukset
4. Tallenna

## Flow 12: Kasvattajalinkityksen hyväksyntä

Polku:

1. Koiran omistaja saa pyynnon tai ehdotuksen linkityksestä
2. Omistaja avaa linkityksen
3. Hyväksyy tai hylkää
4. Halutessa paattaa myös:
   - näkyykö koira kasvattajan kasvatit-osiossa
   - mita oikeuksia kasvattajalle jaa

## Tarkein flow ensiversion onnistumiselle

Jos yksi flow pitää saada todella sujuvaksi, se on tama:

1. luo lemmikki
2. lisaa tarkeimmat tiedot
3. jaa lemmikki toiselle
4. toinen avaa tiedot helposti
5. hoitaja pystyy lisaamaan paivityksen takaisin

Tama on tuotteen ydinlupaus.

## Mita ei kannata tehda liian raskaasti

- ei liian monta pakollista askelta onboardingiin
- ei liian syvaa navigaatiota
- ei erillista screenia jokaiselle pienelle muistiinpanolle
- ei liian monimutkaista kutsuprosessia

## Selkein suositus

Jos haluatte pitaa v1:n hallittavana, suunnitelkaa ja wireframekaa ensin nama ruudut:

1. Auth
2. Luo lemmikki
3. Koti
4. Lemmikin detail
5. Muistutukset
6. Jako
7. Lisaa kommentti tai media

Kun nama toimivat hyvin, suurin osa tuotteen ytimestä on jo kasassa.
