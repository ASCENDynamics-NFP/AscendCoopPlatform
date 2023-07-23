import {Timestamp} from "firebase/firestore";

export interface AppUser {
  id: string; // User ID
  lastLoginAt: Timestamp; // When the user last logged in
  lastModifiedAt: Timestamp; // When the user document was last modified
  lastModifiedBy: string; // User ID of the user who last modified the user document
  createdAt: Timestamp; // When the user was added
  createdBy: string; // User ID of the user who created the user document
  bio: string; // Short bio
  tagline: string; // Tagline
  displayName: string; // Full name
  email: string; // Email address
  emailVerified: boolean; // Whether the user's email is verified
  name: string; // First and last name
  profilePicture: string; // base64 string
  locale: string; // User's locale
  language: string; // User's language
  friends: string[]; // Array of user IDs of the user's friends
  pendingFriends: string[]; // Array of user IDs of the user's pending friends
  groups: string[]; // Array of group IDs of the groups the user belongs to
  pendingGroups: string[]; // Array of group IDs of the groups the user has requested to join
  // Other properties...
}
