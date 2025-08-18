# Role Management Technical Implementation Guide

## Overview

This document provides detailed technical implementation guidance for the Roles and Hierarchy System in the ASCENDynamics NFP platform. It complements the main [ROLES_HIERARCHY_SYSTEM.md](./ROLES_HIERARCHY_SYSTEM.md) documentation with specific implementation details, code examples, and integration patterns.

## Table of Contents

1. [Data Models](#data-models)
2. [Component Architecture](#component-architecture)
3. [State Management](#state-management)
4. [Validation Logic](#validation-logic)
5. [UI Implementation](#ui-implementation)
6. [Testing Strategies](#testing-strategies)

## Data Models

### StandardRoleTemplate Model

**Location**: `/shared/models/standard-role-template.model.ts`

```typescript
export type StandardRoleCategory =
  | "Organization"
  | "Collaboration"
  | "Family"
  | "Friends"
  | "Volunteer"
  | "Professional"
  | "Community"
  | "Administrative"
  | "Partnership"
  | "Corporate";

export interface StandardRoleTemplate {
  id: string;
  category: StandardRoleCategory;
  name: string;
  description: string;
  defaultPermissions?: string[];
  applicableGroupTypes?: string[];
  icon?: string;
  isSystemRole: boolean;
  suggestedChildRoles?: string[];
}

export interface StandardRoleHierarchy {
  category: StandardRoleCategory;
  parentRoles: StandardRoleTemplate[];
  childRoleTemplates: StandardRoleTemplate[];
  description: string;
}
```

**Key Features**:

- **Category Enum**: Strongly typed categories prevent invalid assignments
- **System Role Protection**: `isSystemRole` prevents deletion of core roles
- **Suggested Hierarchies**: Pre-defined child role recommendations
- **Group Type Filtering**: Roles can be restricted to specific group types

#### Volunteer Templates

The volunteer category now uses a two-tier structure to support team-based coordination.

- **Volunteer Coordinator**: Oversees volunteer programs and manages team leaders
- **Team Leader**: Leads groups of volunteers for specific initiatives
- **Event Volunteer**: Supports on-site events
- **Program Volunteer**: Assists ongoing programs
- **Remote Volunteer**: Contributes to projects from remote locations
- **Youth Volunteer**: Participates in youth-focused activities
- **Volunteer**: General volunteer role

Hierarchy:

```
Volunteer Coordinator
└── Team Leader
    ├── Event Volunteer
    ├── Program Volunteer
    ├── Remote Volunteer
    ├── Youth Volunteer
    └── Volunteer
```

### GroupRole Model

**Location**: `/shared/models/group-role.model.ts`

```typescript
export type RoleType = "user" | "organization";

export interface GroupRole {
  id: string;
  name: string;
  description?: string;
  parentRoleId?: string;
  permissions?: string[];
  roleType?: RoleType;

  // Standardization fields
  standardRoleTemplateId?: string;
  standardCategory?: StandardRoleCategory;
  isStandardRole?: boolean;
  isCustomRole?: boolean;
  icon?: string;
  color?: string;
  sortOrder?: number;
}
```

**Key Features**:

- **Dual Role Types**: Support for both user and organizational roles
- **Template Linking**: Connection to standard role templates
- **Hierarchy Support**: Parent-child relationships within categories
- **Visual Customization**: Icons and colors for UI representation

### RelatedAccount Model

**Location**: `/shared/models/account.model.ts`

```typescript
export interface RelatedAccount extends BaseDocument {
  id: string;
  accountId: string;
  name?: string;
  type?: "user" | "group";
  status?: "pending" | "accepted" | "rejected" | "blocked";

  // Role assignment fields
  access?: "admin" | "moderator" | "member"; // Legacy access levels
  role?: string; // Legacy custom role name
  roleId?: string; // Legacy single role ID
  roleIds?: string[]; // Current multiple role IDs

  // Relationship metadata
  relationship?: "friend" | "member" | "partner" | "family";
  initiatorId?: string;
  targetId?: string;
  canAccessContactInfo?: boolean;
}
```

**Key Features**:

- **Multi-Role Support**: `roleIds` array enables multiple role assignments
- **Backward Compatibility**: Maintains `roleId` for legacy support
- **Relationship Context**: Different relationship types beyond roles
- **Permission Granularity**: Fine-grained access control options

## Component Architecture

### Role Management Page

**Location**: `/src/app/modules/account/pages/role-management/`

#### Component Structure

```typescript
export class RoleManagementPage implements OnInit {
  // Observable streams
  roles$!: Observable<GroupRole[]>;
  editableRoles$!: Observable<GroupRole[]>;
  categorizedRoles$!: Observable<CategorizedRoles[]>;
  loading$!: Observable<boolean>;

  // Helper methods
  groupRolesByCategory(roles: GroupRole[]): CategorizedRoles[];
  getAvailableParentRoles(role: GroupRole, allRoles: GroupRole[]): GroupRole[];
  isDescendant(
    childId: string,
    ancestorId: string,
    roles: GroupRole[],
  ): boolean;
}
```

#### Key Implementation Details

1. **Category Grouping Logic**:

```typescript
private groupRolesByCategory(roles: GroupRole[]): CategorizedRoles[] {
  const categoryIcons = {
    'User': 'person', 'Organization': 'business',
    'Volunteer': 'hand-right', 'Family': 'home',
    // ... full mapping
  };

  const grouped = roles.reduce((acc, role) => {
    const category = role.standardCategory || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(role);
    return acc;
  }, {} as { [key: string]: GroupRole[] });

  return Object.keys(grouped).sort().map(category => ({
    category: category as StandardRoleCategory | 'Uncategorized',
    roles: grouped[category].sort((a, b) => a.name.localeCompare(b.name)),
    icon: categoryIcons[category] || 'help',
    color: categoryColors[category] || 'medium'
  }));
}
```

2. **Parent Role Validation**:

```typescript
getAvailableParentRoles(role: GroupRole, allRoles: GroupRole[]): GroupRole[] {
  return allRoles.filter(potentialParent => {
    // Same category requirement
    if (potentialParent.standardCategory !== role.standardCategory) return false;

    // Prevent self-selection
    if (potentialParent.id === role.id) return false;

    // Prevent circular references
    if (this.isDescendant(potentialParent.id, role.id, allRoles)) return false;

    return true;
  });
}
```

### Standard Role Selector Component

**Location**: `/src/app/modules/account/components/standard-role-selector/`

#### Component Features

- **Template-Based Creation**: Select from pre-defined role templates
- **Custom Role Creation**: Create roles within standard categories
- **Category Filtering**: Filter templates by category
- **Visual Indicators**: Icons and descriptions for each template

#### Key Implementation

```typescript
export class StandardRoleSelectorComponent {
  @Input() existingRoles: GroupRole[] = [];
  @Input() accountInfo?: Account;
  @Output() roleSelected = new EventEmitter<StandardRoleTemplate>();
  @Output() customRoleRequested = new EventEmitter<CustomRoleRequest>();

  filteredTemplates$ = this.filterControl.valueChanges.pipe(
    startWith(""),
    map((value) => this.filterTemplates(value)),
  );

  getTemplatesByCategory(): {[key: string]: StandardRoleTemplate[]} {
    return STANDARD_ROLE_TEMPLATES.reduce(
      (acc, template) => {
        if (!acc[template.category]) acc[template.category] = [];
        acc[template.category].push(template);
        return acc;
      },
      {} as {[key: string]: StandardRoleTemplate[]},
    );
  }
}
```

### Related Account List Component

**Location**: `/src/app/modules/account/relatedAccount/pages/list/`

#### Multi-Role Selection Logic

```typescript
updateRoles(account: RelatedAccount, selectedRoleIds: string[]): void {
  // Validate category restrictions
  const roles = this.getCurrentRoles();
  const selectedRoles = roles.filter(r => selectedRoleIds.includes(r.id));
  const categories = new Set(selectedRoles.map(r => r.standardCategory).filter(Boolean));

  if (categories.size > selectedRoles.length) {
    // Multiple roles from same category - show error
    this.showCategoryError();
    return;
  }

  // Update account with new role assignments
  const updates: Partial<RelatedAccount> = {
    roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
    roleId: selectedRoleIds.length > 0 ? selectedRoleIds[0] : undefined
  };

  this.updateRelatedAccount(account.id, updates);
}
```

## State Management

### NgRx Implementation

#### Actions

**Location**: `/src/app/state/actions/account.actions.ts`

```typescript
export const createGroupRole = createAction(
  "[Account] Create Group Role",
  props<{groupId: string; role: Partial<GroupRole>}>(),
);

export const updateGroupRole = createAction(
  "[Account] Update Group Role",
  props<{groupId: string; role: GroupRole}>(),
);

export const deleteGroupRole = createAction(
  "[Account] Delete Group Role",
  props<{groupId: string; roleId: string}>(),
);
```

#### Selectors

**Location**: `/src/app/state/selectors/account.selectors.ts`

```typescript
export const selectGroupRolesByGroupId = (groupId: string) =>
  createSelector(
    selectAccountState,
    (state) => state.accounts[groupId]?.roles || [],
  );

export const selectRolesByCategory = (groupId: string) =>
  createSelector(selectGroupRolesByGroupId(groupId), (roles) =>
    groupRolesByCategory(roles),
  );
```

#### Effects

**Location**: `/src/app/state/effects/account.effects.ts`

```typescript
createGroupRole$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AccountActions.createGroupRole),
    switchMap(({groupId, role}) =>
      this.accountService.createGroupRole(groupId, role).pipe(
        map(() => AccountActions.createGroupRoleSuccess({groupId, role})),
        catchError((error) =>
          of(AccountActions.createGroupRoleFailure({error})),
        ),
      ),
    ),
  ),
);
```

## Validation Logic

### Category Consistency Validation

```typescript
validateRoleAssignment(
  accountType: 'user' | 'group',
  selectedRoleIds: string[],
  availableRoles: GroupRole[]
): ValidationResult {
  const selectedRoles = availableRoles.filter(r => selectedRoleIds.includes(r.id));

  // Account type validation
  const invalidTypeRoles = selectedRoles.filter(role => {
    if (accountType === 'user' && role.roleType === 'organization') return true;
    if (accountType === 'group' && role.roleType === 'user') return true;
    return false;
  });

  if (invalidTypeRoles.length > 0) {
    return {
      valid: false,
      error: `Cannot assign ${invalidTypeRoles[0].roleType} roles to ${accountType} accounts`
    };
  }

  // Category duplication validation
  const categories = selectedRoles
    .map(r => r.standardCategory)
    .filter(Boolean);
  const uniqueCategories = new Set(categories);

  if (categories.length !== uniqueCategories.size) {
    return {
      valid: false,
      error: 'Cannot assign multiple roles from the same category'
    };
  }

  return { valid: true };
}
```

### Hierarchy Validation

```typescript
validateHierarchy(
  parentRoleId: string | undefined,
  childRoleId: string,
  allRoles: GroupRole[]
): boolean {
  if (!parentRoleId) return true;

  const parentRole = allRoles.find(r => r.id === parentRoleId);
  const childRole = allRoles.find(r => r.id === childRoleId);

  if (!parentRole || !childRole) return false;

  // Same category requirement
  if (parentRole.standardCategory !== childRole.standardCategory) {
    return false;
  }

  // Prevent circular references
  return !this.wouldCreateCircularReference(parentRoleId, childRoleId, allRoles);
}

private wouldCreateCircularReference(
  parentId: string,
  childId: string,
  roles: GroupRole[]
): boolean {
  const visited = new Set<string>();
  let currentId = parentId;

  while (currentId && !visited.has(currentId)) {
    if (currentId === childId) return true;
    visited.add(currentId);

    const current = roles.find(r => r.id === currentId);
    currentId = current?.parentRoleId;
  }

  return false;
}
```

## UI Implementation

### Categorized Role Display

**Template Structure** (`role-management.page.html`):

```html
<div *ngFor="let categoryGroup of categorizedRoles$ | async">
  <!-- Category Header -->
  <div class="category-header">
    <h3>
      <ion-icon
        [name]="categoryGroup.icon"
        [color]="categoryGroup.color"
      ></ion-icon>
      {{ categoryGroup.category }} ({{ categoryGroup.roles.length }})
    </h3>
  </div>

  <!-- Column Headers -->
  <ion-grid class="category-roles">
    <ion-row class="header-row">
      <ion-col size="3">Current Info</ion-col>
      <ion-col size="2">Name</ion-col>
      <ion-col size="2">Description</ion-col>
      <ion-col size="1.5">Type</ion-col>
      <ion-col size="1.5">Parent Role</ion-col>
      <ion-col size="2">Actions</ion-col>
    </ion-row>

    <!-- Roles in Category -->
    <ion-row *ngFor="let role of categoryGroup.roles" class="role-row">
      <ion-col size="3">
        <div class="role-display">
          <ion-icon [name]="role.icon || getRoleIcon(role)"></ion-icon>
          <div>
            <h4>{{ role.name }}</h4>
            <span *ngIf="role.isStandardRole" class="role-badge standard">
              <ion-icon name="library"></ion-icon> Standard
            </span>
            <span *ngIf="role.isCustomRole" class="role-badge custom">
              <ion-icon name="create"></ion-icon> Custom
            </span>
          </div>
        </div>
      </ion-col>

      <!-- Editable Fields -->
      <ion-col size="2">
        <ion-input [(ngModel)]="role.name" (ionBlur)="updateRole(role)">
        </ion-input>
      </ion-col>

      <!-- Parent Role Selection with Category Filtering -->
      <ion-col size="1.5">
        <ion-select
          [(ngModel)]="role.parentRoleId"
          (ionChange)="updateRole(role)"
        >
          <ion-select-option [value]="undefined">None</ion-select-option>
          <ion-select-option
            *ngFor="let parent of getAvailableParentRoles(role, (roles$ | async) || [])"
            [value]="parent.id"
          >
            {{ parent.name }}
          </ion-select-option>
        </ion-select>
      </ion-col>
    </ion-row>
  </ion-grid>
</div>
```

### Role Selector with Multi-Selection

```html
<ion-select
  multiple="true"
  [value]="getCurrentRoleIds(relatedAccount)"
  (ionChange)="updateRoles(relatedAccount, $event.detail.value)"
>
  <ion-select-option
    *ngFor="let role of getRolesForAccount(relatedAccount)"
    [value]="role.id"
  >
    <div class="role-option">
      <ion-icon [name]="role.icon"></ion-icon>
      <span>{{ role.name }}</span>
      <ion-badge [color]="getCategoryColor(role.standardCategory)">
        {{ role.standardCategory }}
      </ion-badge>
    </div>
  </ion-select-option>
</ion-select>
```

### Styling Guidelines

**CSS Classes** (`role-management.page.scss`):

```scss
.category-header {
  margin: 16px 0 8px 0;
  padding: 8px;
  background-color: var(--ion-color-light);
  border-radius: 8px;

  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--ion-color-dark);
  }
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;

  &.standard {
    background-color: var(--ion-color-success);
    color: var(--ion-color-success-contrast);
  }

  &.custom {
    background-color: var(--ion-color-warning);
    color: var(--ion-color-warning-contrast);
  }
}

.category-roles {
  margin-left: 16px;

  .header-row {
    font-weight: bold;
    border-bottom: 1px solid var(--ion-color-medium);
    padding-bottom: 8px;
    margin-bottom: 8px;
  }

  .role-row {
    border-bottom: 1px solid var(--ion-color-light);
    padding: 8px 0;

    &:hover {
      background-color: var(--ion-color-light);
    }
  }
}
```

## Testing Strategies

### Unit Tests

#### Role Validation Tests

```typescript
describe("Role Validation", () => {
  it("should prevent multiple roles from same category", () => {
    const roles = [
      {id: "1", standardCategory: "Organization", name: "Admin"},
      {id: "2", standardCategory: "Organization", name: "Member"},
    ];

    const result = validateRoleAssignment("user", ["1", "2"], roles);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("same category");
  });

  it("should allow roles from different categories", () => {
    const roles = [
      {id: "1", standardCategory: "Organization", name: "Admin"},
      {id: "2", standardCategory: "Volunteer", name: "Coordinator"},
    ];

    const result = validateRoleAssignment("user", ["1", "2"], roles);
    expect(result.valid).toBe(true);
  });
});
```

#### Hierarchy Tests

```typescript
describe("Role Hierarchy", () => {
  it("should prevent circular references", () => {
    const roles = [
      {id: "1", name: "Parent", parentRoleId: undefined},
      {id: "2", name: "Child", parentRoleId: "1"},
    ];

    // Try to make parent a child of child (circular)
    const isValid = validateHierarchy("2", "1", roles);
    expect(isValid).toBe(false);
  });

  it("should require same category for parent-child", () => {
    const roles = [
      {id: "1", standardCategory: "Organization", name: "Admin"},
      {id: "2", standardCategory: "Volunteer", name: "Coordinator"},
    ];

    const isValid = validateHierarchy("1", "2", roles);
    expect(isValid).toBe(false);
  });
});
```

### Integration Tests

#### Role Assignment Workflow

```typescript
describe("Role Assignment Integration", () => {
  it("should complete full role assignment workflow", async () => {
    // 1. Create standard role from template
    const template = STANDARD_ROLE_TEMPLATES.find((t) => t.id === "std_admin");
    await createRoleFromTemplate(groupId, template);

    // 2. Assign role to user
    await assignRoleToUser(userId, roleId);

    // 3. Verify assignment
    const userRoles = await getUserRoles(userId);
    expect(userRoles).toContain(roleId);

    // 4. Verify permissions
    const permissions = await getUserPermissions(userId);
    expect(permissions).toContain("manage_members");
  });
});
```

### E2E Tests

#### Role Management UI Tests

```typescript
describe("Role Management Page", () => {
  it("should display roles grouped by category", async () => {
    await page.goto("/account/roles");

    // Check category headers
    const categories = await page
      .locator(".category-header h3")
      .allTextContents();
    expect(categories).toContain("Organization (3)");
    expect(categories).toContain("Volunteer (2)");

    // Verify role display within categories
    const orgRoles = await page
      .locator('[data-category="Organization"] .role-row')
      .count();
    expect(orgRoles).toBe(3);
  });

  it("should enforce parent role category restrictions", async () => {
    // Select a volunteer role
    await page.selectOption(
      '[data-role-id="vol_coordinator"] select[name="parentRoleId"]',
      "",
    );

    // Verify only volunteer category parents are available
    const options = await page
      .locator('[data-role-id="vol_coordinator"] select option')
      .allTextContents();
    expect(options).not.toContain("Administrator"); // Organization role
    expect(options).toContain("Senior Volunteer Coordinator"); // Volunteer role
  });
});
```

## Performance Considerations

### Optimization Strategies

1. **Role Caching**: Cache frequently accessed role data
2. **Lazy Loading**: Load role details on demand
3. **Batch Operations**: Group multiple role updates
4. **Indexed Queries**: Optimize database queries with proper indexing

### Memory Management

```typescript
// Use trackBy functions for large role lists
trackByRoleId(index: number, role: GroupRole): string {
  return role.id;
}

// Implement OnDestroy for subscription cleanup
ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## Conclusion

This technical implementation guide provides the detailed patterns and practices for implementing the role management system. The architecture supports scalability while maintaining flexibility for diverse organizational needs.

For additional implementation support, refer to the existing codebase examples or consult with the development team.

---

**Last Updated**: August 8, 2025  
**Version**: 1.0  
**Related Documents**: [ROLES_HIERARCHY_SYSTEM.md](./ROLES_HIERARCHY_SYSTEM.md)
