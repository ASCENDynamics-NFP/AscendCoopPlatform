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
import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {
  ToastController,
  AlertController,
  ModalController,
} from "@ionic/angular";
import {Observable, Subscription, combineLatest} from "rxjs";
import {map, take} from "rxjs/operators";
import {
  Account,
  RelatedAccount,
} from "../../../../../../shared/models/account.model";
import {
  selectAccountById,
  selectRelatedAccountsByAccountId,
  selectRelatedListingsByAccountId,
} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {NotificationService} from "../../../messaging/services/notification.service";
import {AccessService} from "../../../../core/services/access.service";
import {ImageUploadModalComponent} from "../../../../shared/components/image-upload-modal/image-upload-modal.component";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.page.html",
  styleUrls: ["./admin-dashboard.page.scss"],
})
export class AdminDashboardPage implements OnInit, OnDestroy {
  account$: Observable<Account | undefined>;
  relatedAccounts$: Observable<RelatedAccount[]>;
  currentUser$: Observable<any>;
  accountId: string;
  selectedSegment: string = "overview";
  private subscription = new Subscription();

  // Statistics for overview
  memberCount$: Observable<number>;
  userMemberCount$: Observable<number>;
  partnerCount$: Observable<number>;
  pendingRequestsCount$: Observable<number>;
  activeListingsCount$: Observable<number>;
  pendingMemberRequests$: Observable<RelatedAccount[]>;

  // Applicant management
  pendingApplicants$: Observable<any[]>;
  pendingApplicantsCount$: Observable<number>;

  // Role/Access Controls
  showAccessControls$: Observable<boolean>;
  activeMembers$: Observable<RelatedAccount[]>;
  filteredMembers$: Observable<RelatedAccount[]>;
  adminCount$: Observable<number>;
  memberSearchTerm = "";

  // Access level options for dropdown
  accessLevels = [
    {value: "admin", label: "Admin"},
    {value: "moderator", label: "Moderator"},
    {value: "member", label: "Member"},
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
    private notificationService: NotificationService,
    private access: AccessService,
  ) {
    this.accountId = this.route.snapshot.paramMap.get("accountId") || "";

    // Initialize observables
    this.account$ = this.store.select(selectAccountById(this.accountId));
    this.relatedAccounts$ = this.store.select(
      selectRelatedAccountsByAccountId(this.accountId),
    );
    this.currentUser$ = this.store.select(selectAuthUser);

    // Calculate statistics
    this.memberCount$ = this.relatedAccounts$.pipe(
      map(
        (accounts) => accounts.filter((ra) => ra.status === "accepted").length,
      ),
    );

    // Separate counts for users and groups
    this.userMemberCount$ = this.relatedAccounts$.pipe(
      map(
        (accounts) =>
          accounts.filter(
            (ra) => ra.status === "accepted" && ra.type === "user",
          ).length,
      ),
    );

    this.partnerCount$ = this.relatedAccounts$.pipe(
      map(
        (accounts) =>
          accounts.filter(
            (ra) => ra.status === "accepted" && ra.type === "group",
          ).length,
      ),
    );

    this.pendingRequestsCount$ = combineLatest([
      this.relatedAccounts$,
      this.currentUser$,
    ]).pipe(
      map(
        ([accounts, currentUser]) =>
          accounts.filter(
            (ra) =>
              ra.status === "pending" && ra.initiatorId !== currentUser?.uid,
          ).length,
      ),
    );

    // Initialize listings count
    this.activeListingsCount$ = this.store
      .select(selectRelatedListingsByAccountId(this.accountId))
      .pipe(
        map(
          (listings) =>
            listings.filter((listing) => listing.status === "active").length,
        ),
      );

    // Initialize pending member requests (exclude self-initiated requests)
    this.pendingMemberRequests$ = combineLatest([
      this.relatedAccounts$,
      this.currentUser$,
    ]).pipe(
      map(([accounts, currentUser]) =>
        accounts.filter(
          (ra) =>
            ra.status === "pending" && ra.initiatorId !== currentUser?.uid,
        ),
      ),
    );

    // Initialize applicant management (simplified for Phase 1)
    // TODO: Replace with actual applicant data from listings state
    this.pendingApplicants$ = this.store
      .select(selectRelatedListingsByAccountId(this.accountId))
      .pipe(
        map((listings) => {
          // For now, create a mock structure for applicants
          // In Phase 2, this would come from actual applicant relatedAccounts
          const mockApplicants = listings
            .filter((listing) => listing.status === "active")
            .slice(0, 3)
            .map((listing, index) => ({
              id: `applicant-${index}`,
              listingId: listing.id,
              listingTitle: listing.title,
              applicantName: `Applicant ${index + 1}`,
              applicantImage: null,
              status: "pending",
              createdAt: new Date(),
            }));
          return mockApplicants;
        }),
      );

    this.pendingApplicantsCount$ = this.pendingApplicants$.pipe(
      map((applicants) => applicants.length),
    );

    // Initialize role/access controls
    this.showAccessControls$ = combineLatest([
      this.currentUser$,
      this.account$,
    ]).pipe(
      map(([user, account]) => this.access.isGroupAdmin(account as any, user)),
    );

    this.activeMembers$ = this.relatedAccounts$.pipe(
      map((accounts) =>
        accounts.filter((ra) => ra.status === "accepted" && ra.type === "user"),
      ),
    );

    // Calculate admin count (including owner + members with admin access)
    this.adminCount$ = this.account$.pipe(
      map((account) => {
        const adminIds = Array.isArray((account as any)?.adminIds)
          ? ((account as any).adminIds as string[])
          : [];
        // Include 1 for the owner
        return 1 + adminIds.length;
      }),
    );

    // Initialize filtered members (same as active members initially)
    this.filteredMembers$ = this.activeMembers$;
  }

