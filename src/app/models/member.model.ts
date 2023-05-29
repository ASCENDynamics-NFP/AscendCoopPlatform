import {Timestamp} from "firebase/firestore";

export interface Member {
  id: string; // Firestore document ID
  groupId: string; // group id
  groupName: string; // group name
  joinedAt: Timestamp; // When the user joined (Firestore timestamp)
  userProfilePicture: string; // base64 string
  userId: string; // Firestore document ID
  userName: string; // First and last name
  userRole: string; // 'admin' | 'editor' | 'subscriber' | 'volunteer' | 'member' | 'reporter'
  // Other properties...
}
