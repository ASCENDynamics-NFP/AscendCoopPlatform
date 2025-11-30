# Time Entry UI Improvements TODO

This document outlines UI and functional improvements identified for the Time-Entry Approvals and Reports pages.

---

## 📋 Approvals Page Improvements

### UI Improvements

#### 1. Add Summary Statistics Card

**Priority:** HIGH  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.html`

**Current Issue:** No at-a-glance summary of pending vs approved hours  
**Improvement:** Add a summary card at the top showing:

- Total Pending (count & hours)
- Total Approved (count & hours)
- Total Rejected (count & hours)
- Total for Period

**Benefit:** Gives admins immediate context without scrolling through all entries

**Implementation Notes:**

- Added `SummaryStats` interface in approvals.page.ts
- Created `summaryStats$` observable that computes statistics from grouped entries
- Added `calculateSummaryStats()` method for aggregating counts and hours
- Added responsive 4-column grid layout (2 columns on tablet, 1 on mobile)
- Color-coded cards: yellow (pending), green (approved), red (rejected), blue (total)
- Added hover effects and dark mode support
- Added translation keys: `summary_statistics`, `total_timesheets`

---

#### 2. Add Search/Filter by User Name

**Priority:** HIGH  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.ts`

**Current Issue:** Only status filter exists; finding specific users is difficult with many entries  
**Improvement:** Add text search input to filter entries by user name  
**Tasks:**

- [x] Add search input field to filter controls
- [x] Add `userSearchTerm$` BehaviorSubject
- [x] Filter `displayEntries$` by user name match
- [x] Add clear search button

**Implementation Notes:**

- Added `userSearchTerm` property and `userSearchTerm$` BehaviorSubject
- Created `onUserSearchChange()` and `clearUserSearch()` methods
- Updated `displayEntries$` observable to include user search filtering
- Filters by both `userName` and `userEmail` (case-insensitive)
- Added styled search input with search icon and clear button
- Added dark mode support for search input
- Added translation keys: `search_by_user`, `search_user_placeholder`, `clear_search`, `no_matching_users`

---

#### 3. Collapsible Entry Details

**Priority:** MEDIUM  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.html`

**Current Issue:** Entry details are always expanded, making it hard to scan many entries  
**Improvement:** Add accordion/toggle to collapse details by default  
**Tasks:**

- [x] Add `expandedGroups` Set to track expanded state
- [x] Add toggle button/chevron icon to each group
- [x] Collapse details by default, expand on click
- [x] Add "Expand All" / "Collapse All" buttons

**Implementation Notes:**

- Added `expandedGroups` Set and `allExpanded` boolean to track state
- Created helper methods: `getGroupKey()`, `isGroupExpanded()`, `toggleGroupExpansion()`
- Added `expandAllGroups()` and `collapseAllGroups()` methods
- Timesheet items now show chevron icon (up/down) indicating expand state
- Details section only renders when expanded (`*ngIf="isGroupExpanded(group)"`)
- Added Angular animation `@slideInOut` for smooth expand/collapse transitions
- Added "Expand All" / "Collapse All" toggle button in section header
- Click on timesheet item toggles expansion; action buttons have `stopPropagation()`
- Added translation keys: `expand_all`, `collapse_all`, `click_to_expand`, `click_to_collapse`
- Styled chevron with hover effects and color change when expanded

---

#### 4. Selective Batch Operations

**Priority:** MEDIUM  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.ts`

**Current Issue:** Bulk approve/reject affects ALL pending entries  
**Improvement:** Add checkboxes for selective batch operations  
**Tasks:**

- [x] Add checkbox to each group item
- [x] Add `selectedGroups` Set to track selection
- [x] Add "Select All" / "Deselect All" buttons
- [x] Update bulk actions to operate on selected items only
- [x] Show selection count in bulk action buttons

**Implementation Notes:**

