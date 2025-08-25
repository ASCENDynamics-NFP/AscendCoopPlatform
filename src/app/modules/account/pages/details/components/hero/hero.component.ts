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
// src/app/modules/account/pages/details/components/hero/hero.component.ts

import {Component, Input, OnInit, OnChanges} from "@angular/core";
import {ModalController, ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {
  Account,
  RelatedAccount,
} from "../../../../../../../../shared/models/account.model";
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";
import {ChatService} from "../../../../../messaging/services/chat.service";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../../../../state/selectors/auth.selectors";
import {firstValueFrom, Observable} from "rxjs";
import {CreateChatRequest} from "../../../../../messaging/models/chat.model";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import {TimeEntry} from "../../../../../../../../shared/models/time-entry.model";
import {
  selectAllEntriesForAccount,
  selectAllEntriesForUser,
} from "../../../../../../state/selectors/time-tracking.selectors";
import {map} from "rxjs/operators";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent implements OnInit, OnChanges {
  @Input() account!: Account; // Changed from Partial<Account> to Account to ensure properties are defined
  @Input() isProfileOwner: boolean = false;
  @Input() isGroupAdmin = false;
  @Input() isGroupMember = false;
  @Input() currentUserType: string | null = null;
  @Input() relationshipStatus: string | null = null; // 'pending', 'accepted', 'rejected', 'blocked', null
  @Input() hasRelationship: boolean = false; // Whether any relationship exists

  // Observable for time entries
  timeEntries$: Observable<TimeEntry[]>;
  totalHours$: Observable<number>;
  projectHours$: Observable<{[projectName: string]: number}>;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private chatService: ChatService,
    private store: Store<{auth: AuthState}>,
    private toastController: ToastController,
  ) {
    // Initialize observables - will be properly set when account is available
    this.timeEntries$ = new Observable();
    this.totalHours$ = new Observable();
    this.projectHours$ = new Observable();
  }

  ngOnInit() {
    if (this.account?.id) {
      this.initializeTimeTracking();
    }
  }

  ngOnChanges() {
    if (this.account?.id) {
      this.initializeTimeTracking();
    }
  }

  private initializeTimeTracking() {
    if (!this.account?.id) return;

    // Get all approved time entries - use different selector based on account type
    if (this.account.type === "user") {
      // For user profiles, get entries where this user is the worker
      this.timeEntries$ = this.store
        .select(selectAllEntriesForUser(this.account.id))
        .pipe(
          map((entries) =>
            entries.filter((entry: TimeEntry) => entry.status === "approved"),
          ),
        );
    } else {
      // For group profiles, get entries for the organization
      this.timeEntries$ = this.store
        .select(selectAllEntriesForAccount(this.account.id))
        .pipe(
          map((entries) =>
            entries.filter((entry: TimeEntry) => entry.status === "approved"),
          ),
        );
    }

    // Calculate total hours
    this.totalHours$ = this.timeEntries$.pipe(
      map((entries) =>
        entries.reduce(
          (total: number, entry: TimeEntry) => total + entry.hours,
          0,
        ),
      ),
    );

    // Calculate hours by project
    this.projectHours$ = this.timeEntries$.pipe(
      map((entries) => {
        const projectTotals: {[projectName: string]: number} = {};
        entries.forEach((entry: TimeEntry) => {
          const projectName = entry.projectName || "Unknown Project";
          projectTotals[projectName] =
            (projectTotals[projectName] || 0) + entry.hours;
        });
        return projectTotals;
      }),
    );
  }

  get hasDonationURL(): boolean {
    return (
      this.account.webLinks?.some(
        (webLink) => webLink?.category?.toLowerCase() === "donation",
      ) || false
    );
  }

  get getLocation(): string {
    if (this.account?.contactInformation?.addresses?.length) {
      const address = this.account.contactInformation.addresses[0];
      const parts: string[] = [];
      if (address?.city) parts.push(address.city);
      if (address?.state) parts.push(address.state);
      if (address?.country) parts.push(address.country);
      return parts.join(", ") || "";
    }
    return "";
  }

  get getFoundedDate(): string {
    if (
      this.account?.type === "group" &&
      this.account?.groupDetails?.dateFounded
    ) {
      const dateFounded = this.account.groupDetails.dateFounded as any;

      // Handle Firestore Timestamp object with seconds/nanoseconds
      if (
        dateFounded &&
        typeof dateFounded === "object" &&
        "seconds" in dateFounded
      ) {
        const date = new Date(dateFounded.seconds * 1000);
        return `Founded ${date.toLocaleDateString()}`;
      }
      // Handle Firestore Timestamp with toDate method
      else if (dateFounded && typeof dateFounded.toDate === "function") {
        const date = dateFounded.toDate();
        return `Founded ${date.toLocaleDateString()}`;
      }
      // Handle Date object
      else if (dateFounded instanceof Date) {
        return `Founded ${dateFounded.toLocaleDateString()}`;
      }
      // Handle string
      else if (typeof dateFounded === "string") {
        const date = new Date(dateFounded);
        if (!isNaN(date.getTime())) {
          return `Founded ${date.toLocaleDateString()}`;
        }
      }
      // Handle timestamp number
      else if (typeof dateFounded === "number") {
        const date = new Date(dateFounded);
        return `Founded ${date.toLocaleDateString()}`;
      }
    }
    return "";
  }

  get getAccountTotalHours(): number {
    return this.account?.totalHours || 0;
  }

  async openImageUploadModal(): Promise<void> {
    if (!this.account.id || !this.isProfileOwner) return;
    const modal = await this.modalController.create({
      component: ImageUploadModalComponent,
      componentProps: {
        collectionName: "accounts",
        docId: this.account.id,
        firestoreLocation: `accounts/${this.account.id}/profile`,
        maxHeight: 300,
        maxWidth: 900,
        fieldName: "heroImage",
      },
    });

    await modal.present();
  }

  onLink(category: string): void {
    const webLink = this.account.webLinks?.find(
      (link) => link.category?.toLowerCase() === category.toLowerCase(),
    );
    if (webLink?.url) {
      window.open(webLink.url, "_blank");
    } else {
      console.error(`No URL found for category: ${category}`);
    }
  }

  /**
   * Create or navigate to existing chat with this account
   */
  async onMessage(): Promise<void> {
    try {
      // Get current user
      const currentUser = await firstValueFrom(
        this.store.select(selectAuthUser),
      );
      if (!currentUser?.uid) {
        console.error("No current user found");
        return;
      }

      // Don't allow messaging yourself
      if (currentUser.uid === this.account.id) {
        return;
      }

      const participantIds = [currentUser.uid, this.account.id];

      // Check if chat already exists
      const existingChat = await firstValueFrom(
        this.chatService.findExistingChat(participantIds),
      );

      if (existingChat) {
        // Navigate to existing chat
        this.router.navigate(["/messaging/chat", existingChat.id]);
      } else {
        // Create new chat
        const request: CreateChatRequest = {
          participants: participantIds,
          isGroup: false,
        };

        const chatId = await firstValueFrom(
          this.chatService.createChat(request),
        );
        this.router.navigate(["/messaging/chat", chatId]);
      }
    } catch (error) {
      console.error("Error creating/navigating to chat:", error);
    }
  }

  /**
   * Send a connection request to this account
   */
  async onConnect(): Promise<void> {
    try {
      // Get current user
      const currentUser = await firstValueFrom(
        this.store.select(selectAuthUser),
      );
      if (!currentUser?.uid) {
        console.error("No current user found");
        return;
      }

      // Don't allow connecting to yourself
      if (currentUser.uid === this.account.id) {
        return;
      }

      // Check account type not null or new
      if (!this.account.type || this.account.type === "new") {
        console.error("Invalid account type");
        return;
      }

      // Determine relationship type based on account types
      let relationshipType: "friend" | "member" | "partner" = "friend";
      if (this.account.type !== this.currentUserType) {
        relationshipType = "member";
      } else if (
        this.account.type === "group" &&
        this.currentUserType === "group"
      ) {
        relationshipType = "partner";
      }

      // Create the related account request - this represents the current user requesting to connect
      const relatedAccount: Partial<RelatedAccount> = {
        id: this.account.id, // Set the ID to the current user's ID (the one making the request)
        accountId: currentUser.uid, // This should be the current user's ID
        initiatorId: currentUser.uid, // Current user is initiating the request
        targetId: this.account.id, // Target account is receiving the request
        name: this.account.name || currentUser.email || "Unknown User",
        iconImage: this.account.iconImage || "", // Use iconImage if available
        tagline: this.account.tagline || "", // We might not have this info for the current user
        type: this.account.type,
        status: "pending",
        relationship: relationshipType,
        createdBy: currentUser.uid,
        lastModifiedBy: currentUser.uid,
      };

      // Only add access field if it's a member relationship
      if (relationshipType === "member") {
        relatedAccount.access = "member";
      }

      // Dispatch the action to create the relationship - send to TARGET account
      this.store.dispatch(
        AccountActions.createRelatedAccount({
          accountId: currentUser.uid, // create record for current user and trigger will create for target
          relatedAccount: relatedAccount as RelatedAccount,
        }),
      );

      // Show success message
      await this.showToast(
        `Connection request sent to ${this.account.name}`,
        "success",
      );
    } catch (error) {
      console.error("Error sending connection request:", error);
      await this.showToast("Failed to send connection request", "danger");
    }
  }

  /**
   * Show toast message
   */
  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: "top",
    });
    await toast.present();
  }
}
