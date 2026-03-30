# Tassulokero User Flowt

## Flow 1: Uusi käyttäjä aloittaa

1. käyttäjä lataa appin
2. käyttäjä rekisteröityy tai kirjautuu
3. käyttäjälle näytetään lyhyt onboarding
4. käyttäjä lisää ensimmäisen lemmikin
5. käyttäjä lisää ensimmäisen tärkeän tiedon
6. käyttäjä saa näkyviin etusivun yhteenvedon

## Flow 2: Ensimmäinen lemmikki lisätään

1. valitse "lisää lemmikki"
2. lisää perustiedot
3. lisää kuva halutessa
4. tallenna
5. avaa lemmikin profiili

## Flow 3: Rokotustieto lisätään

1. avaa lemmikin profiili
2. siirry rokotuksiin
3. lisää rokote
4. syötä päivämäärä ja uusintapäivä
5. appi ehdottaa muistutusta
6. tallenna

## Flow 4: Muistutus tulee näkyviin

1. käyttäjä avaa etusivun
2. etusivulla näkyy tulevat muistutukset
3. käyttäjä avaa muistutuksen
4. käyttäjä kuittaa sen tehdyksi tai siirtää ajankohtaa

## Flow 5: Eläinlääkärikäynti kirjataan

1. avaa lemmikin profiili
2. lisää eläinlääkärikäynti
3. lisää syy ja yhteenveto
4. lisää mahdollinen kontrollipäivä
5. appi luo tarvittaessa muistutuksen

## Flow 6: Lemmikki jaetaan perheenjäsenelle

1. avaa lemmikin profiili
2. siirry jakamiseen
3. lisää käyttäjä kutsulla
4. valitse rooli `family`
5. vastaanottaja hyväksyy kutsun
6. molemmat voivat hallita lemmikin tietoja

## Flow 7: Lemmikki jaetaan hoitajalle

1. avaa lemmikin profiili
2. siirry jakamiseen
3. lisää käyttäjä kutsulla
4. valitse rooli `caretaker`
5. määritä näkyvät tiedot
6. hoitaja näkee arjen kannalta tärkeät tiedot yhdessä paikassa

## MVP:n tärkeimmät näkymät

- kirjautuminen / rekisteröityminen
- onboarding
- etusivu / dashboard
- lemmikkilista
- lemmikin profiili
- rokotukset
- lääkitykset
- eläinlääkärikäynnit
- muistutukset
- asetukset
- jakaminen

## Dashboardin tärkein sisältö

Etusivu ei saa olla tyhjä "tervetuloa"-näkymä.

Siellä pitää näkyä:

- seuraavat muistutukset
- lähiajan erääntyvät asiat
- lemmikit nopeasti avattavina
- viimeksi päivitetyt tiedot

## Tärkein UX-periaate

Käyttäjä ei tule appiin ihailemaan dataa.

Käyttäjä tulee appiin yleensä siksi, että:

- pitää tarkistaa jokin tieto nopeasti
- pitää lisätä uusi tieto
- pitää nähdä mitä pitää hoitaa seuraavaksi
- pitää jakaa tiedot toiselle ihmiselle ilman säätöä

Siksi navigaation pitää tukea noita kolmea asiaa.
