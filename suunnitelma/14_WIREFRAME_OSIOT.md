# Tassulokero Wireframe Osiot

## Tavoite

Tama tiedosto pilkkoo tärkeimmat ruudut sisaltolohkoihin.

Tarkoitus:

- helpottaa wireframejen piirtamista
- helpottaa UI-suunnittelua
- helpottaa komponenttien hahmottamista ennen koodausta

Tama ei ole lopullinen design-dokumentti, vaan sisaltorakenne.

## 1. Auth

### Kirjautuminen

Sisaltolohkot:

- logo tai appin nimi
- otsikko
- email-kentta
- salasana-kentta
- kirjaudu sisaan -painike
- linkki tilin luontiin
- linkki unohtuneeseen salasanaan

### Tilin luonti

Sisaltolohkot:

- otsikko
- email-kentta
- salasana-kentta
- vahvista salasana
- luo tili -painike
- linkki kirjautumiseen

## 2. Ensimmaisen lemmikin luonti

Sisaltolohkot:

- otsikko
- lemmikin kuvan valinta
- nimi
- laji
- rotu valinnainen
- syntymaaika valinnainen
- tallenna -painike

Huomio:

- ensivaiheessa kysytään vain tarkein minimi
- muut tiedot voidaan tayttaa myohemmin

## 3. Koti

Tama on yksi appin tarkeimmista ruuduista.

Sisaltolohkot:

- tervehdys tai kayttajan nimi
- hakukentta tai nopea suodatus valinnainen
- lemmikkikortit
- muistutuskooste
- nopea lisaa -toiminto

### Lemmikkikortti

Sisalto:

- pyorea kuva
- nimi
- mahdollinen pieni status
- seuraava tarkea muistutus tai huomioteksti

Jos lemmikkeja on vain yksi:

- kortti voi olla suurempi
- muistutuskooste voi liittya suoraan siihen

### Muistutuskooste

Sisalto:

- tanaan
- tulossa pian
- myohassa

## 4. Lemmikin detail

Tama on appin toinen ydinruutu.

### Ylapalkki

Sisalto:

- lemmikin kuva
- nimi
- pikatoiminnot

### Osio 1: Yleiskatsaus

Sisalto:

- perustiedot
- siru
- rotu
- ika tai syntymaaika
- mahdolliset nopeat huomiot

### Osio 2: Terveys

Sisalto:

- rokotukset
- laakitykset
- elainlaakarikaynnit
- allergiat tai muut health-notet

### Osio 3: Hoito

Sisalto:

- ruoka
- annoskoko
- komennot
- paivarutiini
- varoitukset

### Osio 4: Paivitykset

Sisalto:

- kommentit
- caretakerin lisaamat havainnot
- yhteinen hoitohistoria

### Osio 5: Media

Sisalto:

- kuvat

### Osio 6: Jako

Sisalto:

- kuka paasee tietoihin
- roolit
- caretakerille jaetut osiot
- kutsu uusi kayttaja

## 5. Muistutukset

Sisaltolohkot:

- otsikko
- suodatus
- listat ryhmiteltyna

### Ryhmittely

- tanaan
- pian tulossa
- myohassa
- valmiit

### Muistutuskortti

Sisalto:

- otsikko
- lemmikin nimi
- aika tai paivamaara
- tila
- kuittaa-painike

## 6. Lisaa

Tama voi olla screeni tai toimintovalikko.

Sisaltolohkot:

- lisaa lemmikki
- lisaa muistutus
- lisaa rokotus
- lisaa laakitys
- lisaa kaynti
- lisaa hoito-ohje
- lisaa kommentti

Suositus:

- pitakaa tata keskitettyna nopeana toimintolistana

## 7. Jako

Sisaltolohkot:

- nykyiset kayttajat
- roolit
- admin-tila
- kutsu uusi
- oikeuksien muokkaus

### Family-rivi

Sisalto:

- nimi
- rooli
- onko admin
- muokkaa
- poista paasy

### Caretaker-rivi

Sisalto:

- nimi
- rooli
- mita osioita naytetaan
- muokkaa
- poista paasy

## 8. Lisaa kommentti tai media

Sisaltolohkot:

- tekstikentta
- lisaa kuva
- julkaise-painike

Huomio:

- v1:ssa vain kuvat ja teksti
- rakenne kannattaa tehda niin, etta uusia mediatyyppeja on helppo lisata myohemmin

## 9. Profiili

Sisaltolohkot:

- oma nimi
- email
- ilmoitusasetukset
- tiliasetukset
- uloskirjautuminen

Mahdollinen future osio:

- plan tai premium

## Ensimmaiset wireframet joita kannattaa piirtää ensin

Jos ette piirra kaikkea kerralla, aloittakaa naista:

1. Auth
2. Luo ensimmainen lemmikki
3. Koti
4. Lemmikin detail
5. Muistutukset
6. Jako
7. Lisaa kommentti tai kuva

## Selkein suositus

Teidan kannattaa seuraavaksi piirtää jokaisesta ylla olevasta ruudusta:

- nopea low-fi wireframe
- vain sisalto ja sijainti
- ei viela viimeisteltya visuaalista ilmetta

Kun se on tehty, varsinainen UI-suunnittelu ja koodaus helpottuu paljon.
