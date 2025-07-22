# Role Hierarchy Page

The role hierarchy page visualizes group roles together with the members who hold those roles.

Navigate to `/account/<accountId>/role-hierarchy` to view a tree of roles for a group account. Roles are grouped by their `parentRoleId` so nested roles appear underneath their parent.

For each role node the page lists related accounts whose `roleId` matches that role. The component retrieves data from NgRx state using the existing selectors `selectGroupRolesByGroupId` and `selectRelatedAccountsByAccountId`.
