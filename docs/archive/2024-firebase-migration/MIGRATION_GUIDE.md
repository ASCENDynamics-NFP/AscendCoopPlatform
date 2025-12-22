# Firebase Functions Migration Guide: From Triggers to Callable Functions

## Overview

This guide shows how to migrate from trigger-heavy architecture to a more scalable callable function architecture for your nonprofit social networking platform.

## Why Migrate?

### Current Issues with Triggers

1. **Complex trigger chains** - Multiple triggers creating cascading updates
2. **Race conditions** - Triggers operating on same data simultaneously
3. **Performance bottlenecks** - Every database write triggers functions
4. **Debugging difficulties** - Hard to trace business logic flow
5. **Cost implications** - Triggers run on every write, even minor ones
6. **Infinite loops** - Triggers can accidentally trigger themselves

### Benefits of Callable Functions

1. **Explicit control** - Functions only run when explicitly called
2. **Better error handling** - Client can handle errors gracefully
3. **Input validation** - Validate data before processing
4. **Authorization** - Check permissions before operations
5. **Atomic operations** - Complete business logic in single transaction
6. **Easier testing** - Direct function calls vs complex trigger setups

## Migration Strategy

### Phase 1: Create Service Layer (Week 1-2)

1. **AccountService** - Centralized account operations
2. **ListingService** - Centralized listing operations
3. **RelationshipService** - Centralized relationship management
4. **NotificationService** - Centralized notifications

### Phase 2: Create API Layer (Week 2-3)

1. **Account API** - `createAccount`, `updateAccount`, `deleteAccount`
2. **Listing API** - `createListing`, `applyToListing`, `manageApplication`
3. **Relationship API** - `createRelationship`, `updateRelationship`

### Phase 3: Client Migration (Week 3-4)

1. Update client code to use callable functions
2. Add proper error handling
3. Add loading states and user feedback

### Phase 4: Trigger Cleanup (Week 4-5)

1. Remove problematic triggers gradually
2. Keep essential triggers for audit/sync
3. Monitor for any missed functionality

## Before & After Comparison

### Before: Trigger-Based Account Creation

```javascript
// Client creates account document directly
await db.collection("accounts").doc(userId).set(accountData);

// Multiple triggers fire automatically:
// 1. onCreateAccount -> creates roles/projects
// 2. Contact info trigger -> geocodes addresses
// 3. Related account trigger -> sets up relationships
// 4. Admin notification trigger -> sends notifications
```

### After: Callable Function Account Creation

```javascript
// Client calls centralized function
const result = await functions.createAccount({
  name: "John Doe",
  type: "nonprofit",
  contactInformation: {
    /* ... */
  },
});

// Single function handles all logic atomically:
// 1. Validates input
// 2. Geocodes addresses
// 3. Creates account with roles/projects
// 4. Sets up relationships
// 5. Sends notifications
// 6. Returns success/error
```

## Key Implementation Patterns

### 1. Service Layer Pattern

```typescript
export class AccountService {
  static async createAccount(userId: string, data: CreateAccountRequest) {
    // All business logic centralized here
    const batch = db.batch();

    // Validate input
    this.validateAccountData(data);

    // Geocode addresses
    const addresses = await this.geocodeAddresses(data.addresses);

    // Create account document
    batch.set(accountRef, accountData);

    // Set up related data
    await this.initializeAccountDefaults(batch, userId, data.type);

    // Execute atomically
    await batch.commit();

    return {accountId, account};
  }
}
```

### 2. API Layer Pattern

```typescript
export const createAccount = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    // Authentication check
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    // Input validation
    const data = request.data as CreateAccountRequest;
    if (!data.name || !data.type) {
      throw new HttpsError("invalid-argument", "Name and type required");
    }

    // Business logic
    const result = await AccountService.createAccount(request.auth.uid, data);

    return {success: true, ...result};
  },
);
```

### 3. Client Usage Pattern

```typescript
// In your Angular/Ionic client
async createAccount(accountData: CreateAccountRequest) {
  try {
    this.loading = true;

    const callable = httpsCallable(this.functions, 'createAccount');
    const result = await callable(accountData);

    this.toast.success('Account created successfully!');
    return result.data;
  } catch (error) {
    this.handleError(error);
    throw error;
  } finally {
    this.loading = false;
  }
}
```

## Migration Checklist

### Service Layer ✅

- [x] AccountService with create/update/delete
- [x] ListingService with CRUD operations
- [x] RelationshipService for connections
- [ ] NotificationService for alerts
- [ ] TimeTrackingService for hours
- [ ] ProjectService for project management

### API Layer ✅

- [x] Account management functions
- [x] Listing management functions
- [x] Relationship management functions
- [ ] Notification functions
- [ ] Time tracking functions
- [ ] Project management functions

