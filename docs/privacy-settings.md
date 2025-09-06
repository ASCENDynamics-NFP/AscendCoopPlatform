# Privacy Settings: Model, Rules, and UI

This document explains section-level privacy in the ASCEND platform: what audiences exist, how they’re enforced by Firestore Security Rules, how you configure them in the app, and how to migrate existing data.

## Goals

- Provide global and per-section visibility controls on accounts.
- Support audiences that match real relationships: Friends (user↔user), Groups (user↔group), Members/Partners (group relations), Admins, and a unified Related audience (all accepted relations).
- Allow fine-grained exceptions via relationship overrides.

## Data Model

`accounts/{accountId}` includes an optional `privacySettings` object with per‑section configuration.

Audiences (`PrivacyAudience`):

- `public`: anyone
- `authenticated` (labeled "Authorized"): any signed-in user
- `related`: any accepted relationship (friend, member, partner, group)
- `private`: deny-by-default; use allowlist/blocklist or per‑relationship overrides to grant access

Section config (`PrivacySettings`):

- `contactInformation` (migrated to subdoc)
- `membersList` (groups) / “Groups” (users)
- `partnersList` (groups)
- `friendsList` (users)
- `roleHierarchy`
- `projects`
- `messaging` and `discoverability` (aux controls)

Each section is a `SectionPrivacy`:

```
{
  visibility: 'public'|'authenticated'|'related'|'groups'|'friends'|'members'|'partners'|'admins'|'custom',
  allowedRoleIds?: string[],
  allowlist?: string[],  // accountIds explicitly allowed
  blocklist?: string[]   // accountIds explicitly denied
}
```

Per-relationship overrides live on each related account:

```
accounts/{accountId}/relatedAccounts/{relatedAccountId} {
  // legacy
  canAccessContactInfo?: boolean,
  // new
  sectionOverrides?: {
    [sectionKey: string]: { allow: boolean, expiresAt?: Timestamp }
  }
}
```

## Firestore Rules Enforcement

Key helpers resolve the viewer’s relationship and the target section’s audience. Enforcement is applied at the document level:

- Sensitive sections move under subcollection docs so rules can gate them:
  - `accounts/{accountId}/sections/contactInfo`
  - Read allowed if the viewer matches section visibility or has an override.
- Related accounts visibility is filtered per doc:
  - Owners/admins and the subject of the relation always read their doc.
  - Otherwise, read only if the doc’s relationship type matches an allowed audience (e.g., `membersList`, `partnersList`, `friendsList`).
- The base account doc remains readable by existing rules; keep sensitive fields out of it.

Short summary of audience checks:

- `public`: no auth required
- `authenticated`: requires `request.auth`
- `related`: any accepted related account (friend, member, partner, or group)
- `private`: owner/admin or explicit allowlist/override; blocklist denies

## UI Configuration

Settings page provides per‑section visibility and allowlists.

- Users see: Public, Authenticated, Friends, Groups, Related.
- Groups see: Public, Authenticated, Members, Partners, Admins, Custom, Related.
- “Members List” on groups appears as “Groups” on user profiles (both write to `membersList`).
- Contact Info card reads `sections/contactInfo`; if blocked, it shows a “private/unavailable” message.

## Migration and Defaults

- Backfill script initializes sensible defaults and migrates base contact info:
  - Contact Info: related (visible to accepted relations only)
  - Members/Partners/Role Hierarchy/Projects: members
  - Friends (users): friends
  - Web Links: public
  - Messaging: related
  - Discoverability.searchable: true
- Script path: `functions/src/scripts/backfillPrivacy.ts`
- Run from `functions/`:
  - `npm install`
  - `npm run build`
  - `npm run backfill:privacy`

## Examples

- “Only my organizations (no friends) can see my phone number” (user): set Contact Info to `groups`.
- “Only friends can see my friends list” (user): set Friends List to `friends`.
- “Members and partners can see our membership roster” (group): set Members List to `related`.
- “All accepted relationships can see our project list” (user or group): set Projects to `related`.
- “Grant a specific partner temporary access to contact info”: add `sectionOverrides.contactInformation = { allow: true, expiresAt }` to that relation doc.

## Future Enhancements (optional)

- Enforce `allowlist`/`blocklist` in rules: extend `canViewSection` to check account-level allow/block lists in addition to relationship overrides.
- Dual‑write for contact info updates to always write `sections/contactInfo`.

## File Pointers

- Models: `shared/models/account.model.ts`
- Rules: `firestore.rules`
- Contact Info UI: `src/app/modules/account/pages/details/components/contact-information/contact-information.component.*`
- Settings UI: `src/app/modules/account/pages/settings/components/settings/settings.component.*`
- Backfill: `functions/src/scripts/backfillPrivacy.ts`

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
