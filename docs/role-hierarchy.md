# Role Hierarchy Page

The role hierarchy page visualizes custom roles defined for a group and which accounts hold each role. Navigate to:

```
/account/:accountId/role-hierarchy
```

Replace `:accountId` with the ID of the group. The page retrieves group roles and related accounts from the store and builds a tree using each role's `parentRoleId`. Under every role the related accounts assigned to that role are listed.
