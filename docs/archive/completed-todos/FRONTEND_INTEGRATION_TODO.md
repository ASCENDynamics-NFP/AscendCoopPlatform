# Frontend Integration TODO - Callable Functions Migration

## 🎯 BACKEND MIGRATION STATUS: ✅ COMPLETE & DEPLOYED

**All 30+ callable functions are live and ready for frontend integration!**

# Frontend Integration TODO - Callable Functions Migration

## 🎯 BACKEND MIGRATION STATUS: ✅ COMPLETE & DEPLOYED

**All 30+ callable functions are live and ready for frontend integration!**

## 🎯 FRONTEND MIGRATION STATUS: 🔄 **IN PROGRESS**

### ✅ **COMPLETED INTEGRATIONS**

#### **Firebase Functions Service** ✅

- [x] **FirebaseFunctionsService**: Complete service with all callable functions
- [x] **Authentication handling**: Token refresh and error management
- [x] **Error handling patterns**: Comprehensive error catching and user-friendly messages
- [x] **Account functions**: createAccount, updateAccount, deleteMyAccount, searchAccounts, getAccount
- [x] **Listing functions**: createListing, updateListing, deleteListing, applyToListing, searchListings
- [x] **Relationship functions**: createRelationship, updateRelationship, deleteRelationship, getRelationships
- [x] **Notification functions**: getUserNotifications, markNotificationAsRead, sendAdminNotification

#### **Service Layer Wrapper** ✅

- [x] **AccountService**: Wrapper around FirebaseFunctionsService for account operations
- [x] **ListingService**: Wrapper around FirebaseFunctionsService for listing operations
- [x] **Observable patterns**: Proper RxJS integration with error handling

### � **IN PROGRESS: UI COMPONENT INTEGRATION**

Now that the service layer is complete, we need to update UI components to use the new callable functions instead of direct Firestore operations.

## � **IMMEDIATE ACTION REQUIRED: Registration Component Fix**

### **Critical Issue Identified** ⚠️

The `unified-registration.component.ts` is currently **only calling `updateAccount`** even for new users. This explains why new users can't complete registration successfully.

**Current Problem:**

```typescript
// Line ~202: Always assumes account exists
const updateRequest: UpdateAccountRequest = {
  accountId: this.account.id!, // ❌ NEW USERS DON'T HAVE account.id YET
  updates: {
    /* profile data */
  },
};

await firstValueFrom(this.firebaseFunctions.updateAccount(updateRequest));
```

**Required Fix:**

```typescript
// SOLUTION: Check if account exists, use createAccount vs updateAccount
if (this.account?.id) {
  // Existing account - use updateAccount
  const updateRequest: UpdateAccountRequest = {
    accountId: this.account.id,
    updates: {
      /* profile data */
    },
  };
  await firstValueFrom(this.firebaseFunctions.updateAccount(updateRequest));
} else {
  // New account - use createAccount
  const createRequest: CreateAccountRequest = {
    type: this.accountType,
    name: formValue.name,
    tagline: formValue.tagline,
    contactInformation: {
      /* contact data */
    },
  };
  await firstValueFrom(this.firebaseFunctions.createAccount(createRequest));
}
```

### **URGENT TODO: Fix Registration Flow** ✅ **COMPLETED**

- [x] **Update unified-registration.component.ts onSubmit method**
- [x] **Add logic to detect new vs existing accounts**
- [x] **Use createAccount for new users, updateAccount for existing**
- [ ] **Test complete registration flow end-to-end** 🔄
- [x] **Fix "Post As" dropdown to use callable functions instead of NgRx store** ✅

**✅ IMPLEMENTATION COMPLETED:**

- Added conditional logic to detect new vs existing accounts
- New users now call `createAccount` callable function
- Existing users continue to call `updateAccount`
- Enhanced error handling for both scenarios
- Added specific error messages for common issues (already exists, not found, etc.)
- **Fixed "Post As" dropdown**: Updated listing-form.component.ts to use AccountsService.searchAccounts instead of relying on NgRx store
- **Enhanced owner account detection**: Now searches for accounts where user has admin/moderator access

**🔄 NEXT: End-to-End Testing Required**

- [ ] Test new user registration → account creation → listing creation flow
- [ ] Verify "Post As" dropdown shows user's own account + manageable group accounts
- [ ] Test that listings are properly created with ownerAccountId

**🚀 RECOMMENDED ENHANCEMENT: Backend Function for Owner Accounts**
For optimal performance, we should create a dedicated backend function:

