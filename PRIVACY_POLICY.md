# Privacy Policy

Last updated: 28 March 2026

## 1. Overview

Tassulokero is a mobile application for managing pet information, reminders, shared access, and breeder-related records.

This repository still contains mock flows and local demo data for part of the product. This policy is therefore a release-oriented draft that must be finalized with the correct legal entity, contact details, and production infrastructure before public launch.

## 2. Controller

Controller:

- Tassulokero / Webory

Privacy contact:

- Add support email before production release

Before launch, replace this section with the final legal controller name and a working privacy contact email address.

## 3. Categories of Data

Depending on how the service is used, Tassulokero may process:

- account data such as email address, display name, handle, and role selection
- pet profile data such as pet name, species, breed, age label, notes, and profile settings
- health and care data such as vaccinations, medications, vet visits, allergies, diet notes, care instructions, and reminders
- access and sharing data such as invitations, role assignments, and pet access relationships
- user-generated content such as updates, notes, and media
- breeder-related data such as kennel information, breeder links, and heat cycle records
- technical data such as app environment values, service logs, and possibly device push tokens if notifications are enabled later

## 4. Purposes of Processing

We may process personal data to:

- create and maintain user accounts
- provide pet management and care coordination features
- enable role-based sharing between owners, family members, caretakers, and breeders
- support security, abuse prevention, and moderation
- improve reliability and maintain the service

## 5. Legal Bases

Depending on the applicable law, processing may be based on:

- performance of a contract
- legitimate interest for maintaining security, service reliability, and moderation
- consent, where required, for optional features such as push notifications
- compliance with legal obligations

## 6. Sharing and Access Roles

Tassulokero supports role-based access, including:

- owner
- family
- family admin
- caretaker
- breeder

Different roles may see or edit different data categories. The app is intended to limit access according to the permissions granted by the owner and the final backend access rules.

## 7. Media

The v1 scope includes pet-related media support. Media may contain personal data if it includes people, locations, names, or other identifying details.

Before release, confirm:

- where media is stored
- how deleted media is handled
- whether backups may temporarily retain deleted content

## 9. Push Notifications

If push notifications are enabled in a later production phase, the app may process a device push token and notification-related metadata to deliver reminders and open the relevant screen in the app.

Push notifications are not yet active in the current mock implementation in this repository.

## 10. Service Providers and Storage

The planned backend stack includes Supabase, and the project may also use Expo services where relevant for builds or notifications.

Before production release, complete this section with:

- the actual production services in use
- the hosting region
- any relevant processors or subprocessors

## 11. Retention

We retain data only as long as necessary for providing the service, maintaining expected account and pet history, handling moderation or abuse issues, and complying with legal obligations.

Before launch, define exact retention rules for:

- user accounts
- deleted pets
- media files
- backups

## 12. User Rights

Depending on applicable law, users may have the right to:

- access their data
- correct inaccurate data
- delete their data
- restrict or object to certain processing
- receive a portable copy of their data
- withdraw consent where processing is based on consent
- lodge a complaint with a supervisory authority

Before release, add the real support path for handling privacy requests.

## 13. Children

Tassulokero is intended for pet management. Users should avoid uploading unnecessary sensitive personal data about humans. If the service is later directed to minors, additional age and consent requirements may apply.

## 14. Security

We intend to protect data using reasonable technical and organizational measures, including authenticated access, role-based permissions, and backend access rules.

Because this repository still contains mock flows and local demo data, these protections are not yet fully representative of the final production environment.

## 15. International Transfers

If service providers process data outside the user's country, data may be transferred internationally. Before release, update this section to reflect the actual providers, storage regions, and transfer mechanisms used.

## 16. Changes to This Policy

We may update this Privacy Policy from time to time. Material changes should be communicated in the app, on the website, or through store listing materials where appropriate.

## 17. Release Checklist for This Policy

Before public release, make sure to:

- replace the controller details with the final legal entity
- add a working privacy contact email
- confirm the final backend and storage providers
- confirm whether analytics are used
- confirm whether push notifications are enabled
- define retention periods
- define the account deletion process
- align the policy with final App Store and Google Play disclosures
