# Build Runbook

Last updated: 28 March 2026

This document explains the next concrete steps for generating internal test builds and later release builds for Tassulokero. It is a practical runbook, not proof that the builds have already been completed.

## 1. Current Starting Point

Already in place:

- Expo project scaffold
- `app.json` with iOS bundle identifier and Android package name
- `eas.json` with `development`, `preview`, and `production` profiles
- placeholder icon and splash assets

Still needed before real cloud builds:

- Expo account login
- final environment values
- final brand assets
- backend connection decisions

## 2. Files Involved

Review these before building:

- [app.json](/Users/roni/weboryn/tassulokero/app.json)
- [eas.json](/Users/roni/weboryn/tassulokero/eas.json)
- [.env.example](/Users/roni/weboryn/tassulokero/.env.example)
- [RELEASE_CHECKLIST.md](/Users/roni/weboryn/tassulokero/RELEASE_CHECKLIST.md)

## 3. First-Time Setup

Run these when network access and Expo login are available:

```bash
npm install
npx expo login
npx eas whoami
```

If `eas-cli` is not available globally, use:

```bash
npx eas --version
```

## 4. Environment Preparation

Before any real test build:

1. Add the production or preview values for:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_APP_ENV`
2. Confirm whether the build should point to:
   - local mock mode
   - preview backend
   - production backend
3. Replace placeholder icon and splash assets if the build is meant for external reviewers

## 5. Preview Build for Internal Testing

Recommended first real build:

```bash
npx eas build --platform ios --profile preview
npx eas build --platform android --profile preview
```

Purpose:

- verify cloud builds complete
- share builds internally
- catch signing and packaging issues early

Do this before attempting store distribution.

## 6. iOS Path Toward TestFlight

Once the preview build is healthy:

```bash
npx eas build --platform ios --profile production
```

Then:

1. wait for the iOS build to finish
2. verify build details in Expo dashboard
3. submit to App Store Connect when metadata is ready

Submission path:

```bash
npx eas submit --platform ios --profile production
```

Before marking TestFlight done, confirm:

- build uploaded successfully
- build appears in App Store Connect
- TestFlight processing completes
- at least one smoke test round is done

## 7. Android Path Toward Internal Testing

Once preview looks healthy:

```bash
npx eas build --platform android --profile production
```

Then:

1. verify generated `.aab` or Play-ready artifact
2. upload to Google Play internal testing
3. confirm tester access and rollout visibility

If submission is later automated:

```bash
npx eas submit --platform android --profile production
```

Before marking Android internal testing done, confirm:

- build uploaded successfully
- internal testing track is visible in Play Console
- tester install path works
- at least one smoke test round is done

## 8. Suggested Build Order

Recommended order:

1. local runtime check
2. iOS preview build
3. Android preview build
4. iOS production build
5. Android production build
6. TestFlight upload
7. Google Play internal upload

## 9. Pre-Build Checklist

Before every build, confirm:

- typecheck passes
- placeholder dev copy is hidden if needed
- final env target is correct
- app icon and splash are acceptable for the target audience
- privacy policy and terms are aligned with the build
- store listing text matches the included features

## 10. Post-Build Checklist

After every build, confirm:

- build completed without signing errors
- app launches
- navigation works
- main tabs render correctly
- no broken placeholder content appears unexpectedly
- the intended environment is actually active

## 11. Honest Status Today

At the time of writing:

- the build configuration scaffold exists
- no actual TestFlight build has been uploaded yet
- no actual Android internal testing build has been uploaded yet
- this runbook is the operational prep for those steps
