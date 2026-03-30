# Tassulokero Lisaominaisuudet Ja Prioriteetit

## Tavoite

Taman tiedoston tarkoitus on lukita, mita rakennetaan:

- heti
- seuraavaksi
- vasta paljon myohemmin
- ei ainakaan nyt

Tarkeinta on valttaa liian iso ensiversio. Tuotteen arvon pitaa syntya ensin yhdesta todella hyvin toimivasta ytimesta:

`kaikki tarkea tieto lemmikista yhdessa paikassa, muistutuksilla ja turvallisella jakamisella`

## Paatoslogiikka

Ominaisuus kuuluu MVP:hen vain jos se tayttaa ainakin yhden naista ehdoista:

- se tukee suoraan ydinkayttotilannetta
- se tekee appista paivittain hyodyllisen
- se tukee muistutuksia tai jakamista
- sen puuttuminen tekisi tuotteesta heti vajaalta tuntuvan

Ominaisuus ei kuulu MVP:hen jos:

- se on "kiva lisa", mutta ei ratkaise ydiongelmaa
- se kasvattaa tuotetta paljon teknisesti
- se vaatii paljon uutta UI:ta, dataa tai turvallisuuslogiikkaa
- sen arvo tulee vasta kun kayttajia on jo enemman

## MVP

Namat kannattaa joko ottaa mukaan ensiversioon tai lukita heti rakennusjarjestyksen alkuun.

### 1. Useampi lemmikki

Miksi:

- monella kayttajalla on useampi kuin yksi lemmikki
- ilman tata tuote tuntuu heti rajatulta

### 2. Muistutukset

Miksi:

- yksi tuotteen suurimmista arvolupauksista
- syy palata appiin uudestaan

Esimerkkeja:

- rokotusmuistutus
- laakemuistutus
- tarkastusmuistutus

### 3. Perhejako

Miksi:

- samaa lemmikkia hoitaa usein useampi ihminen
- yhteinen muokkaus tekee tuotteesta aidosti arjessa kaytettavan

Tavoite:

- perheenjasen voi nahda kaiken
- perheenjasen voi muokata kaikkea tarpeellista

### 4. Hoitajajako

Miksi:

- todella konkreettinen kayttotilanne
- erottaa tuotteen tavallisesta muistiinpanosovelluksesta

Tavoite:

- omistaja voi jakaa vain tarvittavat tiedot
- hoitaja voi katsoa nopeasti mita pitaa tehda
- hoitaja voi lisata kommentteja ja kuvia kaikille nakyvaan yhteiseen hoitohistoriaan

### 5. Hoito-ohjeet

Miksi:

- juuri tama tekee jaosta oikeasti hyodyllista
- helppo ymmartaa ja helppo myyda kayttajalle

Esimerkkeja:

- ruoka
- annoskoko
- komennot
- laakkeet
- mita valttaa

### 6. Tarkeat terveystiedot

Miksi:

- tuotteen ydin ei ole vain "muistiinpanot", vaan tarkea tieto
- kayttaja odottaa tallentavansa ainakin nama heti

Esimerkkeja:

- rokotukset
- laakitykset
- elainlaakarikaynnit
- allergiat

## V1.1

Namat ovat vahvoja seuraavan version ominaisuuksia, mutta niita ei tarvitse saada mukaan heti ensijulkaisuun.

### 1. Paivarutiinit

Esimerkkeja:

- aamu
- ilta
- ulkoilu
- ruokinta
- laakkeet

Miksi:

- tekee hoidosta helpompaa
- toimii hyvin jaettuna sisaltona

### 2. Toistuvat tehtavat

Esimerkkeja:

- matolaake
- kynsien leikkaus
- turkinhoito
- pesu

Miksi:

- vahvistaa muistutuspuolta
- antaa kayttajalle konkreettista hyotya arkeen

### 3. Hatakortti

Sisalto:

- elainlaakari
- paivystys
- vakuutusnumero
- allergiat
- kriittiset ohjeet

Miksi:

- todella hyodyllinen oikeassa tilanteessa
- tekee tuotteesta turvallisemman tuntuisen

## Myohemmin

Namat voivat olla hyvia, mutta vasta kun ydintuote toimii oikeasti hyvin.

### 1. Paivakirja

Esimerkkeja:

- soiko normaalisti
- laakkeet annettu
- vointi
- oireet

Miksi myohemmin:

- hyodyllinen, mutta ei valttamaton aivan alkuun
- voi kasvaa nopeasti suureksi kokonaisuudeksi

