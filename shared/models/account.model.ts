/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {BaseDocument} from "./base-document";
import {GeoPoint, Timestamp} from "firebase/firestore";
import {GroupRole} from "./group-role.model";

// Define a type for optional and nullable fields
type Nullable<T> = T | null;

// Address interface with optional fields
export interface Address {
  name?: Nullable<string>;
  street?: Nullable<string>;
  city?: Nullable<string>;
  state?: Nullable<string>;
  zipcode?: Nullable<string>;
  country?: Nullable<string>;
  formatted?: Nullable<string>;
  geopoint?: Nullable<GeoPoint>; // Use Firebase GeoPoint
  isPrimaryAddress?: Nullable<boolean>;
  remote?: Nullable<boolean>;
}

// PhoneNumber interface with nullable fields
export interface PhoneNumber {
  countryCode: Nullable<string>;
  number: Nullable<string>;
  type: Nullable<string>;
  isEmergencyNumber: Nullable<boolean>;
}

interface UserSpecific {
  dateOfBirth?: Timestamp;
  firstName?: string;
  lastName?: string;
  username?: string;
  hobbiesAndInterests?: string[];
}

interface GroupSpecific {
  dateFounded?: Timestamp;
  supportedLanguages?: string[];
  groupType?: string;
  groupObjectivesMissionStatement?: string;
  groupHistoryBackground?: string;
  /** Public Google Calendar embed or share URL */
  googleCalendarUrl?: string;
  // faqs?: string[]; // Optional, for common queries related to the group
}

interface LegalAgreement {
  accepted: boolean;
  datetime: Timestamp;
  version: string;
}

interface LegalAgreements {
  termsOfService: LegalAgreement;
  privacyPolicy: LegalAgreement;
}

export interface Email {
  name: Nullable<string>;
  email: Nullable<string>;
}

export interface ContactInformation {
  privacy?: "public" | "private" | "specific-users"; // Privacy setting
  addresses?: Nullable<Address>[];
  phoneNumbers: PhoneNumber[];
  emails: Email[];
  preferredMethodOfContact: "Email" | "Phone" | "SMS" | "Fax";
}

interface Accessibility {
  preferredLanguage?: string;
  accessibilityNeeds?: string[];
}

export interface ProfessionalInformation {
  occupation: string;
  employerName?: string;
  workExperience?: string;
  skillsAndExpertise?: string[];
  currentJobTitle?: string;
  linkedInProfile?: string;
  /**
   * Local resume file selected by the user or the resulting download URL
   * after the file has been uploaded to Firebase Storage.
   */
  resumeUpload?: File | string | null;
  educationalBackground?: string;
}

export interface VolunteerPreferences {
  areasOfInterest: string[];
  availability: "Weekdays" | "Weekends" | "Evenings";
  preferredVolunteerRoles: string[];
  previousVolunteerExperience?: string;
  willingnessToTravel?: boolean;
  desiredLevelOfCommitment: "One-time" | "Occasional" | "Regular";
}

export interface MutualAidCommunityEngagement {
  servicesOffered: string[];
  servicesNeeded?: string[];
  communityAffiliations: string[];
  willingnessToProvideMentorship?: boolean;
  interestInReceivingMentorship?: boolean;
  groupsOrForumsParticipation?: string[];
}

interface LaborRights {
  unionMembership: "Yes" | "No" | "Prefer not to say";
  workplaceConcerns?: string[];
  preferredAdvocacyAreas?: string[];
  experienceWithLaborRightsIssues?: string;
}

export interface WebLink {
  name: string; // e.g., "LinkedIn", "Personal Blog", "Portfolio"
  url: string; // The actual URL
  category:
    | "Social Media"
    | "Donation"
    | "Hobbies"
    | "Publications"
    | "Portfolio"
    | "Personal Website"
    | "External Resources"
    | "Other";
}

interface GroupCategory {
  primaryCategory: string; // e.g., "Education", "Health"
  secondaryCategories?: string[]; // Optional, e.g., ["Advocacy", "Community Service"]
  tagsKeywords?: string[]; // Optional, for search and categorization
}

