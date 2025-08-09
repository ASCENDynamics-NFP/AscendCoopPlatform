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
// shared/models/standard-project-template.model.ts

export type StandardProjectCategory =
  | "Volunteer"
  | "Fundraising"
  | "Event"
  | "Education"
  | "Outreach"
  | "Research"
  | "Operations"
  | "Marketing"
  | "Technology"
  | "General";

export type ProjectComplexity = "Simple" | "Moderate" | "Complex";
export type ProjectTimeframe =
  | "Short-term"
  | "Medium-term"
  | "Long-term"
  | "Ongoing";

export interface StandardProjectTemplate {
  id: string;
  category: StandardProjectCategory;
  name: string;
  description: string;
  applicableGroupTypes?: string[]; // Which group types this project applies to
  icon?: string;
  color?: string;
  isSystemTemplate: boolean; // Cannot be deleted
  defaultTasks?: string[]; // Suggested default tasks
  requiredRoles?: string[]; // Roles typically needed for this project
  complexity: ProjectComplexity;
  estimatedTimeframe: ProjectTimeframe;
  suggestedMetrics?: string[]; // KPIs to track
}

// Pre-defined standard project templates
export const STANDARD_PROJECT_TEMPLATES: StandardProjectTemplate[] = [
  // Volunteer Projects
  {
    id: "std_volunteer_general",
    category: "Volunteer",
    name: "Volunteer Program",
    description: "General volunteer coordination and management",
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "heart",
    color: "#FF6B6B",
    isSystemTemplate: true,
    defaultTasks: [
      "Recruit volunteers",
      "Schedule activities",
      "Track hours",
      "Recognize contributions",
    ],
    requiredRoles: ["Volunteer Coordinator", "Volunteer"],
    complexity: "Moderate",
    estimatedTimeframe: "Ongoing",
    suggestedMetrics: [
      "Total volunteer hours",
      "Number of active volunteers",
      "Retention rate",
    ],
  },
  {
    id: "std_volunteer_event",
    category: "Volunteer",
    name: "Event Volunteering",
    description: "Volunteer coordination for specific events",
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "calendar",
    color: "#FF8E53",
    isSystemTemplate: true,
    defaultTasks: [
      "Define volunteer roles",
      "Recruit event volunteers",
      "Coordinate on event day",
      "Post-event feedback",
    ],
    requiredRoles: ["Event Coordinator", "Event Volunteer"],
    complexity: "Moderate",
    estimatedTimeframe: "Short-term",
    suggestedMetrics: [
      "Volunteers recruited",
      "No-show rate",
      "Event success rating",
    ],
  },

  // Fundraising Projects
  {
    id: "std_fundraising_campaign",
    category: "Fundraising",
    name: "Fundraising Campaign",
    description: "Organized fundraising initiative with specific goals",
    applicableGroupTypes: ["Nonprofit"],
    icon: "cash",
    color: "#4ECDC4",
    isSystemTemplate: true,
    defaultTasks: [
      "Set fundraising goal",
      "Develop campaign strategy",
      "Execute outreach",
      "Track donations",
      "Thank donors",
    ],
    requiredRoles: ["Campaign Manager", "Fundraising Team"],
    complexity: "Complex",
    estimatedTimeframe: "Medium-term",
    suggestedMetrics: [
      "Total funds raised",
      "Number of donors",
      "Cost per dollar raised",
      "Donor retention",
    ],
  },
  {
    id: "std_grant_application",
    category: "Fundraising",
    name: "Grant Application",
    description: "Research and application process for grants",
    applicableGroupTypes: ["Nonprofit"],
    icon: "document-text",
    color: "#45B7D1",
    isSystemTemplate: true,
    defaultTasks: [
      "Research grant opportunities",
      "Prepare application materials",
      "Submit applications",
      "Follow up",
      "Report on usage",
    ],
    requiredRoles: ["Grant Writer", "Program Manager"],
    complexity: "Complex",
    estimatedTimeframe: "Medium-term",
    suggestedMetrics: [
      "Applications submitted",
      "Success rate",
      "Total grant funding",
      "Application time",
    ],
  },

  // Event Projects
  {
    id: "std_community_event",
    category: "Event",
    name: "Community Event",
    description: "Community gathering or celebration",
    applicableGroupTypes: ["Community", "Nonprofit"],
    icon: "people",
    color: "#96CEB4",
    isSystemTemplate: true,
    defaultTasks: [
      "Plan event details",
      "Secure venue",
      "Promote event",
      "Coordinate logistics",
      "Execute event",
      "Evaluate success",
    ],
    requiredRoles: ["Event Coordinator", "Volunteer"],
    complexity: "Moderate",
    estimatedTimeframe: "Short-term",
    suggestedMetrics: [
      "Attendance",
      "Participant satisfaction",
      "Budget vs actual",
      "Media coverage",
    ],
  },
  {
    id: "std_educational_workshop",
    category: "Event",
    name: "Educational Workshop",
    description: "Educational or training workshop",
    applicableGroupTypes: ["Nonprofit", "Community", "Business"],
    icon: "school",
    color: "#FFEAA7",
    isSystemTemplate: true,
    defaultTasks: [
      "Define learning objectives",
      "Develop curriculum",
      "Find facilitators",
      "Promote workshop",
      "Execute training",
      "Collect feedback",
    ],
    requiredRoles: ["Training Coordinator", "Facilitator", "Participant"],
    complexity: "Moderate",
    estimatedTimeframe: "Short-term",
    suggestedMetrics: [
      "Number of participants",
      "Learning outcomes achieved",
      "Satisfaction scores",
      "Follow-up engagement",
    ],
  },

  // Education Projects
  {
    id: "std_education_program",
    category: "Education",
    name: "Education Program",
    description: "Ongoing educational initiative or curriculum",
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "book",
    color: "#74B9FF",
    isSystemTemplate: true,
    defaultTasks: [
      "Develop curriculum",
      "Recruit educators",
      "Enroll participants",
      "Deliver sessions",
      "Assess progress",
      "Graduate participants",
    ],
    requiredRoles: ["Program Manager", "Educator", "Student"],
    complexity: "Complex",
    estimatedTimeframe: "Long-term",
    suggestedMetrics: [
      "Enrollment numbers",
      "Completion rate",
      "Learning outcomes",
      "Post-program employment/advancement",
    ],
  },

  // Outreach Projects
  {
    id: "std_community_outreach",
    category: "Outreach",
    name: "Community Outreach",
    description: "Engage and connect with community members",
    applicableGroupTypes: ["Nonprofit", "Community"],
    icon: "megaphone",
    color: "#FD79A8",
    isSystemTemplate: true,
    defaultTasks: [
      "Identify target communities",
      "Develop outreach materials",
      "Connect with community leaders",
      "Host information sessions",
      "Follow up with interested individuals",
    ],
    requiredRoles: ["Outreach Coordinator", "Community Liaison"],
    complexity: "Moderate",
    estimatedTimeframe: "Ongoing",
    suggestedMetrics: [
      "People reached",
      "Engagement rate",
      "New memberships/participants",
      "Geographic coverage",
    ],
  },

  // Research Projects
  {
    id: "std_research_study",
    category: "Research",
    name: "Research Study",
    description: "Data collection and analysis project",
    applicableGroupTypes: ["Nonprofit", "Business"],
    icon: "analytics",
    color: "#A29BFE",
    isSystemTemplate: true,
    defaultTasks: [
      "Define research questions",
      "Design methodology",
      "Collect data",
      "Analyze results",
      "Publish findings",
    ],
    requiredRoles: ["Research Lead", "Data Analyst", "Research Assistant"],
    complexity: "Complex",
    estimatedTimeframe: "Long-term",
    suggestedMetrics: [
      "Data points collected",
      "Research milestones",
      "Publications/reports",
      "Impact citations",
    ],
  },

  // Operations Projects
  {
    id: "std_operations_improvement",
    category: "Operations",
    name: "Operations Improvement",
    description: "Process improvement and efficiency initiatives",
    applicableGroupTypes: ["Nonprofit", "Business"],
    icon: "settings",
    color: "#636E72",
    isSystemTemplate: true,
    defaultTasks: [
      "Assess current processes",
      "Identify improvement opportunities",
      "Design new processes",
      "Implement changes",
      "Monitor effectiveness",
    ],
    requiredRoles: ["Operations Manager", "Process Analyst"],
    complexity: "Moderate",
    estimatedTimeframe: "Medium-term",
    suggestedMetrics: [
      "Process efficiency gains",
      "Cost savings",
      "Time reductions",
      "Quality improvements",
    ],
  },

  // Marketing Projects
  {
    id: "std_marketing_campaign",
    category: "Marketing",
    name: "Marketing Campaign",
    description: "Promotional campaign for awareness or engagement",
    applicableGroupTypes: ["Nonprofit", "Business", "Community"],
    icon: "trending-up",
    color: "#00B894",
    isSystemTemplate: true,
    defaultTasks: [
      "Define target audience",
      "Develop messaging",
      "Create marketing materials",
      "Execute campaign",
      "Measure results",
    ],
    requiredRoles: [
      "Marketing Manager",
      "Content Creator",
      "Social Media Coordinator",
    ],
    complexity: "Moderate",
    estimatedTimeframe: "Short-term",
    suggestedMetrics: [
      "Reach",
      "Engagement rate",
      "Conversion rate",
      "Brand awareness lift",
    ],
  },

  // Technology Projects
  {
    id: "std_technology_implementation",
    category: "Technology",
    name: "Technology Implementation",
    description: "Implementation of new technology systems or tools",
    applicableGroupTypes: ["Nonprofit", "Business"],
    icon: "laptop",
    color: "#0984E3",
    isSystemTemplate: true,
    defaultTasks: [
      "Assess requirements",
      "Research solutions",
      "Plan implementation",
      "Deploy technology",
      "Train users",
      "Monitor adoption",
    ],
    requiredRoles: ["IT Manager", "System Administrator", "End User"],
    complexity: "Complex",
    estimatedTimeframe: "Medium-term",
    suggestedMetrics: [
      "Implementation milestones",
      "User adoption rate",
      "System uptime",
      "User satisfaction",
    ],
  },

  // General Projects
  {
    id: "std_general_initiative",
    category: "General",
    name: "General Initiative",
    description: "Flexible project template for various initiatives",
    applicableGroupTypes: ["Nonprofit", "Business", "Community", "Government"],
    icon: "flag",
    color: "#2D3436",
    isSystemTemplate: true,
    defaultTasks: [
      "Define project scope",
      "Identify stakeholders",
      "Create project plan",
      "Execute activities",
      "Monitor progress",
      "Evaluate outcomes",
    ],
    requiredRoles: ["Project Manager", "Team Member"],
    complexity: "Moderate",
    estimatedTimeframe: "Medium-term",
    suggestedMetrics: [
      "Project milestones",
      "Budget utilization",
      "Stakeholder satisfaction",
      "Goal achievement",
    ],
  },
];

