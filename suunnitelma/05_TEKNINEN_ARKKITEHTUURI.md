# Tassulokero Tekninen Arkkitehtuuri

## Suositeltu stack

Koska teillä on jo web/React-taustaa, järkevä ensimmäinen valinta on:

- mobiiliappi: React Native + Expo
- backend: Supabase tai oma Node/Next-backend
- tietokanta: PostgreSQL
- auth: Supabase Auth tai vastaava
- tiedostot: Supabase Storage / S3-tyylinen ratkaisu
- push-notifikaatiot: Expo Notifications

## Suositus MVP:lle

Jos tavoitteena on saada appi oikeasti ulos:

- Expo
- Supabase
- PostgreSQL

Tämä on hyvä, koska:

- nopea rakentaa
- auth on helppo
- tietokanta on oikea relaatiokanta
- storage onnistuu
- myöhempi skaalaus on mahdollinen

## Arkkitehtuurin perusosat

### Mobile App

Vastaa:

- käyttöliittymästä
- lomakkeista
- listauksista
- muistutusten näkymistä
- käyttäjän toiminnasta

### Backend / BFF

Vastaa:

- authista
- liiketoimintasäännöistä
- muistutusten luonnista
- tietoturvasta
- mahdollisista ajastetuista taustatöistä

### Database

Vastaa:

- käyttäjistä
- lemmikeistä
- käyttöoikeuksista ja jaoista
- terveystiedoista
- muistutuksista
- tiedostometadatasta

### Background Jobs

Tarvitaan todennäköisesti:

- muistutusten muodostamiseen
- tulevien eräpäivien tarkistamiseen
- push-notifikaatioiden lähettämiseen

## Ensimmäiset tekniset päätökset jotka kannattaa lukita

1. käytetäänkö Supabasea vai omaa backendia
2. miten auth tehdään
3. miten push-notifikaatiot lähetetään
4. miten tiedostot tallennetaan
5. halutaanko admin-näkymä heti vai myöhemmin
6. miten kutsut ja jakaminen toteutetaan

## Suositus juuri teille

Jos tärkeintä on saada ensimmäinen oikea tuote ulos:

- Expo
- Supabase
- Postgres
- pushit myöhemmin heti kun perusdata toimii

## Mitä ei kannata tehdä alussa

- ei mikropalveluja
- ei liian monimutkaista domain-arkkitehtuuria
- ei "yleiskäyttöistä kaikkeen sopivaa backendia"
- ei liian hienoa offline-järjestelmää v1:een

## Tärkein tekninen periaate

Rakentakaa ensin:

- oikea tietomalli
- oikea CRUD
- oikeat muistutukset
- oikea käyttöoikeusmalli

Vasta sen jälkeen:

- premium-hienoudet
- laajemmat integraatiot
- kasvun optimointi