```typescript
// functions/src/callables/getUserManageableAccounts.ts
export const getUserManageableAccounts = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId)
    throw new HttpsError("unauthenticated", "User not authenticated");

  // Return user's own account + groups where user is admin/moderator
  // This would be more efficient than client-side filtering
});
```

---

## 🎯 **NEXT PRIORITY: PROJECT MANAGEMENT INTEGRATION** 🚨

**CRITICAL FINDING**: Project management is still using direct Firestore operations!

### **🔥 URGENT: Project Effects Need Integration**

**Current Problem:**

```typescript
// projects.effects.ts - Line ~62: Still using direct Firestore
this.firestore.addDocument(`accounts/${accountId}/projects`, project);
```

**Required Fix:**

```typescript
// BEFORE: Direct Firestore
this.firestore.addDocument(`accounts/${accountId}/projects`, project);

// AFTER: Callable Function
this.projectService.createProject({
  accountId,
  name: project.name,
  description: project.description,
  category: project.category,
});
```

### **PROJECT INTEGRATION TODO** ✅ **COMPLETED**

- [x] **Add Project Functions to FirebaseFunctionsService**: createProject, updateProject, deleteProject, etc. ✅
- [x] **Create ProjectService wrapper**: Updated to use callable functions instead of Firestore ✅
- [x] **Update projects.effects.ts**: Replace all Firestore operations with ProjectService calls ✅
- [ ] **Update project components**: Ensure they use the new service layer 🔄
- [ ] **Test project management flows**: Create, update, delete, assign operations ⬜

**✅ COMPLETED IMPLEMENTATIONS:**

- Added complete project function interfaces and methods to FirebaseFunctionsService
- Updated ProjectService to use callable functions with proper error handling
- **Updated projects.effects.ts to use ProjectService instead of direct Firestore operations**
- Maintained backward compatibility with legacy method signatures
- Added comprehensive JSDoc documentation for all methods
- **Fixed loadProjects$, createProject$, updateProject$, deleteProject$ effects**

**🔄 NEXT CRITICAL STEP: Update project components and test flows**

### **📋 PROJECT FUNCTIONS TO IMPLEMENT**

```typescript
// Add to FirebaseFunctionsService:
export interface CreateProjectRequest {
  accountId: string;
  name: string;
  description: string;
  category: string;
}

export interface UpdateProjectRequest {
  accountId: string;
  projectId: string;
  updates: Partial<CreateProjectRequest>;
}

// Add methods:
createProject(data: CreateProjectRequest): Observable<any>
updateProject(data: UpdateProjectRequest): Observable<any>
deleteProject(accountId: string, projectId: string): Observable<any>
assignToProject(data: AssignToProjectRequest): Observable<any>
getAccountProjects(accountId: string): Observable<any>
getUserAssignedProjects(): Observable<any>
searchProjects(params: SearchProjectsRequest): Observable<any>
```

## 📋 **COMPONENT INTEGRATION ROADMAP**

### 🔥 **PRIORITY 1: ACCOUNT MANAGEMENT COMPONENTS**

#### **Registration/Signup Components** 🔄

- [ ] **unified-registration.component.ts**: Update account creation flow to use `AccountService.createUserAccount()`
- [ ] **Remove direct Firestore writes**: Replace `firestore.collection("accounts").doc().set()` calls
- [ ] **Integrate validation**: Use backend validation instead of frontend-only validation
- [ ] **Error handling**: Implement proper error display for failed account creation

```typescript
// BEFORE (Direct Firestore):
this.firestore.collection("accounts").doc(userId).set({
  name: formData.name,
  type: formData.type,
  // ... other fields
});

// AFTER (Callable Function):
this.accountService
  .createUserAccount({
    name: formData.name,
    type: formData.type,
    contactInformation: {
      emails: [{email: formData.email}],
    },
  })
  .subscribe({
    next: (result) => console.log("Account created:", result),
    error: (error) => this.handleError(error),
  });
```

#### **Profile Management Components** 🔄

- [ ] **Profile Edit Forms**: Update to use `AccountService.updateUserAccount()`
- [ ] **Settings Components**: Replace direct Firestore updates with callable functions
- [ ] **Profile Image Upload**: Integrate with `updateAccount` function
- [ ] **Contact Information Updates**: Use structured data validation from backend

#### **Account Search/Directory Components** ⬜

- [ ] **Account Search Pages**: Implement `AccountService.searchNearbyAccounts()`
- [ ] **User Directory Components**: Replace Firestore queries with `searchAccounts`
- [ ] **Advanced Filters**: Implement location radius, skills, and type filtering
- [ ] **Pagination**: Use startAfter cursor for efficient large result sets

### 🔥 **PRIORITY 2: LISTING MANAGEMENT COMPONENTS**

