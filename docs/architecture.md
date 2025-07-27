# Project Architecture

This document provides a high level overview of how the Ionic/Angular application is organized and how it interacts with Firebase services.

## Angular Structure

The application is split into feature modules under `src/app/modules`.

- **Auth Module** – pages for login, signup and a landing page.
- **Account Module** – pages for managing user and organization accounts along with related account listings.
- **Listing Module** – pages to create, edit and view listings as well as related account functionality.

Common code is placed in two main shared areas:

- `src/app/shared` contains reusable components, pipes and a `SharedModule` that exports them.
- `src/app/core` contains singleton services (e.g. `AuthService`, `FirestoreService`, `ImageUploadService`) and route guards. Services are provided in root so the same instance is used across modules.

### State Management

NgRx is used for application state. Reducers, actions, selectors and effects live in `src/app/state`.

```
state/
├── actions
├── effects
├── reducers
└── selectors
```

The main `AppState` combines slices such as `auth`, `accounts` and `listings`. Effects handle async work like Firebase authentication and Firestore queries, dispatching actions so components remain focused on presentation.

## Firebase Integration

### Firestore

`FirestoreService` wraps AngularFire APIs to read and write documents, upload files and query sub‑collections. Components call this service and then update state via NgRx actions. Firestore’s real‑time streams keep the store in sync.

### Cloud Functions

The `functions/` directory contains Firebase Functions written in TypeScript. Triggers react to Firestore changes, for example:

- When a listing document is created, `onCreateListing` geocodes addresses, creates related sub‑documents and writes them back to Firestore.
- Account and related account updates use similar triggers to keep relationship collections consistent.

Functions can also expose HTTPS endpoints such as `getHomepageListings` which the frontend calls to retrieve listings sorted by proximity.

```
frontend → FirestoreService → Firestore
        ↘                          ↘
          NgRx Store ← Cloud Functions (triggers/HTTP)
```

## Data Flow Example

1. **User creates a listing** in the Ionic app. The Listing component dispatches a NgRx action which stores the data via `FirestoreService`.
2. **Cloud Function `onCreateListing`** executes, enriching the listing with geocoded data and creating related documents under both the listing and the owner account.
3. **Store updates** via Firestore real‑time streams and components react to the new listing information.

The same pattern is used for other account and listing operations ensuring Firestore, Functions and the client stay synchronized.

## Firestore Document Structure

Data in Firestore is organized under each account. Two commonly used collections are `projects` and `timeEntries`.

### Projects

`accounts/{accountId}/projects/{projectId}`

Fields:

- `name` – name of the project.
- `archived` – whether the project is archived.

### Time Entries

`accounts/{accountId}/timeEntries/{entryId}`

Fields:

- `userId` – ID of the user logging time.
- `projectId` – ID of the related project (required).
- `date` – entry date.
- `hours` – hours recorded.

Each time entry must reference an existing project through its `projectId` field.