- Added `selectedGroups` Set and `allPendingSelected` boolean to track selection state
- Created helper methods: `isGroupSelected()`, `toggleGroupSelection()`, `selectAllPending()`, `deselectAll()`, `getSelectedCount()`, `getSelectedPendingGroups()`
- Updated `bulkApprove()` and `bulkReject()` to show selection count in confirmation dialogs
- Updated `performBulkAction()` to process either selected groups or all pending groups
- Added selection controls section with "Select All Pending" / "Deselect All" toggle button
- Added selection count badge showing number of selected items
- Added checkboxes (only visible on pending items) with proper event handling (`stopPropagation()`)
- Added visual feedback: selected items have primary color border and background highlight
- Added dark mode support for checkbox and selection styling
- Added translation keys: `select_all_pending`, `deselect_all`, `selected`, `approve_selected`, `reject_selected`

---

#### 5. Week Picker Enhancement

**Priority:** LOW  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.html`

**Current Issue:** Must click through weeks one at a time  
**Improvement:** Add date picker to jump directly to any week  
**Tasks:**

- [x] Add calendar/date picker popover
- [x] Allow selecting any date to jump to that week
- [x] Keep previous/next buttons for quick navigation
- [x] Add "Jump to This Week" quick action

**Implementation Notes:**

- Made current period clickable to open date picker dropdown
- Added calendar icon next to month/year label indicating clickability
- Date picker uses `ion-datetime` with `presentation="date"` for clean calendar view
- Added `onDateSelected()` method that calculates the week start (Sunday) for any selected date
- Added `isCurrentWeek()` helper to check if viewing current week
- Added `jumpToThisWeek()` method to quickly return to current week
- "This Week" button only shows when not viewing current week
- Previous/next nav button labels hidden on mobile (<600px) to save space
- Added dark mode support for date picker dropdown
- Added translation keys: `this_week`, `jump_to_this_week`, `select_week`
- Added proper ARIA labels for accessibility

---

#### 6. Improve Mobile Entry Grid

**Priority:** LOW  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.scss`

**Current Issue:** Entry grid collapses to single column on mobile (480px), losing context  
**Improvement:** Keep date + hours on same row for better mobile readability  
**Tasks:**

- [x] Adjust grid-template-columns for small screens
- [x] Consider horizontal scroll for very small screens
- [x] Test on various device sizes

**Implementation Notes:**

- Changed from single-column grid to flexbox with wrap at 480px breakpoint
- Date and hours now stay on the same row (date flex-grows, hours fixed right)
- Project name wraps to second row with `flex-basis: 100%` and smaller font
- Notes button absolutely positioned to right side
- Added proper padding-right to accommodate notes button
- Maintains context by keeping date + hours visible together
- Project name still visible but de-emphasized on second line

---

### Functional Improvements

#### 7. Require Rejection Reason

**Priority:** HIGH  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.ts`

**Current Issue:** Rejection shows simple confirmation with no reason required  
**Improvement:** Require reason input when rejecting timesheets  
**Tasks:**

- [x] Update `rejectTimesheet()` alert to include textarea input
- [x] Validate that reason is provided (min length)
- [x] Pass rejection reason to `updateTimesheetStatus()`
- [x] Store reason in `rejectionReason` field on TimeEntry
- [x] Add translation key for rejection reason prompt

**Implementation Notes:**

- Added textarea input to rejection alert with placeholder text
- Input has minlength=10 and maxlength=500 attributes
- Added validation: reason must be at least 10 characters
- If validation fails, shows warning toast and prevents alert from closing
- Added `showValidationError()` helper method for toast display
- Updated `updateTimesheetStatus()` to accept optional `rejectionReason` parameter
- Reason stored in `rejectionReason` field on TimeEntry
- Reason also included in `statusHistory` entry and `noteHistory` entry
- Rejection notification now includes the rejection reason
- Bulk reject also requires a reason with same validation

---

#### 8. Undo Action Toast

**Priority:** MEDIUM  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.ts`

**Current Issue:** Accidental approval/rejection cannot be undone  
**Improvement:** Add 5-second "Undo" toast after approval/rejection  
**Tasks:**

- [x] Delay Firestore update by 5 seconds
- [x] Show toast with "Undo" button
- [x] Cancel update if undo clicked
- [x] Proceed with update after timeout
- [x] Handle component destruction during delay

**Implementation Notes:**

