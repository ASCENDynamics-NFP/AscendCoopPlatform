import {Timestamp} from "firebase/firestore";

export interface User {
  id: string | null; // Firestore document ID
  bio: string | null; // Short bio
  createdAt: Timestamp; // When the user was added
  email: string; // Email address
  lastLoginAt: Timestamp | null; // When the user last logged in
  lastModifiedAt: Timestamp | null; // When the user document was last modified
  lastModifiedBy: string | null; // User ID of the user who last modified the user document
  name: string; // First and last name
  profilePicture: string | null; // base64 string
  uid: string | null; // The user's Firebase Authentication UID
  // Other properties...
}
