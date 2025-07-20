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
// list.page.ts

import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, combineLatest, of} from "rxjs";
import {map} from "rxjs/operators";
import {AuthUser} from "@shared/models/auth-user.model";
import {Account, RelatedAccount} from "@shared/models/account.model";
import {GroupRole} from "@shared/models/group-role.model";
import {
  selectAccountById,
  selectRelatedAccountsByAccountId,
  selectGroupRolesByGroupId,
} from "../../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../../state/actions/account.actions";
import {take} from "rxjs/operators";
import {MetaService} from "../../../../../core/services/meta.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
})
export class ListPage implements OnInit {
  // Route Parameters
  accountId: string | null = null;
  listType: string | null = null;

  // Observables
  currentUser$!: Observable<AuthUser | null>;
  account$!: Observable<Partial<Account> | undefined>;
  relatedAccounts$!: Observable<Partial<RelatedAccount>[]>;
  currentRelatedAccountsList$!: Observable<Partial<RelatedAccount>[]>;
  pendingRelatedAccountsList$!: Observable<Partial<RelatedAccount>[]>;
  isOwner$!: Observable<boolean>;
  title$!: Observable<string>;
  isGroupAdmin$!: Observable<boolean>;
  canManageRoles$!: Observable<boolean>;
  showEditControls$!: Observable<boolean>;
  accessOptions = ["admin", "moderator", "member"] as const;
  customRoles$!: Observable<GroupRole[]>;
  relationshipOptions = [
    "admin",
    "friend",
    "member",
    "partner",
    "family",
    "parent",
    "child",
    "boss",
    "employee",
    "volunteer",
    "sibling",
    "parent-org",
    "child-org",
    "external",
  ] as const;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private metaService: MetaService,
    private store: Store,
  ) {
    // Extract route parameters
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
    this.listType = this.activatedRoute.snapshot.paramMap.get("listType");
  }

  ngOnInit() {
    // Select the authenticated user from the store
    this.currentUser$ = this.store.select(selectAuthUser);

    if (this.accountId) {
      // Dispatch an action to load the account details if not already loaded
      this.store.dispatch(
        AccountActions.loadAccount({accountId: this.accountId}),
      );

      // Select the specific account by ID
      this.account$ = this.store.select(selectAccountById(this.accountId));

      // Select related accounts where initiatorId or targetId equals accountId
      this.relatedAccounts$ = this.store.select(
        selectRelatedAccountsByAccountId(this.accountId),
      );

      // Determine ownership based on current user and accountId
      this.isOwner$ = combineLatest([
        this.currentUser$,
        of(this.accountId),
      ]).pipe(
        map(([currentUser, accountId]) => currentUser?.uid === accountId),
      );

      // Determine the title based on listType and account.type
      this.title$ = this.account$.pipe(
        map((account) => {
          if (this.listType === "user" && account?.type === "user") {
            return "Friends";
          } else if (this.listType === "user" && account?.type === "group") {
            return "Members";
          } else if (this.listType === "group" && account?.type === "group") {
            return "Partners";
          } else if (this.listType === "group" && account?.type === "user") {
            return "Organizations";
          }
          return "";
        }),
      );

      // Filter related accounts into current and pending lists
      this.currentRelatedAccountsList$ = this.relatedAccounts$.pipe(
        map((relatedAccounts) =>
          relatedAccounts.filter(
            (ra) => ra.type === this.listType && ra.status === "accepted",
          ),
        ),
      );

      this.pendingRelatedAccountsList$ = this.relatedAccounts$.pipe(
        map((relatedAccounts) =>
          relatedAccounts.filter(
            (ra) => ra.type === this.listType && ra.status === "pending",
          ),
        ),
      );

      this.isGroupAdmin$ = combineLatest([
        this.currentUser$,
        this.relatedAccounts$,
      ]).pipe(
        map(([currentUser, relatedAccounts]) => {
          if (!currentUser) return false;
          const rel = relatedAccounts.find((ra) => ra.id === currentUser.uid);
          return (
            rel?.status === "accepted" &&
            (rel.access === "admin" || rel.access === "moderator")
          );
        }),
      );

      this.canManageRoles$ = combineLatest([
        this.isGroupAdmin$,
        this.isOwner$,
      ]).pipe(map(([admin, owner]) => admin || owner));

      this.showEditControls$ = combineLatest([
        this.account$,
        this.currentUser$,
        this.isGroupAdmin$,
      ]).pipe(
        map(
          ([account, user, isAdmin]) =>
            !!account &&
            account.type === "group" &&
            !!user &&
            (isAdmin || user.uid === account.id),
        ),
      );

      this.customRoles$ = this.store.select(
        selectGroupRolesByGroupId(this.accountId),
      );
      this.store.dispatch(
        AccountActions.loadGroupRoles({groupId: this.accountId}),
      );
    }
  }

  ionViewWillEnter() {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
    this.listType = this.activatedRoute.snapshot.paramMap.get("listType");
    // Dynamic Meta Tags
    const isUserList = this.listType === "user";
    const title = isUserList
      ? "Users | ASCENDynamics NFP"
      : "Organizations | ASCENDynamics NFP";
    const description = isUserList
      ? "Explore a diverse list of users contributing to the ASCENDynamics NFP community."
      : "Discover organizations making an impact through volunteering and community efforts on ASCENDynamics NFP.";
    const keywords = isUserList
      ? "users, profiles, volunteer"
      : "organizations, nonprofits, community";

    this.metaService.updateMetaTags(
      title,
      description,
      keywords,
      {
        title: title,
        description: description,
        url: `https://app.ASCENDynamics.org/account/${this.accountId}/related/${this.listType}`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: title,
        description: description,
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );
  }

  /**
   * Updates the status of a related account.
   * @param request The related account request to update.
   * @param status The new status to set.
   */
  updateStatus(request: Partial<RelatedAccount>, status: string) {
    this.currentUser$.pipe(take(1)).subscribe((authUser) => {
      if (!authUser?.uid || !request.id) {
        console.error("User ID or Account ID is missing");
        return;
      }

      if (!this.accountId || !request.id) return;

      const updatedRelatedAccount: RelatedAccount = {
        id: request.id,
        accountId: request.accountId || this.accountId,
        status: status as "pending" | "accepted" | "rejected" | "blocked",
        lastModifiedBy: authUser.uid,
      };

      // Dispatch an action to update the related account's status
      this.store.dispatch(
        AccountActions.updateRelatedAccount({
          accountId: this.accountId,
          relatedAccount: updatedRelatedAccount,
        }),
      );
    });
  }

  /**
   * Accepts a related account request.
   * @param request The related account request to accept.
   */
  acceptRequest(request: Partial<RelatedAccount>) {
    this.updateStatus(request, "accepted");
  }

  /**
   * Rejects a related account request.
   * @param request The related account request to reject.
   */
  rejectRequest(request: Partial<RelatedAccount>) {
    this.updateStatus(request, "rejected");
  }

  /**
   * Removes a related account request.
   * @param request The related account request to remove.
   */
  removeRequest(request: Partial<RelatedAccount>) {
    if (!this.accountId || !request.id) return;

    // Dispatch an action to delete the related account
    this.store.dispatch(
      AccountActions.deleteRelatedAccount({
        accountId: this.accountId,
        relatedAccountId: request.id,
      }),
    );
  }

  updateAccess(request: Partial<RelatedAccount>, access: "admin" | "moderator" | "member") {
    this.currentUser$.pipe(take(1)).subscribe((authUser) => {
      if (!authUser?.uid || !request.id || !this.accountId) return;
      const updated: RelatedAccount = {
        ...(request as RelatedAccount),
        accountId: this.accountId,
        access: access,
        lastModifiedBy: authUser.uid,
      };
      this.store.dispatch(
        AccountActions.updateRelatedAccount({
          accountId: this.accountId!,
          relatedAccount: updated,
        }),
      );
    });
  }

  updateRole(request: Partial<RelatedAccount>, roleId: string) {
    this.currentUser$.pipe(take(1)).subscribe((authUser) => {
      if (!authUser?.uid || !request.id || !this.accountId) return;
      const updated: RelatedAccount = {
        ...(request as RelatedAccount),
        accountId: this.accountId,
        roleId,
        lastModifiedBy: authUser.uid,
      };
      this.store.dispatch(
        AccountActions.updateRelatedAccount({
          accountId: this.accountId!,
          relatedAccount: updated,
        }),
      );
    });
  }

  updateRelationship(request: Partial<RelatedAccount>, relationship: string) {
    this.currentUser$.pipe(take(1)).subscribe((authUser) => {
      if (!authUser?.uid || !request.id || !this.accountId) return;
      const updated: RelatedAccount = {
        ...(request as RelatedAccount),
        accountId: this.accountId,
        relationship: relationship as any,
        lastModifiedBy: authUser.uid,
      };
      this.store.dispatch(
        AccountActions.updateRelatedAccount({
          accountId: this.accountId!,
          relatedAccount: updated,
        }),
      );
    });
  }

  /**
   * Determines whether to show accept/reject buttons for a related account.
   * @param request The related account request.
   * @returns An observable emitting a boolean.
   */
  showAcceptRejectButtons(
    request: Partial<RelatedAccount>,
  ): Observable<boolean> {
    return combineLatest([this.isOwner$, this.currentUser$]).pipe(
      map(
        ([isOwner, currentUser]) =>
          isOwner &&
          request.status === "pending" &&
          request.initiatorId !== currentUser?.uid,
      ),
    );
  }

  /**
   * Determines whether to show the remove button for a related account.
   * @param request The related account request.
   * @returns An observable emitting a boolean.
   */
  showRemoveButton(request: Partial<RelatedAccount>): Observable<boolean> {
    return combineLatest([this.isOwner$, this.currentUser$]).pipe(
      map(
        ([isOwner, currentUser]) =>
          isOwner &&
          (request.status === "accepted" ||
            (request.status === "pending" &&
              request.initiatorId === currentUser?.uid)),
      ),
    );
  }

  /**
   * Helper method to determine the other account ID in a related account.
   * @param relatedAccount The related account object.
   * @returns The ID of the other account or null if not found.
   */
  getOtherId(relatedAccount: Partial<RelatedAccount>): string | null {
    if (!this.accountId) return null;
    if (
      relatedAccount.initiatorId &&
      relatedAccount.initiatorId !== this.accountId
    ) {
      return relatedAccount.initiatorId;
    }
    if (relatedAccount.targetId && relatedAccount.targetId !== this.accountId) {
      return relatedAccount.targetId;
    }
    return null;
  }

  /**
   * TrackBy function to optimize *ngFor rendering.
   * @param index The index of the item.
   * @param item The related account item.
   * @returns The unique identifier for the item.
   */
  trackById(index: number, item: Partial<RelatedAccount>): string {
    return item.id ? item.id : index.toString();
  }

  /**
   * Navigates to the selected related account.
   * @param id The account ID to navigate to.
   */
  goToRelatedAccount(id: string | null | undefined) {
    if (id) {
      this.router.navigate([`/account/${id}`]);
    }
  }
}
