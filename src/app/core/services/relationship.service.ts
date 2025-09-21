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
import {map, catchError} from "rxjs/operators";
import {
  FirebaseFunctionsService,
  CreateRelationshipRequest,
} from "./firebase-functions.service";

export interface RelatedAccount {
  id: string;
  status: "pending" | "accepted" | "blocked" | "declined";
  initiatorId: string;
  targetId: string;
  createdAt: any;
  relationshipType?: string;
}

/**
 * RelationshipService - Wrapper around FirebaseFunctionsService for relationship operations
 * This service handles friend requests, group memberships, and connection management
 */
@Injectable({
  providedIn: "root",
})
export class RelationshipService {
  constructor(private firebaseFunctions: FirebaseFunctionsService) {}

  /**
   * Create a new relationship (friend request, group membership, etc.)
   * @param data The relationship data to create
   * @returns Observable of the created relationship
   */
  createRelationship(data: CreateRelationshipRequest): Observable<any> {
    return this.firebaseFunctions.createRelationship(data).pipe(
      map((response) => response.relationship),
      catchError((error) => {
        console.error("Error creating relationship:", error);
        throw error;
      }),
    );
  }

  /**
   * Send a friend request to another account
   * @param targetAccountId The account ID to send friend request to
   * @param customMessage Optional custom message
   * @returns Observable of the friend request
   */
  sendFriendRequest(
    targetAccountId: string,
    customMessage?: string,
  ): Observable<any> {
    return this.createRelationship({
      targetAccountId,
      relationship: "friend",
      customMessage: customMessage || "Would like to connect with you!",
    });
  }

  /**
   * Accept a friend request or relationship
   * @param targetAccountId The account ID that sent the request
   * @returns Observable of the updated relationship
   */
  acceptRelationship(targetAccountId: string): Observable<any> {
    return this.firebaseFunctions
      .updateRelationship(targetAccountId, {
        status: "accepted",
      })
      .pipe(
        catchError((error) => {
          console.error("Error accepting relationship:", error);
          throw error;
        }),
      );
  }

  /** Generic relationship update: access/roles/status, optionally on behalf of accountId (e.g., group) */
  updateRelationship(
    targetAccountId: string,
    updates: {
      status?: "accepted" | "declined" | "blocked";
      access?: "admin" | "moderator" | "member";
      role?: string;
      roleId?: string;
      roleIds?: string[];
      accountId?: string;
    },
  ): Observable<any> {
    return this.firebaseFunctions
      .updateRelationship(targetAccountId, updates)
      .pipe(
        catchError((error) => {
          console.error("Error updating relationship:", error);
          throw error;
        }),
      );
  }

  /**
   * Decline or reject a relationship request
   * @param targetAccountId The account ID that sent the request
   * @returns Observable of the updated relationship
   */
  declineRelationship(targetAccountId: string): Observable<any> {
    return this.firebaseFunctions
      .updateRelationship(targetAccountId, {
        status: "declined",
      })
      .pipe(
        catchError((error) => {
          console.error("Error declining relationship:", error);
          throw error;
        }),
      );
  }

  /**
   * Block a user/account
   * @param targetAccountId The account ID to block
   * @returns Observable of the block relationship
   */
  blockUser(targetAccountId: string): Observable<any> {
    return this.firebaseFunctions
      .updateRelationship(targetAccountId, {
        status: "blocked",
      })
      .pipe(
        catchError((error) => {
          console.error("Error blocking user:", error);
          throw error;
        }),
      );
  }

  /**
   * Unblock a user/account
   * @param targetAccountId The account ID to unblock
   * @returns Observable of the deletion result
   */
  unblockUser(targetAccountId: string): Observable<any> {
    return this.firebaseFunctions.deleteRelationship(targetAccountId).pipe(
      catchError((error) => {
        console.error("Error unblocking user:", error);
        throw error;
      }),
    );
  }

  /**
   * Remove/delete a relationship (unfriend, leave group, etc.)
   * @param targetAccountId The account ID to remove relationship with
   * @returns Observable of the deletion result
   */
  removeRelationship(targetAccountId: string): Observable<any> {
    return this.firebaseFunctions.deleteRelationship(targetAccountId).pipe(
      catchError((error) => {
        console.error("Error removing relationship:", error);
        throw error;
      }),
    );
  }

