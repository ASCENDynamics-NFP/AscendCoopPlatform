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
import {EMPTY, from, of, firstValueFrom} from "rxjs";
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
import {AccountsService} from "../../core/services/accounts.service";
import {ListingsService} from "../../core/services/listings.service";
import {StorageService} from "../../core/services/storage.service";
import {Account} from "@shared/models/account.model";
import {GroupRole} from "@shared/models/group-role.model";
import {RelatedListing} from "@shared/models/related-listing.model";
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
  selectAreAccountsFresh,
  selectAreRelatedAccountsFresh,
  selectAreRelatedListingsFresh,
  selectAreGroupRolesFresh,
} from "../selectors/account.selectors";

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private accountsService: AccountsService,
    private listingsService: ListingsService,
    private storageService: StorageService,
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
        this.accountsService.getAllAccounts().pipe(
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
      switchMap(({account}) =>
        from(this.createAccountWithResume(account)).pipe(
          map((created) => {
            this.router.navigate([`/accounts/${created.id}`]);
            this.showToast("Account created successfully", "success");
            return AccountActions.createAccountSuccess({account: created});
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
        ),
      ),
    ),
  );

  // Update Account
  updateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.updateAccount),
      debounceTime(300),
      switchMap(({account}) =>
        from(this.updateAccountWithResume(account)).pipe(
          map((updated) => {
            this.showToast("Account updated successfully", "success");
            return AccountActions.updateAccountSuccess({account: updated});
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
        from(this.accountsService.searchAccountByName("accounts", query)).pipe(
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
            this.accountsService.getRelatedAccounts(accountId).pipe(
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
            this.listingsService
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

  // Load Group Roles if not fresh
  loadGroupRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadGroupRoles),
      mergeMap(({groupId}) =>
        this.store.select(selectAreGroupRolesFresh(groupId)).pipe(
          take(1),
          filter((fresh) => !fresh),
          switchMap(() =>
            this.firestoreService
              .getDocument<Account>("accounts", groupId)
              .pipe(
                map((account) =>
                  AccountActions.loadGroupRolesSuccess({
                    groupId,
                    roles: account?.roles || [],
                  }),
                ),
                catchError((error) =>
                  of(
                    AccountActions.loadGroupRolesFailure({
                      error: error.message,
                    }),
                  ),
                ),
              ),
          ),
        ),
      ),
    ),
  );

  createGroupRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.createGroupRole),
      switchMap(({groupId, role}) =>
        from(this.updateRoles(groupId, (roles) => [...roles, role])).pipe(
          map(() => AccountActions.createGroupRoleSuccess({groupId, role})),
          catchError((error) =>
            of(AccountActions.createGroupRoleFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  updateGroupRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.updateGroupRole),
      switchMap(({groupId, role}) =>
        from(
          this.updateRoles(groupId, (roles) =>
            roles.map((r) => (r.id === role.id ? role : r)),
          ),
        ).pipe(
          map(() => AccountActions.updateGroupRoleSuccess({groupId, role})),
          catchError((error) =>
            of(AccountActions.updateGroupRoleFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  deleteGroupRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.deleteGroupRole),
      switchMap(({groupId, roleId}) =>
        from(
          this.updateRoles(groupId, (roles) =>
            roles.filter((r) => r.id !== roleId),
          ),
        ).pipe(
          map(() => AccountActions.deleteGroupRoleSuccess({groupId, roleId})),
          catchError((error) =>
            of(AccountActions.deleteGroupRoleFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  private async updateRoles(
    groupId: string,
    modifier: (roles: GroupRole[]) => GroupRole[],
  ): Promise<GroupRole[]> {
    const account = await firstValueFrom(
      this.firestoreService.getDocument<Account>("accounts", groupId),
    );
    const currentRoles = account?.roles || [];
    const updatedRoles = modifier(currentRoles);
    await this.firestoreService.updateDocument("accounts", groupId, {
      roles: updatedRoles,
    });
    return updatedRoles;
  }

  private async createAccountWithResume(account: Account): Promise<Account> {
    const newAccount: any = {
      ...account,
      totalHours: account.totalHours ?? 0,
      createdAt: serverTimestamp(),
      lastModifiedAt: serverTimestamp(),
    };

    const file = account.professionalInformation?.resumeUpload;
    if (file instanceof File) {
      newAccount.professionalInformation = {
        ...newAccount.professionalInformation,
        resumeUpload: null,
      };
    }

    const accountId = await this.firestoreService.addDocument(
      "accounts",
      newAccount,
    );

    let resumeUrl: string | null = null;
    if (file instanceof File) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const filePath = `accounts/${accountId}/resume.${extension}`;
      resumeUrl = await this.storageService.uploadFile(filePath, file);
      await this.firestoreService.updateDocument("accounts", accountId, {
        professionalInformation: {
          ...newAccount.professionalInformation,
          resumeUpload: resumeUrl,
        },
      });
    }

    return {
      ...newAccount,
      id: accountId,
      professionalInformation: {
        ...newAccount.professionalInformation,
        resumeUpload: resumeUrl,
      },
    } as Account;
  }

  private async updateAccountWithResume(account: Account): Promise<Account> {
    let updatedAccount: any = {
      ...account,
      lastModifiedAt: serverTimestamp(),
    };

    const file = account.professionalInformation?.resumeUpload;
    if (file instanceof File) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const filePath = `accounts/${account.id}/resume.${extension}`;
      const resumeUrl = await this.storageService.uploadFile(filePath, file);
      updatedAccount = {
        ...updatedAccount,
        professionalInformation: {
          ...account.professionalInformation,
          resumeUpload: resumeUrl,
        },
      };
    }

    await this.firestoreService.updateDocument(
      "accounts",
      account.id,
      updatedAccount,
    );

    return updatedAccount as Account;
  }

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
