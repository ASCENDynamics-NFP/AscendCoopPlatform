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
import {Observable} from "rxjs";
import {
  FirebaseFunctionsService,
  CreateGroupChatRequest,
  AddUserToChatRequest,
  RemoveUserFromChatRequest,
  PaginatedMessagesRequest,
  PaginatedMessagesResponse,
  GetUserChatsRequest,
  SearchMessagesRequest,
} from "../../../core/services/firebase-functions.service";

@Injectable({
  providedIn: "root",
})
export class ChatFunctionsService {
  constructor(private firebaseFunctions: FirebaseFunctionsService) {}

  /**
   * Create a new group chat
   * @param data Group chat creation data
   * @returns Observable of the created group chat
   */
  createGroupChat(data: CreateGroupChatRequest): Observable<any> {
    return this.firebaseFunctions.createGroupChat(data);
  }

  /**
   * Add a user to an existing chat
   * @param data Data for adding user to chat
   * @returns Observable of the operation result
   */
  addUserToChat(data: AddUserToChatRequest): Observable<any> {
    return this.firebaseFunctions.addUserToChat(data);
  }

  /**
   * Remove a user from a chat
   * @param data Data for removing user from chat
   * @returns Observable of the operation result
   */
  removeUserFromChat(data: RemoveUserFromChatRequest): Observable<any> {
    return this.firebaseFunctions.removeUserFromChat(data);
  }

  /**
   * Get paginated messages for a chat
   * @param data Pagination request data
   * @returns Observable of paginated messages
   */
  getMessages(
    data: PaginatedMessagesRequest,
  ): Observable<PaginatedMessagesResponse> {
    return this.firebaseFunctions.getMessages(data);
  }

  /**
   * Get user's chats
   * @param data Request data for getting user chats
   * @returns Observable of user's chats
   */
  getUserChats(data: GetUserChatsRequest): Observable<any> {
    return this.firebaseFunctions.getUserChats(data);
  }

  /**
   * Search messages in chats
   * @param data Search request data
   * @returns Observable of search results
   */
  searchMessages(data: SearchMessagesRequest): Observable<any> {
    return this.firebaseFunctions.searchMessages(data);
  }

  // Convenience methods with common parameter patterns

  /**
   * Create a private chat between two users
   * @param accountId Current account ID
   * @param otherUserId The other user's ID
   * @param name Optional chat name
   * @returns Observable of the created chat
   */
  createPrivateChat(
    accountId: string,
    otherUserId: string,
    name?: string,
  ): Observable<any> {
    return this.createGroupChat({
      name: name || "Private Chat",
      memberIds: [otherUserId],
      accountId,
      isPrivate: true,
    });
  }

  /**
   * Create a public group chat
   * @param accountId Current account ID
   * @param name Chat name
   * @param description Optional chat description
   * @param memberIds Array of member IDs to add
   * @returns Observable of the created chat
   */
  createPublicGroupChat(
    accountId: string,
    name: string,
    description: string,
    memberIds: string[],
  ): Observable<any> {
    return this.createGroupChat({
      name,
      description,
      memberIds,
      accountId,
      isPrivate: false,
    });
  }

  /**
   * Get recent messages for a chat (most recent first)
   * @param chatId Chat ID
   * @param accountId Account ID
   * @param limit Number of messages to retrieve (default: 20)
   * @returns Observable of recent messages
   */
  getRecentMessages(
    chatId: string,
    accountId: string,
    limit: number = 20,
  ): Observable<PaginatedMessagesResponse> {
    return this.getMessages({
      chatId,
      accountId,
      limit,
    });
  }

  /**
   * Get messages before a specific message (for pagination)
   * @param chatId Chat ID
   * @param accountId Account ID
   * @param beforeMessageId ID of the message to paginate before
   * @param limit Number of messages to retrieve (default: 20)
   * @returns Observable of messages before the specified message
   */
  getMessagesBefore(
    chatId: string,
    accountId: string,
    beforeMessageId: string,
    limit: number = 20,
  ): Observable<PaginatedMessagesResponse> {
    return this.getMessages({
      chatId,
      accountId,
      before: beforeMessageId,
      limit,
    });
  }

  /**
   * Get messages after a specific message (for loading new messages)
   * @param chatId Chat ID
   * @param accountId Account ID
   * @param afterMessageId ID of the message to get newer messages after
   * @param limit Number of messages to retrieve (default: 20)
   * @returns Observable of messages after the specified message
   */
  getMessagesAfter(
    chatId: string,
    accountId: string,
    afterMessageId: string,
    limit: number = 20,
  ): Observable<PaginatedMessagesResponse> {
    return this.getMessages({
      chatId,
      accountId,
      after: afterMessageId,
      limit,
    });
  }

  /**
   * Search messages within a specific chat
   * @param chatId Chat ID to search within
   * @param accountId Account ID
   * @param query Search query
   * @param limit Number of results to return (default: 10)
   * @returns Observable of search results
   */
  searchMessagesInChat(
    chatId: string,
    accountId: string,
    query: string,
    limit: number = 10,
  ): Observable<any> {
    return this.searchMessages({
      accountId,
      query,
      chatId,
      limit,
    });
  }

  /**
   * Search messages across all user's chats
   * @param accountId Account ID
   * @param query Search query
   * @param limit Number of results to return (default: 10)
   * @returns Observable of search results
   */
  searchAllMessages(
    accountId: string,
    query: string,
    limit: number = 10,
  ): Observable<any> {
    return this.searchMessages({
      accountId,
      query,
      limit,
    });
  }
}
