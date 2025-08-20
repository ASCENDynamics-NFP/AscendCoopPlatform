# Role Management Quick Reference

## Quick Start Guide

### Adding a New Role Category

1. **Update the enum** in `standard-role-template.model.ts`:

```typescript
export type StandardRoleCategory =
  | "Organization"
  | "Volunteer"
  | "Professional"
  | "YourNewCategory"; // Add here
```

2. **Add role templates** to `STANDARD_ROLE_TEMPLATES`:

```typescript
{
  id: "std_your_role",
  category: "YourNewCategory",
  name: "Your Role Name",
  description: "Role description",
  isSystemRole: true,
  // ... other properties
}
```

3. **Update category mappings** in components:

```typescript
// In role-management.page.ts and standard-role-selector.component.ts
const categoryIcons = {
  // ... existing mappings
  YourNewCategory: "your-icon-name",
};

const categoryColors = {
  // ... existing mappings
  YourNewCategory: "your-color",
};
```

### Creating a Role from Template

```typescript
onStandardRoleSelected(template: StandardRoleTemplate) {
  const role: GroupRole = {
    id: this.afs.createId(),
    name: template.name,
    description: template.description,
    roleType: "organization", // or "user"
    standardRoleTemplateId: template.id,
    standardCategory: template.category,
    isStandardRole: true,
    permissions: template.defaultPermissions || [],
    icon: template.icon
  };

  this.store.dispatch(
    AccountActions.createGroupRole({ groupId: this.groupId, role })
  );
}
```

### Assigning Multiple Roles

```typescript
updateRoles(account: RelatedAccount, selectedRoleIds: string[]): void {
  const updates: Partial<RelatedAccount> = {
    roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
    roleId: selectedRoleIds.length > 0 ? selectedRoleIds[0] : undefined
  };

  this.updateRelatedAccount(account.id, updates);
}
```

### Validating Role Selection

```typescript
// Check category restrictions
getRolesForAccount(account: RelatedAccount): GroupRole[] {
  return this.allRoles.filter(role => {
    // Filter by account type
    if (account.type === 'user' && role.roleType === 'organization') return false;
    if (account.type === 'group' && role.roleType === 'user') return false;

    // Add other validation logic
    return true;
  });
}
```

## Common Patterns

### Pattern 1: Hierarchical Role Structure

Standard organization roles now include:

- **Project Manager** – Oversees projects and coordinates team activities
- **Department Head** – Manages a department within the organization
- **Team Lead** – Leads a team and coordinates staff
- **Staff** – Staff member with general responsibilities
- **Intern** – Intern with limited access for learning purposes

```
Category: Organization
├── Administrator (Parent)
│   ├── Project Manager (Child)
│   │   └── Team Lead
│   │       ├── Staff
│   │       └── Intern
│   ├── Department Head (Child)
│   │   └── Team Lead
│   │       ├── Staff
│   │       └── Intern
│   └── Moderator (Child)
│       └── Member
```

```
Category: Volunteer
├── Volunteer Coordinator (Parent)
└── Team Leader (Child)
    ├── Event Volunteer
    ├── Program Volunteer
    ├── Remote Volunteer
    ├── Youth Volunteer
    └── Volunteer
```

### Community Roles Overview

- **Community Leader** – Guides initiatives and delegates to organizers.
- **Event Organizer** – Plans and manages community events.
- **Outreach Coordinator** – Drives outreach and communication efforts.
- **Community Volunteer** – Supports events and outreach activities.
- **Sponsor** – Provides funding or resources (standalone).

Hierarchy: Community Leader → Event Organizer/Outreach Coordinator → Community Volunteer; Sponsor (standalone)

```
Category: Administrative
├── Super Admin
│   └── System Administrator
│       ├── Support Agent
│       └── Auditor
```

### Pattern 2: Multi-Category Assignment

```typescript
// User can have roles from different categories
userRoles = [
  {category: "Organization", name: "Member"},
  {category: "Volunteer", name: "Event Volunteer"},
  {category: "Professional", name: "Consultant"},
];
```

