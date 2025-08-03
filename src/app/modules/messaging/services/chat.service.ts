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
import {Observable, from, throwError, BehaviorSubject} from "rxjs";
import {map, switchMap, catchError} from "rxjs/operators";
import firebase from "firebase/compat/app";
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
  ) {}

  // TODO: Replace with actual auth service integration
  private getCurrentUserId(): string {
    // For now, using a placeholder - this should be replaced with actual auth
    return "current-user-id";
  }

  /**
   * Get user's chats with real-time updates
   */
  getUserChats(): Observable<Chat[]> {
    const userId = this.getCurrentUserId();
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
   * Create a new chat
   */
  createChat(request: CreateChatRequest): Observable<string> {
    const userId = this.getCurrentUserId();

    // Ensure current user is in participants
    if (!request.participants.includes(userId)) {
      request.participants.push(userId);
    }

    const chatData: Partial<Chat> = {
      participants: request.participants,
      isGroup: request.isGroup || false,
      name: request.name,
      createdBy: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp() as any,
      lastModifiedAt: firebase.firestore.FieldValue.serverTimestamp() as any,
    };

    return from(
      this.firestore.collection(this.CHATS_COLLECTION).add(chatData),
    ).pipe(
      map((docRef) => docRef.id),
      catchError((error) => {
        console.error("Error creating chat:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Send a message in a chat
   */
  sendMessage(request: SendMessageRequest): Observable<string> {
    const currentUserId = this.getCurrentUserId();
    const messageData: Partial<Message> = {
      senderId: currentUserId,
      text: request.text,
      type: request.type || MessageType.TEXT,
      status: MessageStatus.SENT,
      timestamp: firebase.firestore.FieldValue.serverTimestamp() as any,
      fileUrl: request.fileUrl,
      fileName: request.fileName,
      fileSize: request.fileSize,
      fileType: request.fileType,
    };

    const messagesRef = this.firestore.collection(
      `${this.CHATS_COLLECTION}/${request.chatId}/${this.MESSAGES_COLLECTION}`,
    );

    return from(messagesRef.add(messageData)).pipe(
      switchMap((docRef) => {
        // Update chat metadata
        const chatUpdateData = {
          lastMessage: request.text,
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
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return uploadTask.snapshotChanges().pipe(
      switchMap(() => fileRef.getDownloadURL()),
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
   */
  searchUsers(searchTerm: string): Observable<any[]> {
    // TODO: Implement user search logic based on your user collection structure
    // This is a placeholder implementation
    return from([]).pipe(
      catchError((error) => {
        console.error("Error searching users:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Get chat participants info
   */
  getChatParticipants(participantIds: string[]): Observable<any[]> {
    // TODO: Implement participant info fetching based on your user collection structure
    // This is a placeholder implementation
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
   * Find existing chat between users
   */
  findExistingChat(participantIds: string[]): Observable<Chat | null> {
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
          console.error("Error finding existing chat:", error);
          return throwError(() => error);
        }),
      );
  }
}