  /** Remove a relationship on behalf of an account (e.g., group admin removing a member) */
  removeRelationshipForAccount(
    accountId: string,
    targetAccountId: string,
  ): Observable<any> {
    return this.firebaseFunctions
      .deleteRelationship(targetAccountId, {accountId})
      .pipe(
        catchError((error) => {
          console.error("Error removing relationship for account:", error);
          throw error;
        }),
      );
  }

  /**
   * Get all relationships for the current user
   * @param options Optional query parameters
   * @returns Observable of relationships
   */
  getRelationships(options?: {
    status?: "pending" | "accepted" | "blocked" | "declined";
    relationship?: "friend" | "member" | "admin" | "moderator";
    limit?: number;
  }): Observable<RelatedAccount[]> {
    return this.firebaseFunctions.getRelationships(options).pipe(
      map((response) => response.relationships || []),
      catchError((error) => {
        console.error("Error loading relationships:", error);
        throw error;
      }),
    );
  }

  /**
   * Get accepted friendships for the current user
   * @returns Observable of accepted friend relationships
   */
  getFriends(): Observable<RelatedAccount[]> {
    return this.getRelationships({
      status: "accepted",
      relationship: "friend",
    });
  }

  /**
   * Get pending friend requests (incoming)
   * @returns Observable of pending friend requests
   */
  getPendingFriendRequests(): Observable<RelatedAccount[]> {
    return this.getRelationships({
      status: "pending",
      relationship: "friend",
    });
  }

  /**
   * Get blocked users/accounts
   * @returns Observable of blocked relationships
   */
  getBlockedUsers(): Observable<RelatedAccount[]> {
    return this.getRelationships({
      status: "blocked",
    });
  }

  /**
   * Get group memberships for the current user
   * @returns Observable of group membership relationships
   */
  getGroupMemberships(): Observable<RelatedAccount[]> {
    return this.getRelationships({
      status: "accepted",
      relationship: "member",
    });
  }

  /**
   * Join a group (request membership)
   * @param groupAccountId The group account ID to join
   * @param customMessage Optional message for the join request
   * @returns Observable of the membership request
   */
  joinGroup(groupAccountId: string, customMessage?: string): Observable<any> {
    return this.createRelationship({
      targetAccountId: groupAccountId,
      relationship: "member",
      customMessage: customMessage || "Would like to join this group!",
    });
  }

  /**
   * Leave a group
   * @param groupAccountId The group account ID to leave
   * @returns Observable of the deletion result
   */
  leaveGroup(groupAccountId: string): Observable<any> {
    return this.removeRelationship(groupAccountId);
  }

  // Convenience helpers for access/role management acting on behalf of a group account
  setAccess(
    accountId: string,
    targetAccountId: string,
    access: "admin" | "moderator" | "member",
  ): Observable<any> {
    return this.updateRelationship(targetAccountId, {accountId, access});
  }

  setRole(accountId: string, targetAccountId: string, roleId: string) {
    // Keep backward compatibility: mirror into roleIds[0]
    return this.updateRelationship(targetAccountId, {
      accountId,
      roleId,
      roleIds: [roleId],
    });
  }

  setRoles(accountId: string, targetAccountId: string, roleIds: string[]) {
    if (!roleIds || roleIds.length === 0) {
      // Clearing both fields by sending empty array and omitting roleId
      return this.updateRelationship(targetAccountId, {
        accountId,
        roleIds: [],
      });
    }
    return this.updateRelationship(targetAccountId, {
      accountId,
      roleIds,
      roleId: roleIds[0],
    });
  }

  /**
   * Check if current user can message a target account
   * This is a convenience method that checks relationship status
   * @param targetAccountId The account to check messaging permissions for
   * @returns Observable of boolean indicating if messaging is allowed
   */
  canMessage(targetAccountId: string): Observable<boolean> {
    return this.getRelationships().pipe(
      map((relationships) => {
        // Check if user is blocked
        const blockedRelationship = relationships.find(
          (rel) =>
            (rel.targetId === targetAccountId ||
              rel.initiatorId === targetAccountId) &&
            rel.status === "blocked",
        );

        // If blocked, cannot message
        if (blockedRelationship) {
          return false;
        }

        // Check if there's an accepted friendship
        const acceptedRelationship = relationships.find(
          (rel) =>
            (rel.targetId === targetAccountId ||
              rel.initiatorId === targetAccountId) &&
            rel.status === "accepted" &&
            rel.relationshipType === "friend",
        );

        // Can message if there's an accepted friendship
        return !!acceptedRelationship;
      }),
      catchError((error) => {
        console.error("Error checking messaging permissions:", error);
        // Default to false if there's an error
        return [false];
      }),
    );
  }
}
