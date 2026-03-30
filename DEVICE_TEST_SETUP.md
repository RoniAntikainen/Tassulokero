# Device Test Setup

Last updated: 28 March 2026

This note explains what must exist on the machine before the last two checklist items can be completed:

- `iOS manuaalitestaus tehty`
- `Android manuaalitestaus tehty`

It is intentionally short and practical.

## 1. iOS Requirements

To run `npm run ios`, this machine needs:

- macOS
- Xcode installed
- Xcode command line tools configured
- iOS Simulator available

Quick checks:

```bash
xcode-select -p
xcrun simctl list devices
```

What failed in the current environment:

```text
xcrun: error: unable to find utility "simctl", not a developer tool or in PATH
```

That means the current machine does not have the required Apple developer tooling available for simulator-based testing.

## 2. Android Requirements

To run `npm run android`, this machine needs:

- Android Studio or Android SDK tools
- `adb` available in `PATH`
- `emulator` available in `PATH`
- at least one Android Virtual Device or a connected Android phone

Quick checks:

```bash
adb devices
emulator -list-avds
```

What failed in the current environment:

```text
adb: command not found
emulator: command not found
```

That means the current machine does not currently have Android SDK tooling available in the shell environment.

## 3. Minimum Manual Smoke Test

When the environment is ready, the smallest acceptable manual test round is:

1. Start the app with `npm run ios` or `npm run android`
2. Confirm app launch
3. Confirm bottom tabs render
4. Open:
   - Koti
   - Muistutukset
   - Lisaa
   - Jaot
   - Profiili
5. Confirm one full flow works:
   - add reminder
   - add update
6. Confirm no immediate runtime crash

## 4. After Successful Device Test

Only then mark these checklist items done:

- `iOS manuaalitestaus tehty`
- `Android manuaalitestaus tehty`

And update:

- [TESTAUSMUISTIO.md](/Users/roni/weboryn/tassulokero/TESTAUSMUISTIO.md)
- [V1_TOTEUTUSSEURANTA.md](/Users/roni/weboryn/tassulokero/V1_TOTEUTUSSEURANTA.md)