- Added `pendingActions` Map to track actions awaiting execution
- Set `UNDO_DELAY_MS = 5000` (5 seconds) constant
- Refactored `updateTimesheetStatus()` to schedule delayed execution
- Added `showUndoToast()` method with "Undo" button
- Added `undoAction()` method to cancel pending action
- Added `executeStatusUpdate()` for actual Firestore update
- Toast shows at bottom of screen with countdown duration
- Toast color matches action (green for approve, yellow for reject)
- On undo, shows "Action undone" confirmation toast
- On component destroy, executes all pending actions immediately (prevents data loss)
- Added `take(1)` to currentUser$ subscription to prevent memory leaks

---

#### 9. Export Approvals Data

**Priority:** MEDIUM  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.ts`

**Current Issue:** No way to export approval data for payroll/compliance  
**Improvement:** Add CSV export button for current filtered view  
**Tasks:**

- [x] Add "Export CSV" button to controls section
- [x] Generate CSV with: User, Week, Hours, Status, Approved By, Date
- [x] Apply current filters to export
- [x] Use descriptive filename with date range

**Implementation Notes:**

- Added `exportToCSV()` method that exports current filtered view
- CSV columns: User, Email, Week Start, Week End, Total Hours, Status, Entries Count, Approved By, Approved Date, Rejection Reason
- Added `escapeCSV()` helper to handle commas, quotes, and newlines in values
- Added `downloadCSV()` helper to trigger browser download
- Filename format: `timesheet-approvals-{date-range}-{status-filter}.csv`
- Examples: `timesheet-approvals-week-2025-11-24.csv`, `timesheet-approvals-all-time-pending.csv`
- Export button placed in bulk actions area with download icon
- Button styled to appear on the right side (margin-left: auto)
- Shows success toast with filename and record count
- Added translation key: `export_csv`

---

#### 10. Persist View Mode Preference

**Priority:** LOW  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.ts`

**Current Issue:** View mode resets to "by-user" on every page load  
**Improvement:** Save preference to localStorage  
**Tasks:**

- [x] Save `viewMode` to localStorage on change
- [x] Load saved `viewMode` on init
- [x] Apply to `sortBy`, `sortDirection`, `statusFilter` as well

**Implementation Notes:**

- Created `ApprovalsPreferences` interface to define stored settings
- Added `APPROVALS_STORAGE_KEY = 'approvals-preferences'` constant
- Added `loadPreferences()` method called in `ngOnInit()` before initializing reactive streams
- Added `savePreferences()` method that serializes preferences to JSON
- Updated all preference-changing methods to call `savePreferences()`:
  - `setViewMode()`: saves viewMode
  - `toggleShowAllWeeks()`: saves showAllWeeks toggle
  - `setStatusFilter()`: saves status filter selection
  - `setSortBy()`: saves sort column preference
  - `toggleSortDirection()`: saves asc/desc preference
- Graceful error handling with try/catch for localStorage operations
- Preferences persist across page reloads and browser sessions

---

#### 11. View Status History

**Priority:** LOW  
**Status:** ✅ COMPLETED  
**File:** `src/app/modules/time-tracking/pages/approvals/approvals.page.ts`

**Current Issue:** Cannot view audit trail of status changes  
**Improvement:** Add modal to view `statusHistory` array  
**Tasks:**

- [x] Add "View History" button on each entry
- [x] Create StatusHistoryModalComponent
- [x] Display timeline of status changes with who/when/reason
- [x] Style as conversation/timeline format

**Implementation Notes:**

- Created `StatusHistoryModalComponent` with timeline UI in `components/status-history-modal/`
- Modal displays user header with name, week, current status, and total hours
- Timeline shows all status changes in reverse chronological order (newest first)
- Each timeline item shows: status icon (colored dot), status label, timestamp (relative + full), changed by user, and reason (if provided)
- Collects status history from all entries in the group for comprehensive view
- Status-specific colors: draft (medium/gray), pending (warning/yellow), approved (success/green), rejected (danger/red)
- "View History" button added to expanded details section of each timesheet
- Added dark mode support for all modal elements
- Mobile-responsive layout with stacked header on small screens
- Empty state shows when no history is recorded
- Added translation keys: `view_history`, `status_history`, `no_history`, `no_history_message`

---

## 📊 Reports Page Improvements

### UI Improvements

#### 12. Simplify Summary Cards Layout

