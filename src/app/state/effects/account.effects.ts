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
} from "rxjs/operators";
import {FirestoreService} from "../../core/services/firestore.service";
import {Account} from "../../models/account.model";
import {RelatedListing} from "../../models/related-listing.model";
import {selectAuthUser} from "../selectors/auth.selectors";
import {Store} from "@ngrx/store";
import * as AuthActions from "../actions/auth.actions";
import {selectAccountEntities} from "../selectors/account.selectors";
import {serverTimestamp} from "@angular/fire/firestore";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Injectable()
export class AccountEffects {
  private accountsCache = new Map<string, Account>();
  private relatedAccountsCache = new Map<string, any[]>();
  private relatedListingsCache = new Map<string, RelatedListing[]>();
  private cacheExpiration = 5 * 60 * 1000; // 5 minutes

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private store: Store,
    private router: Router,
    private toastController: ToastController,
  ) {}

  // Load Accounts
  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccounts),
      switchMap(() =>
        this.firestoreService.getAllAccounts().pipe(
          map((accounts) => AccountActions.loadAccountsSuccess({accounts})),
          catchError((error) => {
            console.error("Effect: Error loading accounts:", error);
            return of(
              AccountActions.loadAccountsFailure({
                error: error.message || error,
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Load Account by ID with real-time updates
  loadAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccount),
      mergeMap(({accountId}) => {
        const cachedAccount = this.accountsCache.get(accountId);
        if (cachedAccount) {
          return of(
            AccountActions.loadAccountSuccess({
              account: cachedAccount,
            }),
          );
        }

        return this.firestoreService
          .getDocument<Account>("accounts", accountId)
          .pipe(
            map((account) => {
              if (!account) {
                throw new Error("Account not found");
              }
              this.accountsCache.set(accountId, account);
              setTimeout(() => {
                this.accountsCache.delete(accountId);
              }, this.cacheExpiration);
              return AccountActions.loadAccountSuccess({
                account,
              });
            }),
            catchError((error) => {
              this.toastController
                .create({
                  message: `Error loading account: ${error.message}`,
                  duration: 2000,
                  color: "danger",
                })
                .then((toast) => toast.present());
              return of(AccountActions.loadAccountFailure({error}));
            }),
          );
      }),
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
            this.toastController
              .create({
                message: "Account created successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return AccountActions.createAccountSuccess({
              account: {...newAccount, id: accountId},
            });
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Error creating account: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(AccountActions.createAccountFailure({error}));
          }),
        );
      }),
    ),
  );

  // Update Account
  updateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.updateAccount),
      debounceTime(300), // Prevent rapid updates
      switchMap(({account}) => {
        this.accountsCache.delete(account.id);
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
            this.accountsCache.set(account.id, updatedAccount);
            this.toastController
              .create({
                message: "Account updated successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return AccountActions.updateAccountSuccess({
              account: updatedAccount,
            });
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Error updating account: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(AccountActions.updateAccountFailure({error}));
          }),
        );
      }),
    ),
  );

  // Delete Account
  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.deleteAccount),
      switchMap(({accountId}) => {
        this.accountsCache.delete(accountId);
        return from(
          this.firestoreService.deleteDocument("accounts", accountId),
        ).pipe(
          map(() => {
            this.router.navigate(["/"]);
            this.toastController
              .create({
                message: "Account deleted successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return AccountActions.deleteAccountSuccess({accountId});
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Error deleting account: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(AccountActions.deleteAccountFailure({error}));
          }),
        );
      }),
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
              (accountData) => ({...(accountData as Account)}),
            );
            this.toastController
              .create({
                message: `Found ${accounts.length} accounts`,
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return AccountActions.searchAccountsSuccess({accounts});
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Search failed: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(AccountActions.searchAccountsFailure({error}));
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
            this.toastController
              .create({
                message: "Related account created successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return AccountActions.createRelatedAccountSuccess({
              accountId,
              relatedAccount: newRelatedAccount,
            });
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Failed to create related account: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(AccountActions.createRelatedAccountFailure({error}));
          }),
        );
      }),
    ),
  );

  // Delete Related Account
  deleteRelatedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.deleteRelatedAccount),
      mergeMap(({accountId, relatedAccountId}) => {
        // Clear related accounts cache
        this.relatedAccountsCache.delete(accountId);

        return from(
          this.firestoreService.deleteDocumentAtPath(
            `accounts/${accountId}/relatedAccounts/${relatedAccountId}`,
          ),
        ).pipe(
          map(() => {
            this.toastController
              .create({
                message: "Related account removed successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return AccountActions.deleteRelatedAccountSuccess({
              accountId,
              relatedAccountId,
            });
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Failed to remove related account: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(AccountActions.deleteRelatedAccountFailure({error}));
          }),
        );
      }),
    ),
  );

  // Load Related Accounts
  loadRelatedAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadRelatedAccounts),
      switchMap(({accountId}) => {
        const cachedRelatedAccounts = this.relatedAccountsCache.get(accountId);
        if (cachedRelatedAccounts) {
          return of(
            AccountActions.loadRelatedAccountsSuccess({
              accountId,
              relatedAccounts: cachedRelatedAccounts,
            }),
          );
        }

        return this.firestoreService.getRelatedAccounts(accountId).pipe(
          map((relatedAccounts) => {
            this.relatedAccountsCache.set(accountId, relatedAccounts);
            setTimeout(() => {
              this.relatedAccountsCache.delete(accountId);
            }, this.cacheExpiration);

            this.toastController
              .create({
                message: `Loaded ${relatedAccounts.length} related accounts`,
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return AccountActions.loadRelatedAccountsSuccess({
              accountId,
              relatedAccounts,
            });
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Error loading related accounts: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(AccountActions.loadRelatedAccountsFailure({error}));
          }),
        );
      }),
    ),
  );

  // Update Related Account
  updateRelatedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.updateRelatedAccount),
      debounceTime(300),
      switchMap(({accountId, relatedAccount}) => {
        // Clear related accounts cache
        this.relatedAccountsCache.delete(accountId);

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
            this.toastController
              .create({
                message: "Related account updated successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return AccountActions.updateRelatedAccountSuccess({
              accountId,
              relatedAccount: updatedRelatedAccount,
            });
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Update failed: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(AccountActions.updateRelatedAccountFailure({error}));
          }),
        );
      }),
    ),
  );

  // Load Related Listings
  loadRelatedListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadRelatedListings),
      mergeMap(({accountId}) => {
        const cachedRelatedListings = this.relatedListingsCache.get(accountId);
        if (cachedRelatedListings) {
          return of(
            AccountActions.loadRelatedListingsSuccess({
              accountId,
              relatedListings: cachedRelatedListings,
            }),
          );
        }

        return this.firestoreService
          .getDocuments<RelatedListing>(`accounts/${accountId}/relatedListings`)
          .pipe(
            map((relatedListings) => {
              this.relatedListingsCache.set(accountId, relatedListings);
              setTimeout(() => {
                this.relatedListingsCache.delete(accountId);
              }, this.cacheExpiration);

              this.toastController
                .create({
                  message: `Loaded ${relatedListings.length} related listings`,
                  duration: 2000,
                  color: "success",
                })
                .then((toast) => toast.present());
              return AccountActions.loadRelatedListingsSuccess({
                accountId,
                relatedListings,
              });
            }),
            catchError((error) => {
              this.toastController
                .create({
                  message: `Error loading related listings: ${error.message}`,
                  duration: 2000,
                  color: "danger",
                })
                .then((toast) => toast.present());
              return of(AccountActions.loadRelatedListingsFailure({error}));
            }),
          );
      }),
    ),
  );

  // Sync Auth User with Account
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
        return {type: "NO_ACTION"};
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
      mergeMap(({accountId, relatedListingId}) => {
        // Clear related listings cache
        this.relatedListingsCache.delete(accountId);

        return from(
          this.firestoreService.deleteDocumentAtPath(
            `accounts/${accountId}/relatedListings/${relatedListingId}`,
          ),
        ).pipe(
          map(() => {
            this.toastController
              .create({
                message: "Related listing removed successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return AccountActions.deleteRelatedListingSuccess({
              accountId,
              relatedListingId,
            });
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Failed to remove related listing: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(AccountActions.deleteRelatedListingFailure({error}));
          }),
        );
      }),
    ),
  );
}