#### **Listing Creation/Edit Components** 🔄

- [ ] **Create Listing Forms**: Update to use `ListingService.createListing()`
- [ ] **Edit Listing Forms**: Update to use `ListingService.updateListing()`
- [ ] **Remove manual geocoding**: Backend now handles address geocoding automatically
- [ ] **Owner Account Selection**: Integrate with "Post As" dropdown functionality

```typescript
// BEFORE (Manual creation + relationship setup):
const listingRef = await this.firestore.collection('listings').add(listingData);
await this.firestore.collection('accounts').doc(userId)
  .collection('relatedListings').doc(listingRef.id).set({...});

// AFTER (Single callable function):
this.listingService.createListing({
  title: formData.title,
  organization: formData.organization,
  type: formData.type,
  contactInformation: {
    addresses: formData.addresses // Backend handles geocoding
  }
}).subscribe({
  next: (result) => console.log('Listing created with relationships:', result),
  error: (error) => this.handleError(error)
});
```

#### **Listing Search/Browse Components** ⬜

- [ ] **Listing Search Pages**: Implement `ListingService.searchListings()`
- [ ] **Location-based search**: Integrate radius filtering with map components
- [ ] **Advanced filters**: Skills, remote work, listing type filtering
- [ ] **Application flow**: Use `ListingService.applyToListing()`

#### **Listing Management Dashboard** ⬜

- [ ] **My Listings Page**: Show listings owned by current account
- [ ] **Application Management**: View and manage applications to listings
- [ ] **Listing Analytics**: Basic stats on views, applications
- [ ] **Bulk operations**: Delete, update multiple listings

### 🔥 **PRIORITY 3: RELATIONSHIP SYSTEM COMPONENTS** ✅ **COMPLETED**

#### **Relationship Management Service** ✅ **COMPLETED**

```typescript
// ✅ NEW RelationshipService using callable functions
this.relationshipService
  .createRelationship({
    targetAccountId: "friend-user-id",
    relationship: "friend",
    customMessage: "Would love to collaborate!",
  })
  .subscribe({
    next: (result) => console.log("Friend request sent:", result),
    error: (error) => this.handleError(error),
  });

// ✅ Comprehensive relationship management
this.relationshipService.sendFriendRequest(accountId, "Hi there!");
this.relationshipService.acceptRelationship(accountId);
this.relationshipService.blockUser(accountId);
this.relationshipService.joinGroup(groupId);
this.relationshipService.getFriends();
this.relationshipService.getPendingFriendRequests();
```

**✅ COMPLETED IMPLEMENTATIONS:**

- [x] **Created Core RelationshipService**: Complete wrapper around FirebaseFunctionsService
- [x] **Friend Request Management**: sendFriendRequest, acceptRelationship, declineRelationship
- [x] **Blocking/Unblocking**: blockUser, unblockUser with proper callable function integration
- [x] **Group Management**: joinGroup, leaveGroup, getGroupMemberships
- [x] **Contact Lists**: getFriends, getPendingFriendRequests, getBlockedUsers
- [x] **Messaging Permissions**: canMessage method for chat integration
- [x] **Comprehensive Error Handling**: Consistent patterns with other services

**🔄 NEXT STEP: Update existing components to use new RelationshipService**

**Component Integration Needed:**

- [ ] **Update messaging/relationship.service.ts**: Replace with core RelationshipService usage
- [ ] **Friend Request Components**: Update to use new service methods
- [ ] **Group Invitation System**: Update to use createRelationship for group membership
- [ ] **Contact Lists**: Update to use getRelationships with filtering
- [ ] **Chat Permission Checks**: Update to use canMessage method

### 🔥 **PRIORITY 4: PROJECT & TIME TRACKING** ✅ **COMPLETED**

**Note**: These functions are available in backend and NOW INTEGRATED in frontend.

#### **Frontend Services** - ✅ **COMPLETED**

```typescript
// ✅ ADDED to FirebaseFunctionsService
export interface CreateTimeEntryRequest {
  accountId: string;
  listingId?: string;
  projectId?: string;
  date: string; // ISO date string
  hours: number;
  description?: string;
  category?: string;
  isVolunteer?: boolean;
}

export interface CreateProjectRequest {
  accountId: string;
  name: string;
  description: string;
  category: string;
}
```

**✅ COMPLETED INTEGRATION TASKS:**

