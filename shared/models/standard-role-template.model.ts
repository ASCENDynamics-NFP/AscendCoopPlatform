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
    suggestedChildRoles: [
      "Project Manager",
      "Department Head",
      "Team Lead",
      "Staff",
      "Intern",
    ],
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
    suggestedChildRoles: [
      "Content Reviewer",
      "Community Manager",
      "Team Lead",
      "Staff",
      "Intern",
    ],
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

  {
    id: "std_project_manager",
    category: "Organization",
    name: "Project Manager",
    description: "Oversees projects and coordinates team activities",
    defaultPermissions: ["manage_projects", "assign_tasks"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community", "Government"],
    icon: "clipboard",
    isSystemRole: true,
    suggestedChildRoles: ["Team Lead", "Staff", "Intern"],
  },
  {
    id: "std_department_head_org",
    category: "Organization",
    name: "Department Head",
    description: "Manages a specific department within the organization",
    defaultPermissions: ["manage_department", "approve_requests"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community", "Government"],
    icon: "briefcase",
    isSystemRole: true,
    suggestedChildRoles: ["Team Lead"],
  },
  {
    id: "std_team_lead",
    category: "Organization",
    name: "Team Lead",
    description: "Leads a team and coordinates staff members",
    defaultPermissions: ["manage_team", "assign_tasks"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community", "Government"],
    icon: "people-circle",
    isSystemRole: true,
    suggestedChildRoles: ["Staff", "Intern"],
  },
  {
    id: "std_staff",
    category: "Organization",
    name: "Staff",
    description: "Staff member with general responsibilities",
    defaultPermissions: ["access_workplace_tools", "collaborate"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community", "Government"],
    icon: "person-circle",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_intern",
    category: "Organization",
    name: "Intern",
    description: "Intern with limited access for learning purposes",
    defaultPermissions: ["view_content", "participate_in_training"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community", "Government"],
    icon: "school",
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
    suggestedChildRoles: ["Team Leader"],
  },
  {
    id: "std_team_leader",
    category: "Volunteer",
    name: "Team Leader",
    description: "Leads groups of volunteers for events or programs",
    defaultPermissions: ["manage_team", "assign_volunteer_tasks"],
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "people-circle",
    isSystemRole: true,
    suggestedChildRoles: [
      "Event Volunteer",
      "Program Volunteer",
      "Remote Volunteer",
      "Youth Volunteer",
      "Volunteer",
    ],
  },
  {
    id: "std_event_volunteer",
    category: "Volunteer",
    name: "Event Volunteer",
    description: "Supports on-site events and activities",
    defaultPermissions: ["participate_in_events", "track_hours"],
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "calendar",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_program_volunteer",
    category: "Volunteer",
    name: "Program Volunteer",
    description: "Assists ongoing programs and initiatives",
    defaultPermissions: ["support_programs", "track_hours"],
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "ribbon",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_remote_volunteer",
    category: "Volunteer",
    name: "Remote Volunteer",
    description: "Contributes remotely to projects",
    defaultPermissions: ["contribute_remotely", "track_hours"],
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "globe",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_youth_volunteer",
    category: "Volunteer",
    name: "Youth Volunteer",
    description: "Participates in youth-oriented activities",
    defaultPermissions: ["participate_in_youth_programs", "track_hours"],
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "school",
    isSystemRole: true,
    suggestedChildRoles: [],
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
    suggestedChildRoles: [
      "Subject Matter Expert",
      "Reviewer",
      "Stakeholder",
      "Collaborator",
      "Observer",
    ],
  },
  {
    id: "std_subject_matter_expert",
    category: "Collaboration",
    name: "Subject Matter Expert",
    description: "Provides specialized knowledge for project tasks",
    defaultPermissions: ["provide_expertise", "support_decisions"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community"],
    icon: "school",
    isSystemRole: true,
    suggestedChildRoles: ["Collaborator"],
  },
  {
    id: "std_reviewer",
    category: "Collaboration",
    name: "Reviewer",
    description: "Reviews work products and ensures quality standards",
    defaultPermissions: ["review_work", "approve_changes"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community"],
    icon: "checkmark-done",
    isSystemRole: true,
    suggestedChildRoles: ["Collaborator"],
  },
  {
    id: "std_stakeholder",
    category: "Collaboration",
    name: "Stakeholder",
    description: "Provides project requirements and strategic feedback",
    defaultPermissions: ["view_project_status", "provide_feedback"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community"],
    icon: "briefcase",
    isSystemRole: true,
    suggestedChildRoles: ["Observer"],
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
  {
    id: "std_observer",
    category: "Collaboration",
    name: "Observer",
    description: "Monitors project progress without direct contribution",
    defaultPermissions: ["view_project_updates"],
    applicableGroupTypes: ["Nonprofit", "Business", "Community"],
    icon: "eye",
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
    id: "std_best_friend",
    category: "Friends",
    name: "Best Friend",
    description: "Closest friend with full personal access",
    defaultPermissions: [
      "view_personal_content",
      "private_messaging",
      "priority_interaction",
    ],
    applicableGroupTypes: ["Social", "Personal"],
    icon: "star",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
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
  {
    id: "std_acquaintance",
    category: "Friends",
    name: "Acquaintance",
    description: "Casual connection with limited access",
    defaultPermissions: ["view_public_content", "limited_interaction"],
    applicableGroupTypes: ["Social", "Personal"],
    icon: "person-outline",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_follower",
    category: "Friends",
    name: "Follower",
    description: "Follower with view-only access to public posts",
    defaultPermissions: ["view_public_content"],
    applicableGroupTypes: ["Social", "Personal"],
    icon: "eye",
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
    suggestedChildRoles: ["Team Lead", "Mentor", "Senior Specialist"],
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

  {
    id: "std_team_lead",
    category: "Professional",
    name: "Team Lead",
    description: "Oversees a specific team and coordinates tasks",
    defaultPermissions: ["lead_team", "assign_tasks"],
    applicableGroupTypes: ["Business", "Nonprofit"],
    icon: "people",
    isSystemRole: true,
    suggestedChildRoles: ["Employee", "Intern", "Contractor", "Consultant"],
  },
  {
    id: "std_mentor",
    category: "Professional",
    name: "Mentor",
    description: "Provides guidance and support to team members",
    defaultPermissions: ["provide_guidance", "review_work"],
    applicableGroupTypes: ["Business", "Nonprofit"],
    icon: "ribbon",
    isSystemRole: true,
    suggestedChildRoles: ["Employee", "Intern", "Contractor", "Consultant"],
  },
  {
    id: "std_contractor",
    category: "Professional",
    name: "Contractor",
    description: "External specialist engaged for specific tasks",
    defaultPermissions: ["access_limited_tools", "submit_timesheets"],
    applicableGroupTypes: ["Business", "Nonprofit"],
    icon: "construct",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_consultant",
    category: "Professional",
    name: "Consultant",
    description: "Expert providing professional advice",
    defaultPermissions: ["advise", "view_reports"],
    applicableGroupTypes: ["Business", "Nonprofit"],
    icon: "chatbubbles",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_intern",
    category: "Professional",
    name: "Intern",
    description: "Temporary trainee gaining work experience",
    defaultPermissions: ["access_training_resources", "assist_tasks"],
    applicableGroupTypes: ["Business", "Nonprofit"],
    icon: "school",
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
    id: "std_event_organizer",
    category: "Community",
    name: "Event Organizer",
    description: "Plans and manages community events",
    defaultPermissions: ["organize_events", "manage_event_participation"],
    applicableGroupTypes: ["Community", "Nonprofit"],
    icon: "calendar",
    isSystemRole: true,
    suggestedChildRoles: ["Community Volunteer"],
  },
  {
    id: "std_outreach_coordinator",
    category: "Community",
    name: "Outreach Coordinator",
    description: "Coordinates community outreach and engagement",
    defaultPermissions: ["manage_outreach", "communicate_with_members"],
    applicableGroupTypes: ["Community", "Nonprofit"],
    icon: "share-social",
    isSystemRole: true,
    suggestedChildRoles: ["Community Volunteer"],
  },
  {
    id: "std_community_volunteer",
    category: "Community",
    name: "Community Volunteer",
    description: "Supports events and outreach efforts",
    defaultPermissions: ["assist_events", "participate_in_outreach"],
    applicableGroupTypes: ["Community", "Nonprofit"],
    icon: "hand-left",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_sponsor",
    category: "Community",
    name: "Sponsor",
    description: "Provides funding or resources for community initiatives",
    defaultPermissions: ["contribute_resources"],
    applicableGroupTypes: ["Community", "Nonprofit"],
    icon: "cash",
    isSystemRole: true,
    suggestedChildRoles: [],
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
    suggestedChildRoles: [
      "Service Provider",
      "Resource Partner",
      "Affiliate Organization",
      "Technology Partner",
      "Advocacy Partner",
      "Implementation Partner",
      "Research Partner",
    ],
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

  {
    id: "std_technology_partner",
    category: "Partnership",
    name: "Technology Partner",
    description: "Partner providing technical solutions or platforms",
    defaultPermissions: ["provide_technology", "access_tech_resources"],
    applicableGroupTypes: ["group", "organization"],
    icon: "hardware-chip",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_advocacy_partner",
    category: "Partnership",
    name: "Advocacy Partner",
    description: "Partner focusing on advocacy and outreach efforts",
    defaultPermissions: ["advocacy_campaigns", "public_outreach"],
    applicableGroupTypes: ["group", "organization"],
    icon: "megaphone",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_implementation_partner",
    category: "Partnership",
    name: "Implementation Partner",
    description: "Partner responsible for on-the-ground program implementation",
    defaultPermissions: ["implement_projects", "field_operations"],
    applicableGroupTypes: ["group", "organization"],
    icon: "construct",
    isSystemRole: true,
    suggestedChildRoles: [],
  },
  {
    id: "std_research_partner",
    category: "Partnership",
    name: "Research Partner",
    description: "Partner conducting research and sharing findings",
    defaultPermissions: ["conduct_research", "share_findings"],
    applicableGroupTypes: ["group", "organization"],
    icon: "flask",
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
      (r) =>
        r.category === "Organization" &&
        [
          "Project Manager",
          "Department Head",
          "Team Lead",
          "Staff",
          "Intern",
          "Member",
        ].includes(r.name),
    ),
    description:
      "Organizational structure with administrators and moderators overseeing managers, team leads, staff, interns, and members",
  },
  {
    category: "Organization",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Organization" &&
        ["Project Manager", "Department Head"].includes(r.name),
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Organization" && r.name === "Team Lead",
    ),
    description:
      "Mid-level structure with project managers and department heads guiding team leads",
  },
  {
    category: "Organization",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Organization" && r.name === "Team Lead",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Organization" && ["Staff", "Intern"].includes(r.name),
    ),
    description: "Team leads supervising staff and interns",
  },
  {
    category: "Volunteer",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Volunteer" && r.name === "Volunteer Coordinator",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Volunteer" && r.name === "Team Leader",
    ),
    description:
      "Volunteer program structure with coordinators overseeing team leaders",
  },
  {
    category: "Volunteer",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Volunteer" && r.name === "Team Leader",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Volunteer" &&
        [
          "Volunteer",
          "Event Volunteer",
          "Program Volunteer",
          "Remote Volunteer",
          "Youth Volunteer",
        ].includes(r.name),
    ),
    description:
      "Team leaders manage volunteers across events, programs, remote work, and youth activities",
  },
  {
    category: "Collaboration",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Collaboration" && r.name === "Project Lead",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Collaboration" &&
        ["Subject Matter Expert", "Reviewer"].includes(r.name),
    ),
    description:
      "Project leads coordinate SMEs and reviewers in multi-tier collaborations",
  },
  {
    category: "Collaboration",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Collaboration" &&
        ["Subject Matter Expert", "Reviewer"].includes(r.name),
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Collaboration" &&
        ["Collaborator", "Observer"].includes(r.name),
    ),
    description: "SMEs and reviewers oversee collaborators and observers",
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
      (r) =>
        r.category === "Professional" &&
        ["Team Lead", "Mentor"].includes(r.name),
    ),
    description: "Department heads oversee team leads and mentors",
  },
  {
    category: "Professional",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Professional" &&
        ["Team Lead", "Mentor"].includes(r.name),
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Professional" &&
        ["Employee", "Intern", "Contractor", "Consultant"].includes(r.name),
    ),
    description:
      "Team leads and mentors manage employees, interns, contractors, and consultants",
  },
  {
    category: "Community",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Community" && r.name === "Community Leader",
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Community" &&
        ["Event Organizer", "Outreach Coordinator"].includes(r.name),
    ),
    description:
      "Community leaders delegate event organization and outreach coordination",
  },
  {
    category: "Community",
    parentRoles: STANDARD_ROLE_TEMPLATES.filter(
      (r) =>
        r.category === "Community" &&
        ["Event Organizer", "Outreach Coordinator"].includes(r.name),
    ),
    childRoleTemplates: STANDARD_ROLE_TEMPLATES.filter(
      (r) => r.category === "Community" && r.name === "Community Volunteer",
    ),
    description: "Organizers and coordinators manage community volunteers",
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
          "Technology Partner",
          "Advocacy Partner",
          "Implementation Partner",
          "Research Partner",
        ].includes(r.name),
    ),
    description:
      "Partnership hierarchy with strategic partners coordinating specialized partners",
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
        ["Vendor", "Client Organization"].includes(r.name),
    ),
    description:
      "Corporate relationships with sponsors and board members having elevated access",
  },
];
