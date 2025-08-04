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
import {Observable, from, throwError} from "rxjs";
import {map, catchError} from "rxjs/operators";

export interface RelatedAccount {
  id: string;
  status: "pending" | "accepted" | "blocked" | "declined";
  initiatorId: string;
  targetId: string;
  createdAt: any;
  relationshipType?: string;
}

@Injectable({
  providedIn: "root",
})
export class RelationshipService {
  private readonly ACCOUNTS_COLLECTION = "accounts";
  private readonly RELATED_ACCOUNTS_COLLECTION = "relatedAccounts";

  constructor(private firestore: AngularFirestore) {}

  /**
   * Check if two users have an accepted relationship
   */
  checkRelationshipStatus(
    currentUserId: string,
    targetUserId: string,
  ): Observable<RelatedAccount | null> {
    return this.firestore
      .collection<RelatedAccount>(
        `${this.ACCOUNTS_COLLECTION}/${currentUserId}/${this.RELATED_ACCOUNTS_COLLECTION}`,
        (ref) =>
          ref
            .where("targetId", "==", targetUserId)
            .where("status", "==", "accepted")
            .limit(1),
      )
      .valueChanges({idField: "id"})
      .pipe(
        map((relationships) => {
          return relationships.length > 0 ? relationships[0] : null;
        }),
        catchError((error) => {
          console.error("Error checking relationship status:", error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Check if current user can message target user
   */
  canMessage(currentUserId: string, targetUserId: string): Observable<boolean> {
    // Users can always message themselves (for testing)
    if (currentUserId === targetUserId) {
      return from([true]);
    }

    return this.checkRelationshipStatus(currentUserId, targetUserId).pipe(
      map((relationship) => {
        return relationship !== null && relationship.status === "accepted";
      }),
      catchError((error) => {
        console.error("Error checking message permissions:", error);
        // Default to false for security
        return from([false]);
      }),
    );
  }

  /**
   * Get all accepted relationships for user (friends list)
   */
  getAcceptedRelationships(userId: string): Observable<RelatedAccount[]> {
    return this.firestore
      .collection<RelatedAccount>(
        `${this.ACCOUNTS_COLLECTION}/${userId}/${this.RELATED_ACCOUNTS_COLLECTION}`,
        (ref) => ref.where("status", "==", "accepted"),
      )
      .valueChanges({idField: "id"})
      .pipe(
        map((relationships) => {
          return relationships;
        }),
        catchError((error) => {
          console.error("Error fetching accepted relationships:", error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Block a user (update relationship status bidirectionally)
   */
  blockUser(currentUserId: string, targetUserId: string): Observable<void> {
    // Create batch to update both directions of the relationship
    const batch = this.firestore.firestore.batch();

    // Block from current user's perspective
    const currentUserRelationshipRef = this.firestore
      .collection(
        `${this.ACCOUNTS_COLLECTION}/${currentUserId}/${this.RELATED_ACCOUNTS_COLLECTION}`,
      )
      .doc(targetUserId).ref;

    // Block from target user's perspective
    const targetUserRelationshipRef = this.firestore
      .collection(
        `${this.ACCOUNTS_COLLECTION}/${targetUserId}/${this.RELATED_ACCOUNTS_COLLECTION}`,
      )
      .doc(currentUserId).ref;

    const updateData = {
      status: "blocked",
      lastModifiedAt: new Date(),
      initiatorId: currentUserId,
      targetId: targetUserId,
      createdAt: new Date(), // In case the relationship doesn't exist yet
    };

    const reverseUpdateData = {
      status: "blocked",
      lastModifiedAt: new Date(),
      initiatorId: currentUserId, // Keep track of who initiated the block
      targetId: currentUserId,
      createdAt: new Date(),
    };

    // Use set with merge to create relationship if it doesn't exist
    batch.set(currentUserRelationshipRef, updateData, {merge: true});
    batch.set(targetUserRelationshipRef, reverseUpdateData, {merge: true});

    return from(batch.commit()).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error("Error blocking user:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Unblock a user (update relationship status back to accepted bidirectionally)
   */
  unblockUser(currentUserId: string, targetUserId: string): Observable<void> {
    // Create batch to update both directions of the relationship
    const batch = this.firestore.firestore.batch();

    // Unblock from current user's perspective
    const currentUserRelationshipRef = this.firestore
      .collection(
        `${this.ACCOUNTS_COLLECTION}/${currentUserId}/${this.RELATED_ACCOUNTS_COLLECTION}`,
      )
      .doc(targetUserId).ref;

    // Unblock from target user's perspective
    const targetUserRelationshipRef = this.firestore
      .collection(
        `${this.ACCOUNTS_COLLECTION}/${targetUserId}/${this.RELATED_ACCOUNTS_COLLECTION}`,
      )
      .doc(currentUserId).ref;

    const updateData = {
      status: "accepted",
      lastModifiedAt: new Date(),
    };

    const reverseUpdateData = {
      status: "accepted",
      lastModifiedAt: new Date(),
    };

    // Use set with merge in case relationship structure needs updating
    batch.set(currentUserRelationshipRef, updateData, {merge: true});
    batch.set(targetUserRelationshipRef, reverseUpdateData, {merge: true});

    return from(batch.commit()).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error("Error unblocking user:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Get all blocked relationships for user
   */
  getBlockedRelationships(userId: string): Observable<RelatedAccount[]> {
    return this.firestore
      .collection<RelatedAccount>(
        `${this.ACCOUNTS_COLLECTION}/${userId}/${this.RELATED_ACCOUNTS_COLLECTION}`,
        (ref) => ref.where("status", "==", "blocked"),
      )
      .valueChanges({idField: "id"})
      .pipe(
        catchError((error) => {
          console.error("Error fetching blocked relationships:", error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Check if user is blocked
   */
  isUserBlocked(
    currentUserId: string,
    targetUserId: string,
  ): Observable<boolean> {
    return this.firestore
      .collection<RelatedAccount>(
        `${this.ACCOUNTS_COLLECTION}/${currentUserId}/${this.RELATED_ACCOUNTS_COLLECTION}`,
        (ref) =>
          ref
            .where("targetId", "==", targetUserId)
            .where("status", "==", "blocked")
            .limit(1),
      )
      .valueChanges()
      .pipe(
        map((relationships) => relationships.length > 0),
        catchError((error) => {
          console.error("Error checking block status:", error);
          return from([false]);
        }),
      );
  }
}
