# Privacy Settings: Model, Rules, and UI

This document reflects the privacy features implemented in the app today: audiences, how Firestore rules gate access, and how users configure visibility in Settings.

## Goals

- Provide global and per‑section visibility controls on accounts.
- Cover core audiences that map to real relationships via a single Related audience.
- Allow fine‑grained exceptions using allowlists, blocklists, and per‑relationship overrides.

## Data Model

Accounts may include `privacySettings` with per‑section configuration. The sections currently used are:

- `contactInformation` (gated subdocument)
- `membersList` (groups) / “Groups” (users)
- `partnersList` (groups)
- `friendsList` (users)
- `roleHierarchy`
- `projects`
- Plus auxiliary controls: `messaging`, `discoverability`

Supported audiences (as implemented in UI and services):

- `public`: anyone
- `authenticated` (labeled “Authorized”): any signed‑in user
- `related`: any accepted relationship (friend, member, partner, or group)
- `private`: deny by default; use allowlist/blocklist or overrides to grant access

Section shape (subset used by the app today):

```
{
  visibility: 'public' | 'authenticated' | 'related' | 'private',
  allowedRoleIds?: string[],
  allowlist?: string[],  // accountIds explicitly allowed
  blocklist?: string[]   // accountIds explicitly denied
}
```

Per‑relationship overrides (optional) live on related account docs and are honored by rules:

```
accounts/{accountId}/relatedAccounts/{relatedAccountId} {
  // Legacy convenience
  canAccessContactInfo?: boolean,
  // New flexible overrides
  sectionOverrides?: {
    [sectionKey: string]: { allow: boolean, expiresAt?: Timestamp }
  }
}
```

Notes

- The Firestore rules also support finer‑grained audiences (e.g., `friends`, `members`, `partners`, `groups`, `admins`) for future UI expansion. The current UI and `PrivacyService` intentionally normalize to the four values above.

## Firestore Rules Enforcement

Sensitive data is moved to subdocuments that rules can gate, and allow/block lists and overrides are applied consistently.

- Contact Info is stored at `accounts/{accountId}/sections/contactInfo` and read only when the viewer:
  - Is the owner or a group admin, or
  - Is allowed by allowlist, or
  - Is not blocklisted and matches the section `visibility` audience, or
  - Has an explicit per‑relationship override.
- Related accounts docs are readable to authenticated users; the app filters what is shown per privacy settings.
- Keep sensitive fields out of the base account document.

Audience summary:

- `public`: no auth required
- `authenticated`: requires `request.auth`
- `related`: any accepted related account (friend, member, partner, or group)
- `private`: only owner/admin, allowlist, or an explicit override

## UI Configuration

The Settings page exposes per‑section visibility and allow/block lists using the four audiences above.

- All accounts: Public, Authorized, Related, Private
- “Members List” on groups appears as “Groups” on user profiles (both map to `membersList`).
- Contact Info UI reads from `sections/contactInfo`; if access is denied it displays a private/unavailable state.
- Allowlist/blocklist pickers let you target specific related accounts for each section.

## Defaults

- If a section’s visibility is missing, the UI treats it as `related` for convenience; saving Settings writes normalized values.
- When an account already has base‐level contact information, a Cloud Function syncs it to `sections/contactInfo` for rules‑based access.

## File Pointers

- Models: `shared/models/account.model.ts`
- Rules: `firestore.rules`
- Privacy service (decision logic): `src/app/core/services/privacy.service.ts`
- Contact Info UI: `src/app/modules/account/pages/details/components/contact-information/contact-information.component.*`
- Settings UI: `src/app/modules/account/pages/settings/components/settings/settings.component.*`

## Diagrams

### Routes & Containers

```mermaid
graph TD
  A[AppRoutingModule] --> B[AccountModule]
  B -->|/account/settings| S1[SettingsPage]
  B -->|/account/:accountId/settings| S2[SettingsPage (OwnerOrAdminGuard)]
  B -->|/account/:accountId| D1[DetailsPage]

  S1 --> SF[SettingsComponent]
  S2 --> SF

  D1 --> H[Hero]
  D1 --> P[Profile]
  D1 --> CI[ContactInformation]
  D1 --> RC[RelatedAccounts]
  D1 --> PI[ProfessionalInfo]
  D1 --> VAC[VolunteerPreferenceInfo]
  D1 --> MA[MutualAidCommunityInfo]
  D1 --> FAQ[FAQ Section]
  D1 --> RL[RelatedListings]
```

