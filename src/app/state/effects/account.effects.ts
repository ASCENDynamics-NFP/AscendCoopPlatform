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
// src/app/state/effects/account.effects.ts

import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as AccountActions from "../actions/account.actions";
import {EMPTY, from, of} from "rxjs";
import {
  switchMap,
  map,
  catchError,
  mergeMap,
  withLatestFrom,
  debounceTime,
  take,
  filter,
} from "rxjs/operators";
import {FirestoreService} from "../../core/services/firestore.service";
import {Account} from "../../models/account.model";
import {RelatedListing} from "../../models/related-listing.model";
import {selectAuthUser} from "../selectors/auth.selectors";
import {Store} from "@ngrx/store";
import * as AuthActions from "../actions/auth.actions";
import {serverTimestamp} from "@angular/fire/firestore";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {AppState} from "../app.state";
import {
  selectAccountById,
  selectAccountEntities,
  selectRelatedAccountsByAccountId,
  selectRelatedListingsByAccountId,
  selectAreAccountsFresh,
  selectAreRelatedAccountsFresh,
  selectAreRelatedListingsFresh,
} from "../selectors/account.selectors";

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private store: Store<AppState>,
    private router: Router,
    private toastController: ToastController,
  ) {}

  // Load Accounts only if not fresh
  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccounts),
      withLatestFrom(this.store.select(selectAreAccountsFresh)),
      filter(([_, areFresh]) => !areFresh),
      switchMap(() =>
        this.firestoreService.getAllAccounts().pipe(
          map((accounts) => AccountActions.loadAccountsSuccess({accounts})),
          catchError((error) =>
            of(
              AccountActions.loadAccountsFailure({
                error: error.message || error,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Load Account by ID if it doesn't exist locally
  loadAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccount),
      mergeMap(({accountId}) =>
        this.store.select(selectAccountById(accountId)).pipe(
          take(1),
          mergeMap((existingAccount) => {
            if (existingAccount) {
              return of({type: "[Account] No Action"});
            } else {
              return this.firestoreService
                .getDocument<Account>("accounts", accountId)
                .pipe(
                  map((account) => {
                    if (!account) {
                      throw new Error("Account not found");
                    }
                    return AccountActions.loadAccountSuccess({account});
                  }),
                  catchError((error) => {
                    this.showToast(
                      `Error loading account: ${error.message}`,
                      "danger",
                    );
                    return of(
                      AccountActions.loadAccountFailure({error: error.message}),
                    );
                  }),
                );
            }
          }),
        ),
      ),
    ),
  );

  // Create Account
  createAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.createAccount),
      switchMap(({account}) => {
        const newAccount = {
          ...account,
          createdAt: serverTimestamp(),
          lastModifiedAt: serverTimestamp(),
        };
        return from(
          this.firestoreService.addDocument("accounts", newAccount),
        ).pipe(
          map((accountId) => {
            this.router.navigate([`/accounts/${accountId}`]);
            this.showToast("Account created successfully", "success");
            return AccountActions.createAccountSuccess({
              account: {...newAccount, id: accountId},
            });
          }),
          catchError((error) => {
            this.showToast(
              `Error creating account: ${error.message}`,
              "danger",
            );
            return of(
              AccountActions.createAccountFailure({error: error.message}),
            );
          }),
        );
      }),
    ),
  );

  // Update Account
  updateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.updateAccount),
      debounceTime(300),
      switchMap(({account}) => {
        const updatedAccount = {
          ...account,
          lastModifiedAt: serverTimestamp(),
        };
        return from(
          this.firestoreService.updateDocument(
            "accounts",
            account.id,
            updatedAccount,
          ),
        ).pipe(
          map(() => {
            this.showToast("Account updated successfully", "success");
            return AccountActions.updateAccountSuccess({
              account: updatedAccount,
            });
          }),
          catchError((error) => {
            this.showToast(
              `Error updating account: ${error.message}`,
              "danger",
            );
            return of(
              AccountActions.updateAccountFailure({error: error.message}),
            );
          }),
        );
      }),
    ),
  );

  // Delete Account
  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.deleteAccount),
      switchMap(({accountId}) =>
        from(this.firestoreService.deleteDocument("accounts", accountId)).pipe(
          map(() => {
            this.router.navigate(["/"]);
            this.showToast("Account deleted successfully", "success");
            return AccountActions.deleteAccountSuccess({accountId});
          }),
          catchError((error) => {
            this.showToast(
              `Error deleting account: ${error.message}`,
              "danger",
            );
            return of(
              AccountActions.deleteAccountFailure({error: error.message}),
            );
          }),
        ),
      ),
    ),
  );

  // Search Accounts
  searchAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.searchAccounts),
      debounceTime(300),
      switchMap(({query}) =>
        from(this.firestoreService.searchAccountByName("accounts", query)).pipe(
          map((accountsData) => {
            const accounts: Account[] = (accountsData || []).map(
              (accountData) => ({
                ...(accountData as Account),
              }),
            );
            this.showToast(`Found ${accounts.length} accounts`, "success");
            return AccountActions.searchAccountsSuccess({accounts});
          }),
          catchError((error) => {
            this.showToast(`Search failed: ${error.message}`, "danger");
            return of(
              AccountActions.searchAccountsFailure({error: error.message}),
            );
          }),
        ),
      ),
    ),
  );

  // Create Related Account
  createRelatedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.createRelatedAccount),
      switchMap(({accountId, relatedAccount}) => {
        const newRelatedAccount = {
          ...relatedAccount,
          createdAt: serverTimestamp(),
          lastModifiedAt: serverTimestamp(),
        };
        return from(
          this.firestoreService.setDocument(
            `accounts/${accountId}/relatedAccounts/${relatedAccount.id}`,
            newRelatedAccount,
          ),
        ).pipe(
          map(() => {
            this.showToast("Request successful", "success");
            return AccountActions.createRelatedAccountSuccess({
              accountId,
              relatedAccount: newRelatedAccount,
            });
          }),
          catchError((error) => {
            this.showToast(
              `Failed to create related account: ${error.message}`,
              "danger",
            );
            return of(
              AccountActions.createRelatedAccountFailure({
                error: error.message,
              }),
            );
          }),
        );
      }),
    ),
  );

  // Delete Related Account
  deleteRelatedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.deleteRelatedAccount),
      mergeMap(({accountId, relatedAccountId}) =>
        from(
          this.firestoreService.deleteDocumentAtPath(
            `accounts/${accountId}/relatedAccounts/${relatedAccountId}`,
          ),
        ).pipe(
          map(() => {
            this.showToast("Removed successfully", "success");
            return AccountActions.deleteRelatedAccountSuccess({
              accountId,
              relatedAccountId,
            });
          }),
          catchError((error) => {
            this.showToast(
              `Failed to remove related account: ${error.message}`,
              "danger",
            );
            return of(
              AccountActions.deleteRelatedAccountFailure({
                error: error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Load Related Accounts if not fresh
  loadRelatedAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadRelatedAccounts),
      mergeMap(({accountId}) =>
        this.store.select(selectAreRelatedAccountsFresh(accountId)).pipe(
          take(1),
          filter((areFresh) => !areFresh),
          switchMap(() =>
            this.firestoreService.getRelatedAccounts(accountId).pipe(
              map((relatedAccounts) =>
                AccountActions.loadRelatedAccountsSuccess({
                  accountId,
                  relatedAccounts,
                }),
              ),
              catchError((error) => {
                this.showToast(
                  `Error loading related accounts: ${error.message}`,
                  "danger",
                );
                return of(
                  AccountActions.loadRelatedAccountsFailure({
                    error: error.message,
                  }),
                );
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Update Related Account
  updateRelatedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.updateRelatedAccount),
      debounceTime(300),
      switchMap(({accountId, relatedAccount}) => {
        const updatedRelatedAccount = {
          ...relatedAccount,
          lastModifiedAt: serverTimestamp(),
        };
        return from(
          this.firestoreService.updateDocument(
            `accounts/${accountId}/relatedAccounts`,
            relatedAccount.id,
            updatedRelatedAccount,
          ),
        ).pipe(
          map(() => {
            this.showToast("Updated successfully", "success");
            return AccountActions.updateRelatedAccountSuccess({
              accountId,
              relatedAccount: updatedRelatedAccount,
            });
          }),
          catchError((error) => {
            this.showToast(`Update failed: ${error.message}`, "danger");
            return of(
              AccountActions.updateRelatedAccountFailure({
                error: error.message,
              }),
            );
          }),
        );
      }),
    ),
  );

  // Load Related Listings if not fresh
  loadRelatedListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadRelatedListings),
      mergeMap(({accountId}) =>
        this.store.select(selectAreRelatedListingsFresh(accountId)).pipe(
          take(1),
          filter((areFresh) => !areFresh),
          switchMap(() =>
            this.firestoreService
              .getDocuments<RelatedListing>(
                `accounts/${accountId}/relatedListings`,
              )
              .pipe(
                map((relatedListings) =>
                  AccountActions.loadRelatedListingsSuccess({
                    accountId,
                    relatedListings,
                  }),
                ),
                catchError((error) => {
                  this.showToast(
                    `Error loading related listings: ${error.message}`,
                    "danger",
                  );
                  return of(
                    AccountActions.loadRelatedListingsFailure({
                      error: error.message,
                    }),
                  );
                }),
              ),
          ),
        ),
      ),
    ),
  );

  // Sync Auth User with Account after a successful load
  syncAuthUserWithAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccountSuccess),
      withLatestFrom(this.store.select(selectAuthUser)),
      map(([{account}, authUser]) => {
        if (authUser?.uid && account.id && authUser.uid === account.id) {
          return AuthActions.updateAuthUser({
            user: {
              displayName: account.name,
              heroImage: account.heroImage,
              iconImage: account.iconImage,
              tagline: account.tagline,
              type: account.type,
              settings: account.settings,
            },
          });
        }
        return {type: "[Account] No Action"};
      }),
    ),
  );

  // Set Selected Account
  setSelectedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.setSelectedAccount),
      withLatestFrom(this.store.select(selectAccountEntities)),
      mergeMap(([action, entities]) => {
        const accountExists = !!entities[action.accountId];
        if (!accountExists) {
          return of(AccountActions.loadAccount({accountId: action.accountId}));
        }
        return EMPTY;
      }),
    ),
  );

  // Delete Related Listing
  deleteRelatedListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.deleteRelatedListing),
      mergeMap(({accountId, relatedListingId}) =>
        from(
          this.firestoreService.deleteDocumentAtPath(
            `accounts/${accountId}/relatedListings/${relatedListingId}`,
          ),
        ).pipe(
          map(() => {
            this.showToast("Removed successfully", "success");
            return AccountActions.deleteRelatedListingSuccess({
              accountId,
              relatedListingId,
            });
          }),
          catchError((error) => {
            this.showToast(
              `Failed to remove related listing: ${error.message}`,
              "danger",
            );
            return of(
              AccountActions.deleteRelatedListingFailure({
                error: error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  private showToast(message: string, color: string) {
    this.toastController
      .create({
        message,
        duration: 2000,
        color,
      })
      .then((toast) => toast.present());
  }
}
