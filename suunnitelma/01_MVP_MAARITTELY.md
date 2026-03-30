# Tassulokero MVP Maarittely

## MVP:n tavoite

Rakennetaan ensimmäinen julkaistava versio, joka on oikeasti hyödyllinen ja yksinkertainen.

MVP ei yritä olla valmis "kaikkeen lemmikinhallintaan", vaan ratkaisee yhden ydinasian:

Käyttäjä pystyy hallitsemaan yhden tai useamman lemmikin tärkeimmät tiedot yhdessä paikassa ja saa muistutuksia ajoissa.

## MVP:n pakolliset ominaisuudet

### 1. Käyttäjätili

- rekisteröityminen
- kirjautuminen
- uloskirjautuminen
- salasanan palautus

### 2. Usean lemmikin tuki

- käyttäjä voi lisätä monta lemmikkiä
- jokaisella lemmikillä oma profiili
- käyttäjä voi vaihtaa lemmikistä toiseen helposti

### 3. Lemmikin perustiedot

- nimi
- laji
- rotu
- syntymäaika tai arvioitu syntymäaika
- sukupuoli
- paino
- väri / tuntomerkit
- sirunumero
- sterilointi/kastrointi
- kuva

### 4. Tärkeät tietokategoriat

Jokaiselle lemmikille voidaan tallentaa ainakin:

- rokotukset
- lääkitykset
- eläinlääkärikäynnit
- allergiat / tärkeät huomiot
- vakuutustiedot
- omat muistiinpanot

### 5. Muistutukset

Käyttäjä voi luoda tai sovellus voi generoida muistutuksia esimerkiksi:

- rokotuksen uusinta
- lääkkeen aloitus tai lopetus
- kontrollikäynti
- muu tärkeä päivämäärä

### 6. Etusivun yhteenveto

Käyttäjä näkee heti:

- seuraavat tulevat muistutukset
- lemmikit
- viimeisimmät tärkeät tapahtumat

### 7. Jakaminen muille käyttäjille

Käyttäjä voi jakaa lemmikin tiedot toiselle käyttäjälle.

Ensimmäiseen versioon riittää kaksi selkeää jakoroolia:

- `family`
  - näkee kaiken
  - voi muokata kaikkea
- `caretaker`
  - näkee hoidon kannalta tärkeät tiedot
  - voi katsoa ruokinnan, lääkityksen, komennot, muistutukset ja muut ohjeet

## MVP:hen ei vielä kuulu

- eläinlääkärien omat käyttäjätilit
- monimutkainen organisaatio- tai tiimimalli
- chat
- maksulliset paketit
- vakuutusintegraatiot
- viralliset integraatiot klinikoihin
- laaja analytiikka tai terveysgrafiikka
- ruokapäiväkirja, treeniseuranta tai laaja hyvinvointijärjestelmä

## MVP:n onnistumiskriteeri

MVP on onnistunut, jos käyttäjä pystyy:

1. luomaan tilin
2. lisäämään vähintään yhden lemmikin
3. tallentamaan tärkeimmät tiedot
4. asettamaan muistutuksia
5. jakamaan lemmikin tiedot toiselle käyttäjälle
6. palaamaan appiin myöhemmin ja löytämään kaiken nopeasti

## MVP:n tärkein näkymä

Tärkein näkymä ei ole pelkkä profiili vaan "mitä pitää tehdä seuraavaksi".

Siksi etusivun tai dashboardin pitää näyttää:

- tulevat tehtävät
- tulevat erääntyvät asiat
- tärkeät huomautukset

## Ensimmäinen julkaistava ydin

Jos pitää rajata vielä enemmän, kaikkein pienin julkaistava ydin on:

- auth
- lemmikin profiili
- rokotukset
- muistutukset
- jakaminen

Se yksin olisi jo oikea, toimiva ensimmäinen tuote.
