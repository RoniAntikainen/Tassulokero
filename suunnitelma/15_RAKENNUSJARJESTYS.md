# Tassulokero Rakennusjarjestys

## Tavoite

Tama tiedosto lukitsee:

- missa jarjestyksessa appi kannattaa rakentaa
- mita tehdaan ensin
- mita ei kannata aloittaa liian aikaisin

Tarkoitus on pitaa tekeminen hallittavana ja estaa turha pomppiminen eri osa-alueiden valilla.

## Perusperiaate

Rakentakaa aina tassa jarjestyksessa:

1. perusta
2. data
3. auth
4. ydinscreenit
5. muistutukset
6. jakaminen
7. media
8. viimeistely

Tama on paljon turvallisempi kuin se, etta tehdään heti hienoin UI tai vaikeimmat ominaisuudet ensin.

## Vaihe 1: Projektin perusta

Tavoite:

- saada appi kayntiin siistilla peruspohjalla

Tehtavat:

- luo Expo-projekti
- ota TypeScript kayttoon
- aseta peruskansiorakenne
- asenna Zustand
- asenna TanStack Query
- paata navigaatiopohja
- tee perus theme ja design token -pohja

Valmis kun:

- appi kaynnistyy
- navigaatio toimii
- state- ja query-pohja on paikallaan

## Vaihe 2: Supabase ja database

Tavoite:

- saada backendin perusta kayttoon

Tehtavat:

- luo Supabase-projekti
- luo tietokannan ydintaulut
- kytke appi Supabaseen
- testaa perusyhteys

Ydintaulut ensin:

- users
- pets
- pet_access
- reminders
- vaccinations
- medications
- vet_visits
- care_instructions
- pet_updates
- attachments

Valmis kun:

- appi voi lukea ja kirjoittaa testidataa

## Vaihe 3: Auth

Tavoite:

- kayttaja voi luoda tilin ja kirjautua sisaan

Tehtavat:

- email + salasana auth
- session-hallinta
- protected navigation
- logout

Ei viela:

- Google login
- Apple login

Valmis kun:

- kayttaja voi luoda tilin
- kayttaja pysyy kirjautuneena
- uloskirjautuminen toimii

## Vaihe 4: Ensimmaiset ydinscreenit

Tavoite:

- appi tuntuu oikealta tuotteelta jo ilman kaikkia ominaisuuksia

Tehtavat:

- auth-screenit
- luo ensimmainen lemmikki
- koti
- lemmikin detail

Tarkeinta:

- kayttaja pystyy luomaan lemmikin
- kayttaja nakee lemmikin kotinakyvassa
- detail-sivun rakenne on olemassa

Valmis kun:

- kayttaja voi kirjautua sisaan
- luoda lemmikin
- avata lemmikin detailin

## Vaihe 5: Terveys- ja hoitodata

Tavoite:

- lemmikin tietoihin tulee oikea sisalto

Tehtavat:

- rokotukset
- laakitykset
- elainlaakarikaynnit
- hoito-ohjeet

Valmis kun:

- kayttaja voi lisata, nahda ja muokata ydintietoja

## Vaihe 6: Muistutukset

Tavoite:

- yksi tuotteen tarkeimmista arvolupauksista toimii

Tehtavat:

- muistutusten luonti
- muistutuslista
- muistutusten kuittaus
- muistutusten jakautuminen family-kayttajille
- perus push-notifikaatiot

Valmis kun:

- muistutus voidaan luoda
- se nakyy oikeissa paikoissa
- se voidaan kuitata
- push toimii ainakin peruspolulla

## Vaihe 7: Jakaminen

Tavoite:

- tuotteen erottautuvin kayttotapa toimii

Tehtavat:

- family-jako
- family admin
- caretaker-jako
- jaettavien osioiden valinta
- kayttooikeustarkistukset UI:ssa ja datassa

Valmis kun:

- toinen kayttaja voi saada lemmikin nakyviin
- caretaker nakkee vain sallitut osiot

## Vaihe 8: Kommentit ja media

Tavoite:

- yhteinen hoitohistoria toimii

Tehtavat:

- kommentit
- kuvien lisays
- kuvien naytto
- pet_updates + attachments -flow

Ei viela:

- erillista laajaa mediatukea

Valmis kun:

- caretaker tai family voi lisata kommentin ja kuvan
- muut kayttajat nakkevat sen

## Vaihe 9: Viimeistely

Tavoite:

- appi tuntuu valmiilta eika vain toimivalta

Tehtavat:

- loading- ja error-tilat
- tyhjat tilat
- accessibility
- push-polkujen tarkistus
- designin viimeistely
- performance

Valmis kun:

- appi tuntuu tasaiselta ja johdonmukaiselta

## Mita ei kannata tehda liian aikaisin

- ei maksuliikennetta heti
- ei social loginia heti
- ei erillista laajaa mediatukea heti
- ei liikaa admin- tai analytics-tyokaluja heti
- ei viimeisen paalle hiottua visuaalista animaatiota ennen kuin ydin toimii

## Ensimmainen oikea toteutusspurt

Jos haluatte aloittaa heti fiksummin, tehkaa ensin tama paketti:

1. Expo-projekti
2. Supabase-projekti
3. auth
4. lemmikin luonti
5. koti
6. lemmikin detail

Kun tama on valmis, teilla on jo oikea toimiva perusrunko.

## Selkein suositus

Jos haluatte välttää kaaoksen, tehkaa aina yksi kokonainen pystysuora siivu kerrallaan.

Esimerkiksi:

- auth loppuun
- lemmikin luonti loppuun
- koti loppuun

Ei niin, että tehdään kaikkialle vähän kaikkea yhtä aikaa.
