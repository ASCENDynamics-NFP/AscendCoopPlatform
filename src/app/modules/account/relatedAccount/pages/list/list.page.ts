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
  account$: Observable<Partial<Account> | undefined> = of(undefined);
  relatedAccounts$: Observable<Partial<RelatedAccount>[]> = of([]);
  currentRelatedAccountsList$: Observable<Partial<RelatedAccount>[]> = of([]);
  pendingRelatedAccountsList$: Observable<Partial<RelatedAccount>[]> = of([]);
  isOwner$: Observable<boolean> = of(false);
  title$: Observable<string> = of("");
  isGroupAdmin$: Observable<boolean> = of(false);
  canManageRoles$: Observable<boolean> = of(false);
  showAccessControls$: Observable<boolean> = of(false);
  showRoleControls$: Observable<boolean> = of(false);
  accessOptions = ["admin", "moderator", "member"] as const;
  customRoles$!: Observable<GroupRole[]>;
  filteredUserRoles$!: Observable<GroupRole[]>;
  filteredOrganizationRoles$!: Observable<GroupRole[]>;
  relationshipOptions = ["friend", "member", "partner", "family"] as const;
  // UI privacy helpers
  listVisibility$: Observable<string> = of("public");
  showPrivateNotice$: Observable<boolean> = of(false);
  ownerListBadge$: Observable<{
    sectionLabel: string;
    text: string;
    color: string;
    allowCount: number;
    blockCount: number;
  } | null> = of(null);
  canViewList$: Observable<boolean> = of(true);
  // Segmented views: list (default), roles, hierarchy
  activeView: "list" | "roles" | "hierarchy" = "list";

  onViewChange(ev: CustomEvent) {
    const v = (ev as any)?.detail?.value;
    this.activeView =
      v === "roles" || v === "hierarchy" || v === "list" ? v : "list";
  }

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
      // Ensure related accounts are loaded for privacy/access evaluation
      this.store.dispatch(
        AccountActions.loadRelatedAccounts({accountId: this.accountId}),
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

      // Determine group admin/moderator (denormalized on account)
      this.isGroupAdmin$ = combineLatest([
        this.currentUser$,
        this.account$,
      ]).pipe(
        map(([currentUser, account]) => {
          if (!currentUser || !account) return false;
          if (account.type !== "group") return false;
          const inAdmins = Array.isArray((account as any).adminIds)
            ? (account as any).adminIds.includes(currentUser.uid)
            : false;
          const inModerators = Array.isArray((account as any).moderatorIds)
            ? (account as any).moderatorIds.includes(currentUser.uid)
            : false;
          const isOwner = account.id === currentUser.uid;
          return isOwner || inAdmins || inModerators;
        }),
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

      // Determine section visibility configured for this list
      this.listVisibility$ = this.account$.pipe(
        map((account) => {
          const vis = account?.privacySettings;
          if (!vis) return "public";
          const type = account?.type;
          if (type === "group") {
            return this.listType === "user"
              ? (vis.membersList?.visibility as string) || "members"
              : (vis.partnersList?.visibility as string) || "members";
          }
          if (type === "user") {
            return this.listType === "user"
              ? (vis.friendsList?.visibility as string) || "friends"
              : (vis.membersList?.visibility as string) || "authenticated";
          }
          return "public";
        }),
      );

      // Show a gentle notice if list is empty and the audience isn't public/authenticated
      this.showPrivateNotice$ = combineLatest([
        this.currentRelatedAccountsList$,
        this.listVisibility$,
      ]).pipe(
        map(([items, visibility]) => {
          const empty = (items?.length || 0) === 0;
          const isRestricted =
            visibility !== "public" && visibility !== "authenticated";
          return empty && isRestricted;
        }),
      );

      // Owner badge showing who can see this section (members/partners/friends)
      this.ownerListBadge$ = combineLatest([
        this.account$,
        this.listVisibility$,
        combineLatest([this.isOwner$, this.isGroupAdmin$]).pipe(
          map(([own, admin]) => own || admin),
        ),
      ]).pipe(
        map(([account, vis, canSee]) => {
          if (!account || !canSee) return null;
          const sectionKey = this.getSectionKeyForList(account.type || "user");
          const sectionLabel = this.getSectionLabelForList(
            account.type || "user",
          );
          const ps: any = account.privacySettings || {};
          const section = ps[sectionKey] || {};
          const allowCount = Array.isArray(section.allowlist)
            ? section.allowlist.length
            : 0;
          const blockCount = Array.isArray(section.blocklist)
            ? section.blocklist.length
            : 0;
          const {text, color} = this.mapVisibility(vis);
          return {sectionLabel, text, color, allowCount, blockCount};
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

      this.showAccessControls$ = combineLatest([
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

      this.showRoleControls$ = combineLatest([
        this.account$,
        this.currentUser$,
      ]).pipe(
        map(
          ([account, user]) => !!account && !!user && user.uid === account.id,
        ),
      );

      this.customRoles$ = this.store.select(
        selectGroupRolesByGroupId(this.accountId),
      );

      // Create filtered role observables for different account types
      this.filteredUserRoles$ = this.customRoles$.pipe(
        map((roles) =>
          roles.filter((role) => !role.roleType || role.roleType === "user"),
        ),
      );

      this.filteredOrganizationRoles$ = this.customRoles$.pipe(
        map((roles) =>
          roles.filter(
            (role) => !role.roleType || role.roleType === "organization",
          ),
        ),
      );

      this.store.dispatch(
        AccountActions.loadGroupRoles({groupId: this.accountId}),
      );
      // Compute current and pending lists (status-based)
      this.currentRelatedAccountsList$ = combineLatest([
        this.relatedAccounts$,
        this.account$,
        of(this.listType),
      ]).pipe(
        map(([list, account, listType]) => {
          const accType = account?.type || "user";
          return (list || []).filter((ra) => {
            if (ra.status !== "accepted") return false;
            if (accType === "user" && listType === "user") {
              return ra.relationship === "friend";
            }
            if (accType === "user" && listType === "group") {
              return ra.relationship === "member";
            }
            if (accType === "group" && listType === "user") {
              return ra.relationship === "member";
            }
            if (accType === "group" && listType === "group") {
              return ra.relationship === "partner";
            }
            // Fallback to legacy type if present
            return (ra as any).type === listType;
          });
        }),
      );
      this.pendingRelatedAccountsList$ = this.relatedAccounts$.pipe(
        map((list) => (list || []).filter((ra) => ra.status === "pending")),
      );

      // Determine section key and label for this list
      const sectionKey$ = this.account$.pipe(
        map((acc) =>
          acc?.type ? this.getSectionKeyForList(acc.type) : "membersList",
        ),
      );

      // Visibility value for the section
      this.listVisibility$ = combineLatest([this.account$, sectionKey$]).pipe(
        map(([acc, key]) => {
          const v = (acc as any)?.privacySettings?.[key]?.visibility as
            | string
            | undefined;
          return v || "public";
        }),
      );

      // Owner-only badge mirroring details page styling
      this.ownerListBadge$ = combineLatest([
        this.account$,
        sectionKey$,
        this.listVisibility$,
      ]).pipe(
        map(([acc, key, vis]) => {
          if (!acc) return null;
          const {text, color} = this.mapVisibility(vis);
          const section = (acc as any)?.privacySettings?.[key] || {};
          const allowCount = Array.isArray(section.allowlist)
            ? section.allowlist.length
            : 0;
          const blockCount = Array.isArray(section.blocklist)
            ? section.blocklist.length
            : 0;
          return {
            sectionLabel: this.getSectionLabelForList(acc.type || "user"),
            text,
            color,
            allowCount,
            blockCount,
          };
        }),
      );

      // Can current viewer access this section?
      const canView$ = combineLatest([
        this.account$,
        this.currentUser$,
        this.relatedAccounts$,
        sectionKey$,
        this.listVisibility$,
      ]).pipe(
        map(([acc, user, rels, key, vis]) => {
          if (!acc) return false;
          // Owner always
          if (user?.uid === acc.id) return true;
          // Allow/Block lists
          const section = (acc as any)?.privacySettings?.[key] || {};
          const allow = Array.isArray(section.allowlist)
            ? section.allowlist.includes(user?.uid)
            : false;
          const block = Array.isArray(section.blocklist)
            ? section.blocklist.includes(user?.uid)
            : false;
          if (allow) return true;
          if (block) return false;
          // Audience
          switch (vis) {
            case "public":
              return true;
            case "authenticated":
              return !!user;
            case "related": {
              const isRelated = (rels || []).some(
                (r) => r.id === user?.uid && r.status === "accepted",
              );
              return isRelated;
            }
            case "private":
            default:
              return false;
          }
        }),
      );

      // Expose canView$ for template
      this.canViewList$ = canView$;

      // Show private notice only when viewer lacks access (not owner) and list is empty
      this.showPrivateNotice$ = combineLatest([
        this.isOwner$,
        canView$,
        this.currentRelatedAccountsList$,
      ]).pipe(
        map(
          ([isOwner, canView, list]) =>
            !isOwner && !canView && (list || []).length === 0,
        ),
      );
    }
  }

  private getSectionKeyForList(accountType: string): string {
    // Map current list type + account type to privacySettings section key
    if (accountType === "group") {
      return this.listType === "user" ? "membersList" : "partnersList";
    }
    // user account
    return this.listType === "user" ? "friendsList" : "membersList"; // "Groups"
  }

  private getSectionLabelForList(accountType: string): string {
    if (accountType === "group") {
      return this.listType === "user" ? "Members List" : "Partners List";
    }
    return this.listType === "user" ? "Friends List" : "Groups";
  }

  private mapVisibility(v: string): {text: string; color: string} {
    const map: Record<string, {text: string; color: string}> = {
      public: {text: "Public", color: "success"},
      authenticated: {text: "Authorized", color: "medium"},
      related: {text: "Related", color: "primary"},
      private: {text: "Private", color: "danger"},
    };
    return map[v] || {text: v, color: "medium"};
  }

  updateSectionOverride(
    request: Partial<RelatedAccount>,
    sectionKey: string,
    allow: boolean,
  ) {
    if (!this.accountId || !request.id) return;
    const updated: RelatedAccount = {
      ...(request as RelatedAccount),
      accountId: this.accountId,
      sectionOverrides: {
        ...(request.sectionOverrides || {}),
        [sectionKey]: {allow},
      },
      // keep legacy flag in sync for contact info
      ...(sectionKey === "contactInformation"
        ? {canAccessContactInfo: allow}
        : {}),
    };
    this.store.dispatch(
      AccountActions.updateRelatedAccount({
        accountId: this.accountId,
        relatedAccount: updated,
      }),
    );
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
        url: `https://ascendynamics.org/account/${this.accountId}/related/${this.listType}`,
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
   * Gets the current role IDs for a related account, supporting both single and multiple roles
   * @param relatedAccount The related account to get role IDs for
   * @returns Array of role IDs
   */
  getCurrentRoleIds(relatedAccount: Partial<RelatedAccount>): string[] {
    if (relatedAccount.roleIds && relatedAccount.roleIds.length > 0) {
      return relatedAccount.roleIds;
    }
    if (relatedAccount.roleId) {
      return [relatedAccount.roleId];
    }
    return [];
  }

  /**
   * Gets the appropriate roles for a related account based on its type,
   * excluding roles from categories that are already selected
   * @param relatedAccount The related account to get roles for
   * @returns Observable of filtered roles
   */
  getRolesForAccount(
    relatedAccount: Partial<RelatedAccount>,
  ): Observable<GroupRole[]> {
    const currentRoleIds = this.getCurrentRoleIds(relatedAccount);

    let baseRoles$: Observable<GroupRole[]>;
    if (relatedAccount.type === "user") {
      baseRoles$ = this.filteredUserRoles$;
    } else if (relatedAccount.type === "group") {
      baseRoles$ = this.filteredOrganizationRoles$;
    } else {
      baseRoles$ = this.customRoles$;
    }

    return baseRoles$.pipe(
      map((roles) => {
        if (currentRoleIds.length === 0) {
          return roles; // Show all roles if none selected
        }

        // Get categories of currently selected roles
        const selectedRoles = roles.filter((role) =>
          currentRoleIds.includes(role.id),
        );
        const selectedCategories = new Set(
          selectedRoles
            .map((role) => role.standardCategory)
            .filter((category) => category !== undefined),
        );

        // Filter out roles from categories that are already selected,
        // but keep already selected roles so they can be deselected
        return roles.filter(
          (role) =>
            currentRoleIds.includes(role.id) || // Keep currently selected roles
            !role.standardCategory || // Keep roles without category
            !selectedCategories.has(role.standardCategory), // Keep roles from unselected categories
        );
      }),
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

  updateAccess(
    request: Partial<RelatedAccount>,
    access: "admin" | "moderator" | "member",
  ) {
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

  updateRoles(request: Partial<RelatedAccount>, roleIds: string[]) {
    this.currentUser$.pipe(take(1)).subscribe((authUser) => {
      if (!authUser?.uid || !request.id || !this.accountId) return;

      const updated: Partial<RelatedAccount> = {
        ...(request as RelatedAccount),
        accountId: this.accountId,
        lastModifiedBy: authUser.uid,
      };

      // Only set role fields if there are roles selected
      if (roleIds && roleIds.length > 0) {
        updated.roleIds = roleIds;
        updated.roleId = roleIds[0]; // Keep backward compatibility
      } else {
        // For Firestore, we need to explicitly remove the fields
        // by not including them in the update object
        delete updated.roleIds;
        delete updated.roleId;
      }

      this.store.dispatch(
        AccountActions.updateRelatedAccount({
          accountId: this.accountId!,
          relatedAccount: updated as RelatedAccount,
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
      map(([isOwner, currentUser]) => {
        if (!currentUser || request.status !== "pending") {
          return false;
        }

        // Case 1: User/Group is requesting to join this account (current user is owner of target account)
        // Show buttons if current user owns this account and didn't initiate the request
        const canApproveAsOwner =
          isOwner && request.initiatorId !== currentUser.uid;

        // Case 2: This account invited the current user (current user is target of invitation)
        // Show buttons if current user is the target of the invitation
        const canApproveAsTarget = request.targetId === currentUser.uid;

        return canApproveAsOwner || canApproveAsTarget;
      }),
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