### Settings Update Data Flow

```mermaid
sequenceDiagram
  actor User
  participant Form as SettingsComponent
  participant Store as NgRx Store
  participant Eff as AccountEffects
  participant FS as Firestore (accounts/{id})

  User->>Form: Change visibility/allow/block lists
  Form->>Store: dispatch(updateAccount({ privacySettings, ... }))
  Store->>Eff: [updateAccount]
  Eff->>FS: update accounts/{id}
  FS-->>Eff: ok
  Eff-->>Store: updateAccountSuccess
  Store-->>Form: state updated
```

### Viewing Contact Information (Gated Section)

```mermaid
sequenceDiagram
  actor Viewer
  participant Page as DetailsPage
  participant Cmp as ContactInformationComponent
  participant Svc as AccountSectionsService
  participant Doc as accounts/{accountId}/sections/contactInfo
  participant Rules as Firestore Rules

  Viewer->>Page: Open profile
  Page->>Cmp: Render
  Cmp->>Svc: contactInfo$(accountId)
  Svc->>Doc: get()
  Doc->>Rules: canViewSection(accountId, 'contactInformation')
  alt Allowed
    Rules-->>Doc: allow
    Doc-->>Svc: data
    Svc-->>Cmp: ContactInformation
    Cmp-->>Viewer: show
  else Denied
    Rules-->>Doc: deny
    Doc-->>Svc: permission error
    Svc-->>Cmp: null
    Cmp-->>Viewer: private/unavailable state
  end
```

### Rules: Section Access Decision

```mermaid
flowchart TD
  A[Request to read section] --> B{Owner or Admin?}
  B -- Yes --> AL1[ALLOW]
  B -- No --> C{In allowlist?}
  C -- Yes --> AL2[ALLOW]
  C -- No --> D{In blocklist?}
  D -- Yes --> DN1[DENY]
  D -- No --> E{Audience match? or Override?}
  E -- Yes --> AL3[ALLOW]
  E -- No --> DN2[DENY]

  %% Implemented by helpers in firestore.rules:
  %% isAccountOwner/isAccountAdmin, inAllowlist, inBlocklist,
  %% isAllowedByAudience, hasOverride, canViewSection
```

### Rules: Related Accounts Visibility

```mermaid
flowchart TD
  S[Read accounts/{accountId}/relatedAccounts/{rid}] --> O{Owner/Admin or Subject?}
  O -- Yes --> AL[ALLOW]
  O -- No --> T{Relationship type}
  T -->|member| M{canViewSection('membersList')}
  T -->|partner| P{canViewSection('partnersList')}
  T -->|friend| F{canViewSection('friendsList')}
  M -- true --> AL
  M -- false --> DN[DENY]
  P -- true --> AL
  P -- false --> DN
  F -- true --> AL
  F -- false --> DN
```

### Details Page: Component Tree (Condensed)

```mermaid
graph TD
  Details[DetailsPage]
  Details --> Hero[Hero]
  Details --> Profile[Profile]
  Details --> Contact[ContactInformation]
  Details --> RelUsers[RelatedAccounts type=user]
  Details --> RelGroups[RelatedAccounts type=group]
  Details --> Prof[ProfessionalInfo]
  Details --> Vol[VolunteerPreferenceInfo]
  Details --> Aid[MutualAidCommunityInfo]
  Details --> FAQ[FAQ Section]
  Details --> Listings[RelatedListings]
```

### Audiences: Where They Apply

```mermaid
graph LR
  Public(Public) --- Auth(Authenticated) --- Related(Related)
  Related --- Private(Private)

  subgraph Sections
    CI[contactInformation]
    ML[membersList / Groups]
    PL[partnersList]
    FL[friendsList]
    RH[roleHierarchy]
    PR[projects]
  end

  Related --> CI
  Related --> ML
  Related --> PL
  Related --> FL
  Related --> RH
  Related --> PR
```
