# Roles and Hierarchy System Documentation

## Overview

The ASCENDynamics NFP platform implements a comprehensive, standardized role-based access control system that enables flexible organizational structures while maintaining consistency for analytics and reporting. The system supports both individual and organizational relationships with customizable hierarchies across multiple domains.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Role Categories](#role-categories)
3. [Standard Role Templates](#standard-role-templates)
4. [Role Assignment Models](#role-assignment-models)
5. [Hierarchical Structures](#hierarchical-structures)
6. [Permission Framework](#permission-framework)
7. [Implementation Details](#implementation-details)
8. [Usage Guidelines](#usage-guidelines)
9. [API Reference](#api-reference)

## System Architecture

### Core Components

1. **StandardRoleTemplate**: Pre-defined role templates with default configurations
2. **GroupRole**: Custom roles created within specific groups/organizations
3. **RelatedAccount**: User-to-user or user-to-group relationships with role assignments
4. **Role Categories**: Standardized categories for analytics and organization

### Data Flow

```
StandardRoleTemplate → GroupRole → RelatedAccount.roleId(s)
       ↓                  ↓              ↓
  Category Classification → Permission Assignment → Access Control
```

## Role Categories

The system defines 10 standardized categories, each designed for specific relationship contexts:

### 1. **Organization**

- **Purpose**: Traditional organizational structures
- **Use Cases**: Nonprofits, businesses, government agencies
- **Key Roles**: Administrator, Moderator, Project Manager, Department Head, Team Lead, Staff, Intern, Member
- **Hierarchy**: Administrator → Moderator → Project Manager/Department Head → Team Lead → Staff/Intern → Member

### 2. **Volunteer**

- **Purpose**: Volunteer program management
- **Use Cases**: Nonprofit volunteer coordination, community service
- **Key Roles**: Volunteer Coordinator, Team Leader, Event Volunteer, Program Volunteer, Remote Volunteer, Youth Volunteer, Volunteer
- **Hierarchy**: Coordinator → Team Leader → Volunteers

### 3. **Collaboration**

- **Purpose**: Project-based teamwork
- **Use Cases**: Cross-functional projects, collaborative initiatives
- **Key Roles**: Project Lead, Subject Matter Expert, Reviewer, Stakeholder, Collaborator, Observer
- **Hierarchy**: Project Lead → Subject Matter Expert/Reviewer → Collaborator/Observer

### 4. **Family**

- **Purpose**: Family unit organization
- **Use Cases**: Family groups, household management
- **Key Roles**: Family Head, Family Member
- **Hierarchy**: Head → Members

### 5. **Friends**

- **Purpose**: Social networking and personal connections
- **Use Cases**: Social groups, friend networks
- **Key Roles**: Best Friend, Close Friend, Friend, Acquaintance, Follower
- **Hierarchy**: Flat structure (peer-to-peer)
- **Access Levels**:
  - **Best Friend**: full personal content, private messaging, and priority interactions
  - **Close Friend**: personal content and private messaging
  - **Friend**: public content and standard interactions
  - **Acquaintance**: public content with limited interaction
  - **Follower**: view-only access to public posts

### 6. **Professional**

- **Purpose**: Workplace and professional relationships
- **Use Cases**: Corporate departments, professional networks
- **Key Roles**: Department Head, Employee
- **Hierarchy**: Department Head → Employees

### 7. **Community**

- **Purpose**: Community organization and civic engagement
- **Use Cases**: Neighborhood groups, civic organizations
- **Key Roles**: Community Leader, Event Organizer, Outreach Coordinator, Community Volunteer, Sponsor
- **Hierarchy**: Community Leader → Event Organizer/Outreach Coordinator → Community Volunteer; Sponsor (standalone)

### 8. **Partnership**

- **Purpose**: Inter-organizational partnerships
- **Use Cases**: Strategic alliances, service partnerships
- **Key Roles**: Strategic Partner, Service Provider, Resource Partner, Affiliate Organization, Technology Partner, Advocacy Partner, Implementation Partner, Research Partner
- **Hierarchy**: Strategic Partner → Specialized Partners

### 9. **Corporate**

- **Purpose**: Corporate relationships and business partnerships
- **Use Cases**: Sponsorships, vendor relationships, client management
- **Key Roles**: Corporate Sponsor, Vendor, Client Organization, Board Member Organization
- **Hierarchy**: Board Members/Sponsors → Vendors/Clients

### 10. **Administrative** _(Reserved for future use)_

- **Purpose**: System and administrative functions
- **Use Cases**: Platform administration, system roles

## Standard Role Templates

### Template Structure

Each standard role template includes:

```typescript
interface StandardRoleTemplate {
  id: string; // Unique identifier
  category: StandardRoleCategory; // Category classification
  name: string; // Display name
  description: string; // Role description
  defaultPermissions?: string[]; // Default permission set
  applicableGroupTypes?: string[]; // Valid group types
  icon?: string; // UI icon identifier
  isSystemRole: boolean; // System protection flag
  suggestedChildRoles?: string[]; // Recommended sub-roles
}
```

### Example Templates by Category

#### Organization Category

- **Administrator**: Full system access and management capabilities
- **Moderator**: Content moderation and member management
- **Project Manager**: Oversees projects and coordinates team activities
- **Department Head**: Manages a specific department within the organization
- **Team Lead**: Leads a team and coordinates staff members
- **Staff**: Staff member with general responsibilities
- **Intern**: Intern with limited access for learning purposes
- **Member**: Standard organization member with basic access

#### Volunteer Category

- **Volunteer Coordinator**: Manages volunteer programs and activities
- **Team Leader**: Oversees groups of volunteers for specific initiatives
- **Event Volunteer**: Supports on-site events and activities
- **Program Volunteer**: Assists ongoing programs and initiatives
- **Remote Volunteer**: Contributes to projects from remote locations
- **Youth Volunteer**: Participates in youth-oriented activities
- **Volunteer**: Individual contributing time and skills

#### Collaboration Category

- **Project Lead**: Leads specific projects and initiatives
- **Subject Matter Expert**: Provides specialized knowledge for project tasks
- **Reviewer**: Ensures quality through review and approval
- **Stakeholder**: Offers requirements and strategic feedback
- **Collaborator**: Contributes to project execution and shared resources
- **Observer**: Monitors progress without direct contribution

#### Partnership Category

- **Strategic Partner**: Key strategic alliance partner organization
- **Service Provider**: Organization providing specific services or expertise
- **Resource Partner**: Partner providing resources, funding, or materials
- **Affiliate Organization**: Affiliated or subsidiary organization
- **Technology Partner**: Partner providing technical solutions or platforms
- **Advocacy Partner**: Partner focusing on advocacy and outreach efforts
- **Implementation Partner**: Partner responsible for on-the-ground program implementation
- **Research Partner**: Partner conducting research and sharing findings

#### Corporate Category

- **Corporate Sponsor**: Corporate entity providing sponsorship support
- **Vendor**: Supplier or vendor organization
- **Client Organization**: Client or customer organization
- **Board Member Organization**: Organization with board representation

## Role Assignment Models

### Single Role Assignment (Legacy)

```typescript
interface RelatedAccount {
  roleId?: string; // Single role reference
  role?: string; // Custom role name
}
```

### Multiple Role Assignment (Current)

```typescript
interface RelatedAccount {
  roleIds?: string[]; // Multiple role references
  roleId?: string; // Backward compatibility
}
```

### Role Filtering and Restrictions

1. **Account Type Filtering**: Users can only be assigned "user" type roles
2. **Category Restrictions**: Users cannot select multiple roles from the same category
3. **Parent Role Constraints**: Parent roles must be from the same category as child roles
4. **Hierarchy Validation**: Prevents circular references and invalid parent-child relationships

## Hierarchical Structures

### Hierarchy Rules

1. **Same Category Requirement**: Parent and child roles must belong to the same category
2. **Single Parent**: Each role can have only one parent role
3. **Multiple Children**: Parent roles can have multiple child roles
4. **Depth Limitation**: Hierarchies are designed for 2-3 levels to maintain simplicity

### Category-Specific Hierarchies

#### Organization Hierarchy

```
Administrator
├── Moderator
│   └── Member
├── Project Manager
│   └── Team Lead
│       ├── Staff
│       └── Intern
└── Department Head
    └── Team Lead
        ├── Staff
        └── Intern
```

#### Collaboration Hierarchy

```
Project Lead
├── Subject Matter Expert
│   ├── Collaborator
│   └── Observer
├── Reviewer
│   ├── Collaborator
│   └── Observer
└── Stakeholder
```

#### Volunteer Hierarchy

```
Volunteer Coordinator
└── Team Leader
    ├── Event Volunteer
    ├── Program Volunteer
    ├── Remote Volunteer
    ├── Youth Volunteer
    └── Volunteer
```

#### Partnership Hierarchy

```
Strategic Partner
├── Service Provider
├── Resource Partner
├── Affiliate Organization
├── Technology Partner
├── Advocacy Partner
├── Implementation Partner
└── Research Partner
```

## Permission Framework

### Default Permissions by Category

#### Organization

- `manage_members`: Add, remove, and modify member accounts
- `manage_projects`: Create and oversee organizational projects
- `manage_roles`: Create and assign roles within the organization
- `manage_settings`: Modify organizational settings and configuration

#### Volunteer

- `manage_volunteers`: Coordinate volunteer assignments and schedules
- `create_volunteer_opportunities`: Post and manage volunteer positions
- `manage_team`: Organize volunteer teams
- `assign_volunteer_tasks`: Delegate tasks to team members
- `participate_in_events`: Support on-site events
- `support_programs`: Assist ongoing programs
- `contribute_remotely`: Work on tasks from remote locations
- `participate_in_youth_programs`: Engage in youth-focused volunteer work
- `register_for_opportunities`: Sign up for volunteer activities
- `track_hours`: Log and monitor volunteer time contributions

#### Partnership

- `access_partnership_resources`: View partnership-specific materials
- `joint_planning`: Participate in collaborative planning sessions
- `data_sharing`: Exchange organizational data within partnerships
- `provide_services`: Deliver contracted services to partners
- `provide_resources`: Supply funding or materials to partners
- `affiliate_access`: Utilize shared branding or affiliate tools
- `provide_technology`: Deliver technical solutions and integrations
- `advocacy_campaigns`: Run advocacy and outreach efforts
- `implement_projects`: Execute programs and initiatives
- `conduct_research`: Perform research and share findings

#### Corporate

- `sponsor_benefits`: Access sponsorship perks and recognition
- `branding_rights`: Use organizational branding in sponsored contexts
- `vendor_portal`: Access vendor-specific tools and interfaces
- `contract_management`: Manage service agreements and contracts

### Permission Inheritance

- Child roles inherit permissions from parent roles
- Additional permissions can be granted at the child level
- Permissions cannot be revoked from inherited parent permissions

## Implementation Details

### Database Schema

#### GroupRole Collection

```typescript
interface GroupRole {
  id: string;
  name: string;
  description?: string;
  parentRoleId?: string;
  permissions?: string[];
  roleType?: RoleType; // "user" | "organization"
  standardRoleTemplateId?: string;
  standardCategory?: StandardRoleCategory;
  isStandardRole?: boolean;
  isCustomRole?: boolean;
  icon?: string;
  color?: string;
  sortOrder?: number;
}
```

#### RelatedAccount Collection

```typescript
interface RelatedAccount {
  accountId: string;
  roleId?: string; // Legacy single role
  roleIds?: string[]; // Current multiple roles
  status?: "pending" | "accepted" | "rejected" | "blocked";
  access?: "admin" | "moderator" | "member";
}
```

### State Management

The system uses NgRx for state management with the following selectors:

- `selectGroupRolesByGroupId`: Retrieve roles for a specific group
- `selectAccountLoading`: Track loading states for role operations
- `selectCategorizedRoles`: Group roles by category for UI display

### UI Components

#### Role Management Interface

- Categorized role display with visual groupings
- Real-time role editing and validation
- Parent role selection with same-category filtering
- Standard role template integration

#### Role Selector Component

- Multi-role selection with category restrictions
- Account type filtering (user vs organization roles)
- Template-based role creation
- Custom role creation within categories

## Usage Guidelines

### Best Practices

1. **Category Consistency**: Always assign roles within appropriate categories
2. **Hierarchy Planning**: Design role hierarchies before implementation
3. **Permission Minimization**: Grant only necessary permissions for each role
4. **Regular Review**: Periodically audit role assignments and permissions

### Common Patterns

#### Nonprofit Organization Setup

```
Organization Category:
- Administrator (Executive Director)
  - Moderator (Program Manager)
    - Member
  - Department Head
    - Team Lead
      - Staff
      - Intern
  - Project Manager
    - Team Lead
      - Staff
      - Intern

Volunteer Category:
- Volunteer Coordinator
  - Team Leader
    - Event Volunteer
    - Program Volunteer
    - Remote Volunteer
    - Youth Volunteer
    - Volunteer
```

#### Corporate Partnership Setup

```
Partnership Category:
- Strategic Partner (Primary Organization)
  - Service Provider (Contracted Services)
  - Resource Partner (Funding/Materials)
  - Affiliate Organization (Affiliated Entity)
  - Technology Partner (Tech Solutions)
  - Advocacy Partner (Advocacy/Outreach)
  - Implementation Partner (Program Execution)
  - Research Partner (Research & Analysis)

Corporate Category:
- Corporate Sponsor (Major Donors)
  - Vendor (Service Suppliers)
  - Client Organization (Beneficiaries)
```

### Migration Guidelines

When migrating from single to multiple role assignments:

1. Preserve existing `roleId` assignments for backward compatibility
2. Gradually transition to `roleIds` array structure
3. Validate role category consistency during migration
4. Update UI components to handle multiple role display

## API Reference

### Role Management Actions

#### Creating Roles

```typescript
// Create standard role from template
dispatch(AccountActions.createGroupRole({
  groupId: string,
  role: {
    standardRoleTemplateId: string,
    name: string,
    category: StandardRoleCategory
  }
}));

// Create custom role
dispatch(AccountActions.createGroupRole({
  groupId: string,
  role: {
    name: string,
    description: string,
    category: StandardRoleCategory,
    parentRoleId?: string,
    isCustomRole: true
  }
}));
```

#### Updating Role Assignments

```typescript
// Single role assignment (legacy)
updateRelatedAccount({
  accountId: string,
  roleId: string
});

// Multiple role assignment (current)
updateRelatedAccount({
  accountId: string,
  roleIds: string[]
});
```

#### Role Validation

```typescript
// Validate parent role selection
getAvailableParentRoles(role: GroupRole, allRoles: GroupRole[]): GroupRole[]

// Check role category restrictions
validateRoleSelection(selectedRoles: string[], accountType: string): boolean
```

### Query Examples

#### Retrieve Categorized Roles

```typescript
const categorizedRoles$ = this.store
  .select(selectGroupRolesByGroupId(groupId))
  .pipe(map((roles) => this.groupRolesByCategory(roles)));
```

#### Filter Roles by Account Type

```typescript
const userRoles = roles.filter(
  (role) => role.roleType === "user" || role.roleType === undefined,
);
```

## Future Enhancements

### Planned Features

1. **Dynamic Permission Templates**: Role-based permission templates
2. **Time-Limited Roles**: Temporary role assignments with expiration
3. **Role Inheritance Maps**: Visual hierarchy representation
4. **Advanced Analytics**: Role-based reporting and insights
5. **Bulk Role Operations**: Mass assignment and management tools

### Scalability Considerations

1. **Performance Optimization**: Indexed role queries for large organizations
2. **Caching Strategy**: Role permission caching for frequently accessed data
3. **Audit Trail**: Comprehensive logging of role changes and assignments
4. **Integration APIs**: External system integration for role synchronization

## Conclusion

The Roles and Hierarchy System provides a robust foundation for managing complex organizational relationships while maintaining consistency and flexibility. The standardized categories enable cross-platform analytics while custom roles allow for organization-specific requirements.

For implementation questions or feature requests, please refer to the development team or create an issue in the project repository.

---

**Last Updated**: August 8, 2025  
**Version**: 2.0  
**Contributors**: ASCENDynamics NFP Development Team
