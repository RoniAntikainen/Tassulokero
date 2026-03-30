# Release Checklist

Last updated: 28 March 2026

This file gathers the current release readiness of Tassulokero into one place. It does not mean the app is already ready for public launch. It shows what is prepared, what still needs real assets or production infrastructure, and what must happen before TestFlight or Google Play internal testing.

## 1. Project and Build Setup

- [x] Expo project exists
- [x] iOS bundle identifier defined in `app.json`
- [x] Android package name defined in `app.json`
- [x] EAS build profiles defined in `eas.json`
- [ ] production environment variables added
- [ ] Supabase project connected
- [ ] storage configured
- [ ] push notifications configured

## 2. Brand Assets

- [x] icon placeholder added
- [x] adaptive icon placeholder added
- [x] splash placeholder added
- [ ] final app icon delivered
- [ ] final splash asset delivered
- [ ] final brand colors and launch typography locked

## 3. Legal and Store Documents

- [x] privacy policy draft added
- [x] terms of use draft added
- [x] store listing draft added
- [x] screenshot plan added
- [ ] privacy policy finalized with real controller and contact details
- [ ] terms finalized with governing law and support details
- [ ] support website or landing page finalized

## 4. Product Readiness

- [x] app shell and navigation in place
- [x] auth and onboarding mock flow in place
- [x] pet, reminder, sharing, profile and breeder mock flows in place
- [ ] production auth connected
- [ ] production database queries and mutations connected
- [ ] production media flow connected
- [ ] production notification flow connected
- [ ] RLS and backend access rules verified

## 5. QA and Testing

- [x] typecheck passes
- [x] web runtime boot confirmed
- [x] test notes documented in `TESTAUSMUISTIO.md`
- [ ] interactive iOS QA pass completed
- [ ] interactive Android QA pass completed
- [ ] critical auth flow tested against production-like backend
- [ ] sharing roles tested end-to-end
- [ ] breeder flow tested end-to-end

## 6. Store Assets and Submission Prep

- [ ] final screenshots captured
- [ ] screenshots exported to App Store sizes
- [ ] screenshots exported to Google Play sizes
- [ ] store description copy finalized
- [ ] release notes finalized
- [ ] age rating / content disclosures reviewed
- [ ] privacy labels / data safety disclosures matched to final implementation

## 7. Build and Distribution

- [ ] preview build created with EAS
- [ ] TestFlight build uploaded
- [ ] Android internal testing build uploaded
- [ ] release build smoke-tested after upload
- [ ] store submission metadata reviewed one last time

## 8. Files to Review Before Launch

- [app.json](/Users/roni/weboryn/tassulokero/app.json)
- [eas.json](/Users/roni/weboryn/tassulokero/eas.json)
- [README.md](/Users/roni/weboryn/tassulokero/README.md)
- [TESTAUSMUISTIO.md](/Users/roni/weboryn/tassulokero/TESTAUSMUISTIO.md)
- [PRIVACY_POLICY.md](/Users/roni/weboryn/tassulokero/PRIVACY_POLICY.md)
- [TERMS.md](/Users/roni/weboryn/tassulokero/TERMS.md)
- [STORE_LISTING.md](/Users/roni/weboryn/tassulokero/STORE_LISTING.md)
- [SCREENSHOT_PLAN.md](/Users/roni/weboryn/tassulokero/SCREENSHOT_PLAN.md)

## 9. Current Honest Status

Current state:

- the app has a strong Expo/React Native frontend and mock product flow
- mobile build metadata is scaffolded
- legal and store text drafts exist
- release prep documentation is now centralized

Still missing before a real launch:

- production backend connection
- final brand assets
- real screenshots
- real device QA
- TestFlight and Google Play internal builds
