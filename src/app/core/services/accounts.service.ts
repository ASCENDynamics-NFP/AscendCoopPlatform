/*******************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/
// src/app/core/services/accounts.service.ts

import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {combineLatest, Observable, of} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {Account, RelatedAccount} from "../../../../shared/models/account.model";
import {RelatedListing} from "../../../../shared/models/related-listing.model";
import {FirestoreService} from "./firestore.service";
import {
  FirebaseFunctionsService,
  CreateAccountRequest,
  UpdateAccountRequest,
  SearchAccountsRequest,
} from "./firebase-functions.service";

@Injectable({
  providedIn: "root",
})
export class AccountsService {
  constructor(
    private afs: AngularFirestore,
    private firestore: FirestoreService,
    private firebaseFunctions: FirebaseFunctionsService,
  ) {}

  // ===== CALLABLE FUNCTION METHODS =====

  /**
   * Create a new account using callable function
   */
  createAccount(accountData: CreateAccountRequest): Observable<any> {
    return this.firebaseFunctions.createAccount(accountData);
  }

  /**
   * Update account using callable function
   */
  updateAccount(
    accountId: string,
    updates: Partial<CreateAccountRequest>,
  ): Observable<any> {
    return this.firebaseFunctions.updateAccount({accountId, updates});
  }

  /**
   * Delete user's own account using callable function
   */
  deleteMyAccount(): Observable<any> {
    return this.firebaseFunctions.deleteMyAccount();
  }

  /**
   * Search accounts using callable function with filtering options
   */
  searchAccounts(searchParams: SearchAccountsRequest): Observable<Account[]> {
    return this.firebaseFunctions.searchAccounts(searchParams).pipe(
      map((result) => {
        return result.accounts || [];
      }),
      catchError((error) => {
        return of([]);
      }),
    );
  }

  /**
   * Get a specific account by ID using callable function
   */
  getAccount(accountId: string): Observable<Account | null> {
    return this.firebaseFunctions.getAccount(accountId).pipe(
      map((result) => result.account || null),
      catchError((error) => {
        console.error("Error getting account:", error);
        return of(null);
      }),
    );
  }

  /** Update gated sections via callable (avoids direct Firestore writes) */
  updateAccountSections(data: {
    accountId: string;
    professionalInformation?: any;
    laborRights?: any;
  }): Observable<any> {
    return this.firebaseFunctions.updateAccountSections(data);
  }

  // ===== LEGACY METHODS (keeping for backward compatibility) =====

  /**
   * @deprecated Use searchAccounts() with SearchAccountsRequest instead
   */
  searchAccountByName(
    collectionName: string,
    searchTerm: string,
  ): Observable<Account[]> {
    // Convert to new search format
    return this.searchAccounts({
      // We can't filter by name directly in the new function
      // This method should be updated to use text search when available
      limit: 20,
    }).pipe(
      map((accounts) =>
        accounts.filter((account) =>
          account.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      ),
    );
  }

  /**
   * @deprecated Direct Firestore access - consider using callable functions for relationships
   */
  getRelatedAccounts(accountId: string): Observable<RelatedAccount[]> {
    const relatedAccountsRef = this.afs.collection<RelatedAccount>(
      `accounts/${accountId}/relatedAccounts`,
    );

    return relatedAccountsRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((action) => {
          const data = action.payload.doc.data() as RelatedAccount;
          const id = action.payload.doc.id;
          return {...data, id};
        }),
      ),
      catchError((error) => {
        console.error("Error getting related accounts:", error);
        return of([]);
      }),
    );
  }

  /**
   * @deprecated Use searchAccounts() instead with proper filtering
   */
  getAllAccounts(): Observable<Account[]> {
    return this.searchAccounts({
      limit: 1000, // Increased limit for directory page
    });
  }

  /**
   * Get account with related data - using mixed approach
   * TODO: Replace with pure callable functions when relationship functions are available
   */
  getAccountWithRelated(accountId: string): Observable<{
    account: Account | null;
    relatedAccounts: RelatedAccount[];
    relatedListings: RelatedListing[];
  }> {
    return combineLatest([
      this.getAccount(accountId), // Using callable function
      this.getRelatedAccounts(accountId), // Legacy Firestore access
      this.afs
        .collection<RelatedListing>(`accounts/${accountId}/relatedListings`)
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((action) => {
              const data = action.payload.doc.data() as RelatedListing;
              const id = action.payload.doc.id;
              return {...data, id};
            }),
          ),
          catchError(() => of([])),
        ),
    ]).pipe(
      map(([account, relatedAccounts, relatedListings]) => ({
        account,
        relatedAccounts,
        relatedListings,
      })),
      catchError((error) => {
        console.error("Error getting account with related data:", error);
        return of({account: null, relatedAccounts: [], relatedListings: []});
      }),
    );
  }
}
