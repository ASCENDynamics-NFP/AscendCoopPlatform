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

import {Component, Input, OnInit, OnChanges, OnDestroy} from "@angular/core";
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
import {RelationshipService} from "../../../../../../core/services/relationship.service";
import {TimeEntry} from "../../../../../../../../shared/models/time-entry.model";
import {
  selectAllEntriesForAccount,
  selectAllEntriesForUser,
} from "../../../../../../state/selectors/time-tracking.selectors";
import {map} from "rxjs/operators";
import {AccountSectionsService} from "../../../../services/account-sections.service";
import {Subscription} from "rxjs";
import {ContactInformation} from "@shared/models/account.model";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent implements OnInit, OnChanges, OnDestroy {
  @Input() account!: Account; // Changed from Partial<Account> to Account to ensure properties are defined
  @Input() isProfileOwner: boolean = false;
  @Input() isGroupAdmin = false;
  @Input() isGroupMember = false;
  @Input() currentUserType: string | null = null;
  @Input() relationshipStatus: string | null = null; // 'pending', 'accepted', 'rejected', 'blocked', null
  @Input() hasRelationship: boolean = false; // Whether any relationship exists
  readonly defaultHeroImage = "assets/image/userhero.png";
  accountIconLoaded = true;

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
    private relationshipService: RelationshipService,
    private sections: AccountSectionsService,
  ) {
    // Initialize observables - will be properly set when account is available
    this.timeEntries$ = new Observable();
    this.totalHours$ = new Observable();
    this.projectHours$ = new Observable();
  }

  ngOnInit() {
    if (this.account?.id) {
      this.initializeTimeTracking();
      this.subscribeContactInfo();
    }
  }

  ngOnChanges() {
    if (this.account?.id) {
      this.initializeTimeTracking();
      this.subscribeContactInfo();
    }
    this.accountIconLoaded = true;
  }

  private contactInfoSub?: Subscription;
  private contactInfo: ContactInformation | null = null;
  private subscribeContactInfo() {
    if (!this.account?.id) return;
    this.contactInfoSub?.unsubscribe();
    this.contactInfoSub = this.sections
      .contactInfo$(this.account.id)
      .subscribe((ci: ContactInformation | null) => (this.contactInfo = ci));
  }

  onHeroImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.defaultHeroImage;
  }

  onIconImageError() {
    this.accountIconLoaded = false;
  }

  ngOnDestroy(): void {
    this.contactInfoSub?.unsubscribe();
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

  get fallbackAccountIcon(): string {
    return this.account?.type === "group"
      ? "business-outline"
      : "person-circle";
  }

  get hasDonationURL(): boolean {
    return (
      this.account.webLinks?.some(
        (webLink) => webLink?.category?.toLowerCase() === "donation",
      ) || false
    );
  }

  get getLocation(): string {
    const addr = this.contactInfo?.addresses?.[0];
    if (!addr) return "";
    const parts: string[] = [];
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.country) parts.push(addr.country);
    return parts.join(", ");
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

  /**
   * Determines whether the Edit button should be shown
   * Hide edit button for group accounts since they should use Admin Dashboard
   * Only show edit button for individual user accounts when they are the profile owner
   */
  get shouldShowEditButton(): boolean {
    // Don't show edit button if not profile owner
    if (!this.isProfileOwner) {
      return false;
    }

    // Don't show edit button for group accounts (they should use Admin Dashboard)
    if (this.account?.type === "group") {
      return false;
    }

    // Show edit button for individual users who own their profile
    return true;
  }

  async openImageUploadModal(): Promise<void> {
    if (!this.account.id || !this.isProfileOwner) return;
    const modal = await this.modalController.create({
      component: ImageUploadModalComponent,
      componentProps: {
        collectionName: "accounts",
        docId: this.account.id,
        firestoreLocation: `accounts/${this.account.id}/profile`,
        imageHeight: 300,
        imageWidth: 900,
        fieldName: "heroImage",
        currentImageUrl: this.account.heroImage,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        // Image upload was successful, update the local account object
        console.log("Hero image upload successful, new URL:", result.data);
        if (this.account) {
          // Create a new account object to avoid readonly property errors
          this.account = {
            ...this.account,
            heroImage: result.data,
          };
        }
      }
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

      // Use callable function to send a friend/connection request (permissions enforced server-side)
      await firstValueFrom(
        this.relationshipService.sendFriendRequest(this.account.id),
      );

      // Show success message
      await this.showToast(
        `Connection request sent to ${this.account.name}`,
        "success",
      );
    } catch (error: any) {
      console.error("Error sending connection request:", error);
      const msg = error?.message?.includes("permission")
        ? "Insufficient permissions to connect"
        : error?.message || "Failed to send connection request";
      await this.showToast(msg, "danger");
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
