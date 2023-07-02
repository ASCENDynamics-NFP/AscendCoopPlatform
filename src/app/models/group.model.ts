import {Timestamp} from "firebase/firestore";

export interface Group {
  createdAt: Timestamp; // When the group was added
  createdBy: string | null; // User ID of the user who created the group
  description: string | null; // Description of group
  groupPicture: string | null; // base64 string
  id: string | null; // Firestore document ID
  lastModifiedAt: Timestamp | null; // When the group document was last modified
  lastModifiedBy: string | null; // User ID of the user who last modified the group
  // lastModifiedByDisplayName: string | null; // Display name of the user who last modified the group
  name: string; // Name of group
  // Other properties...
}