export interface Event {
  /** Unique identifier for the event */
  id?: string;
  /** Event title */
  title: string;
  /** Detailed description of the event */
  description?: string;
  /** Event start date and time */
  startDate: Timestamp;
  /** Event end date and time */
  endDate: Timestamp;
  /** Physical or virtual location */
  location?: Address | string;
  /** Organizer account ID */
  organizerId?: string;
  /** List of attendee account IDs */
  attendeeIds?: string[];
  /** Maximum number of attendees */
  capacity?: number;
  /** Optional image representing the event */
  imageUrl?: string;
  /** Whether the event is held online */
  isOnline?: boolean;
  /** Link to external registration or RSVP form */
  registrationUrl?: string;
  /** Tags used for search and categorisation */
  tags?: string[];
  /** Contact information for inquiries */
  contactInformation?: ContactInformation;
  /** Record creation timestamp */
  createdAt?: Timestamp;
  /** Record update timestamp */
  updatedAt?: Timestamp;
}

interface User {
  userDetails?: UserSpecific; // User-specific details
  accessibility?: Accessibility; // Accessibility and language preferences
  professionalInformation?: ProfessionalInformation; // Professional information and work experience
  volunteerPreferences?: VolunteerPreferences; // Volunteer preferences and experience
  mutualAidCommunityEngagement?: MutualAidCommunityEngagement; // Mutual aid, community engagement, and mentorship
  laborRights?: LaborRights; // Labor rights and advocacy
}

interface Group {
  groupDetails?: GroupSpecific; // Group-specific details
  groupCategoriesInterests?: GroupCategory;
  groupActivitiesEvents?: {
    // Optional, can be added later
    regularMeetingSchedule?: string; // Optional, e.g., "Every Tuesday at 6 PM"
    upcomingEvents?: Event[]; // Optional, can be added later
    pastEvents?: Event[]; // Optional, can be added later
  };
  administrativeSettings?: {
    // Optional, can be added later
    groupAdminsManagers: string[]; // Assign initial administrators or managers for the group
    notificationPreferences?: string; // e.g., "Email notifications for new posts, member requests"
  };
  /**
   * Custom roles that can be assigned to related accounts
   */
  roles?: GroupRole[];
}

export interface Account extends BaseDocument, Group, User {
  privacy:
    | "public"
    | "accepted-users-only"
    | "accepted-groups-only"
    | "private"; // Privacy setting
  type: "user" | "group";
  name: string;
  tagline: string;
  description: string;
  iconImage: string;
  heroImage: string;
  legalAgreements: LegalAgreements; // Legal agreements, such as terms of service and privacy policy
  contactInformation?: ContactInformation; // Contact information and address
  webLinks: WebLink[]; // Links to social media, personal websites, etc.
  lastLoginAt: Timestamp;
  email: string;
  /**
   * Total volunteer hours logged for this account
   */
  totalHours?: number;
  settings?: Settings; // User-specific settings
}

export interface RelatedAccount extends BaseDocument {
  id: string; // Required
  accountId: string; // Reference to the parent account
  name?: string; // Name of the related user or group
  iconImage?: string; // URL or path to the icon image
  tagline?: string; // Tagline or short description
  type?: "user" | "group"; // Type of the related account
  status?: "pending" | "accepted" | "rejected" | "blocked"; // Relationship status
  relationship?:
    | "admin"
    | "friend"
    | "member"
    | "partner"
    | "family"
    | "parent"
    | "child"
    | "boss"
    | "employee"
    | "volunteer"
    | "sibling"
    | "parent-org"
    | "child-org"
    | "external"; // Details about the relationship (e.g., 'friend', 'member')
  /**
   * Built-in access level within a group
   */
  access?: "admin" | "moderator" | "member";
  /**
   * Optional custom role name
   */
  role?: string;
  /**
   * Reference to a custom group role defined in the parent group
   */
  roleId?: string;
  initiatorId?: string; // ID of the account who initiated the request
  targetId?: string; // ID of the account who received the request
  canAccessContactInfo?: boolean; // Whether the related account can access the contact information
}

export interface Settings {
  // Settings for the account
  notifications?: {
    // Notification settings
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    // Privacy settings
    profileVisibility?: "public" | "private" | "accepted-users-only";
    contactInformation?: "public" | "private" | "accepted-users-only";
    // Add more privacy settings as needed
  };
  language: string;
  theme: "light" | "dark" | "system";
}
