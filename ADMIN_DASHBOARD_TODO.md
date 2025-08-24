# Admin Dashboard Implementation - TODO List

## Project Overview

Separate personal profile management from group administration to ensure individual users focus on their profiles while group admins have dedicated tools for organizational management.

---

## Phase 1: Admin Dashboard Setup

### 1. Core Infrastructure

- [x] **Core Infrastructure** ✅

  - [x] Create Admin Dashboard Module & Route ✅
  - [x] Set up route `/account/:accountId/admin` ✅
  - [x] Implement `AdminGroupOwnerGuard` (or similar) for access control ✅
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

- [x] **Member Actions**
  - [x] Remove/ban member functionality
  - [x] Member promotion/demotion tools
  - [ ] Invite new members feature (or stub for future)
  - [ ] Search/filter members (optional for Phase 1)

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
  - [x] List current admins (`groupAdminsManagers`)
  - [x] Promote members to admin status
  - [x] Prevent removing last admin
  - [x] Admin delegation functionality

- [x] **Settings Persistence**
  - [x] Save settings via store updates/cloud functions
  - [x] Test privacy changes reflect in group accessibility
  - [x] Error handling and validation

### 8. Shared Elements Considerations

- [ ] **"Connections" vs "Members" Handling**

  - [ ] Ensure RelatedAccount component works for both user friends and group members
  - [ ] Maintain context-specific labels and controls
  - [ ] Preserve component reusability while enforcing permissions

- [ ] **Basic Profile Fields Overlap**

  - [ ] Handle shared fields (name, description, images) appropriately by context
  - [ ] Ensure UI components can be reused but with proper context awareness
  - [ ] Prevent cross-contamination of user vs group field visibility

- [ ] **Listings Context Management**

  - [ ] Distinguish between "My Listings" (user) vs "Our Group's Listings" (admin)
  - [ ] Maintain same creation interface but with proper ownership context
  - [ ] Ensure applicant approval flows work for both individual and group listings

- [ ] **Notifications & Approvals Context**
  - [ ] Unified notification system but context-aware action interfaces
  - [ ] Route approval actions to appropriate interfaces (personal vs admin)
  - [ ] Prevent group admin notifications from appearing in personal contexts

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

- [ ] **Access Control Testing**

  - [ ] Verify admin dashboard access restrictions
  - [ ] Test AuthGuard/redirect functionality
  - [ ] Ensure non-admins cannot access manually

- [ ] **Feature Testing**

  - [ ] Test profile info updates and persistence
  - [ ] Test member approval workflow
  - [ ] Test role assignment and changes
  - [ ] Verify UI updates after changes

- [ ] **Security Implementation**
  - [ ] Update Firebase/Firestore security rules
  - [ ] Prevent unauthorized client-side changes
  - [ ] Admin-only field write permissions

### 11. Additional Admin Features

- [ ] **Moderation and Approval Tools**

  - [ ] Time-tracking approvals integration (if applicable)
  - [ ] Volunteer hour sign-off interface
  - [ ] Content posting moderation (future)
  - [ ] General approval queue management

- [ ] **Project/Initiative Management (Future Phase)**
  - [ ] Link to existing Projects page (`/account/:id/projects`)
  - [ ] Stub out "Projects" section in admin dashboard
  - [ ] Basic project CRUD interface (if data model supports)
  - [ ] Plan for Phase 2 project tracking expansion

---

## Phase 2: Edit Profile Cleanup

### 1. Account Edit Menu Simplification

- [ ] **Remove Group Features**

  - [ ] Eliminate FAQ management from edit menu for groups
  - [ ] Remove other group-specific entries (Members, Projects if present)
  - [ ] Hide/disable group fields (`groupType`, `googleCalendarUrl`) in user context

- [ ] **Conditional Rendering**
  - [ ] Update `app-edit-menu` component for conditional display
  - [ ] Separate user vs group edit interfaces
  - [ ] Consider hiding entire form for group accounts

### 2. Preserve Edit Profile Features for Individual Users

- [ ] **Basic Personal Info**

  - [ ] Ensure name, username, tagline, bio/description editing remains for users
  - [ ] Keep profile image (avatar) and cover photo upload functionality
  - [ ] Maintain personal "about me" section

