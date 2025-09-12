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
// src/app/core/services/firebase-functions.service.ts

import {Injectable} from "@angular/core";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {Observable, from, throwError} from "rxjs";
import {map, catchError, switchMap, take} from "rxjs/operators";
import {getAuth} from "firebase/auth";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";

// Types for callable functions
export interface CreateAccountRequest {
  type: "user" | "group";
  name: string;
  tagline?: string;
  contactInformation?: {
    emails?: Array<{email: string; type?: string}>;
    phoneNumbers?: Array<{number: string; type?: string}>;
    addresses?: Array<{
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    }>;
  };
  iconImage?: string;
  heroImage?: string;
}

export interface UpdateAccountRequest {
  accountId: string;
  updates: Partial<CreateAccountRequest>;
}

export interface CreateListingRequest {
  title: string;
  organization: string;
  description: string;
  type: "volunteer" | "job" | "event" | "project";
  category: string;
  status: "active" | "inactive" | "draft";
  remote: boolean;
  contactInformation: {
    emails?: Array<{email: string; type?: string}>;
    phoneNumbers?: Array<{number: string; type?: string}>;
    addresses?: Array<{
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      remote?: boolean;
    }>;
  };
  requirements?: string[];
  skills?: string[];
  timeCommitment?: {
    hoursPerWeek?: number;
    duration?: string;
    schedule?: string;
  };
  iconImage?: string;
  heroImage?: string;
}

export interface CreateRelationshipRequest {
  targetAccountId: string;
  relationship: "friend" | "member" | "admin" | "moderator";
  access?: "member" | "admin" | "moderator";
  notes?: string;
  customMessage?: string;
}

export interface SearchAccountsRequest {
  location?: {
    latitude: number;
    longitude: number;
  };
  radiusKm?: number;
  skills?: string[];
  accountType?: "user" | "nonprofit" | "business" | "community";
  limit?: number;
  startAfter?: string;
}

export interface SearchListingsRequest {
  location?: {
    latitude: number;
    longitude: number;
  };
  radiusKm?: number;
  skills?: string[];
  type?: "volunteer" | "job" | "event" | "project";
  remote?: boolean;
  category?: string;
  limit?: number;
  startAfter?: string;
}

export interface CreateProjectRequest {
  accountId: string;
  name: string;
  description: string;
  category: string;
}

export interface UpdateProjectRequest {
  accountId: string;
  projectId: string;
  updates: Partial<{
    name: string;
    description: string;
    category: string;
  }>;
}

export interface AssignToProjectRequest {
  accountId: string;
  projectId: string;
  userId: string;
  role?: string;
}

export interface SearchProjectsRequest {
  accountId?: string;
  category?: string;
  limit?: number;
  startAfter?: string;
}

// Time Tracking Interfaces
export interface CreateTimeEntryRequest {
  accountId: string;
  listingId?: string;
  projectId?: string;
  date: string; // ISO date string
  hours: number;
  description?: string;
  category?: string;
  isVolunteer?: boolean;
}

export interface UpdateTimeEntryRequest {
  timeEntryId: string;
  updates: Partial<{
    date: string;
    hours: number;
    description: string;
    category: string;
    isVolunteer: boolean;
  }>;
}

export interface GetAccountTimeEntriesRequest {
  accountId: string;
  startDate?: string;
  endDate?: string;
  projectId?: string;
  userId?: string;
  limit?: number;
}

export interface TimeTrackingStatsRequest {
  accountId: string;
  startDate?: string;
  endDate?: string;
  projectId?: string;
  userId?: string;
}

// Chat/Messaging Interfaces
export interface CreateGroupChatRequest {
  name: string;
  description?: string;
  memberIds: string[];
  accountId: string;
  isPrivate?: boolean;
}

export interface AddUserToChatRequest {
  chatId: string;
  userId: string;
  addedBy: string;
  accountId: string;
}

export interface RemoveUserFromChatRequest {
  chatId: string;
  userId: string;
  removedBy: string;
  accountId: string;
}

export interface PaginatedMessagesRequest {
  chatId: string;
  accountId: string;
  limit?: number;
  before?: string;
  after?: string;
}

export interface PaginatedMessagesResponse {
  messages: any[];
  hasMore: boolean;
  nextPageToken?: string;
  totalCount: number;
}

export interface GetUserChatsRequest {
  accountId: string;
  limit?: number;
  lastVisible?: any;
}

export interface SearchMessagesRequest {
  accountId: string;
  query: string;
  chatId?: string;
  limit?: number;
}

