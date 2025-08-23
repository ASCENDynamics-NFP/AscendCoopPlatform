# Admin Dashboard Implementation - TODO List

## Project Overview ✅ **COMPLETED**

Separate personal profile management from group administration to ensure individual users focus on their profiles while group admins have dedicated tools for organizational management.

**Status: PRODUCTION READY** ✨

### Final Implementation Summary:

- ✅ Complete admin dashboard with 7 main sections: Overview, Profile, Members, Roles, FAQs, Listings, Projects, Time Tracking, and Settings
- ✅ Time tracking approvals integration with existing `/account/:id/time-tracking/approvals` page
- ✅ Projects management integration with existing `/account/:id/projects` page
- ✅ Comprehensive access controls via AdminGroupOwnerGuard
- ✅ FAQ section profile view adjustments with information cards for groups
- ✅ Security implementation with comprehensive Firestore rules
- ✅ Context-aware shared components handling user vs group contexts properly
- ✅ ProfileOwnerGuard now redirects group admins to admin dashboard instead of edit page
- ✅ Consistent "Admin Dashboard" terminology throughout the UI
- ✅ Clean code architecture with no duplication between modules
- ✅ **NEW**: Notification badges on Members tab showing pending requests count
- ✅ **NEW**: Quick Actions section in overview for common admin tasks
- ✅ **NEW**: Admin Tips section with helpful guidance for new administrators
- ✅ **NEW**: Enhanced UX with improved styling and visual hierarchy
- ✅ **NEW**: Accessibility improvements with ARIA labels and semantic HTML
- ✅ All core Phase 1 functionality completed and production-ready

**Remaining items are testing and QA tasks that should be done separately**---

## Phase 1: Admin Dashboard Setup ✅ **COMPLETED**

### 1. Core Infrastructure ✅ **COMPLETED**

- [x] **Core Infrastructure** ✅

  - [x] Create Admin Dashboard Module & Route ✅
  - [x] Set up route `/account/:accountId/admin` ✅
  - [x] Implement `AdminGroupOwnerGuard` for access control ✅
  - [x] Create admin dashboard module structure ✅
  - [x] Ensure only group admins/owners can access ✅

- [x] **Dashboard Navigation & UI** ✅
  - [x] Design admin dashboard layout with clear navigation ✅
  - [x] Create menu/tabs for: Group Profile, Members, Roles, Listings, FAQs, Settings ✅
  - [x] Reuse consistent styles from user profile pages (Ionic grid/segment layout) ✅
  - [x] Add distinct header/icon to indicate admin area ✅
  - [x] Add "Go to Admin Dashboard" button on group profile (visible to admins only) ✅

### 2. Group Profile Management ✅ **COMPLETED**

- [x] **Group Profile Form (Admin Version)** ✅

  - [x] **Basic Info Section** ✅

    - [x] Dedicated `AdminGroupProfileFormComponent` created ✅
    - [x] Group name, description fields ✅
    - [x] Mission Statement field (`groupObjectivesMissionStatement`) ✅
    - [x] Group type selection ✅
    - [x] Founding date field ✅
    - [x] Add History/Background field (`groupHistoryBackground`) ✅
    - [x] Add Supported Languages field ✅

  - [x] **Contact Info Section** ✅

    - [x] Custom contact form for organizational contacts ✅
    - [x] Group address, phone, public email fields ✅
    - [x] Proper form validation and structure ✅
    - [x] Clear labeling as organizational contacts ✅

  - [x] **Web Links Section** ✅

    - [x] Dynamic web links form array ✅
    - [x] Organization-specific link categories ✅
    - [x] Add/remove link functionality ✅
    - [x] URL validation ✅

  - [x] **Google Calendar Integration** ✅

    - [x] Field for calendar embed link (`groupDetails.googleCalendarUrl`) ✅
    - [x] Preview or instructions for obtaining share URL ✅
    - [ ] Future: Native event object creation and management (Phase 2+)

  - [x] **Save Functionality** ✅
    - [x] Hook up form to `AccountActions.updateAccount` ✅
    - [x] Form integrates with admin dashboard Profile tab ✅
    - [x] Validation and error handling ✅
    - [x] Loading states and user feedback ✅

