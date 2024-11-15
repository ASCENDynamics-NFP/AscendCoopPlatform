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
} from "rxjs/operators";
import {FirestoreService} from "../../core/services/firestore.service";
import {Account} from "../../models/account.model";
import {RelatedListing} from "../../models/related-listing.model";
import {selectAuthUser} from "../selectors/auth.selectors";
import {Store} from "@ngrx/store";
import * as AuthActions from "../actions/auth.actions";
import {selectAccountEntities} from "../selectors/account.selectors";
import {serverTimestamp} from "@angular/fire/firestore";

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private store: Store,
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
      mergeMap(({accountId}) =>
        this.firestoreService.getAccountWithRelated(accountId).pipe(
          map(({account, relatedAccounts, relatedListings}) => {
            if (account) {
              return AccountActions.loadAccountSuccess({
                account,
                relatedAccounts,
                relatedListings,
              });
            }
            return AccountActions.loadAccountFailure({
              error: "Account not found",
            });
          }),
          catchError((error) => of(AccountActions.loadAccountFailure({error}))),
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
            if (accountId) {
              return AccountActions.createAccountSuccess({
                account: {...newAccount, id: accountId},
              });
            } else {
              return AccountActions.createAccountFailure({
                error: "Failed to create account",
              });
            }
          }),
          catchError((error) =>
            of(AccountActions.createAccountFailure({error})),
          ),
        );
      }),
    ),
  );

  // Update Account
  updateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.updateAccount),
      switchMap(({account}) => {
        const updatedAccount = {
          ...account,
          lastModifiedAt: serverTimestamp(), // Always update
        };
        return from(
          this.firestoreService.updateDocument(
            "accounts",
            account.id,
            updatedAccount,
          ),
        ).pipe(
          map(() =>
            AccountActions.updateAccountSuccess({account: updatedAccount}),
          ),
          catchError((error) =>
            of(AccountActions.updateAccountFailure({error})),
          ),
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
          map(() => AccountActions.deleteAccountSuccess({accountId})),
          catchError((error) =>
            of(AccountActions.deleteAccountFailure({error})),
          ),
        ),
      ),
    ),
  );

  // Search Accounts
  searchAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.searchAccounts),
      switchMap(({query}) =>
        from(this.firestoreService.searchAccountByName("accounts", query)).pipe(
          map((accountsData) => {
            const accounts: Account[] = (accountsData || []).map(
              (accountData) => ({
                ...(accountData as Account),
              }),
            );
            return AccountActions.searchAccountsSuccess({accounts});
          }),
          catchError((error) =>
            of(AccountActions.searchAccountsFailure({error})),
          ),
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
          map(() =>
            AccountActions.createRelatedAccountSuccess({
              accountId,
              relatedAccount: newRelatedAccount,
            }),
          ),
          catchError((error) =>
            of(AccountActions.createRelatedAccountFailure({error})),
          ),
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
          map(() =>
            AccountActions.deleteRelatedAccountSuccess({
              accountId,
              relatedAccountId,
            }),
          ),
          catchError((error) =>
            of(AccountActions.deleteRelatedAccountFailure({error})),
          ),
        ),
      ),
    ),
  );

  // Load Related Accounts
  loadRelatedAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadRelatedAccounts),
      switchMap(({accountId}) =>
        this.firestoreService.getRelatedAccounts(accountId).pipe(
          map((relatedAccounts) =>
            AccountActions.loadRelatedAccountsSuccess({
              accountId,
              relatedAccounts,
            }),
          ),
          catchError((error) =>
            of(AccountActions.loadRelatedAccountsFailure({error})),
          ),
        ),
      ),
    ),
  );

  // Update Related Account
  updateRelatedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.updateRelatedAccount),
      switchMap(({accountId, relatedAccount}) => {
        const updatedRelatedAccount = {
          ...relatedAccount,
          lastModifiedAt: serverTimestamp(), // Always update
        };
        return from(
          this.firestoreService.updateDocument(
            `accounts/${accountId}/relatedAccounts`,
            relatedAccount.id,
            updatedRelatedAccount,
          ),
        ).pipe(
          map(() =>
            AccountActions.updateRelatedAccountSuccess({
              accountId,
              relatedAccount: updatedRelatedAccount,
            }),
          ),
          catchError((error) =>
            of(AccountActions.updateRelatedAccountFailure({error})),
          ),
        );
      }),
    ),
  );

  // Load Related Listings
  loadRelatedListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadRelatedListings),
      mergeMap(({accountId}) =>
        this.firestoreService
          .getCollectionWithCondition<RelatedListing>(
            `accounts/${accountId}/relatedListings`,
            "status",
            "in",
            ["active", "filled"],
          )
          .pipe(
            map((relatedListings) =>
              AccountActions.loadRelatedListingsSuccess({
                accountId,
                relatedListings,
              }),
            ),
            catchError((error) =>
              of(AccountActions.loadRelatedListingsFailure({error})),
            ),
          ),
      ),
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
}