- [ ] **Personal Contact Information**

  - [ ] Preserve user's own contact info management (email, phone, addresses, social links)
  - [ ] Keep privacy level settings for personal contact info
  - [ ] Ensure separation from group contact info

- [ ] **Professional Information**

  - [ ] Keep Professional segment for individual users only
  - [ ] Maintain occupation, employer, skills, education, resume fields
  - [ ] Ensure no professional info appears for group accounts

- [ ] **User-Specific Sections**

  - [ ] Preserve Volunteer Preferences & Causes section for users
  - [ ] Keep Mutual Aid & Community Engagement section for individual users
  - [ ] Maintain Labor Rights & Advocacy Info for personal profiles only
  - [ ] Ensure these sections don't appear for group accounts

- [ ] **Personal Social & Web Links**

  - [ ] Keep personal website/social media links for individual users
  - [ ] Distinguish from organizational links managed in admin dashboard

- [ ] **Personal Connections Management**

  - [ ] Preserve friend request acceptance/rejection for users
  - [ ] Keep personal connections list management
  - [ ] Ensure friend management remains separate from group member management

- [ ] **Account Settings**
  - [ ] Maintain personal account settings (notifications, theme, language, password/security)
  - [ ] Keep settings separate from group administrative settings

### 3. Group Admin Redirects

- [ ] **Redirect Implementation**
  - [ ] Redirect group admins from `/account/:id/edit` to `/account/:id/admin`
  - [ ] Add logic to AuthGuard or EditPage component
  - [ ] Display informational message about dashboard move
  - [ ] Ensure clean UX transition

### 4. UI Component Cleanup

- [ ] **Basic Info Form Updates**

  - [ ] Hide group-specific fields for user profiles
  - [ ] Update template conditions (`account.type === 'group'`)
  - [ ] Consider splitting into UserBasicInfoForm vs GroupBasicInfoForm

- [ ] **Form Visibility Logic**
  - [ ] Ensure Professional, Volunteer, Mutual Aid, Labor Rights forms only show for users
  - [ ] Verify existing `*ngIf` conditions work correctly
  - [ ] Double-check no group sections appear for users

### 5. Profile View Adjustments

- [x] **Remove Inline Editing** ✅

  - [x] Disable FAQ inline editing for group admins ✅
  - [x] Remove other inline admin actions from profile view ✅
  - [x] Add "Manage in Admin Dashboard" notices/buttons ✅
  - [x] Remove "Projects" and "Approve Time" buttons from profile header ✅

- [ ] **User Experience Preservation**
  - [ ] Ensure non-admin user experience unchanged
  - [ ] Maintain group profile viewing (About, Members, FAQ read-only)
  - [ ] Verify admin has separate edit access

### 6. Documentation Updates

- [ ] **Help Text Updates**
  - [ ] Update tooltips referencing old profile edit flow
  - [ ] Modify in-app documentation
  - [ ] Update user manual/FAQ references
  - [ ] Ensure consistent Admin Dashboard terminology

### 7. Personal Profile Testing

- [ ] **User Profile Functionality**

  - [ ] Test individual user profile editing (all sections)
  - [ ] Verify profile changes save and display correctly
  - [ ] Test group admin's personal profile editing

- [ ] **Workflow Testing**

  - [ ] Test old edit route redirection for groups
  - [ ] Verify admin dashboard is the correct way to edit groups
  - [ ] Check FAQ removal doesn't break other functionality

- [ ] **Related Account Logic**
  - [ ] Confirm friend request handling still works
  - [ ] Test connections page functionality
  - [ ] Verify user context buttons remain available

### 8. Code Cleanup

- [ ] **Component Management**

  - [ ] Remove/repurpose FAQ form component from account edit module
  - [ ] Avoid code duplication between modules
  - [ ] Maintain single source of truth for FAQ management

- [ ] **State Management**

  - [ ] Remove obsolete actions tied to old workflows
  - [ ] Update routing as needed
  - [ ] Clean up unused imports/references

- [ ] **Consistency Updates**
  - [ ] Ensure "Admin Dashboard" naming throughout UI
  - [ ] Update page titles, nav menu references
  - [ ] Differentiate from "Account Settings" or "Edit Profile"

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