### 3. Members & Partners Management

- [x] **Navigation Integration** ✅

  - [x] "Manage Members" button linking to `/account/:accountId/related/user` ✅
  - [x] "Manage Partners" button linking to `/account/:accountId/related/group` ✅
  - [x] Quick action buttons in Overview tab ✅
  - [x] Dedicated Members & Partners tab with overview cards ✅

- [x] **Member List Interface**

  - [x] Reuse/embed existing `relatedAccount ListPage` component
  - [x] Integrate as part of admin dashboard UI (not separate page)
  - [x] Display current members with role/access information

- [x] **Role/Access Controls** ✅

  - [x] Ensure `showAccessControls$` is true for admins ✅
  - [x] Dropdowns for access level (admin/moderator/member) ✅
  - [x] Role assignment functionality ✅
  - [x] Adjust logic for group owners and admins access ✅

- [x] **Pending Requests Management** ✅

  - [x] Subsection/tab for Pending Member Requests ✅
  - [x] Display pending related accounts with relation "member" ✅
  - [x] Accept and Reject buttons functionality ✅
  - [x] Status updates (pending → accepted/rejected) ✅
  - [x] Clear approval queue interface ✅
  - [x] **NEW**: Validation to prevent self-approval (initiatorId ≠ accountId) ✅
  - [x] **NEW**: Visual indicator for self-initiated requests ✅

- [x] **Member Actions** ✅
  - [x] Remove/ban member functionality ✅
  - [x] Member promotion/demotion tools ✅
  - [x] Invite new members feature (or stub for future) ✅
  - [x] Search/filter members (optional for Phase 1) ✅

### 4. Roles & Permissions Management

- [x] **Roles Management Integration**

  - [x] Link to existing Role Management page (`/account/:id/roles`)
  - [x] Embed or navigate to `RoleManagementPage`
  - [x] Add admin guard to roles route
  - [x] "Manage Roles" and "Hierarchy Tree" buttons

- [x] **Role Functionality**
  - [x] Standard role template selection (Administrator, Moderator, Project Manager)
  - [x] Role creation, editing, deletion (CRUD)
  - [x] Role assignment to members
  - [x] Role hierarchy visualization
  - [x] Test role creation and assignment workflows

### 5. FAQ Management

- [x] **FAQ Admin Interface**

  - [x] Add "FAQs" section to admin dashboard
  - [x] Reuse `FaqFormComponent` from profile edit
  - [x] List current FAQs with add/edit/delete options
  - [x] Reorder FAQs functionality (if implemented)

- [x] **FAQ Form Features**

  - [x] Validation (question 500 char max, answer 2000 char max)
  - [x] Auto-save or explicit save functionality
  - [x] FormArray management for multiple FAQs
  - [x] Integration with store/actions for account updates

- [x] **Profile Integration**
  - [x] Remove FAQ option from Account Edit menu
  - [x] Update group profile FAQ display
  - [x] Remove inline editing from profile view
  - [x] Ensure FAQ updates reflect on public profile

### 6. Listings Management

- [x] **Listings Overview**

  - [x] Add "Listings" section to admin dashboard
  - [x] Link to existing listings page (`/account/:id/listings`)
  - [x] Display group's listings by status (active, draft, etc.)
  - [x] "Add Listing" button linking to creation flow

- [x] **Applicant Management** ✅

  - [x] Surface pending applicants to group listings ✅
  - [x] Link to listing's "Applicants" page ✅
  - [x] Show applicant count per listing ✅
  - [x] Basic approval/rejection for listing applicants (Phase 1 focus) ✅
  - [x] Integration with "Applicant Listings" view for group admins ✅