**Priority:** MEDIUM  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.html`

**Current Issue:** Summary cards have nested `ion-row` → `div` → `ion-col` creating extra DOM  
**Improvement:** Flatten structure for better performance and cleaner code  
**Tasks:**

- [ ] Refactor summary cards to use CSS Grid directly
- [ ] Remove unnecessary wrapper divs
- [ ] Ensure proper responsive behavior

---

#### 13. Dynamic Chart Height

**Priority:** MEDIUM  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.scss`

**Current Issue:** Fixed 300px height truncates labels on bar charts with many projects  
**Improvement:** Calculate height based on data count  
**Tasks:**

- [ ] Set minimum height of 250px
- [ ] Add ~30px per bar/item beyond threshold
- [ ] Cap maximum height at 600px
- [ ] Apply to project distribution chart

---

#### 14. Improve Loading State

**Priority:** MEDIUM  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.html`

**Current Issue:** Loading spinner appears after controls, not overlaying results  
**Improvement:** Overlay loading state on results area  
**Tasks:**

- [ ] Add loading overlay div with backdrop
- [ ] Position absolutely over results section
- [ ] Add fade-in/out animation
- [ ] Prevent interaction during loading

---

#### 15. Date Picker Modal

**Priority:** LOW  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.html`

**Current Issue:** Inline `ion-datetime` takes significant vertical space  
**Improvement:** Use popup/modal date picker  
**Tasks:**

- [ ] Replace inline datetime with ion-datetime-button
- [ ] Configure modal presentation
- [ ] Maintain functionality for start/end date selection

---

#### 16. Empty Chart Placeholder

**Priority:** LOW  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.html`

**Current Issue:** Charts show blank canvas when no data exists  
**Improvement:** Add "No data for this period" placeholder  
**Tasks:**

- [ ] Check if chart data is empty before rendering
- [ ] Show placeholder with icon and message
- [ ] Suggest adjusting filters or date range

---

#### 17. Enhance Print Styles

**Priority:** LOW  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.scss`

**Current Issue:** Charts get cut off in print view  
**Improvement:** Optimize print layout  
**Tasks:**

- [ ] Set explicit chart dimensions for print
- [ ] Add page-break-inside: avoid for charts
- [ ] Hide interactive elements (buttons, filters)
- [ ] Add print header with report title and date

---

### Functional Improvements

#### 18. Auto-Generate on Filter Change

**Priority:** HIGH  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.ts`

**Current Issue:** Must click "Generate Report" after every filter change  
**Improvement:** Auto-generate with debounce  
**Tasks:**

- [ ] Add debounce (500ms) to filter change handlers
- [ ] Auto-call `generateReport()` on debounced change
- [ ] Show loading indicator during regeneration
- [ ] Keep manual "Refresh" button for explicit reload

---

#### 19. Date Range Presets

**Priority:** HIGH  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.html`

**Current Issue:** Must manually enter custom date ranges  
**Improvement:** Add quick preset buttons  
**Tasks:**

- [ ] Add preset buttons: "This Month", "Last Month", "This Quarter", "Last Quarter", "YTD"
- [ ] Calculate date ranges dynamically
- [ ] Auto-populate start/end date fields
- [ ] Trigger report generation on preset selection

---

#### 20. Save Report Configurations

**Priority:** MEDIUM  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.ts`

**Current Issue:** Must reconfigure filters for frequently-run reports  
**Improvement:** Allow saving report configurations  
**Tasks:**

- [ ] Add "Save Configuration" button
- [ ] Create SavedReportConfig interface
- [ ] Store in localStorage or user preferences
- [ ] Add dropdown to load saved configurations
- [ ] Allow naming and deleting saved configs

---

#### 21. Period Comparison Mode

**Priority:** MEDIUM  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.ts`

**Current Issue:** Cannot compare periods to see trends  
**Improvement:** Add comparison mode (e.g., this month vs last month)  
**Tasks:**

- [ ] Add "Compare" toggle
- [ ] Show secondary date range selector
- [ ] Modify charts to show both periods
- [ ] Add delta/percentage change indicators
- [ ] Update CSV export to include comparison data

---

#### 22. PDF Export with Charts

