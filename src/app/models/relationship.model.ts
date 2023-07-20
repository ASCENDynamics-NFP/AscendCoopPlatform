import {Timestamp} from "firebase/firestore";

export interface AppRelationship {
  createdAt: Timestamp; // When the user was added
  createdBy: string; // User ID of the user who created the user document
  id: string | null; // The ID of the request
  senderId: string; // The user or group who initiated the request (user-id or group-id)
  receiverId: string; // The user or group the request is directed to (user-id or group-id)
  type: string; // The type of request (friend, group, etc.)
  status: string; // The status of the request (pending, accepted, rejected)
  membershipRole: string; // The role of the user in the group (admin, member, etc.)
  receiverRelationship: string; // The relationship of the receiver to the sender ('mother', 'sibling', 'parent', 'child', 'external', etc.)
  senderRelationship: string; // The relationship of the sender to the receiver ('mother', 'sibling', 'parent', 'child', 'external', etc.)
  senderName: string; // The display name of who initiated the request
  senderImage: string; // The display image of who initiated the request
  senderTagline: string; // The display tagline of who initiated the request
  receiverName: string; // The display name of who the request is directed to
  receiverImage: string; // The display image of who the request is directed to
  receiverTagline: string; // The display tagline of who the request is directed to
  lastModifiedAt: Timestamp; // When the user document was last modified
  lastModifiedBy: string; // User ID of the user who last modified the user document
}
