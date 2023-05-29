import {Timestamp} from "firebase/firestore";

export interface User {
  id: string; // Firestore document ID
  bio: string; // Short bio
  createdAt: Timestamp; // When the user was added
  email: string; // Email address
  lastLoginAt: Timestamp; // When the user last logged in
  lastModifiedAt: Timestamp; // When the user document was last modified
  lastModifiedBy: string; // User ID of the user who last modified the user document
  name: string; // First and last name
  profilePicture: string; // base64 string
  uid: string; // The user's Firebase Authentication UID
  // Other properties...
}
