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
import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Observable, from, throwError, of} from "rxjs";
import {map, switchMap, catchError, take} from "rxjs/operators";
import firebase from "firebase/compat/app";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";
import {
  Chat,
  Message,
  MessageType,
  MessageStatus,
  CreateChatRequest,
  SendMessageRequest,
} from "../models/chat.model";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private readonly CHATS_COLLECTION = "chats";
  private readonly MESSAGES_COLLECTION = "messages";
  private readonly STORAGE_PATH = "chatMedia";

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private store: Store<{auth: AuthState}>,
  ) {}

  private getCurrentUserId(): Observable<string> {
    return this.store.select(selectAuthUser).pipe(
      map((user) => user?.uid || ""),
      take(1),
    );
  }

  private getCurrentUserIdSync(): string {
    let currentUserId = "";
    this.store
      .select(selectAuthUser)
      .pipe(take(1))
      .subscribe((user) => {
        currentUserId = user?.uid || "";
      });
    return currentUserId;
  }

  /**
   * Get user's chats with real-time updates
   */
  getUserChats(): Observable<Chat[]> {
    const userId = this.getCurrentUserIdSync();
    return this.firestore
      .collection<any>(this.CHATS_COLLECTION, (ref) =>
        ref
          .where("participants", "array-contains", userId)
          .orderBy("lastMessageTimestamp", "desc"),
      )
      .valueChanges({idField: "id"})
      .pipe(
        map((chats: any[]) => chats as Chat[]),
        catchError((error) => {
          console.error("Error fetching user chats:", error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Get a specific chat by ID with real-time updates
   */
  getChat(chatId: string): Observable<Chat | null> {
    return this.firestore
      .collection<any>(this.CHATS_COLLECTION)
      .doc(chatId)
      .valueChanges({idField: "id"})
      .pipe(
        map((chat: any) => (chat as Chat) || null),
        catchError((error) => {
          console.error("Error fetching chat:", error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Get messages for a chat with real-time updates
   */
  getChatMessages(
    chatId: string,
    limitCount: number = 50,
  ): Observable<Message[]> {
    return this.firestore
      .collection<Message>(
        `${this.CHATS_COLLECTION}/${chatId}/${this.MESSAGES_COLLECTION}`,
        (ref) => ref.orderBy("timestamp", "desc").limit(limitCount),
      )
      .valueChanges({idField: "id"})
      .pipe(
        map(
          (messages) =>
            messages
              .map((message) => ({
                ...message,
                timestamp: message.timestamp || new Date(),
              }))
              .reverse(), // Reverse to show oldest first
        ),
        catchError((error) => {
          console.error("Error fetching chat messages:", error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Create a new chat (direct or group)
   */
  createChat(request: CreateChatRequest): Observable<string> {
    return from(this.createChatInternal(request));
  }

  /**
   * Create a new chat (internal implementation)
   */
  async createChatInternal(request: CreateChatRequest): Promise<string> {
    const chatData: Partial<Chat> = {
      participants: request.participants,
      isGroup: request.isGroup,
      createdAt: firebase.firestore.FieldValue.serverTimestamp() as any,
      lastMessage: "",
      lastMessageTimestamp:
        firebase.firestore.FieldValue.serverTimestamp() as any,
    };

    // Add group-specific fields if it's a group chat
    if (request.isGroup && request.name) {
      chatData.name = request.name;
      chatData.groupName = request.name; // For compatibility
    }

    try {
      const docRef = await this.firestore.collection("chats").add(chatData);
      if (docRef?.id) {
        return docRef.id;
      } else {
        throw new Error("Failed to create chat: No document ID returned");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  }

  /**
   * Send a message in a chat
   */
  sendMessage(request: SendMessageRequest): Observable<string> {
    const currentUserId = this.getCurrentUserIdSync();
    const messageData: Partial<Message> = {
      senderId: currentUserId,
      text: request.text || "", // Ensure text is never undefined
      type: request.type || MessageType.TEXT,
      status: MessageStatus.SENT,
      timestamp: firebase.firestore.FieldValue.serverTimestamp() as any,
    };

    // Only include file-related fields if they have values
    if (request.fileUrl) {
      messageData.fileUrl = request.fileUrl;
    }
    if (request.fileName) {
      messageData.fileName = request.fileName;
    }
    if (request.fileSize) {
      messageData.fileSize = request.fileSize;
    }
    if (request.fileType) {
      messageData.fileType = request.fileType;
    }

    const messagesRef = this.firestore.collection(
      `${this.CHATS_COLLECTION}/${request.chatId}/${this.MESSAGES_COLLECTION}`,
    );

    return from(messagesRef.add(messageData)).pipe(
      switchMap((docRef) => {
        // Update chat metadata
        const lastMessageText =
          request.text ||
          (request.fileName ? `📎 ${request.fileName}` : "File attachment");
        const chatUpdateData = {
          lastMessage: lastMessageText,
          lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
          lastModifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        return from(
          this.firestore
            .collection(this.CHATS_COLLECTION)
            .doc(request.chatId)
            .update(chatUpdateData),
        ).pipe(map(() => docRef.id));
      }),
      catchError((error) => {
        console.error("Error sending message:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Upload a file for chat
   */
  uploadFile(file: File, chatId: string): Observable<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${this.STORAGE_PATH}/${chatId}/${fileName}`;
    const uploadTask = this.storage.upload(filePath, file);

    return from(uploadTask).pipe(
      switchMap(() => this.storage.ref(filePath).getDownloadURL()),
      catchError((error) => {
        console.error("Error uploading file:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Mark messages as read
   */
  markMessagesAsRead(chatId: string, messageIds: string[]): Observable<void> {
    const batch = this.firestore.firestore.batch();
    const messagesRef = this.firestore.collection(
      `${this.CHATS_COLLECTION}/${chatId}/${this.MESSAGES_COLLECTION}`,
    );

    messageIds.forEach((messageId) => {
      const messageRef = messagesRef.doc(messageId).ref;
      batch.update(messageRef, {
        status: MessageStatus.READ,
        readAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });

    return from(batch.commit()).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error("Error marking messages as read:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Search users for creating new chats
   * Note: User search is handled by the relationship service and NgRx store
   */
  searchUsers(searchTerm: string): Observable<any[]> {
    // User search functionality is implemented via RelationshipService
    // and managed through NgRx store in the components
    return from([]).pipe(
      catchError((error) => {
        console.error("Error searching users:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Get chat participants info
   * Note: Participant info is managed through NgRx store account selectors
   */
  getChatParticipants(participantIds: string[]): Observable<any[]> {
    // Participant information is loaded via NgRx store account actions
    // and accessed through account selectors in components
    return from([]).pipe(
      catchError((error) => {
        console.error("Error fetching participants:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Delete a message
   */
  deleteMessage(chatId: string, messageId: string): Observable<void> {
    return from(
      this.firestore
        .collection(
          `${this.CHATS_COLLECTION}/${chatId}/${this.MESSAGES_COLLECTION}`,
        )
        .doc(messageId)
        .delete(),
    ).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error("Error deleting message:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Leave a chat
   */
  leaveChat(chatId: string, userId: string): Observable<void> {
    return from(
      this.firestore
        .collection(this.CHATS_COLLECTION)
        .doc(chatId)
        .update({
          participants: firebase.firestore.FieldValue.arrayRemove(userId),
          lastModifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }),
    ).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error("Error leaving chat:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Add participants to a group chat
   */
  addParticipants(chatId: string, participantIds: string[]): Observable<void> {
    return from(
      this.firestore
        .collection(this.CHATS_COLLECTION)
        .doc(chatId)
        .update({
          participants: firebase.firestore.FieldValue.arrayUnion(
            ...participantIds,
          ),
          lastModifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }),
    ).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error("Error adding participants:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Remove participants from a group chat
   */
  removeParticipants(
    chatId: string,
    participantIds: string[],
  ): Observable<void> {
    return from(
      this.firestore
        .collection(this.CHATS_COLLECTION)
        .doc(chatId)
        .update({
          participants: firebase.firestore.FieldValue.arrayRemove(
            ...participantIds,
          ),
          lastModifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }),
    ).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error("Error removing participants:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Update chat title/name (for group chats)
   */
  updateChatTitle(chatId: string, newTitle: string): Observable<void> {
    return from(
      this.firestore.collection(this.CHATS_COLLECTION).doc(chatId).update({
        name: newTitle,
        groupName: newTitle, // Update both fields for compatibility
        lastModifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    ).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error("Error updating chat title:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Update/edit a message
   */
  updateMessage(
    chatId: string,
    messageId: string,
    updatedContent: {text?: string; editedAt?: any},
  ): Observable<void> {
    const updateData = {
      ...updatedContent,
      editedAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastModifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    return from(
      this.firestore
        .collection(
          `${this.CHATS_COLLECTION}/${chatId}/${this.MESSAGES_COLLECTION}`,
        )
        .doc(messageId)
        .update(updateData),
    ).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error("Error updating message:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Find existing chat between users (works for both 1-on-1 and group chats)
   */
  findExistingChat(participantIds: string[]): Observable<Chat | null> {
    // Sort participant IDs to ensure consistent comparison
    const sortedParticipantIds = [...participantIds].sort();

    return this.firestore
      .collection<any>(this.CHATS_COLLECTION, (ref) =>
        ref.where("participants", "array-contains", participantIds[0]),
      )
      .valueChanges({idField: "id"})
      .pipe(
        map((chats: any[]) => {
          // Filter to find exact participant match
          const exactMatch = chats.find((chat: Chat) => {
            const chatParticipants = [...chat.participants].sort();
            return (
              chatParticipants.length === sortedParticipantIds.length &&
              chatParticipants.every(
                (id, index) => id === sortedParticipantIds[index],
              )
            );
          });
          return exactMatch ? (exactMatch as Chat) : null;
        }),
        catchError((error) => {
          console.error("Error finding existing chat:", error);
          return of(null);
        }),
      );
  }

  /**
   * Find existing 1-on-1 chat between two users (legacy method for backward compatibility)
   */
  findExistingDirectChat(participantIds: string[]): Observable<Chat | null> {
    if (participantIds.length !== 2) {
      return throwError(
        () => new Error("This method is only for 1-on-1 chats"),
      );
    }

    return this.firestore
      .collection<any>(this.CHATS_COLLECTION, (ref) =>
        ref
          .where("participants", "==", participantIds)
          .where("isGroup", "==", false)
          .limit(1),
      )
      .valueChanges({idField: "id"})
      .pipe(
        map((chats: any[]) => (chats.length > 0 ? (chats[0] as Chat) : null)),
        catchError((error) => {
          console.error("Error finding existing direct chat:", error);
          return of(null);
        }),
      );
  }
}