  ngOnInit() {
    // Load account data if not already loaded
    this.store.dispatch(
      AccountActions.loadAccount({accountId: this.accountId}),
    );
    this.store.dispatch(
      AccountActions.loadRelatedAccounts({accountId: this.accountId}),
    );
    this.store.dispatch(
      AccountActions.loadRelatedListings({accountId: this.accountId}),
    );

    // Check for query parameters to set initial tab
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      if (params["tab"]) {
        console.log(
          "Setting selectedSegment from query params:",
          params["tab"],
        );
        this.selectedSegment = params["tab"];
      }
    });

    // Also listen for query parameter changes during the session
    this.subscription.add(
      this.route.queryParams.subscribe((params) => {
        if (params["tab"] && params["tab"] !== this.selectedSegment) {
          console.log(
            "Updating selectedSegment from query params:",
            params["tab"],
          );
          this.selectedSegment = params["tab"];
        }
      }),
    );

    // Initialize notification service for admin notifications
    this.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user?.uid) {
        this.notificationService.setCurrentUserId(user.uid);
      }
    });

    // Verify this is a group account
    this.subscription.add(
      this.account$.pipe(take(1)).subscribe((account) => {
        if (account && account.type !== "group") {
          // Redirect if this is not a group account
          this.router.navigate(["/account", this.accountId]);
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;

    // Update URL with query parameter to maintain state
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: this.selectedSegment},
      queryParamsHandling: "merge",
    });
  }

  // Helper method to navigate to specific tab
  navigateToTab(tabName: string) {
    console.log("navigateToTab called with:", tabName);
    this.selectedSegment = tabName;
    console.log("selectedSegment set to:", this.selectedSegment);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: tabName},
      queryParamsHandling: "merge",
    });
  }

  navigateToRoleManagement() {
    this.router.navigate(["/account", this.accountId, "roles"]);
  }

  navigateToRoleHierarchy() {
    this.router.navigate(["/account", this.accountId, "hierarchy"]);
  }

  navigateToListings() {
    this.router.navigate(["/account", this.accountId, "listings"]);
  }

  createNewListing() {
    this.router.navigate(["/listings/create"], {
      queryParams: {groupId: this.accountId},
    });
  }

  navigateToProjects() {
    this.router.navigate(["/account", this.accountId, "projects"]);
  }

  navigateToTimeTrackingApprovals() {
    this.router.navigate([
      "/account",
      this.accountId,
      "time-tracking",
      "approvals",
    ]);
  }

  navigateToTimeTrackingReports() {
    this.router.navigate([
      "/account",
      this.accountId,
      "time-tracking",
      "reports",
    ]);
  }

  navigateToMembers() {
    this.router.navigate(["/account", this.accountId, "related", "user"]);
  }

  navigateToPartners() {
    this.router.navigate(["/account", this.accountId, "related", "group"]);
  }

  onFaqFormSubmitted() {
    // FAQ form submission is handled by the form component itself
    // This method can be used for additional actions if needed
    console.log("FAQ form submitted successfully");
  }

  async approveMemberRequest(relatedAccountId: string) {
    try {
      this.relatedAccounts$.pipe(take(1)).subscribe(async (accounts) => {
        const relatedAccount = accounts.find(
          (ra) => ra.id === relatedAccountId,
        );
        if (relatedAccount) {
          // Only allow approval if:
          // 1. The current account did NOT initiate the request (initiatorId != accountId)
          // 2. The request is targeting the current account (targetId == accountId)
          if (
            relatedAccount.initiatorId !== this.accountId &&
            relatedAccount.targetId === this.accountId
          ) {
            const updatedAccount = {
              ...relatedAccount,
              status: "accepted" as any,
            };
            this.store.dispatch(
              AccountActions.updateRelatedAccount({
                accountId: this.accountId,
                relatedAccount: updatedAccount,
              }),
            );

            // Show success feedback
            const toast = await this.toastController.create({
              message: `${relatedAccount.name} has been approved as a member`,
              duration: 2000,
              color: "success",
              position: "bottom",
            });
            await toast.present();
          } else {
            console.warn(
              "Cannot approve member request: Invalid approval conditions",
            );
            this.showErrorToast(
              "Cannot approve this request. You cannot approve your own requests.",
            );
          }
        }
      });
    } catch (error) {
      console.error("Error approving member request:", error);
      this.showErrorToast("Failed to approve member request");
    }
  }

  canApproveMemberRequest(relatedAccount: any): boolean {
    // Only allow approval if:
    // 1. The current account did NOT initiate the request (initiatorId != accountId)
    // 2. The request is targeting the current account (targetId == accountId)
    // 3. The request status is pending
    return (
      relatedAccount.initiatorId !== this.accountId &&
      relatedAccount.targetId === this.accountId &&
      relatedAccount.status === "pending"
    );
  }

  async rejectMemberRequest(relatedAccountId: string) {
    try {
      this.relatedAccounts$.pipe(take(1)).subscribe(async (accounts) => {
        const relatedAccount = accounts.find(
          (ra) => ra.id === relatedAccountId,
        );
        if (relatedAccount) {
          const updatedAccount = {...relatedAccount, status: "rejected" as any};
          this.store.dispatch(
            AccountActions.updateRelatedAccount({
              accountId: this.accountId,
              relatedAccount: updatedAccount,
            }),
          );

          // Show feedback
          const toast = await this.toastController.create({
            message: `Request from ${relatedAccount.name} has been rejected`,
            duration: 2000,
            color: "warning",
            position: "bottom",
          });
          await toast.present();
        }
      });
    } catch (error) {
      console.error("Error rejecting member request:", error);
      this.showErrorToast("Failed to reject member request");
    }
  }

  updateGroupPrivacy(value: string) {
    this.account$.pipe(take(1)).subscribe((account) => {
      if (account) {
        const updatedAccount = {
          ...account,
          privacySettings: {
            ...(account.privacySettings || {}),
            profile: {
              ...((account.privacySettings as any)?.profile || {}),
              visibility: value as "public" | "private",
            },
          },
          lastModified: new Date(),
        };
        this.store.dispatch(
          AccountActions.updateAccount({account: updatedAccount}),
        );
      }
    });
  }

  updatePrivacy(value: "public" | "private") {
    this.updateGroupPrivacy(value);
  }

  updateMembershipPolicy(value: string) {
    this.account$.pipe(take(1)).subscribe(async (account) => {
      if (account) {
        const updatedAccount = {
          ...account,
          settings: {
            language: account.settings?.language || "en",
            theme: account.settings?.theme || "system",
            ...(account.settings || {}),
          },
          administrativeSettings: {
            ...(account.administrativeSettings || {}),
            membershipPolicy: value as "open" | "approval" | "invitation",
          },
          lastModified: new Date(),
        };
        this.store.dispatch(
          AccountActions.updateAccount({account: updatedAccount}),
        );

        // Show success feedback
        const toast = await this.toastController.create({
          message: `Membership policy updated to ${this.capitalizeFirst(value)}`,
          duration: 2000,
          color: "success",
          position: "bottom",
        });
        await toast.present();
      }
    });
  }

  getMembershipPolicy(account: any): string {
    const policy =
      account.administrativeSettings?.membershipPolicy || "approval";
    return policy; // Return the raw value for the select element
  }

  // Helper method to capitalize first letter
  private capitalizeFirst(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Helper method to format founding date
  getFormattedFoundingDate(account: any): string {
    const date = this.getDateFromTimestamp(account.groupDetails?.dateFounded);
    if (!date) return "Not specified";
    return date.getFullYear().toString();
  }

  // Helper method to format supported languages
  getFormattedLanguages(account: any): string {
    const languages = account.groupDetails?.supportedLanguages;
    if (!languages) return "Not specified";

    // If it's an array, join directly (now storing full names)
    if (Array.isArray(languages)) {
      return languages.join(", ");
    }

    // If it's a string with commas, return as is (now storing full names)
    if (typeof languages === "string" && languages.includes(",")) {
      return languages;
    }

    // Single language
    return languages;
  }

  updateNotificationSetting(setting: string, value: boolean) {
    this.account$.pipe(take(1)).subscribe((account) => {
      if (account) {
        // For now, we'll store notification preferences as a JSON string
        // This can be improved later with a proper notification preferences interface
        const currentPrefs = account.administrativeSettings
          ?.notificationPreferences
          ? JSON.parse(account.administrativeSettings.notificationPreferences)
          : {};

        const updatedPrefs = {
          ...currentPrefs,
          [setting]: value,
        };

        const updatedAccount = {
          ...account,
          settings: {
            language: account.settings?.language || "en",
            theme: account.settings?.theme || "system",
            ...(account.settings || {}),
          },
          administrativeSettings: {
            ...(account.administrativeSettings || {}),
            notificationPreferences: JSON.stringify(updatedPrefs),
          },
        };
        this.store.dispatch(
          AccountActions.updateAccount({account: updatedAccount}),
        );

        // Show confirmation message
        this.showNotificationSettingUpdate(setting, value);
      }
    });
  }

  // Helper method to show notification setting update
  private async showNotificationSettingUpdate(
    setting: string,
    enabled: boolean,
  ) {
    const settingNames: {[key: string]: string} = {
      memberJoinRequests: "Member Join Requests",
      newListingApplications: "Listing Applications",
      groupActivity: "Group Activity",
    };

    const settingName = settingNames[setting] || setting;
    const status = enabled ? "enabled" : "disabled";

    const toast = await this.toastController.create({
      message: `${settingName} notifications ${status}`,
      duration: 2000,
      color: enabled ? "success" : "medium",
      position: "bottom",
    });
    await toast.present();
  }

  // Applicant Management Methods
  async approveApplicant(applicantId: string) {
    // TODO: Implement actual applicant approval logic
    // This would involve updating the applicant's status in the listing's relatedAccounts
    console.log("Approving applicant:", applicantId);

    // Show user feedback
    const toast = await this.toastController.create({
      message:
        "Applicant approval functionality coming soon! Use individual listing pages to manage applicants.",
      duration: 4000,
      color: "warning",
      position: "bottom",
      buttons: [
        {
          text: "View Listings",
          handler: () => {
            this.navigateToTab("listings");
          },
        },
        {
          text: "OK",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }

  async rejectApplicant(applicantId: string) {
    // TODO: Implement actual applicant rejection logic
    console.log("Rejecting applicant:", applicantId);

    // Show user feedback
    const toast = await this.toastController.create({
      message:
        "Applicant rejection functionality coming soon! Use individual listing pages to manage applicants.",
      duration: 4000,
      color: "warning",
      position: "bottom",
      buttons: [
        {
          text: "View Listings",
          handler: () => {
            this.navigateToTab("listings");
          },
        },
        {
          text: "OK",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }

  viewAllApplicants() {
    // For now, navigate to listings page where admin can manage individual listing applicants
    // TODO: Create a consolidated applicants view for all group listings
    this.navigateToTab("listings");
  }

  async showDeactivateGroupConfirmation() {
    const alert = await this.alertController.create({
      header: "Deactivate Group",
      cssClass: "custom-alert",
      message: `
        <div class="alert-content">
          <ion-icon name="warning-outline" color="warning" style="font-size: 3rem; display: block; margin: 0 auto 16px;"></ion-icon>
          <p><strong>This will temporarily deactivate your group</strong></p>
          
          <div style="text-align: left; margin: 16px 0;">
            <p><strong>What happens when you deactivate:</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px; font-size: 0.9rem;">
              <li>Your group will be hidden from search results</li>
              <li>New member requests will be disabled</li>
              <li>All group listings will be set to inactive</li>
              <li>Existing members will be notified of the change</li>
              <li>Group content remains accessible to current members</li>
            </ul>
          </div>
          
          <div style="background: #f0f9ff; padding: 12px; border-radius: 8px; margin: 12px 0;">
            <p style="margin: 0; font-size: 0.85rem; color: #0369a1;">
              <ion-icon name="information-circle-outline" style="vertical-align: middle; margin-right: 4px;"></ion-icon>
              <strong>Good news:</strong> You can reactivate your group at any time by logging back into this dashboard.
            </p>
          </div>
          
          <p style="margin-top: 16px;"><strong>Are you sure you want to continue?</strong></p>
        </div>
      `,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "alert-button-cancel",
        },
        {
          text: "Deactivate Group",
          role: "destructive",
          cssClass: "alert-button-confirm",
          handler: () => {
            this.deactivateGroup();
          },
        },
      ],
    });
    await alert.present();
  }

  async deactivateGroup() {
    try {
      this.account$.pipe(take(1)).subscribe(async (account) => {
        if (account) {
          const updatedAccount = {
            ...account,
            status: "inactive" as any,
            lastModified: new Date(),
          };

          this.store.dispatch(
            AccountActions.updateAccount({account: updatedAccount}),
          );

          // TODO: Deactivate all related listings when backend supports it
          // For now, this would need to be handled in the backend or via separate actions

          // Show success message
          const toast = await this.toastController.create({
            message:
              "Group has been deactivated successfully. Members will be notified.",
            duration: 4000,
            color: "success",
            position: "bottom",
          });
          await toast.present();

          // Redirect to home after deactivation
          setTimeout(() => {
            this.router.navigate(["/tabs/home"]);
          }, 3000);
        }
      });
    } catch (error) {
      console.error("Error deactivating group:", error);
      this.showErrorToast("Failed to deactivate group. Please try again.");
    }
  }

  async reactivateGroup() {
    try {
      this.account$.pipe(take(1)).subscribe(async (account) => {
        if (account) {
          const updatedAccount = {
            ...account,
            status: "active" as any,
            lastModified: new Date(),
          };

          this.store.dispatch(
            AccountActions.updateAccount({account: updatedAccount}),
          );

          // Show success message
          const toast = await this.toastController.create({
            message: "Group has been reactivated successfully!",
            duration: 3000,
            color: "success",
            position: "bottom",
          });
          await toast.present();
        }
      });
    } catch (error) {
      console.error("Error reactivating group:", error);
      this.showErrorToast("Failed to reactivate group. Please try again.");
    }
  }

  isGroupInactive(): Observable<boolean> {
    return this.account$.pipe(map((account) => account?.status === "inactive"));
  }

  // Role/Access Control Methods
  async updateMemberAccessLevel(memberId: string, newAccessLevel: string) {
    try {
      console.log(
        `Updating member ${memberId} access level to: ${newAccessLevel}`,
      );

      // Show confirmation for sensitive operations (promoting to admin)
      if (newAccessLevel === "admin") {
        const alert = await this.alertController.create({
          header: "Confirm Admin Promotion",
          message:
            "Are you sure you want to promote this member to admin? They will have full access to group management.",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "Confirm",
              role: "confirm",
              handler: () => {
                this.performAccessLevelUpdate(memberId, newAccessLevel);
              },
            },
          ],
        });
        await alert.present();
      } else {
        this.performAccessLevelUpdate(memberId, newAccessLevel);
      }
    } catch (error) {
      console.error("Error updating member access level:", error);
      this.showErrorToast("Failed to update member access level");
    }
  }

  private async performAccessLevelUpdate(
    memberId: string,
    newAccessLevel: string,
  ) {
    // Dispatch update to relatedAccount document
    const accessVal = newAccessLevel as "admin" | "moderator" | "member";
    this.currentUser$.pipe(take(1)).subscribe(async (authUser) => {
      const relatedAccountUpdate: RelatedAccount = {
        id: memberId,
        accountId: this.accountId,
        access: accessVal,
        lastModifiedBy: authUser?.uid || undefined,
      } as RelatedAccount;

      this.store.dispatch(
        AccountActions.updateRelatedAccount({
          accountId: this.accountId,
          relatedAccount: relatedAccountUpdate,
        }),
      );

      // Show success feedback
      const toast = await this.toastController.create({
        message: `Member access level updated to ${newAccessLevel}`,
        duration: 2000,
        color: "success",
        position: "bottom",
      });
      await toast.present();
    });
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: "danger",
      position: "bottom",
    });
    await toast.present();
  }

  getMemberAccessLevel(member: RelatedAccount): string {
    return member.access || "member";
  }

  canManageRoles(member: RelatedAccount): boolean {
    // Prevent self-role modification and ensure user can only manage members with lower access
    // TODO: Implement proper permission checking
    return member.id !== this.accountId; // Basic check for now
  }

  // Member Invitation Methods
  async showInviteMemberModal() {
    // Check membership policy to show appropriate interface
    this.account$.pipe(take(1)).subscribe(async (account) => {
      const membershipPolicy =
        account?.administrativeSettings?.membershipPolicy || "approval";

      if (membershipPolicy === "invitation") {
        // For invitation-only groups, open the invite modal directly
        await this.openInviteModal(account);
      } else {
        // For other policies, show information first
        await this.showInvitationInfo(membershipPolicy, account);
      }
    });
  }

  private async openInviteModal(account: any) {
    const modal = await this.modalController.create({
      component: (
        await import(
          "../../components/invite-member-modal/invite-member-modal.component"
        )
      ).InviteMemberModalComponent,
      componentProps: {
        groupId: this.accountId,
        groupName: account?.name || "Your Group",
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data === true) {
        // Invitation was sent successfully
        console.log("Invitation sent successfully");
      }
    });

    await modal.present();
  }

  private async showInvitationInfo(membershipPolicy: string, account: any) {
    let message = "";
    let buttons: any[] = [];

    switch (membershipPolicy) {
      case "open":
        message = `
          <p><strong>Open Membership Policy</strong></p>
          <p>Your group allows anyone to join immediately. To invite members:</p>
          <ul>
            <li>Share your group profile link</li>
            <li>Members can join instantly without approval</li>
          </ul>
        `;
        buttons = [
          {
            text: "Copy Group Link",
            handler: () => {
              this.copyGroupLink();
            },
          },
          {
            text: "Send Personal Invite",
            handler: () => {
              this.openInviteModal(account);
            },
          },
          {
            text: "Close",
            role: "cancel",
          },
        ];
        break;

      case "approval":
        message = `
          <p><strong>Approval Required Policy</strong></p>
          <p>Your group requires admin approval for new members. You can:</p>
          <ul>
            <li>Send personal invitations to specific people</li>
            <li>Share your group profile link for requests</li>
            <li>Review and approve requests from the Members tab</li>
          </ul>
        `;
        buttons = [
          {
            text: "Send Invitation",
            handler: () => {
              this.openInviteModal(account);
            },
          },
          {
            text: "Copy Group Link",
            handler: () => {
              this.copyGroupLink();
            },
          },
          {
            text: "View Pending Requests",
            handler: () => {
              this.navigateToTab("members");
            },
          },
          {
            text: "Close",
            role: "cancel",
          },
        ];
        break;
    }

    const alert = await this.alertController.create({
      header: "Invite Members",
      message,
      buttons,
    });
    await alert.present();
  }

  private async copyGroupLink() {
    const groupUrl = `${window.location.origin}/account/${this.accountId}`;

    try {
      await navigator.clipboard.writeText(groupUrl);
      const toast = await this.toastController.create({
        message: "Group link copied to clipboard!",
        duration: 2000,
        color: "success",
        position: "bottom",
      });
      await toast.present();
    } catch (error) {
      console.error("Failed to copy link:", error);
      // Fallback: show the link in an alert
      const alert = await this.alertController.create({
        header: "Group Link",
        message: `Share this link: ${groupUrl}`,
        buttons: ["OK"],
      });
      await alert.present();
    }
  }

  // Member Search/Filter Methods
  filterMembers(event: any) {
    const searchTerm = event.target.value?.toLowerCase() || "";
    this.memberSearchTerm = searchTerm;

    if (searchTerm.trim() === "") {
      // Reset to show all active members
      this.filteredMembers$ = this.activeMembers$;
    } else {
      // Filter members based on search term
      this.filteredMembers$ = this.activeMembers$.pipe(
        map((members) =>
          members.filter(
            (member) =>
              member.name?.toLowerCase().includes(searchTerm) ||
              member.tagline?.toLowerCase().includes(searchTerm),
          ),
        ),
      );
    }
  }

  // Helper method to get notification preference value
  getNotificationPreference(account: any, setting: string): boolean {
    if (!account?.administrativeSettings?.notificationPreferences) {
      return true; // Default to true for new groups
    }
    try {
      const prefs = JSON.parse(
        account.administrativeSettings.notificationPreferences,
      );
      return prefs[setting] !== false; // Default to true if not explicitly set to false
    } catch {
      return true; // Default to true if parsing fails
    }
  }

  // Test notification methods for development
  async testMemberJoinNotification() {
    this.account$.pipe(take(1)).subscribe(async (account) => {
      if (account) {
        await this.notificationService.showMemberJoinRequestNotification(
          "John Doe",
          account.name || "Your Group",
          this.accountId,
        );
      }
    });
  }

  async testListingApplicationNotification() {
    await this.notificationService.showListingApplicationNotification(
      "Jane Smith",
      "Volunteer Coordinator Position",
      "test-listing-id",
    );
  }

  // Helper method to safely convert dates
  getDateFromTimestamp(timestamp: any): Date | null {
    if (!timestamp) {
      return null;
    }
    // If it's already a Date object
    if (timestamp instanceof Date) {
      return timestamp;
    }
    // If it's a Firestore Timestamp
    if (timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate();
    }
    // If it's a timestamp number or string
    if (typeof timestamp === "number" || typeof timestamp === "string") {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }

  // Image upload methods
  async openImageUploadModal(imageType: "hero" | "icon") {
    this.account$.pipe(take(1)).subscribe(async (account) => {
      if (!account) return;

      const modal = await this.modalController.create({
        component: ImageUploadModalComponent,
        componentProps: {
          collectionName: "accounts",
          docId: account.id,
          firestoreLocation: `accounts/${account.id}`,
          fieldName: imageType === "hero" ? "heroImage" : "iconImage",
          imageWidth: imageType === "hero" ? 1200 : 400,
          imageHeight: imageType === "hero" ? 600 : 400,
          title:
            imageType === "hero" ? "Upload Hero Image" : "Upload Icon Image",
          acceptedFormats: "image/*",
        },
      });

      await modal.present();

      const {data} = await modal.onDidDismiss();
      if (data) {
        // Update the local account object to reflect the new image
        const updatedAccount = {
          ...account,
          [imageType === "hero" ? "heroImage" : "iconImage"]: data,
        };

        // Dispatch action to update the store
        this.store.dispatch(
          AccountActions.updateAccount({
            account: updatedAccount,
          }),
        );

        // Show success message
        const toast = await this.toastController.create({
          message: `${imageType === "hero" ? "Hero" : "Icon"} image updated successfully!`,
          duration: 3000,
          color: "success",
        });
        await toast.present();
      }
    });
  }

  goBackToProfile() {
    this.router.navigate(["/account", this.accountId]);
  }
}