### 2. Paino- ja terveyshistoria

Esimerkkeja:

- painokayra
- oirehistoria
- toipumisen seuranta

Miksi myohemmin:

- vaatii enemman visualisointia
- ei ole ensimmainen syy asentaa appia

### 3. Aikajana kaikista tapahtumista

Miksi myohemmin:

- parantaa kayttokokemusta
- mutta data kannattaa rakentaa ensin kunnolla rakenteiseksi

### 4. Tilapainen jakolinkki

Miksi myohemmin:

- hyodyllinen, mutta vaatii tarkkaa turvallisuusajattelua

### 5. PDF tai export

Miksi myohemmin:

- hyva lisa
- ei ydinkayttoa ensivaiheessa

## Tarkennus uusien paatosten mukaan

Koska haluatte nyt v1:een myos:

- kasvattajaa helpottavia ominaisuuksia

niita ei pideta enaa "ehka joskus" -tasolla.

Mutta ne kannattaa rajata tarkasti.

### Kasvattajaominaisuudet v1:ssa

Mukaan:

- juoksujen kirjaus
- juoksuhistoria
- yksinkertainen arvio seuraavasta juoksusta aiemman historian perusteella
- kasvattajalinkitys koiraan
- breeder access oletusoikeuksilla, joita voi laajentaa tai supistaa

Ei viela:

- liian laaja jalostusanalytiikka
- monimutkaiset kasvattajaraportit

### Kasvattajaominaisuudet v1:ssa

Mukaan:

- kasvattajalinkityksen hyvaksynta
- breederin kasvatit-osio
- yksinkertainen owner/breeder onboarding-haarautuminen
- juoksutiedot ja niiden rajattu nakyvyys

Ei viela:

- raskas algoritminen feed
- useat reaktiot
- laajemmat mediatyypit
- monimutkaiset suositusmallit
- kommenttiketjut
- monimutkaiset ranking-algoritmit

Tama rajaus pitaa tuotteen viela hallittavana, vaikka scope kasvaakin.

## Ehka ei koskaan tai vasta paljon myohemmin

Namat kuulostavat helposti hyviltakin, mutta voivat vieda tuotteen vaaraan suuntaan.

### 1. Chat

Miksi ei alkuun:

- iso yllapidettava kokonaisuus
- ei kuulu tuotteen ydinongelmaan

### 2. Sosiaalinen feed tai yhteiso

Miksi ei alkuun:

- on kaytannossa eri tuote
- hajottaa fokusta pahasti

### 3. Liian monimutkaiset elainlaakarintegraatiot

Miksi ei alkuun:

- teknisesti raskaita
- hitaita toteuttaa
- riippuvat ulkopuolisista toimijoista

### 4. Kaiken kattava hyvinvointialusta

Miksi ei alkuun:

- liian iso scope
- ensiversio hajoaa helposti "tehdaan kaikki" -ongelmaan

## Suositeltu rakennusjarjestys

Rakentakaa mieluummin tassa jarjestyksessa:

1. Auth
2. Useampi lemmikki
3. Perustiedot
4. Rokotukset, laakitykset ja elainlaakarikaynnit
5. Muistutukset
6. Perhejako
7. Hoitajajako
8. Hoito-ohjeet
9. Paivarutiinit
10. Toistuvat tehtavat

## Selkein suositus teille nyt

Jos haluatte pitaa tuotteen oikeasti hallittavana, hyva ensiversion raja on tama:

- auth
- useampi lemmikki
- lemmikin perustiedot
- rokotukset
- laakitykset
- elainlaakarikaynnit
- muistutukset
- perhejako
- hoitajajako
- hoito-ohjeet

Jattakaa ensiversiosta pois ainakin:

- chat
- yhteisominaisudet
- raskaat integraatiot
- liian laaja paivakirja
- exportit ja lisaraportit

Tama riittaa jo oikeasti hyodylliseen ja myytavaan ensituotteeseen.

## Tarkennus nykyisen paatoksen mukaan

Koska haluatte tehda kunnollisen v1:n ettekä liian riisuttua demoa:

- kuvat kuuluvat mukaan jo v1:een
- liitteiden perusmuoto kuuluu mukaan jo v1:een
- varsinainen rajaus ei ole "tehdaan mahdollisimman vahan"
- oikea rajaus on "tehdaan vain ne asiat, jotka tukevat ydinkayttoa todella hyvin"
