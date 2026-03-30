# Tassulokero Paascreenit Ja Navigointi

## Tavoite

Tama tiedosto lukitsee:

- appin tarkeimmat naytot
- mika on oikea etusivu
- miten kayttaja liikkuu screenista toiseen
- mita kannattaa laittaa bottom navigationiin ja mita ei

Tarkoitus on estaa tilanne, jossa appiin syntyy liikaa irrallisia nakymia ilman selkeaa rakennetta.

## Perusajatus

Appin etusivu ei ole yksi valittu lemmikki.

Etusivu on:

- kayttajan oma nakyma
- lista lemmikeista
- yhdistetty muistutusnakyma

Jos kayttajalla on vain yksi lemmikki:

- sita voidaan nayttaa etusivulla isompana
- mutta rakenne ei silti perustu vain siihen yhteen lemmikkiin

## Suositeltu navigointimalli

Paras ensiversion malli on:

- bottom navigation
- stack-navit yksittaisten screenien sisalla

Suositeltu bottom nav:

1. Koti
2. Muistutukset
3. Lisaa
4. Jaot
5. Profiili

Huomio:

- lemmikin oma detail-sivu ei kuulu bottom navigationiin
- se avataan kotinakyman kautta

## Paascreenit

### 1. Koti

Tama on appin ensimmainen varsinainen paanakyma kirjautumisen jalkeen.

Sisalto:

- lemmikkilista tai lemmikkikortit
- jokaisesta lemmikista kuva ja nimi
- mahdollinen nopea status tai seuraava tarkea asia
- kooste tulevista muistutuksista

Jos lemmikkeja on yksi:

- lemmikki voidaan nayttaa isompana hero-tyylisesti

Tarkeat toiminnot:

- avaa lemmikin detail-sivun
- siirry muistutuksiin
- lisaa uusi lemmikki

### 2. Lemmikin detail-sivu

Tama ei ole bottom-tab, vaan avattava syvempi screeni.

Sisalto:

- lemmikin otsikko, kuva ja perustiedot
- valilehdet tai osiot esimerkiksi:
  - perustiedot
  - terveys
  - hoito-ohjeet
  - kommentit ja paivitykset
  - media
  - jaot

Tarkeat toiminnot:

- muokkaa tietoja
- lisaa rokotus, laakitys tai kaynti
- lisaa hoito-ohje
- lisaa kommentti tai kuva
- hallitse jakoja

### 3. Muistutukset

Erillinen muistutusnakyma koko kayttajalle.

Sisalto:

- tanaan
- pian tulossa
- myohassa
- valmiit tai kuitatut

Tarkeat toiminnot:

- luo muistutus
- kuittaa muistutus
- suodata lemmikin mukaan

Huomio:

- family-puolella muistutukset kuuluvat oletuksena kaikille jaetuille perhekayttajille

### 4. Lisaa

Yksi keskitetty "lisaa jotain" -nakyma tai toimintovalikko.

Esimerkkeja:

- lisaa lemmikki
- lisaa muistutus
- lisaa rokotus
- lisaa laakitys
- lisaa elainlaakarikaynti
- lisaa hoito-ohje
- lisaa kommentti

Syy:

- estaa UI:n pirstaloitumista
- uusi asia on helppo loytaa yhdesta paikasta

### 5. Jaot

Yksi nakyma, jossa kayttaja hallitsee kaikkia jakoja.

Sisalto:

- kenella on paasy mihinkin lemmikkiin
- rooli
- onko family admin
- mihin caretaker paasee kasiksi

Tarkeat toiminnot:

- kutsu uusi kayttaja
- muokkaa oikeuksia
- poista paasy

Huomio:

- family admin voi hallita jakoa
- vain owner voi poistaa koko lemmikin

### 6. Profiili

Kayttajan oma nakyma.

Sisalto:

- oma nimi ja tili
- asetukset
- ilmoitukset
- tuleva plan tai premium-paikka myohempaa varten

Tarkeat toiminnot:

- hallitse omaa tilia
- ilmoitusasetukset
- uloskirjautuminen

## Ensisijaiset user flowt

### Flow 1: Uusi kayttaja

1. kirjautuu sisaan
2. luo ensimmaisen lemmikin
3. paatyy kotiin
4. lisaa ensimmaisen muistutuksen

### Flow 2: Jaa perheenjasenelle

1. avaa lemmikin detail-sivu
2. menee jaot-osioon
3. kutsuu family-kayttajan
4. antaa tarvittaessa admin-oikeuden

### Flow 3: Jaa hoitajalle

1. avaa lemmikin detail-sivu
2. menee jaot-osioon
3. kutsuu caretakerin
4. valitsee mita osioita caretaker saa nahda

### Flow 4: Hoitaja kayttaa appia

1. avaa jaetun lemmikin
2. lukee hoito-ohjeet ja muut sallitut tiedot
3. lisaa kommentin tai kuvan
4. owner ja family nakkevat paivityksen

## Lemmikin detail-sivun sisainen rakenne

Suositus:

yleinen sivu + osioittainen rakenne, ei liian monta irrallista alasivua heti alkuun

Esimerkki:

- Yleiskatsaus
- Terveys
- Hoito
- Paivitykset
- Media
- Jako

Tama on todennakoisesti helpompi ymmartaa kuin liian syva navigaatio.

## Mita ei kannata tehda heti

- ei liian montaa tabia
- ei erillista screenia jokaiselle pienelle datapalalle
- ei liian monimutkaista nested navigation -rakennetta
- ei erillista "social" tai "community" tabia

## Selkein suositus

Jos haluatte pitaa ensiversion selkeana, rakentakaa ensin nama paanakyvat:

1. auth
2. koti
3. lemmikin detail-sivu
4. muistutukset
5. lisaa
6. jaot
7. profiili

Tasta saa jo oikeasti hyvän ja navigoitavan v1-sovelluksen.
