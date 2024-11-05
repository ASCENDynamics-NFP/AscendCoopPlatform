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
import {from, of} from "rxjs";
import {switchMap, map, catchError, mergeMap} from "rxjs/operators";
import {FirestoreService} from "../../core/services/firestore.service";
import {Account} from "../../models/account.model";
import {RelatedListing} from "../../models/related-listing.model";

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
  ) {}

  // Load Accounts
  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccounts),
      switchMap(() =>
        this.firestoreService.getAllAccounts().pipe(
          map((accounts) => AccountActions.loadAccountsSuccess({accounts})),
          catchError((error) => {
            console.error("Effect: Error loading account:", error);
            return of(
              AccountActions.loadAccountFailure({
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
              const enhancedAccount: Account = {
                ...account,
                relatedAccountIds: relatedAccounts.map((ra) => ra.id),
                relatedListingIds: relatedListings.map((rl) => rl.id),
              };
              return AccountActions.loadAccountSuccess({
                account: enhancedAccount,
                relatedAccounts,
                relatedListings,
              });
            }
            return AccountActions.loadAccountFailure({
              error: "Account not found",
            });
          }),
        ),
      ),
    ),
  );

  // Create Account
  createAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.createAccount),
      switchMap(({account}) =>
        from(this.firestoreService.addDocument("accounts", account)).pipe(
          map((accountId) => {
            if (accountId) {
              return AccountActions.createAccountSuccess({
                account: {...account, id: accountId},
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
        ),
      ),
    ),
  );

  // Update Account
  updateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.updateAccount),
      switchMap(({account}) =>
        from(
          this.firestoreService.updateDocument("accounts", account.id, account),
        ).pipe(
          map(() => AccountActions.updateAccountSuccess({account})),
          catchError((error) =>
            of(AccountActions.updateAccountFailure({error})),
          ),
        ),
      ),
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

  // Effect to handle creating a related account
  createRelatedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.createRelatedAccount),
      switchMap(({accountId, relatedAccount}) =>
        from(
          this.firestoreService.setDocument(
            `accounts/${accountId}/relatedAccounts/${relatedAccount.id}`, // Specify the document path with the relatedAccount.id
            relatedAccount,
          ),
        ).pipe(
          map(() =>
            AccountActions.createRelatedAccountSuccess({
              relatedAccount,
            }),
          ),
          catchError((error) =>
            of(AccountActions.createRelatedAccountFailure({error})),
          ),
        ),
      ),
    ),
  );

  // Using deleteDocumentAtPath (Correct)
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
            AccountActions.loadRelatedAccountsSuccess({relatedAccounts}),
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
      switchMap(({accountId, relatedAccount}) =>
        from(
          this.firestoreService.updateDocument(
            `accounts/${accountId}/relatedAccounts`,
            relatedAccount.id,
            relatedAccount,
          ),
        ).pipe(
          map(() =>
            AccountActions.updateRelatedAccountSuccess({relatedAccount}),
          ),
          catchError((error) =>
            of(AccountActions.updateRelatedAccountFailure({error})),
          ),
        ),
      ),
    ),
  );

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
              AccountActions.loadRelatedListingsSuccess({relatedListings}),
            ),
            catchError((error) =>
              of(AccountActions.loadRelatedListingsFailure({error})),
            ),
          ),
      ),
    ),
  );
}
