# Smoke Test Script

Last updated: 28 March 2026

This script is the fastest practical path for completing:

- `iOS manuaalitestaus tehty`
- `Android manuaalitestaus tehty`

Use it after the environment in [DEVICE_TEST_SETUP.md](/Users/roni/weboryn/tassulokero/DEVICE_TEST_SETUP.md) is ready.

## 1. Launch

Start one platform:

```bash
npm run ios
```

or

```bash
npm run android
```

Pass if:

- app opens
- no immediate crash
- bottom tabs are visible

## 2. Auth And Onboarding

Check:

1. Open auth screen
2. Switch between sign in / sign up / reset
3. Confirm loading state appears
4. Enter app
5. Open onboarding
6. Switch owner / breeder path

Pass if:

- auth UI is usable
- onboarding is reachable
- no broken navigation

## 3. Core Pet Flow

Check:

1. Open `Lisaa`
2. Add a pet
3. Return to `Koti`
4. Open pet detail
5. Edit overview fields

Pass if:

- new pet appears in home
- detail opens
- edit flow saves without crash

## 4. Health And Care

Check:

1. Add vaccination
2. Add medication
3. Add vet visit
4. Add insurance record
5. Add care instruction
6. Edit one health item
7. Delete one care instruction

Pass if:

- new rows appear in detail
- edit works
- delete works

## 5. Reminders

Check:

1. Create manual reminder
2. Create vaccination-type reminder
3. Open reminder detail
4. Edit reminder
5. Complete reminder
6. Cancel another reminder

Pass if:

- reminder groups update correctly
- detail opens
- complete and cancel both work

## 6. Sharing

Check:

1. Open `Jaot`
2. Add family access
3. Add caretaker access
4. Toggle family admin
5. Edit access permissions
6. Remove one access

Pass if:

- new access rows appear
- admin toggle works
- permission toggles work
- remove works

## 7. Shared History And Media

Check:

1. Add update as owner
2. Add update as family
3. Add update as caretaker
4. Attach mock image to one update
5. Open `Paivitykset`
6. Open `Media`

Pass if:

- role labels show correctly
- update appears in history
- media appears in updates and media tab

## 8. Breeder Side

Check:

1. Switch mock role to breeder
2. Open breeder profile area
3. Open breeder links section
4. Set one linked pet to pending
5. Approve one linked pet
6. Add one heat cycle

Pass if:

- breeder profile renders
- breeder link status changes
- heat cycle appears

## 9. Final Smoke Pass

Before marking device testing done, confirm:

- no red screen or fatal runtime crash appeared
- all main tabs still open
- navigation still works after multiple actions
- app state remains coherent after role switching

## 11. After Test

When one full platform pass succeeds:

1. Update [TESTAUSMUISTIO.md](/Users/roni/weboryn/tassulokero/TESTAUSMUISTIO.md)
2. Mark the matching checkbox in [V1_TOTEUTUSSEURANTA.md](/Users/roni/weboryn/tassulokero/V1_TOTEUTUSSEURANTA.md)
3. Note any platform-specific issues separately