- [x] **Listing CRUD**
  - [x] Edit/withdraw listings interface
  - [x] Integration with existing listing-edit page
  - [x] Ensure all group listing management available to admins

### 7. Group Settings & Privacy

- [x] **Privacy Controls**

  - [x] Profile Visibility toggle (Public vs Members-only)
  - [x] Membership Policy settings (open vs approval required)
  - [x] Privacy field mapping in account model

- [x] **Notification Preferences**

  - [x] Admin notification settings (`administrativeSettings.notificationPreferences`)
  - [x] Email notifications for join requests, new posts, etc.
  - [x] Preference management interface

- [x] **Admin Management**

  - [x] Assign additional group admins
  - [x] List current admins (`relatedAccounts` with access="admin")
  - [x] Promote members to admin status
  - [x] Prevent removing last admin
  - [x] Admin delegation functionality

- [x] **Settings Persistence**
  - [x] Save settings via store updates/cloud functions
  - [x] Test privacy changes reflect in group accessibility
  - [x] Error handling and validation

### 8. Shared Elements Considerations ✅ **COMPLETED**

- [x] **"Connections" vs "Members" Handling** ✅

  - [x] Ensure RelatedAccount component works for both user friends and group members ✅
  - [x] Maintain context-specific labels and controls ✅
  - [x] Preserve component reusability while enforcing permissions ✅

- [x] **Basic Profile Fields Overlap** ✅

  - [x] Handle shared fields (name, description, images) appropriately by context ✅
  - [x] Ensure UI components can be reused but with proper context awareness ✅
  - [x] Prevent cross-contamination of user vs group field visibility ✅

- [x] **Listings Context Management** ✅

  - [x] Distinguish between "My Listings" (user) vs "Our Group's Listings" (admin) ✅
  - [x] Maintain same creation interface but with proper ownership context ✅
  - [x] Ensure applicant approval flows work for both individual and group listings ✅

- [x] **Notifications & Approvals Context** ✅
  - [x] Unified notification system but context-aware action interfaces ✅
  - [x] Route approval actions to appropriate interfaces (personal vs admin) ✅
  - [x] Prevent group admin notifications from appearing in personal contexts ✅

### 9. Dashboard Overview ✅ **COMPLETED**

- [x] **Statistics Summary** ✅

  - [x] Member count display (separated by type) ✅
    - [x] User members count (type="user") ✅
    - [x] Partner organizations count (type="group") ✅
  - [x] Pending requests count ✅
  - [x] Active listings count (placeholder) ✅
  - [x] Clickable stat cards with navigation ✅
  - [x] Professional styling with icons ✅
  - [x] Profile visibility status ✅
  - [ ] Upcoming events (if calendar integration)

- [x] **Quick Actions** ✅
  - [x] Recent activity summary ✅
  - [x] Quick access to common admin tasks ✅
  - [x] "Group at a Glance" information panel ✅

### 10. Testing & Security

- [x] **Access Control Testing** ✅

  - [x] Verify admin dashboard access restrictions ✅
  - [x] Test AuthGuard/redirect functionality ✅
  - [x] Ensure non-admins cannot access manually ✅

- [x] **Feature Testing** ✅

  - [x] Test profile info updates and persistence ✅
  - [x] Test member approval workflow ✅
  - [x] Test role assignment and changes ✅
  - [x] Verify UI updates after changes ✅
  - [x] **NEW**: Enhanced user feedback for all admin operations ✅
  - [x] **NEW**: Error handling and validation for critical operations ✅
  - [x] **NEW**: Confirmation dialogs for sensitive actions (admin promotion) ✅
  - [x] **NEW**: Toast notifications for success/error states ✅

- [x] **Security Implementation** ✅
  - [x] Update Firebase/Firestore security rules ✅
  - [x] Prevent unauthorized client-side changes ✅
  - [x] Admin-only field write permissions ✅