### Pattern 3: Account Type Filtering

```typescript
const userRoles = roles.filter((r) => r.roleType === "user" || !r.roleType);
const orgRoles = roles.filter((r) => r.roleType === "organization");
```

### Pattern 4: Professional Hierarchy

```
Department Head
├── Team Lead
│   ├── Employee
│   ├── Intern
│   ├── Contractor
│   └── Consultant
└── Mentor
    ├── Employee
    ├── Intern
    ├── Contractor
    └── Consultant
```

- **Department Head**: Leads a specific department or division
- **Team Lead**: Oversees a specific team and coordinates tasks
- **Mentor**: Provides guidance and support to team members
- **Employee**: Standard staff member
- **Intern**: Temporary trainee gaining work experience
- **Contractor**: External specialist engaged for specific tasks
- **Consultant**: Expert providing professional advice

## Component Integration

### Using Role Selector Component

```html
<app-standard-role-selector
  [existingRoles]="(roles$ | async) || []"
  [accountInfo]="currentAccount"
  (roleSelected)="onStandardRoleSelected($event)"
  (customRoleRequested)="onCustomRoleRequested($event)"
>
</app-standard-role-selector>
```

### Displaying Categorized Roles

```html
<div *ngFor="let categoryGroup of categorizedRoles$ | async">
  <h3>
    <ion-icon [name]="categoryGroup.icon"></ion-icon>
    {{ categoryGroup.category }} ({{ categoryGroup.roles.length }})
  </h3>

  <div *ngFor="let role of categoryGroup.roles">{{ role.name }}</div>
</div>
```

## Troubleshooting

### Issue: Role not appearing in selector

**Solution**: Check `roleType` matches account type:

```typescript
// For user accounts, ensure role has roleType: 'user' or undefined
// For group accounts, ensure role has roleType: 'organization' or undefined
```

### Issue: Cannot select parent role

**Solution**: Verify same category requirement:

```typescript
// Parent and child must have same standardCategory
const availableParents = roles.filter(
  (r) => r.standardCategory === currentRole.standardCategory,
);
```

### Issue: Multiple roles from same category

**Solution**: Add validation in role selection:

```typescript
const categories = selectedRoles.map((r) => r.standardCategory);
const uniqueCategories = new Set(categories);
if (categories.length !== uniqueCategories.size) {
  // Show error: "Cannot select multiple roles from same category"
}
```

## File Locations

- **Models**: `/shared/models/`

  - `standard-role-template.model.ts`
  - `group-role.model.ts`
  - `account.model.ts`

- **Components**: `/src/app/modules/account/`

  - `pages/role-management/`
  - `components/standard-role-selector/`
  - `relatedAccount/pages/list/`

- **State Management**: `/src/app/state/`
  - `actions/account.actions.ts`
  - `selectors/account.selectors.ts`
  - `effects/account.effects.ts`

## Testing Checklist

- [ ] Role creation from template
- [ ] Custom role creation
- [ ] Parent role assignment (same category only)
- [ ] Multiple role assignment (different categories)
- [ ] Role type filtering (user vs organization)
- [ ] Category restriction validation
- [ ] Role deletion and update
- [ ] UI categorization display

## Performance Tips

1. **Use trackBy** for role lists:

```typescript
trackByRoleId(index: number, role: GroupRole): string {
  return role.id;
}
```

2. **Cache role queries**:

```typescript
private roleCache = new Map<string, GroupRole[]>();
```

3. **Implement lazy loading** for large role sets

4. **Use OnPush change detection** for role components

## Related Documentation

- [ROLES_HIERARCHY_SYSTEM.md](./ROLES_HIERARCHY_SYSTEM.md) - Complete system overview
- [ROLES_TECHNICAL_IMPLEMENTATION.md](./ROLES_TECHNICAL_IMPLEMENTATION.md) - Detailed implementation guide
- [architecture.md](./architecture.md) - Overall platform architecture

---

**Last Updated**: August 8, 2025