### Client Updates

- [ ] Replace direct Firestore writes with callable functions
- [ ] Add proper error handling
- [ ] Add loading states
- [ ] Update form validation
- [ ] Test all user flows

### Trigger Cleanup

- [ ] Remove account creation triggers
- [ ] Remove listing management triggers
- [ ] Remove relationship triggers
- [ ] Keep audit/sync triggers
- [ ] Update security rules

## Testing Strategy

### Unit Testing

```typescript
describe("AccountService", () => {
  it("should create account with valid data", async () => {
    const result = await AccountService.createAccount("user123", validData);
    expect(result.accountId).toBe("user123");
    expect(result.account.name).toBe(validData.name);
  });

  it("should throw error for invalid data", async () => {
    await expect(
      AccountService.createAccount("user123", invalidData),
    ).rejects.toThrow("Name and type are required");
  });
});
```

### Integration Testing

```typescript
describe("Account API", () => {
  it("should create account via callable function", async () => {
    const callable = testEnv.wrap(createAccount);
    const result = await callable(validData, {auth: {uid: "user123"}});

    expect(result.success).toBe(true);
    expect(result.accountId).toBe("user123");
  });
});
```

## Performance Considerations

### Before Migration

- 20+ triggers firing on account creation
- Potential race conditions and conflicts
- High function execution costs
- Difficult to debug performance issues

### After Migration

- Single function call with atomic operations
- Predictable performance characteristics
- Better error handling and rollback
- Easier to optimize and monitor

## Security Benefits

### Input Validation

```typescript
// Validate all inputs before processing
if (!data.name || data.name.length < 2) {
  throw new HttpsError(
    "invalid-argument",
    "Name must be at least 2 characters",
  );
}

if (!["user", "nonprofit", "business"].includes(data.type)) {
  throw new HttpsError("invalid-argument", "Invalid account type");
}
```

### Authorization Checks

```typescript
// Check permissions before operations
const hasPermission = await this.checkAccountAccess(userId, accountId);
if (!hasPermission) {
  throw new HttpsError("permission-denied", "Insufficient permissions");
}
```

### Rate Limiting

```typescript
// Built-in rate limiting for callable functions
export const createAccount = onCall(
  {
    // Automatic rate limiting based on user
    enforceAppCheck: true,
    // Resource limits prevent abuse
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  handler,
);
```

## Monitoring & Observability

### Logging

```typescript
logger.info("Account created successfully", {
  userId,
  accountType: data.type,
  timestamp: new Date().toISOString(),
});
```

### Metrics

- Function execution time
- Success/failure rates
- User adoption of new APIs
- Cost comparison vs triggers

### Alerting

- Failed function executions
- High error rates
- Performance degradation
- Security issues

## Rollback Plan

If issues arise during migration:

1. **Immediate**: Re-enable disabled triggers
2. **Short-term**: Fix issues in callable functions
3. **Long-term**: Gradual re-migration with fixes

## Next Steps

1. Review the created service and API files
2. Fix any TypeScript compilation issues
3. Add missing methods (search, stats, etc.)
4. Create unit tests for services
5. Update client code to use new APIs
6. Deploy and test in development environment
7. Gradually migrate production traffic
8. Monitor performance and errors
9. Clean up old triggers

This migration will make your Firebase Functions much more maintainable, performant, and easier to debug!

### Security Rules (Relationships)

Lock client writes to derived relationship collections and require callable functions for all mutations. Sample rules:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Accounts related accounts
    match /accounts/{accountId}/relatedAccounts/{relatedAccountId} {
      allow read: if request.auth != null; // app/UI enforces privacy filtering
      allow create, update, delete: if false; // writes via callables only
    }

    // Accounts related listings
    match /accounts/{accountId}/relatedListings/{listingId} {
      allow read: if request.auth != null;
      allow create, update, delete: if false;
    }

    // Listings related accounts (applications)
    match /listings/{listingId}/relatedAccounts/{relatedAccountId} {
      allow read: if request.auth != null;
      allow create, update, delete: if false;
    }
  }
}
```

Notes:

- Group admin checks and UI gating still apply for list rendering.
- Admin SDK in Cloud Functions bypasses rules, so callable functions can safely perform writes.

### Relationships Access Model

- Accounts side stores `status` and `access` (no `relationship` on `accounts/*/relatedAccounts/*`).
  - `status`: `pending | accepted | declined | blocked` (we use `pending/accepted` today).
  - `access`: `admin | moderator | member` (for group memberships).
- Listings side continues to use `relationship` (e.g., `owner | applicant`).

Client inputs to callables:

- `createRelationship`: accept either `{relationship}` (back-compat) or `{access}` for group memberships; service maps to the `access` field on account docs.
- `updateRelationship`: accept `{status, access?}` for account memberships.