export const STANDARD_PROJECT_CATEGORIES_INFO = {
  Volunteer: {
    description:
      "Projects focused on volunteer recruitment, coordination, and management",
    icon: "heart",
    color: "#FF6B6B",
  },
  Fundraising: {
    description:
      "Projects aimed at raising funds and securing financial resources",
    icon: "cash",
    color: "#4ECDC4",
  },
  Event: {
    description:
      "Projects for organizing and executing events, workshops, and gatherings",
    icon: "calendar",
    color: "#96CEB4",
  },
  Education: {
    description:
      "Projects focused on educational programs and learning initiatives",
    icon: "school",
    color: "#74B9FF",
  },
  Outreach: {
    description: "Projects for community engagement and relationship building",
    icon: "megaphone",
    color: "#FD79A8",
  },
  Research: {
    description:
      "Projects involving data collection, analysis, and research studies",
    icon: "analytics",
    color: "#A29BFE",
  },
  Operations: {
    description: "Projects for improving processes and operational efficiency",
    icon: "settings",
    color: "#636E72",
  },
  Marketing: {
    description: "Projects for promotion, awareness, and marketing campaigns",
    icon: "trending-up",
    color: "#00B894",
  },
  Technology: {
    description:
      "Projects involving technology implementation and digital solutions",
    icon: "laptop",
    color: "#0984E3",
  },
  General: {
    description: "Flexible projects that don't fit into specific categories",
    icon: "flag",
    color: "#2D3436",
  },
};