### 11. Additional Admin Features ✅ **COMPLETED**

- [x] **Moderation and Approval Tools** ✅

  - [x] Time-tracking approvals integration (if applicable) ✅
  - [x] Volunteer hour sign-off interface ✅
  - [ ] Content posting moderation (future)
  - [x] General approval queue management ✅

- [x] **Project/Initiative Management** ✅
  - [x] Link to existing Projects page (`/account/:id/projects`) ✅
  - [x] Stub out "Projects" section in admin dashboard ✅
  - [x] Basic project CRUD interface (existing implementation) ✅
  - [ ] Plan for Phase 2 project tracking expansion (Future Phase)

---

## Phase 2: Edit Profile Cleanup ✅ **COMPLETED**

### 1. Account Edit Menu Simplification ✅ **COMPLETED**

- [x] **Remove Group Features** ✅

  - [x] Eliminate FAQ management from edit menu for groups ✅
  - [x] Remove other group-specific entries (Members, Projects if present) ✅
  - [x] Hide/disable group fields (`groupType`, `googleCalendarUrl`) in user context ✅

- [x] **Conditional Rendering** ✅

  - [x] Update `app-edit-menu` component for conditional display ✅
  - [x] Separate user vs group edit interfaces ✅
  - [x] Enhanced information card for groups with admin dashboard guidance ✅

- [x] **Auth Guard Implementation** ✅
  - [x] Replace component-level auth checks with ProfileOwnerGuard ✅
  - [x] Allow group admins/moderators to edit group profiles ✅
  - [x] Maintain proper access control for both users and groups ✅

### 2. Preserve Edit Profile Features for Individual Users ✅ **COMPLETED**

- [x] **Basic Personal Info** ✅

  - [x] Ensure name, username, tagline, bio/description editing remains for users ✅
  - [x] Keep profile image (avatar) and cover photo upload functionality ✅
  - [x] Maintain personal "about me" section ✅

- [x] **Personal Contact Information** ✅

  - [x] Preserve user's own contact info management (email, phone, addresses, social links) ✅
  - [x] Keep privacy level settings for personal contact info ✅
  - [x] Ensure separation from group contact info ✅

- [x] **Professional Information** ✅

  - [x] Keep Professional segment for individual users only ✅
  - [x] Maintain occupation, employer, skills, education, resume fields ✅
  - [x] Ensure no professional info appears for group accounts ✅

- [x] **User-Specific Sections** ✅

  - [x] Preserve Volunteer Preferences & Causes section for users ✅
  - [x] Keep Mutual Aid & Community Engagement section for individual users ✅
  - [x] Maintain Labor Rights & Advocacy Info for personal profiles only ✅
  - [x] Ensure these sections don't appear for group accounts ✅

- [x] **Personal Social & Web Links** ✅

  - [x] Keep personal website/social media links for individual users ✅
  - [x] Distinguish from organizational links managed in admin dashboard ✅

- [x] **Personal Connections Management** ✅

  - [x] Preserve friend request acceptance/rejection for users ✅
  - [x] Keep personal connections list management ✅
  - [x] Ensure friend management remains separate from group member management ✅

- [x] **Account Settings** ✅
  - [x] Maintain personal account settings (notifications, theme, language, password/security) ✅
  - [x] Keep settings separate from group administrative settings ✅

### 3. Group Admin Guidance (No Forced Redirects) ✅ **COMPLETED**

- [x] **Enhanced Edit Menu for Groups** ✅
  - [x] Information card explaining admin dashboard features ✅
  - [x] Direct navigation button to admin dashboard ✅
  - [x] Professional styling with clear messaging ✅
  - [x] No forced redirects - allows basic profile editing ✅

### 4. UI Component Cleanup ✅ **COMPLETED**

- [x] **Basic Info Form Updates** ✅

  - [x] Hide group-specific fields for user profiles ✅
  - [x] Update template conditions (`account.type === 'group'`) ✅
  - [x] Context-aware form rendering working correctly ✅

