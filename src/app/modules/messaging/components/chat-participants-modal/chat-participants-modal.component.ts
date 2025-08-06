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
import {Component, Input, OnInit} from "@angular/core";
import {
  ModalController,
  ToastController,
  ActionSheetController,
} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {Observable, combineLatest, map, of, forkJoin} from "rxjs";
import {take, switchMap, filter, catchError} from "rxjs/operators";

import {Chat} from "../../models/chat.model";
import {ChatService} from "../../services/chat.service";
import {RelationshipService} from "../../services/relationship.service";
import {RelatedAccount} from "../../../../../../shared/models/account.model";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

export interface ChatParticipant {
  id: string;
  name: string;
  email: string;
  iconImage?: string;
  isCurrentUser: boolean;
  canRemove: boolean;
}

@Component({
  selector: "app-chat-participants-modal",
  templateUrl: "./chat-participants-modal.component.html",
  styleUrls: ["./chat-participants-modal.component.scss"],
})
export class ChatParticipantsModalComponent implements OnInit {
  @Input() chat!: Chat;
  @Input() currentUserId!: string;

  participants$!: Observable<ChatParticipant[]>;
  availableUsers$!: Observable<any[]>;
  availableUsers: any[] = [];
  searchTerm = "";
  isLoading = false;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private chatService: ChatService,
    private relationshipService: RelationshipService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.loadParticipants();
    this.loadAvailableUsers();
  }

  /**
   * Load current chat participants
   */
  private loadParticipants() {
    // Load participant accounts
    this.chat.participants.forEach((participantId) => {
      this.store.dispatch(
        AccountActions.loadAccount({accountId: participantId}),
      );
    });

    // Create observable of participants with their account info
    const participantObservables = this.chat.participants.map((participantId) =>
      this.store.select(selectAccountById(participantId)).pipe(
        map((account) => ({
          id: participantId,
          name: account?.name || account?.email || "Unknown User",
          email: account?.email || "",
          iconImage: account?.iconImage,
          isCurrentUser: participantId === this.currentUserId,
          canRemove: this.chat.isGroup && participantId !== this.currentUserId,
        })),
      ),
    );

    this.participants$ = combineLatest(participantObservables);
  }

  /**
   * Load available users that can be added to the chat
   */
  private loadAvailableUsers() {
    if (!this.chat.isGroup) {
      this.availableUsers$ = of([]);
      this.availableUsers = [];
      return;
    }

    // Get current user's friends who are not already in the chat
    this.availableUsers$ = this.store.select(selectAuthUser).pipe(
      take(1),
      switchMap((currentUser) => {
        if (!currentUser?.uid) {
          return of([]);
        }

        // Get user's accepted relationships
        return this.relationshipService
          .getAcceptedRelationships(currentUser.uid)
          .pipe(
            switchMap((relationships) => {
              // Get the IDs of users who are not already participants
              // Each relationship has either initiatorId or targetId as the friend's ID
              const friendIds = relationships
                .map((rel) => {
                  // Return the ID that's not the current user
                  return rel.initiatorId === currentUser.uid
                    ? rel.targetId
                    : rel.initiatorId;
                })
                .filter(
                  (friendId) =>
                    friendId && !this.chat.participants.includes(friendId),
                );

              if (friendIds.length === 0) {
                return of([]);
              }

              // Load account information for each available user
              const userObservables = friendIds.map((userId) => {
                // Dispatch action to load account if not already loaded
                this.store.dispatch(
                  AccountActions.loadAccount({accountId: userId}),
                );

                return this.store.select(selectAccountById(userId)).pipe(
                  filter((account) => !!account), // Wait for account to be loaded
                  take(1),
                  map((account) => ({
                    id: userId,
                    name: account?.name || account?.email || "Unknown User",
                    email: account?.email || "",
                    iconImage: account?.iconImage || "",
                    type: account?.type || "user",
                  })),
                );
              });

              return userObservables.length > 0
                ? combineLatest(userObservables)
                : of([]);
            }),
            catchError((error) => {
              console.error("Error loading available users:", error);
              return of([]);
            }),
          );
      }),
    );

    // Subscribe to get local copy for filtering
    this.availableUsers$.subscribe((users) => {
      this.availableUsers = users;
    });
  }

  /**
   * Add a user to the chat
   */
  async addUser(userId: string) {
    if (!this.chat.isGroup) return;

    this.isLoading = true;
    try {
      await this.chatService
        .addParticipants(this.chat.id, [userId])
        .toPromise();
      this.showToast("User added to chat", "success");

      // Update local chat participants
      this.chat.participants.push(userId);
      this.loadParticipants();
      this.loadAvailableUsers();
    } catch (error) {
      console.error("Error adding user to chat:", error);
      this.showToast("Failed to add user to chat", "danger");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Show options for a participant
   */
  async showParticipantOptions(participant: ChatParticipant) {
    if (!participant.canRemove) return;

    const actionSheet = await this.actionSheetController.create({
      header: participant.name,
      buttons: [
        {
          text: "View Profile",
          icon: "person-outline",
          handler: () => {
            // TODO: Navigate to user profile
            console.log("Navigate to profile:", participant.id);
          },
        },
        {
          text: "Remove from Chat",
          icon: "person-remove-outline",
          role: "destructive",
          handler: () => {
            this.removeUser(participant.id);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
        },
      ],
    });

    await actionSheet.present();
  }

  /**
   * Remove a user from the chat
   */
  async removeUser(userId: string) {
    if (!this.chat.isGroup || userId === this.currentUserId) return;

    this.isLoading = true;
    try {
      await this.chatService
        .removeParticipants(this.chat.id, [userId])
        .toPromise();
      this.showToast("User removed from chat", "success");

      // Update local chat participants
      this.chat.participants = this.chat.participants.filter(
        (id) => id !== userId,
      );
      this.loadParticipants();
      this.loadAvailableUsers();
    } catch (error) {
      console.error("Error removing user from chat:", error);
      this.showToast("Failed to remove user from chat", "danger");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Filter available users based on search term
   */
  getFilteredUsers(): any[] {
    const users = this.availableUsers || [];

    if (!this.searchTerm.trim()) {
      return users;
    }

    const searchLower = this.searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower),
    );
  }

  /**
   * Close the modal
   */
  dismiss() {
    this.modalController.dismiss();
  }

  /**
   * Show toast message
   */
  private async showToast(
    message: string,
    color: "success" | "danger" = "success",
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: "top",
    });
    await toast.present();
  }

  /**
   * Get default avatar image
   */
  getDefaultAvatar(): string {
    return "assets/image/logo/ASCENDynamics NFP-logos_transparent.png";
  }

  /**
   * Handle avatar load error
   */
  setDefaultAvatar(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = this.getDefaultAvatar();
    }
  }
}