// Notification Interfaces
export interface GetUserNotificationsRequest {
  limit?: number;
  lastNotificationId?: string;
}

export interface MarkNotificationAsReadRequest {
  notificationId: string;
}

export interface SendAdminNotificationRequest {
  accountId: string;
  type: string;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: "root",
})
export class FirebaseFunctionsService {
  constructor(
    private fns: AngularFireFunctions,
    private store: Store,
  ) {}

  // Helper method to check authentication and refresh token if needed
  private ensureAuthenticated(): Observable<any> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      // Check NgRx store as fallback
      return this.store.select(selectAuthUser).pipe(
        take(1),
        switchMap((authUser) => {
          if (!authUser) {
            return throwError(
              () => new Error("User not authenticated. Please sign in."),
            );
          }

          // Wait for Firebase Auth to catch up
          return from(auth.authStateReady()).pipe(
            switchMap(() => {
              const refreshedUser = auth.currentUser;
              if (!refreshedUser) {
                return throwError(
                  () =>
                    new Error(
                      "Firebase Auth state inconsistent. Please refresh the page.",
                    ),
                );
              }

              return from(refreshedUser.getIdToken(true)).pipe(
                map((token) => {
                  return token;
                }),
                catchError((error) => {
                  return throwError(
                    () => new Error("Authentication token refresh failed"),
                  );
                }),
              );
            }),
          );
        }),
      );
    }

    // Force token refresh to ensure we have a valid token
    return from(user.getIdToken(true)).pipe(
      map((token) => {
        return token;
      }),
      catchError((error) => {
        return throwError(
          () => new Error("Authentication token refresh failed"),
        );
      }),
    );
  }

  // Public method to test authentication status
  testAuthentication(): Observable<any> {
    return this.ensureAuthenticated();
  }

  // Account Management Functions
  createAccount(data: CreateAccountRequest): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const callable = this.fns.httpsCallable("createAccount");
        return from(callable(data));
      }),
      map((result: any) => {
        return result;
      }),
      catchError(this.handleError("Account creation")),
    );
  }

  updateAccount(data: UpdateAccountRequest): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const callable = this.fns.httpsCallable("updateAccount");
        return from(callable(data));
      }),
      map((result: any) => {
        return result;
      }),
      catchError((error) => {
        if (
          error?.code === "unauthenticated" ||
          error?.message?.includes("Unauthenticated")
        ) {
          return throwError(
            () =>
              new Error(
                "Authentication failed. Please sign out and sign in again.",
              ),
          );
        }
        return this.handleError("Account update")(error);
      }),
    );
  }

  deleteMyAccount(): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const callable = this.fns.httpsCallable("deleteMyAccount");
        return from(callable({}));
      }),
      map((result: any) => {
        return result;
      }),
      catchError(this.handleError("Account deletion")),
    );
  }

  searchAccounts(data: SearchAccountsRequest): Observable<any> {
    const callable = this.fns.httpsCallable("searchAccounts");
    return from(callable(data)).pipe(
      map((result: any) => {
        // Backend returns an object: { success, accounts, hasMore, nextCursor }
        // But normalize defensively in case of array payloads
        if (result && Array.isArray(result)) {
          return result.map((account: any) => {
            if (account?.createdAt?._seconds) {
              account.createdAt = new Date(
                account.createdAt._seconds * 1000,
              ).toISOString();
            }
            if (account?.lastLoginAt?._seconds) {
              account.lastLoginAt = new Date(
                account.lastLoginAt._seconds * 1000,
              ).toISOString();
            }
            return account;
          });
        }

        if (result?.accounts && Array.isArray(result.accounts)) {
          const mapped = result.accounts.map((account: any) => {
            if (account?.createdAt?._seconds) {
              account.createdAt = new Date(
                account.createdAt._seconds * 1000,
              ).toISOString();
            }
            if (account?.lastLoginAt?._seconds) {
              account.lastLoginAt = new Date(
                account.lastLoginAt._seconds * 1000,
              ).toISOString();
            }
            return account;
          });
          return {...result, accounts: mapped};
        }

        return result;
      }),
      catchError(this.handleError("Search accounts")),
    );
  }

  getAccount(accountId: string): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const callable = this.fns.httpsCallable("getAccount");
        return from(callable({accountId})).pipe(
          map((result: any) => result),
          catchError(this.handleError("Get account")),
        );
      }),
    );
  }

  migrateAccountsIsActive(): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const callable = this.fns.httpsCallable("migrateAccountsIsActive");
        return from(callable({})).pipe(
          map((result: any) => {
            return result;
          }),
          catchError(this.handleError("Accounts migration")),
        );
      }),
    );
  }

  // Listing Management Functions
  createListing(data: CreateListingRequest): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const callable = this.fns.httpsCallable("createListing");
        return from(callable(data)).pipe(
          map((result: any) => result),
          catchError(this.handleError("Listing creation")),
        );
      }),
    );
  }

  updateListing(
    listingId: string,
    updates: Partial<CreateListingRequest>,
  ): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const callable = this.fns.httpsCallable("updateListing");
        return from(callable({listingId, updates})).pipe(
          map((result: any) => result),
          catchError(this.handleError("Listing update")),
        );
      }),
    );
  }

  deleteListing(listingId: string): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const callable = this.fns.httpsCallable("deleteListing");
        return from(callable({listingId})).pipe(
          map((result: any) => result),
          catchError(this.handleError("Listing deletion")),
        );
      }),
    );
  }

  applyToListing(
    listingId: string,
    notes?: string,
    customMessage?: string,
  ): Observable<any> {
    const callable = this.fns.httpsCallable("applyToListing");
    return from(callable({listingId, notes, customMessage})).pipe(
      map((result: any) => result),
      catchError(this.handleError("Listing application")),
    );
  }

  searchListings(data: SearchListingsRequest): Observable<any> {
    const callable = this.fns.httpsCallable("searchListings");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Listing search")),
    );
  }

  // Relationship Management Functions
  createRelationship(data: CreateRelationshipRequest): Observable<any> {
    const callable = this.fns.httpsCallable("createRelationship");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Relationship creation")),
    );
  }

  updateRelationship(targetAccountId: string, updates: any): Observable<any> {
    const callable = this.fns.httpsCallable("updateRelationship");
    return from(callable({targetAccountId, updates})).pipe(
      map((result: any) => result),
      catchError(this.handleError("Relationship update")),
    );
  }

  deleteRelationship(targetAccountId: string): Observable<any> {
    const callable = this.fns.httpsCallable("deleteRelationship");
    return from(callable({targetAccountId})).pipe(
      map((result: any) => result),
      catchError(this.handleError("Relationship deletion")),
    );
  }

  getRelationships(options?: any): Observable<any> {
    const callable = this.fns.httpsCallable("getRelationships");
    return from(callable(options || {})).pipe(
      map((result: any) => result),
      catchError(this.handleError("Get relationships")),
    );
  }

  // Notification Functions
  getUserNotifications(data: GetUserNotificationsRequest): Observable<any> {
    const callable = this.fns.httpsCallable("getUserNotifications");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Get notifications")),
    );
  }

  markNotificationAsRead(data: MarkNotificationAsReadRequest): Observable<any> {
    const callable = this.fns.httpsCallable("markNotificationAsRead");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Mark notification as read")),
    );
  }

  sendAdminNotification(data: SendAdminNotificationRequest): Observable<any> {
    const callable = this.fns.httpsCallable("sendAdminNotification");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Send admin notification")),
    );
  }

  deleteAccount(confirmationText: string): Observable<any> {
    const callable = this.fns.httpsCallable("deleteAccount");
    return from(callable({confirmationText})).pipe(
      map((result: any) => result),
      catchError(this.handleError("Delete account")),
    );
  }

  // Project Management Functions
  createProject(data: CreateProjectRequest): Observable<any> {
    const callable = this.fns.httpsCallable("createProject");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Create project")),
    );
  }

  updateProject(data: UpdateProjectRequest): Observable<any> {
    const callable = this.fns.httpsCallable("updateProject");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Update project")),
    );
  }

  deleteProject(accountId: string, projectId: string): Observable<any> {
    const callable = this.fns.httpsCallable("deleteProject");
    return from(callable({accountId, projectId})).pipe(
      map((result: any) => result),
      catchError(this.handleError("Delete project")),
    );
  }

  assignToProject(data: AssignToProjectRequest): Observable<any> {
    const callable = this.fns.httpsCallable("assignToProject");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Assign to project")),
    );
  }

  getAccountProjects(accountId: string): Observable<any> {
    const callable = this.fns.httpsCallable("getAccountProjects");
    return from(callable({accountId})).pipe(
      map((result: any) => result),
      catchError(this.handleError("Get account projects")),
    );
  }

  getUserAssignedProjects(): Observable<any> {
    const callable = this.fns.httpsCallable("getUserAssignedProjects");
    return from(callable({})).pipe(
      map((result: any) => result),
      catchError(this.handleError("Get user assigned projects")),
    );
  }

  searchProjects(data: SearchProjectsRequest): Observable<any> {
    const callable = this.fns.httpsCallable("searchProjects");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Search projects")),
    );
  }

  // =============================================
  // TIME TRACKING METHODS
  // =============================================

  /**
   * Create a new time entry
   * @param data The time entry data to create
   * @returns Observable of the created time entry
   */
  createTimeEntry(data: CreateTimeEntryRequest): Observable<any> {
    const callable = this.fns.httpsCallable("createTimeEntry");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Create time entry")),
    );
  }

  /**
   * Update an existing time entry
   * @param data The time entry updates
   * @returns Observable of the updated time entry
   */
  updateTimeEntry(data: UpdateTimeEntryRequest): Observable<any> {
    const callable = this.fns.httpsCallable("updateTimeEntry");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Update time entry")),
    );
  }

  /**
   * Delete a time entry
   * @param timeEntryId The ID of the time entry to delete
   * @returns Observable of the deletion result
   */
  deleteTimeEntry(timeEntryId: string): Observable<any> {
    const callable = this.fns.httpsCallable("deleteTimeEntry");
    return from(callable({timeEntryId})).pipe(
      map((result: any) => result),
      catchError(this.handleError("Delete time entry")),
    );
  }

  /**
   * Get time entries for an account
   * @param data The query parameters for time entries
   * @returns Observable of time entries
   */
  getAccountTimeEntries(data: GetAccountTimeEntriesRequest): Observable<any> {
    const callable = this.fns.httpsCallable("getAccountTimeEntries");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Get account time entries")),
    );
  }

  /**
   * Get time tracking statistics for an account
   * @param data The query parameters for stats
   * @returns Observable of time tracking statistics
   */
  getTimeTrackingStats(data: TimeTrackingStatsRequest): Observable<any> {
    const callable = this.fns.httpsCallable("getTimeTrackingStats");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Get time tracking stats")),
    );
  }

  // Chat/Messaging Functions

  /**
   * Create a new group chat
   * @param data The group chat creation data
   * @returns Observable of the created group chat
   */
  createGroupChat(data: CreateGroupChatRequest): Observable<any> {
    const callable = this.fns.httpsCallable("createGroupChat");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Create group chat")),
    );
  }

  /**
   * Add a user to a chat
   * @param data The data for adding a user to chat
   * @returns Observable of the operation result
   */
  addUserToChat(data: AddUserToChatRequest): Observable<any> {
    const callable = this.fns.httpsCallable("addUserToChat");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Add user to chat")),
    );
  }

  /**
   * Remove a user from a chat
   * @param data The data for removing a user from chat
   * @returns Observable of the operation result
   */
  removeUserFromChat(data: RemoveUserFromChatRequest): Observable<any> {
    const callable = this.fns.httpsCallable("removeUserFromChat");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Remove user from chat")),
    );
  }

  /**
   * Get paginated messages for a chat
   * @param data The pagination request data
   * @returns Observable of paginated messages
   */
  getMessages(
    data: PaginatedMessagesRequest,
  ): Observable<PaginatedMessagesResponse> {
    const callable = this.fns.httpsCallable("getMessages");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Get messages")),
    );
  }

  /**
   * Get user's chats
   * @param data The request data for getting user chats
   * @returns Observable of user's chats
   */
  getUserChats(data: GetUserChatsRequest): Observable<any> {
    const callable = this.fns.httpsCallable("getUserChats");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Get user chats")),
    );
  }

  /**
   * Search messages in chats
   * @param data The search request data
   * @returns Observable of search results
   */
  searchMessages(data: SearchMessagesRequest): Observable<any> {
    const callable = this.fns.httpsCallable("searchMessages");
    return from(callable(data)).pipe(
      map((result: any) => result),
      catchError(this.handleError("Search messages")),
    );
  }

  // Error handling
  private handleError(operation: string) {
    return (error: any): Observable<any> => {
      // Extract Firebase Function error message
      if (error?.details?.message) {
        throw new Error(`${operation} failed: ${error.details.message}`);
      } else if (error?.message) {
        throw new Error(`${operation} failed: ${error.message}`);
      } else {
        throw new Error(`${operation} failed: Unknown error occurred`);
      }
    };
  }
}