- [x] **Form Visibility Logic** ✅
  - [x] Ensure Professional, Volunteer, Mutual Aid, Labor Rights forms only show for users ✅
  - [x] Verify existing `*ngIf` conditions work correctly ✅
  - [x] Double-check no group sections appear for users ✅
  - [x] Enhanced information card for groups with admin dashboard guidance ✅

### 5. Profile View Adjustments ✅ **COMPLETED**

- [x] **Remove Inline Editing** ✅

  - [x] Disable FAQ inline editing for group admins ✅
  - [x] Remove other inline admin actions from profile view ✅
  - [x] Add "Manage in Admin Dashboard" notices/buttons ✅

- [x] **User Experience Preservation** ✅
  - [x] Ensure non-admin user experience unchanged ✅
  - [x] Maintain group profile viewing (About, Members, FAQ read-only) ✅
  - [x] Verify admin has separate edit access ✅

### 6. Documentation Updates ✅

- [x] **Help Text Updates** ✅
  - [x] Update tooltips referencing old profile edit flow ✅
  - [x] Modify in-app documentation ✅
  - [x] Update user manual/FAQ references ✅
  - [x] Ensure consistent Admin Dashboard terminology ✅
  - [x] **NEW**: Welcome card with admin dashboard overview ✅
  - [x] **NEW**: Quick navigation links in overview ✅
  - [x] **NEW**: User-friendly guidance for admin features ✅

### 7. Personal Profile Testing

- [ ] **User Profile Functionality**

  - [ ] Test individual user profile editing (all sections)
  - [ ] Verify profile changes save and display correctly
  - [ ] Test group admin's personal profile editing

- [x] **Workflow Testing** ✅

  - [x] Test old edit route redirection for groups ✅
  - [x] Verify admin dashboard is the correct way to edit groups ✅
  - [ ] Check FAQ removal doesn't break other functionality

- [ ] **Related Account Logic**
  - [ ] Confirm friend request handling still works
  - [ ] Test connections page functionality
  - [ ] Verify user context buttons remain available

### 8. Code Cleanup

- [x] **Component Management** ✅

  - [x] FAQ form component properly shared between modules ✅
  - [x] No code duplication between modules ✅
  - [x] Single source of truth for FAQ management maintained ✅

- [x] **State Management** ✅

  - [x] No obsolete actions found ✅
  - [x] Routing properly updated ✅
  - [x] Clean imports/references maintained ✅

- [x] **Consistency Updates** ✅
  - [x] Ensure "Admin Dashboard" naming throughout UI ✅
  - [x] Update page titles, nav menu references ✅
  - [x] Differentiate from "Account Settings" or "Edit Profile" ✅

---

## Implementation Notes

### Priority Order

1. Core Infrastructure (Dashboard module, routes, guards)
2. Group Profile Management (basic admin editing)
3. Members Management (approval workflows)
4. FAQ Management (move from profile edit)
5. Settings & Privacy controls
6. Edit Profile cleanup and redirects
7. Testing and security verification

### Technical Considerations

- Reuse existing components where possible (`BasicInfoFormComponent`, `ContactInfoFormComponent`, etc.)
- Maintain consistent styling with existing profile pages
- Ensure proper state management integration
- Focus on basic CRUD operations for Phase 1
- Plan for future Phase 2 enhancements (analytics, advanced features)

### Success Criteria

- Group admins have dedicated dashboard for all organizational management
- Individual users have clean, focused profile editing experience
- Clear separation between personal and organizational features
- All approval workflows centralized in admin dashboard
- No functionality regression for existing users
- Proper access controls and security measures in place

---

## Future Enhancements (Phase 2+)

- Advanced analytics and reporting
- Complex project/initiative management
- Enhanced messaging and communication tools
- Detailed moderation and approval workflows
- Event management and calendar integration
- Advanced role hierarchy and permissions
