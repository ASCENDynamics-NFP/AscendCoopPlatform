import {Timestamp} from "firebase/firestore";

export interface User {
  bio: string | null; // Short bio
  createdAt: Timestamp; // When the user was added
  displayName: string | null; // Full name
  email: string; // Email address
  emailVerified: boolean; // Whether the user's email is verified
  lastLoginAt: Timestamp | null; // When the user last logged in
  lastModifiedAt: Timestamp | null; // When the user document was last modified
  lastModifiedBy: string | null; // User ID of the user who last modified the user document
  name: string; // First and last name
  profilePicture: string | null; // base64 string
  uid: string | null; // Firebase User ID
  // Other properties...
}