- [x] **Add project functions to FirebaseFunctionsService**: createProject, updateProject, deleteProject, etc. ✅
- [x] **Add time tracking functions**: createTimeEntry, updateTimeEntry, getTimeTrackingStats ✅
- [x] **Create ProjectService wrapper**: Similar to AccountService and ListingService ✅
- [x] **Create TimeTrackingService wrapper**: Handle time entry operations ✅
- [x] **Update project management effects**: Replace direct Firestore with services ✅
- [x] **Update time tracking effects**: Replace manual time tracking with callable functions ✅

**✅ COMPLETED IMPLEMENTATIONS:**

- Added complete time tracking function interfaces and methods to FirebaseFunctionsService
- **Completely rewritten TimeTrackingService to use callable functions instead of direct Firestore**
- **Updated time-tracking.effects.ts to use TimeTrackingService instead of AngularFirestore**
- Added comprehensive error handling and Observable patterns
- Maintained backward compatibility with legacy method signatures
- **Fixed all effects: loadProjects$, saveEntry$, deleteEntry$, loadEntries$, loadAllTimeEntries$, updateTimeEntry$, submitTimesheetForApproval$**

**🔄 NEXT CRITICAL STEP: Test time tracking flows and update any remaining components**

## � **IMMEDIATE NEXT STEPS**

### **Week 1: Account Registration Integration**

1. **Priority Target**: Fix unified-registration.component.ts to use callable functions
2. **Update registration flow**: Replace direct Firestore writes with AccountService.createUserAccount()
3. **Test account creation**: Ensure validation and error handling work properly
4. **Fix "Post As" dropdown**: Investigate missing account data in dropdown

### **Week 2: Profile & Settings Integration**

1. **Profile editing**: Update all profile edit forms to use updateAccount callable
2. **Settings management**: Replace direct Firestore updates with callable functions
3. **Account deletion**: Ensure deleteMyAccount callable is working properly
4. **Testing**: Comprehensive testing of account management flows

### **Week 3: Listing Management Integration**

1. **Listing creation**: Update create listing forms to use callable functions
2. **Listing editing**: Replace direct updates with updateListing callable
3. **Listing search**: Implement advanced search with location and skill filtering
4. **Testing**: Test listing creation, editing, and search functionality

### **Week 4: Relationship System Integration**

1. **Friend requests**: Implement relationship creation with callable functions
2. **Group management**: Update group invitation and membership systems
3. **Connection management**: Handle relationship status changes
4. **Testing**: Test all relationship management flows

## 🔧 **TECHNICAL IMPLEMENTATION GUIDE**

### **Pattern for Component Updates**

```typescript
// 1. Inject the appropriate service
constructor(
  private accountService: AccountService,
  private listingService: ListingService,
  // ... other services
) {}

// 2. Replace direct Firestore calls with service calls
// BEFORE:
this.firestore.collection("accounts").doc(id).update(data);

// AFTER:
this.accountService.updateUserAccount(id, data).subscribe({
  next: (result) => {
    // Handle success
    this.showSuccessMessage('Account updated successfully');
  },
  error: (error) => {
    // Handle error with user-friendly message
    this.showErrorMessage(error.message || 'Update failed');
  }
});

// 3. Update error handling
private showErrorMessage(message: string) {
  // Show user-friendly error message
  this.toastService.error(message);
}

private showSuccessMessage(message: string) {
  // Show success confirmation
  this.toastService.success(message);
}
```

### **Error Handling Standards**

```typescript
// Standard error handling pattern for all components
.subscribe({
  next: (result) => {
    // Success handling
    this.handleSuccess(result);
  },
  error: (error) => {
    console.error('Operation failed:', error);

    // User-friendly error messages
    let errorMessage = 'Operation failed. Please try again.';

    if (error.message) {
      errorMessage = error.message;
    }

    this.showErrorMessage(errorMessage);
  }
});
```

## 📊 **CURRENT INTEGRATION STATUS**

✅ **Backend Services**: 30+ callable functions deployed and tested  
✅ **Frontend Service Layer**: FirebaseFunctionsService with all function calls  
✅ **Service Wrappers**: AccountService and ListingService implemented  
🔄 **Component Integration**: In progress - starting with registration components  
⬜ **Project/Time Tracking**: ✅ **COMPLETED** - All services integrated with callable functions  
⬜ **Testing**: Comprehensive integration testing needed  
⬜ **Documentation**: Component integration documentation

---

## 🎯 **SUCCESS METRICS**

- [ ] **Performance**: All callable functions respond < 2 seconds
- [ ] **Reliability**: 99.9% success rate for function calls
- [ ] **User Experience**: Seamless transitions from old to new flows
- [ ] **Error Rates**: < 1% function call failures
- [ ] **Data Integrity**: Zero data loss during migration
- [ ] **Feature Parity**: All existing functionality maintained with new callable functions
