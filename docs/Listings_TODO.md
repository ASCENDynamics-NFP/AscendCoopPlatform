# Listings Feature Improvement TODO

## Overview

Enhance the Listings module with advanced search, location-based discovery, improved applicant management, and better UX to transform it into a robust opportunity discovery system.

---

## Step 1: Implement Advanced Search & Filtering

### Backend Integration

- [x] Wire up existing `SearchListingsRequest` params in `listings.page.ts` (backend already supports: `location`, `radiusKm`, `skills`, `type`, `remote`, `category`, `limit`, `startAfter`)
- [x] Replace client-side filtering in `listings.selectors.ts` with server-side search via `ListingsService.searchListings()`
- [x] Add proper error handling and loading states for search requests
- [x] Implement pagination using `startAfter` cursor from backend response

### Filter Panel UI

- [x] Create `ListingFilterComponent` with collapsible filter panel
- [x] Add location radius filter (5mi / 10mi / 25mi / 50mi / Any) — converts to `radiusKm` param
- [x] Add skills multi-select filter using `SkillRequirement.name` values
- [x] Add remote-only toggle switch → maps to `remote: true` param
- [x] Add date range picker for listing start date (`TimeCommitment.startDate`)
- [x] Add hours per week range slider (`TimeCommitment.hoursPerWeek` min/max)
- [ ] Add organization autocomplete filter
- [x] Add "Clear All Filters" button

### State Management

- [x] Update `listings.actions.ts` with new `advancedSearch` action accepting `SearchListingsRequest` payload
- [x] Update `listings.reducer.ts` to store advanced filter state
- [x] Add effect to call `ListingsService.searchListings()` on filter changes

---

## Step 2: Add Location-Based Map View

### Map Component

- [ ] Create `ListingsMapComponent` for map view display
- [ ] Add map/list view toggle button to `listings.page.html`
- [ ] Display listing markers using `contactInformation.addresses[]` coordinates
- [ ] Implement marker clustering for dense areas
- [ ] Add marker popup with listing preview (title, type, organization)
- [ ] Implement click-to-navigate from marker to listing detail

### Geolocation Integration

- [ ] Add "Near Me" quick filter button
- [ ] Request user geolocation permission (reference existing implementation in homepage)
- [ ] Auto-populate location filter with user's current location
- [ ] Store last-used location in user preferences

### Decision Required

- [ ] **Choose map library**: Google Maps / Leaflet / Mapbox

---

## Step 3: Enhance Applicant Management

### Status Pipeline

> **Note**: `ListingRelatedAccount` model already has `status: "applied" | "accepted" | "declined" | "withdrawn"`. Consider adding `"reviewing"` and `"interviewed"` stages.

- [ ] Extend `ListingRelatedAccount.status` enum with new stages:
  - Current: `applied` → `accepted` | `declined` | `withdrawn`
  - Proposed: `applied` → `reviewing` → `interviewed` → `accepted` | `declined` | `withdrawn`
- [ ] Create `ApplicantPipelineComponent` with kanban-style columns
- [ ] Add drag-and-drop between status columns (use existing `manageApplication()` callable to update status)
- [ ] Show applicant count badge per status column

### Bulk Actions

- [ ] Add multi-select checkboxes to applicant list
- [ ] Add "Select All" / "Deselect All" buttons
- [ ] Add bulk status update dropdown (calls `manageApplication()` for each selected)
- [ ] Add bulk message action (send to all selected)
- [ ] Add bulk export to CSV (applicant name, email, phone, status, applicationDate)

### Messaging Integration

- [ ] Add "Message Applicant" button on applicant card
- [ ] Deep link to messaging module with pre-filled recipient (`/messaging?userId={accountId}`)
- [ ] Show unread message indicator on applicant cards (requires cross-module state)

### Decision Required

- [ ] **Schema migration strategy**: Add new status values with backward compatibility (existing "applied"/"accepted"/"declined"/"withdrawn" continue to work)

---

## Step 4: Improve Listing Cards UX

### Skill Match Visualization

- [ ] Create `SkillMatchService` to compare user profile skills with listing `SkillRequirement[]`
- [ ] Calculate match percentage: `(matchedSkills / totalRequired) * 100`
- [ ] Weight required skills higher than optional (`SkillRequirement.required`)
- [ ] Add match percentage badge to listing cards
- [ ] Color-code badge (green >75%, yellow 50-75%, gray <50%)
- [ ] Add tooltip showing matched vs missing skills on hover

### Visual Hierarchy Improvements

- [ ] Redesign listing card layout with clearer information hierarchy
- [ ] Add listing type icon/color coding:
  - `volunteer` = green
  - `job` = blue
  - `internship` = orange
  - `gig` = purple
- [ ] Add remote work badge/icon when `Listing.remote === true`
- [ ] Add time commitment summary (e.g., "10-15 hrs/week") from `TimeCommitment.hoursPerWeek`
- [ ] Add "Posted X days ago" timestamp (calculate from `createdAt`)
- [ ] Add organization logo thumbnail (`Listing.iconImage`)

### Responsive Design

- [ ] Optimize card grid for mobile (single column)
- [ ] Optimize card grid for tablet (2 columns)
- [ ] Optimize card grid for desktop (3-4 columns)
- [ ] Ensure filter panel collapses to bottom sheet modal on mobile

---

## Further Considerations

### 1. Backend vs Client Filtering

**Recommendation**: Use Cloud Function (`searchListings` callable) for advanced search

- ✅ Backend already supports all needed params in `SearchListingsRequest`
- ✅ Complex geo queries handled server-side
- ✅ Better performance for large datasets
- ⚠️ Cold start latency (~1-2s first request)
- [ ] Confirm approach with team

### 2. Map Component Library

| Option      | Pros                           | Cons                                |
| ----------- | ------------------------------ | ----------------------------------- |
| Google Maps | Familiar API, reliable         | Cost at scale, API key management   |
| Leaflet     | Free, open-source, lightweight | Less polished, manual tile provider |
| Mapbox      | Beautiful maps, good free tier | Complexity, another dependency      |

- [ ] Check if Google Maps API key already exists in `environment.ts`
- [ ] Evaluate bundle size impact
- [ ] Make final library decision

### 3. Applicant Status Model Change

**Recommendation**: Backward-compatible migration

- Existing statuses remain valid: `"applied"`, `"accepted"`, `"declined"`, `"withdrawn"`
- Add new optional statuses: `"reviewing"`, `"interviewed"`
- Update `manageApplication()` callable to accept new status values
- [ ] Update Firestore security rules for new status values
- [ ] No migration script needed (additive change)

---

## Existing Infrastructure Reference

### Backend Callable Functions (Already Implemented)

| Function              | Purpose                      | Location                        |
| --------------------- | ---------------------------- | ------------------------------- |
| `searchListings`      | Advanced search with filters | `firebase-functions.service.ts` |
| `manageApplication`   | Update applicant status      | `firebase-functions.service.ts` |
| `saveListing`         | Save/favorite a listing      | `firebase-functions.service.ts` |
| `unsaveListing`       | Remove saved listing         | `firebase-functions.service.ts` |
| `applyToListing`      | Submit application           | `firebase-functions.service.ts` |
| `removeMyApplication` | Withdraw application         | `firebase-functions.service.ts` |

### SearchListingsRequest Interface

```typescript
interface SearchListingsRequest {
  location?: {latitude: number; longitude: number};
  radiusKm?: number;
  skills?: string[];
  type?: "volunteer" | "job" | "event" | "project";
  remote?: boolean;
  category?: string;
  limit?: number;
  startAfter?: string;
}
```