**Priority:** MEDIUM  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.ts`

**Current Issue:** Only CSV export available, no visual report export  
**Improvement:** Add PDF export including charts  
**Tasks:**

- [ ] Add jsPDF or similar library
- [ ] Capture chart canvases as images
- [ ] Generate PDF with summary, charts, and tables
- [ ] Add organization branding/header
- [ ] Include generation timestamp

---

#### 23. User Detail Drill-Down

**Priority:** LOW  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.html`

**Current Issue:** User breakdown shows summary but no detail view  
**Improvement:** Add link to view user's detailed entries  
**Tasks:**

- [ ] Make user name clickable
- [ ] Navigate to filtered view or modal with that user's entries
- [ ] Show breakdown by project, date, status
- [ ] Add "Back to Report" navigation

---

#### 24. Improve Chart Interactivity

**Priority:** LOW  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.ts`

**Current Issue:** Bar chart labels get cut off with many projects  
**Improvement:** Add scrolling or click-to-expand  
**Tasks:**

- [ ] Enable horizontal scroll for bar chart container
- [ ] Add click handler to expand individual bars
- [ ] Show detail popover on bar click
- [ ] Consider switching to horizontal bar chart for many items

---

## 🔗 Cross-Cutting Improvements

#### 25. Consistent Navigation

**Priority:** HIGH  
**Status:** ❌ TODO  
**Files:** Both pages

**Current Issue:** Reports page header links to `/time-entry` instead of Approvals  
**Improvement:** Add consistent breadcrumb or back navigation  
**Tasks:**

- [ ] Update Reports page defaultHref to Approvals page
- [ ] Add breadcrumb component showing: Time Tracking > Approvals > Reports
- [ ] Ensure back navigation is intuitive from both pages

---

#### 26. Standardize Loading States

**Priority:** MEDIUM  
**Status:** ❌ TODO  
**Files:** Both pages

**Current Issue:** Different loading UI patterns between pages  
**Improvement:** Create shared loading component  
**Tasks:**

- [ ] Create TimeTrackingLoadingComponent
- [ ] Use consistent spinner, message, and styling
- [ ] Apply to both Approvals and Reports pages

---

#### 27. Complete i18n Translation

**Priority:** HIGH  
**Status:** ❌ TODO  
**File:** `src/app/modules/time-tracking/pages/reports/reports.page.html`

**Current Issue:** Reports page has hardcoded English strings  
**Improvement:** Move all strings to translation files  
**Tasks:**

- [ ] Identify all hardcoded strings in reports.page.html
- [ ] Add translation keys to en.json
- [ ] Replace hardcoded strings with `{{ 'key' | translate }}`
- [ ] Strings include: "Report Configuration", "Generate Report", "Refresh", "Export CSV", chart titles, etc.

---

#### 28. Accessibility Improvements

**Priority:** MEDIUM  
**Status:** ❌ TODO  
**Files:** Both pages

**Current Issue:** Icon-only buttons lack labels; charts not accessible  
**Improvement:** Add ARIA attributes and accessible alternatives  
**Tasks:**

- [ ] Add `aria-label` to all icon-only buttons
- [ ] Add accessible data tables for chart data
- [ ] Ensure color is not the only indicator of status
- [ ] Test with screen reader
- [ ] Add keyboard navigation for interactive elements

---

#### 29. Real-Time Updates

**Priority:** LOW  
**Status:** ❌ TODO  
**Files:** Both pages

**Current Issue:** Pages don't update when data changes elsewhere  
**Improvement:** Add real-time Firestore listeners  
**Tasks:**

- [ ] Consider adding `onSnapshot` listeners for live updates
- [ ] Handle optimistic updates for local actions
- [ ] Show indicator when new data is available
- [ ] Evaluate performance impact before implementing

---

## 📅 Implementation Priority

### Phase 1 - High Priority (Core UX)

1. Item 1: Summary Statistics Card
2. Item 2: Search/Filter by User Name
3. Item 7: Require Rejection Reason
4. Item 18: Auto-Generate on Filter Change
5. Item 19: Date Range Presets
6. Item 25: Consistent Navigation
7. Item 27: Complete i18n Translation

### Phase 2 - Medium Priority (Enhanced Features)

8. Item 3: Collapsible Entry Details
9. Item 4: Selective Batch Operations
10. Item 8: Undo Action Toast
11. Item 9: Export Approvals Data
12. Item 12: Simplify Summary Cards Layout
13. Item 13: Dynamic Chart Height
14. Item 14: Improve Loading State
15. Item 20: Save Report Configurations
16. Item 21: Period Comparison Mode
17. Item 22: PDF Export with Charts
18. Item 26: Standardize Loading States
19. Item 28: Accessibility Improvements

### Phase 3 - Low Priority (Polish)

20. Item 5: Week Picker Enhancement
21. Item 6: Improve Mobile Entry Grid
22. Item 10: Persist View Mode Preference
23. Item 11: View Status History
24. Item 15: Date Picker Modal
25. Item 16: Empty Chart Placeholder
26. Item 17: Enhance Print Styles
27. Item 23: User Detail Drill-Down
28. Item 24: Improve Chart Interactivity
29. Item 29: Real-Time Updates

---

## 📝 General Notes

- All changes should maintain backward compatibility
- Test on iOS, Android, and web platforms
- Consider bundle size impact when adding new libraries (jsPDF, etc.)
- Coordinate i18n additions with translation team
- Performance test with large datasets (100+ entries, 50+ users)

---

## 🏗️ Technical Reference

### Relevant File Locations

| Component            | Path                                                                       |
| -------------------- | -------------------------------------------------------------------------- |
| Approvals Page       | `src/app/modules/time-tracking/pages/approvals/`                           |
| Reports Page         | `src/app/modules/time-tracking/pages/reports/`                             |
| Timesheet Page       | `src/app/modules/time-tracking/pages/timesheet/`                           |
| Week View Component  | `src/app/modules/time-tracking/components/week-view/`                      |
| Notes Modal          | `src/app/modules/time-tracking/components/notes-modal/`                    |
| Time Entry Model     | `shared/models/time-entry.model.ts`                                        |
| NgRx Actions         | `src/app/state/actions/time-tracking.actions.ts`                           |
| NgRx Selectors       | `src/app/state/selectors/time-tracking.selectors.ts`                       |
| Analytics Service    | `src/app/core/services/analytics.service.ts`                               |
| Notification Service | `src/app/modules/time-tracking/services/timesheet-notification.service.ts` |
| Translations (EN)    | `src/assets/i18n/en.json`                                                  |
| Firestore Rules      | `firestore.rules`                                                          |

### Existing Data Models

**TimeEntry Interface** (`shared/models/time-entry.model.ts`):

```typescript
interface TimeEntry {
  id?: string;
  accountId: string;
  projectId: string;
  projectName?: string;
  userId: string;
  userName?: string;
  date: Timestamp;
  hours: number;
  status?: "draft" | "pending" | "approved" | "rejected";
  notes?: string;
  noteHistory?: NoteHistoryEntry[];
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: Timestamp;
  rejectionReason?: string;
  originalHours?: number;
  statusHistory?: StatusHistoryEntry[];
}
```

**GroupedEntries Interface** (Approvals page internal):

```typescript
interface GroupedEntries {
  userId: string;
  userName: string;
  userEmail: string;
  weekStart: Date;
  entries: TimeEntry[];
  totalHours: number;
  status: "draft" | "pending" | "approved" | "rejected";
  projectName?: string;
}
```

### Existing NgRx Selectors

| Selector                                      | Purpose                             |
| --------------------------------------------- | ----------------------------------- |
| `selectAllEntriesForAccount(accountId)`       | Get all time entries for an account |
| `selectAllEntriesForUser(userId)`             | Get all time entries for a user     |
| `selectActiveProjectsByAccount(accountId)`    | Get non-archived projects           |
| `selectRelatedAccountsByAccountId(accountId)` | Get users related to account        |

### Translation Keys Pattern

Time tracking translations use the `time_tracking.` prefix:

```json
{
  "time_tracking": {
    "time_approvals": "Time Approvals",
    "approve": "Approve",
    "reject": "Reject",
    "pending": "Pending",
    "approved": "Approved",
    "rejected": "Rejected",
    ...
  }
}
```

### Chart.js Configuration

Reports page uses ng2-charts with Chart.js. Registered components:

- DoughnutController, BarController, LineController
- ArcElement, BarElement, LineElement, PointElement
- CategoryScale, LinearScale
- Title, Tooltip, Legend, Filler

### Recommended Libraries for New Features

| Feature                 | Library             | npm Package            | Bundle Impact |
| ----------------------- | ------------------- | ---------------------- | ------------- |
| PDF Export              | jsPDF               | `jspdf`                | ~300KB        |
| PDF with HTML           | html2canvas + jsPDF | `html2canvas`, `jspdf` | ~400KB        |
| Date Picker Enhancement | Ionic DateTime      | Built-in               | None          |
| Debounce                | RxJS                | Built-in               | None          |

---

## 🧪 Testing Considerations

### Unit Test Files

| Component      | Test File                     |
| -------------- | ----------------------------- |
| Approvals Page | `approvals.page.spec.ts`      |
| Reports Page   | `reports.page.spec.ts`        |
| Timesheet Page | `timesheet.page.spec.ts`      |
| Week View      | `week-view.component.spec.ts` |

### Test Scenarios to Add

For each improvement, consider these test categories:

1. **Component Tests**

   - Input/output binding
   - Event emission
   - Template rendering

2. **Integration Tests**

   - NgRx store interactions
   - Service method calls
   - Navigation

3. **E2E Scenarios**
   - Full approval workflow
   - Report generation with filters
   - CSV/PDF export

### Mock Data Requirements

```typescript
// Sample grouped entries for testing
const mockGroupedEntries: GroupedEntries[] = [
  {
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    weekStart: new Date("2025-11-24"),
    entries: [
      /* TimeEntry[] */
    ],
    totalHours: 40,
    status: "pending",
  },
];
```

---

## 🔐 Security Considerations

### Firestore Rules Impact

Changes that affect data access patterns should be validated against `firestore.rules`:

- **Item 7 (Rejection Reason)**: `rejectionReason` field already allowed in rules
- **Item 11 (Status History)**: `statusHistory` array already supported
- **Item 9 (Export)**: Read-only, no rule changes needed

### Permission Checks

Approvals page requires admin/manager role. Verify in component:

```typescript
// Current implementation uses relatedAccounts to check admin status
this.store
  .select(selectRelatedAccountsByAccountId(accountId))
  .pipe(filter((accounts) => accounts.some((a) => a.role === "admin")));
