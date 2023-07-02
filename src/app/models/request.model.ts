import {Timestamp} from "firebase/firestore";

export interface AppRequest {
  createdAt: Timestamp | null; // When the user was added
  createdBy: string | null; // User ID of the user who created the user document
  id: string | null; // The ID of the request
  senderId: string; // The user or group who initiated the request (user-id or group-id)
  receiverId: string; // The user or group the request is directed to (user-id or group-id)
  type: string; // The type of request (friend, group, etc.)
  status: string; // The status of the request (pending, accepted, rejected)
  name: string; // The display name of who initiated the request
  image: string; // The display image of who initiated the request
  description: string; // The display short description of who initiated the request
  lastModifiedAt: Timestamp | null; // When the user document was last modified
  lastModifiedBy: string | null; // User ID of the user who last modified the user document
}
