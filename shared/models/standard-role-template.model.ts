/*******************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/
// shared/models/standard-role-template.model.ts

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
  applicableGroupTypes?: string[]; // Which group types this role applies to
  icon?: string;
  isSystemRole: boolean; // Cannot be deleted
  suggestedChildRoles?: string[]; // Suggested sub-roles
}

export interface StandardRoleHierarchy {
  category: StandardRoleCategory;
  parentRoles: StandardRoleTemplate[];
  childRoleTemplates: StandardRoleTemplate[];
  description: string;
}

// Pre-defined standard role templates
export const STANDARD_ROLE_TEMPLATES: StandardRoleTemplate[] = [
  // Organization Category
  {
    id: "std_admin",
    category: "Organization",
    name: "Administrator",
    description: "Full system access and management capabilities",
    defaultPermissions: [
      "manage_members",
      "manage_projects",
      "manage_roles",
      "manage_settings",
    ],
    applicableGroupTypes: ["Nonprofit", "Business", "Community", "Government"],
    icon: "shield-checkmark",
    isSystemRole: true,
    suggestedChildRoles: ["Project Manager", "Department Head"],
  },
  {
    id: "std_moderator",
    category: "Organization",
    name: "Moderator",
    description: "Content moderation and member management",
    defaultPermissions: ["moderate_content", "manage_members"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community"],
    icon: "hammer",
    isSystemRole: true,
    suggestedChildRoles: ["Content Reviewer", "Community Manager"],
  },
  {
    id: "std_member",
    category: "Organization",
    name: "Member",
    description: "Standard organization member with basic access",
    defaultPermissions: ["view_content", "participate"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community", "Government"],
    icon: "person",
    isSystemRole: true,
    suggestedChildRoles: [],
  },

  // Volunteer Category
  {
    id: "std_volunteer_coordinator",
    category: "Volunteer",
    name: "Volunteer Coordinator",
    description: "Manages volunteer programs and activities",
    defaultPermissions: ["manage_volunteers", "create_volunteer_opportunities"],
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "people",
    isSystemRole: true,
    suggestedChildRoles: ["Event Volunteer", "Program Volunteer"],
  },
  {
    id: "std_volunteer",
    category: "Volunteer",
    name: "Volunteer",
    description: "Individual contributing time and skills",
    defaultPermissions: ["register_for_opportunities", "track_hours"],
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "heart",
    isSystemRole: true,
    suggestedChildRoles: [],
  },

  // Collaboration Category
  {
    id: "std_project_lead",
    category: "Collaboration",
    name: "Project Lead",
    description: "Leads specific projects and initiatives",
    defaultPermissions: ["manage_project", "assign_tasks"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community"],
    icon: "flag",
    isSystemRole: true,
    suggestedChildRoles: ["Project Member", "Subject Matter Expert"],
  },
  {
    id: "std_collaborator",
    category: "Collaboration",
    name: "Collaborator",
    description: "Actively participates in collaborative projects",
    defaultPermissions: ["contribute_to_projects", "share_resources"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community"],
    icon: "git-merge",
    isSystemRole: true,
    suggestedChildRoles: [],
  },

  // Family Category
  {
    id: "std_family_head",
    category: "Family",
    name: "Family Head",
    description: "Primary family organizer and decision maker",
    defaultPermissions: ["manage_family", "make_decisions"],
    applicableGroupTypes: ["Family"],
    icon: "home",
    isSystemRole: true,
    suggestedChildRoles: ["Parent", "Guardian"],
  },
  {
    id: "std_family_member",
    category: "Family",
    name: "Family Member",
    description: "General family member",
    defaultPermissions: ["participate_in_family"],
    applicableGroupTypes: ["Family"],
    icon: "people-circle",
    isSystemRole: true,
    suggestedChildRoles: ["Child", "Extended Family"],
  },

  // Friends Category
  {
    id: "std_close_friend",
    category: "Friends",
    name: "Close Friend",
    description: "Trusted friend with broader access",
    defaultPermissions: ["view_personal_content", "private_messaging"],
    applicableGroupTypes: ["Social", "Personal"],
    icon: "heart-circle",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_friend",
    category: "Friends",
    name: "Friend",
    description: "General friend connection",
    defaultPermissions: ["view_public_content", "basic_interaction"],
    applicableGroupTypes: ["Social", "Personal"],
    icon: "happy",
    isSystemRole: true,
    suggestedChildRoles: [],
  },

  // Professional Category
  {
    id: "std_department_head",
    category: "Professional",
    name: "Department Head",
    description: "Leads a specific department or division",
    defaultPermissions: ["manage_department", "approve_requests"],
    applicableGroupTypes: ["Business", "Nonprofit"],
    icon: "briefcase",
    isSystemRole: true,
    suggestedChildRoles: ["Team Lead", "Senior Specialist"],
  },
  {
    id: "std_employee",
    category: "Professional",
    name: "Employee",
    description: "Standard employee or staff member",
    defaultPermissions: ["access_workplace_tools", "collaborate"],
    applicableGroupTypes: ["Business", "Nonprofit"],
    icon: "person-circle",
    isSystemRole: true,
    suggestedChildRoles: [],
  },

  // Community Category
  {
    id: "std_community_leader",
    category: "Community",
    name: "Community Leader",
    description: "Guides community initiatives and engagement",
    defaultPermissions: ["organize_events", "represent_community"],
    applicableGroupTypes: ["Community", "Nonprofit"],
    icon: "megaphone",
    isSystemRole: true,
    suggestedChildRoles: ["Event Organizer", "Outreach Coordinator"],
  },
  {
    id: "std_resident",
    category: "Community",
    name: "Resident",
    description: "Community resident or local participant",
    defaultPermissions: ["participate_in_community", "attend_events"],
    applicableGroupTypes: ["Community"],
    icon: "location",
    isSystemRole: true,
    suggestedChildRoles: [],
  },

  // Partnership Category
  {
    id: "std_strategic_partner",
    category: "Partnership",
    name: "Strategic Partner",
    description: "Key strategic alliance partner organization",
    defaultPermissions: [
      "access_partnership_resources",
      "joint_planning",
      "data_sharing",
    ],
    applicableGroupTypes: ["group", "organization"],
    icon: "handshake",
    isSystemRole: true,
    suggestedChildRoles: ["Service Provider", "Resource Partner"],
  },
  {
    id: "std_service_provider",
    category: "Partnership",
    name: "Service Provider",
    description: "Organization providing specific services or expertise",
    defaultPermissions: ["provide_services", "access_service_tools"],
    applicableGroupTypes: ["group", "organization"],
    icon: "construct",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_resource_partner",
    category: "Partnership",
    name: "Resource Partner",
    description: "Partner providing resources, funding, or materials",
    defaultPermissions: ["provide_resources", "funding_oversight"],
    applicableGroupTypes: ["group", "organization"],
    icon: "gift",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_affiliate_organization",
    category: "Partnership",
    name: "Affiliate Organization",
    description: "Affiliated or subsidiary organization",
    defaultPermissions: ["affiliate_access", "shared_branding"],
    applicableGroupTypes: ["group", "organization"],
    icon: "link",
    isSystemRole: true,
    suggestedChildRoles: [],
  },

  // Corporate Category
  {
    id: "std_corporate_sponsor",
    category: "Corporate",
    name: "Corporate Sponsor",
    description: "Corporate entity providing sponsorship support",
    defaultPermissions: ["sponsor_benefits", "branding_rights", "event_access"],
    applicableGroupTypes: ["group", "organization"],
    icon: "business",
    isSystemRole: true,
    suggestedChildRoles: ["Platinum Sponsor", "Gold Sponsor", "Silver Sponsor"],
  },
  {
    id: "std_board_member_org",
    category: "Corporate",
    name: "Board Member Organization",
    description: "Organization with board representation",
    defaultPermissions: [
      "board_access",
      "governance_participation",
      "strategic_input",
    ],
    applicableGroupTypes: ["group", "organization"],
    icon: "shield-checkmark",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_investor_org",
    category: "Corporate",
    name: "Investor Organization",
    description: "Organization providing investment or funding",
    defaultPermissions: ["investor_portal", "financial_reports"],
    applicableGroupTypes: ["group", "organization"],
    icon: "trending-up",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_channel_partner_org",
    category: "Corporate",
    name: "Channel Partner Organization",
    description: "Organization participating in channel partnerships",
    defaultPermissions: ["channel_portal", "co_marketing", "sales_support"],
    applicableGroupTypes: ["group", "organization"],
    icon: "swap-horizontal",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_vendor",
    category: "Corporate",
    name: "Vendor",
    description: "Supplier or vendor organization",
    defaultPermissions: ["vendor_portal", "contract_management"],
    applicableGroupTypes: ["group", "organization"],
    icon: "storefront",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_supplier_org",
    category: "Corporate",
    name: "Supplier Organization",
    description: "Organization supplying goods or materials",
    defaultPermissions: ["supply_portal", "inventory_access"],
    applicableGroupTypes: ["group", "organization"],
    icon: "cube",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_contractor_org",
    category: "Corporate",
    name: "Contractor Organization",
    description: "Organization providing contract-based services",
    defaultPermissions: ["contractor_portal", "service_orders"],
    applicableGroupTypes: ["group", "organization"],
    icon: "construct",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_client_organization",
    category: "Corporate",
    name: "Client Organization",
    description: "Client or customer organization",
    defaultPermissions: ["client_portal", "service_access", "support_tickets"],
    applicableGroupTypes: ["group", "organization"],
    icon: "briefcase",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
];

export const STANDARD_ROLE_HIERARCHIES: StandardRoleHierarchy[] = [
  {
    category: "Organization",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Organization" &&
        ["Administrator", "Moderator"].includes(r.name),
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Organization" && r.name === "Member",
    ),
    description:
      "Basic organizational structure with administrators, moderators, and members",
  },
  {
    category: "Volunteer",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Volunteer" && r.name === "Volunteer Coordinator",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Volunteer" && r.name === "Volunteer",
    ),
    description:
      "Volunteer program structure with coordinators managing volunteers",
  },
  {
    category: "Collaboration",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Collaboration" && r.name === "Project Lead",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Collaboration" && r.name === "Collaborator",
    ),
    description:
      "Project-based collaboration with leads managing collaborators",
  },
  {
    category: "Family",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Family" && r.name === "Family Head",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Family" && r.name === "Family Member",
    ),
    description: "Family structure with heads organizing family members",
  },
  {
    category: "Professional",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Professional" && r.name === "Department Head",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Professional" && r.name === "Employee",
    ),
    description:
      "Professional hierarchy with department heads managing employees",
  },
  {
    category: "Community",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Community" && r.name === "Community Leader",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Community" && r.name === "Resident",
    ),
    description: "Community structure with leaders guiding residents",
  },
  {
    category: "Partnership",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Partnership" && r.name === "Strategic Partner",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Partnership" &&
        [
          "Service Provider",
          "Resource Partner",
          "Affiliate Organization",
        ].includes(r.name),
    ),
    description:
      "Partnership hierarchy with strategic partners coordinating service and resource providers",
  },
  {
    category: "Corporate",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Corporate" &&
        ["Corporate Sponsor", "Board Member Organization"].includes(r.name),
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Corporate" &&
        ["Investor Organization", "Channel Partner Organization"].includes(
          r.name,
        ),
    ),
    description:
      "Sponsors and board member organizations overseeing investors and channel partners",
  },
  {
    category: "Corporate",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Corporate" &&
        ["Investor Organization", "Channel Partner Organization"].includes(
          r.name,
        ),
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Corporate" &&
        [
          "Vendor",
          "Supplier Organization",
          "Contractor Organization",
          "Client Organization",
        ].includes(r.name),
    ),
    description:
      "Investor and channel partner relationships managing vendors, suppliers, contractors, and clients",
  },
];