```

---

## 📱 Platform-Specific Notes

### iOS Considerations

- `ion-datetime` modal may need `showDefaultButtons` for better UX
- Safe area insets for bottom action buttons
- Haptic feedback for approval actions (optional)

### Android Considerations

- Back button handling for modals
- Material Design ripple effects on buttons
- Status bar color during loading overlays

### Web/PWA Considerations

- Keyboard shortcuts (e.g., `Ctrl+S` to save config)
- Browser print dialog integration
- Clipboard API for quick copy of data

---

## 📈 Performance Benchmarks

### Current Baseline (to measure against)

| Metric              | Target  | Notes           |
| ------------------- | ------- | --------------- |
| Approvals page load | < 2s    | With 50 entries |
| Report generation   | < 3s    | Monthly report  |
| CSV export          | < 1s    | 100 rows        |
| Filter response     | < 200ms | User search     |

### Optimization Tips

1. **Virtual Scrolling**: Consider `ion-virtual-scroll` for 100+ entries
2. **Memoization**: Use `distinctUntilChanged()` on selectors
3. **Lazy Loading**: Charts should render after initial paint
4. **Pagination**: Server-side pagination for large datasets

---

## 🔄 Related Documentation

- [TIME_TRACKING_TODO.md](./TIME_TRACKING_TODO.md) - Original feature implementation tracking
- [TIME_TRACKING_ANALYTICS_SUMMARY.md](./TIME_TRACKING_ANALYTICS_SUMMARY.md) - Analytics service details
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - General testing guidelines
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Data migration procedures

---

## 📊 Progress Tracking

| Phase            | Total Items | Completed | Percentage |
| ---------------- | ----------- | --------- | ---------- |
| Phase 1 (High)   | 7           | 3         | 43%        |
| Phase 2 (Medium) | 12          | 4         | 33%        |
| Phase 3 (Low)    | 10          | 4         | 40%        |
| **Total**        | **29**      | **11**    | **38%**    |

_Last Updated: November 30, 2025_
