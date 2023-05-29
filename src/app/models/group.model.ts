import {Timestamp} from "firebase/firestore";

export interface Group {
  createdAt: Timestamp; // When the group was added
  createdBy: string; // User ID of the user who created the group
  description: string; // Description of group
  groupPicture: string; // base64 string
  id: string; // Firestore document ID
  lastModifiedAt: Timestamp; // When the group document was last modified
  lastModifiedBy: string; // User ID of the user who last modified the group
  lastModifiedByDisplayName: string; // Display name of the user who last modified the group
  name: string; // Name of group
  // Other properties...
}
