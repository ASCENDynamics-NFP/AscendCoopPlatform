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
import {Timestamp, FieldValue} from "firebase/firestore";

// Base type for common fields (copied from shared for now)
export interface BaseDocument {
  id: string; // Firestore document ID
  createdAt?: Timestamp | FieldValue;
  createdBy?: string;
  lastModifiedAt?: Timestamp | FieldValue;
  lastModifiedBy?: string;
}

export interface Chat extends BaseDocument {
  participants: string[]; // Array of user UIDs
  isGroup: boolean; // true for group chats, false for 1-on-1
  name?: string; // Group name (for group chats) or custom name
  groupName?: string; // Alternative field for group name
  lastMessage?: string; // Content of the last message
  lastMessageTimestamp?: Timestamp | FieldValue; // When the last message was sent
  lastMessageSender?: string; // UID of who sent the last message
  lastMessageSenderName?: string; // Display name of last message sender
  unreadCount?: {[userId: string]: number}; // Per-user unread message count
}

export interface Message extends BaseDocument {
  senderId: string; // UID of the message sender
  senderName?: string; // Display name of sender (for caching)
  text?: string; // Message text content (for text messages)
  fileUrl?: string; // Download URL for media/file messages
  fileName?: string; // Original filename for file messages
  fileType?: string; // MIME type of the file
  fileSize?: number; // File size in bytes
  timestamp: Timestamp | FieldValue; // Server timestamp
  type: MessageType; // Type of message
  status?: MessageStatus; // Message delivery status
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  VIDEO = "video",
  AUDIO = "audio",
  SYSTEM = "system", // For system messages like "X joined the chat"
}

export enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

// For creating new chats
export interface CreateChatRequest {
  participants: string[];
  isGroup: boolean;
  name?: string;
}

// For sending messages
export interface SendMessageRequest {
  chatId: string;
  text?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  type: MessageType;
}
