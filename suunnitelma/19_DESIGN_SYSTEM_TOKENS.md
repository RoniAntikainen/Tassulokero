# Tassulokero Design System Tokens

## Tavoite

Tama tiedosto kokoaa appin ensiversion design tokenit yhteen paikkaan.

Tarkoitus:

- antaa suorat arvot kehitykseen
- pitaa UI johdonmukaisena
- estaa "vahan sinne pain vahan tanne pain" -tyylinen visuaalinen hajonta

## Vari tokenit

### Taustat

- `color.bg.base = #FFFFFF`
- `color.bg.subtle = #F6F7F9`
- `color.bg.card = #FFFFFF`
- `color.bg.elevated = #FFFFFF`

### Tekstit

- `color.text.primary = #111111`
- `color.text.secondary = #667085`
- `color.text.tertiary = #8A94A6`
- `color.text.inverse = #FFFFFF`

### Borderit ja erotinviivat

- `color.border.default = #E7EAF0`
- `color.border.strong = #D5DAE3`
- `color.border.focus = #0EA5A4`

### Brand ja korostus

- `color.brand.primary = #0EA5A4`
- `color.brand.primaryHover = #0F766E`
- `color.brand.primarySoft = #E6F8F7`

### Tilavärit

- `color.success = #16A34A`
- `color.warning = #F59E0B`
- `color.danger = #E46A4A`
- `color.info = #3B82F6`

### Overlayt

- `color.overlay.scrim = rgba(17, 17, 17, 0.48)`

## Typografia

## Fonttiperhe

Suositus:

- `font.family.base = Inter, system-ui, sans-serif`

Vaihtoehtoinen pehmeampi suunta myohemmin:

- `Manrope`

Mutta ensiversion turvallinen valinta:

- `Inter`

## Fonttikoot

- `font.size.xs = 12`
- `font.size.sm = 14`
- `font.size.md = 16`
- `font.size.lg = 18`
- `font.size.xl = 20`
- `font.size.2xl = 24`
- `font.size.3xl = 30`

## Fonttipainot

- `font.weight.regular = 400`
- `font.weight.medium = 500`
- `font.weight.semibold = 600`
- `font.weight.bold = 700`

## Rivikorkeudet

- `font.lineHeight.tight = 1.2`
- `font.lineHeight.normal = 1.45`
- `font.lineHeight.relaxed = 1.6`

## Spacing-tokenit

Suositus:

- `space.1 = 4`
- `space.2 = 8`
- `space.3 = 12`
- `space.4 = 16`
- `space.5 = 20`
- `space.6 = 24`
- `space.8 = 32`
- `space.10 = 40`
- `space.12 = 48`
- `space.16 = 64`

## Radius-tokenit

- `radius.sm = 12`
- `radius.md = 16`
- `radius.lg = 20`
- `radius.xl = 24`
- `radius.full = 9999`

Suositus:

- inputit ja pienet painikkeet: `radius.sm`
- tavalliset kortit: `radius.lg`
- suuret hero- tai profiilipinnat: `radius.xl`
- avatarit: `radius.full`

## Varjot

Pidetaan varjot hillittyina.

- `shadow.sm = 0 1px 2px rgba(16, 24, 40, 0.04)`
- `shadow.md = 0 6px 16px rgba(16, 24, 40, 0.08)`
- `shadow.lg = 0 12px 28px rgba(16, 24, 40, 0.10)`

Suositus:

- private-puolella border + kevyt varjo
- kasvattajalle jaetussa nakymassa hieman vahvempi korttierottelu tarvittaessa

## Koot ja kosketuspinnat

- `size.touch.min = 44`
- `size.icon.sm = 16`
- `size.icon.md = 20`
- `size.icon.lg = 24`
- `size.avatar.sm = 32`
- `size.avatar.md = 40`
- `size.avatar.lg = 56`
- `size.avatar.xl = 80`

## Layout-tokenit

- `layout.screen.maxWidth = 560`
- `layout.content.padding = 20`
- `layout.section.gap = 24`
- `layout.card.gap = 16`

Huomio:

- mobiili edella
- paljon ilmaa, mutta ei liian valjasti

## Komponenttien peruslinja

### Nappi

- korkeus: `44-52`
- paapainike: brand primary
- toissijainen: valkoinen + border
- teksti: medium tai semibold

### Kortti

- tausta: card white
- border: default
- radius: lg
- padding: 16 tai 20

### Input

- tausta: white
- border: default
- focus border: brand primary
- radius: md
- korkeus: 48

### Feed-kortti

- media ylhaalla
- profiilitiedot selkeasti nakyviin
- like/comment-rivi alhaalla
- radius: lg

## Oman kayton ja jaetun nakyman token-ajattelu

### Oma kaytto

- enemman `bg.subtle`
- enemman border-ratkaisuja
- hyvin hillitty syvyys

### Jaettu nakyma

- enemman kuvapintaa
- hieman vahvemmat kortit
- sama brand-vari, mutta elavampi rytmi

## Selkein suositus

Jos haluatte rakentaa ensiversion nopeasti mutta siististi, aloittakaa ainakin nailla token-ryhmilla:

- vari
- typography
- spacing
- radius
- shadow

Nilla paasee jo todella pitkalle ennen kuin tarvitaan yksityiskohtaisempaa design systemia.
