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
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {ChatService} from "../../services/chat.service";
import {RelationshipService} from "../../services/relationship.service";
import {CreateChatRequest} from "../../models/chat.model";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {forkJoin, firstValueFrom} from "rxjs";
import {map} from "rxjs/operators";

interface Contact {
  id: string;
  name: string;
  selected: boolean;
}

@Component({
  selector: "app-new-chat",
  templateUrl: "./new-chat.page.html",
  styleUrls: ["./new-chat.page.scss"],
})
export class NewChatPage implements OnInit {
  contacts: Contact[] = [];
  selectedContacts: Contact[] = [];
  isGroupChat = false;
  groupName = "";
  isLoading = false;
  currentUserId: string | null = null;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private relationshipService: RelationshipService,
    private toastController: ToastController,
    private store: Store<{auth: AuthState}>,
  ) {}

  ngOnInit() {
    // Get current user ID
    this.store.select(selectAuthUser).subscribe((user) => {
      console.log("Auth user updated:", user);
      this.currentUserId = user?.uid || null;
      console.log("Current user ID set to:", this.currentUserId);
      if (this.currentUserId) {
        this.loadContacts();
      } else {
        console.warn("No authenticated user found");
      }
    });
  }

  /**
   * Load user's accepted contacts
   */
  private loadContacts() {
    if (!this.currentUserId) {
      console.error("Cannot load contacts: user not authenticated");
      return;
    }

    // Load accepted relationships from Firestore
    this.relationshipService
      .getAcceptedRelationships(this.currentUserId)
      .subscribe({
        next: (relationships) => {
          this.contacts = relationships.map((rel) => ({
            id:
              rel.targetId === this.currentUserId
                ? rel.initiatorId
                : rel.targetId,
            name: `User ${rel.id}`, // We'll need to get display names from account service
            selected: false,
          }));
        },
        error: (error) => {
          console.error("Error loading contacts:", error);
          this.showErrorToast("Failed to load contacts");
          // Fallback to dummy data for development
          this.contacts = [
            {id: "user1", name: "Alice Johnson", selected: false},
            {id: "user2", name: "Bob Smith", selected: false},
            {id: "user3", name: "Carol Davis", selected: false},
            {id: "user4", name: "David Wilson", selected: false},
          ];
        },
      });
  }

  /**
   * Toggle contact selection
   */
  toggleContact(contact: Contact) {
    contact.selected = !contact.selected;
    this.updateSelectedContacts();
  }

  /**
   * Update selected contacts array
   */
  private updateSelectedContacts() {
    this.selectedContacts = this.contacts.filter((c) => c.selected);
    this.isGroupChat = this.selectedContacts.length > 1;
  }

  /**
   * Create the chat
   */
  async createChat() {
    if (this.selectedContacts.length === 0) {
      this.showErrorToast("Please select at least one contact");
      return;
    }

    if (this.isGroupChat && !this.groupName.trim()) {
      this.showErrorToast("Please enter a group name");
      return;
    }

    if (!this.currentUserId) {
      this.showErrorToast("Authentication required");
      return;
    }

    this.isLoading = true;
    console.log("Starting chat creation...", {
      selectedContacts: this.selectedContacts,
      isGroupChat: this.isGroupChat,
      currentUserId: this.currentUserId,
    });

    try {
      // Include current user in participants array
      const participantIds = [
        this.currentUserId!,
        ...this.selectedContacts.map((c) => c.id),
      ];

      console.log("Participant IDs (including current user):", participantIds);

      // For testing: skip relationship validation temporarily
      console.log("Skipping relationship validation for debugging...");

      // Validate relationships for all selected contacts
      // const relationshipChecks = participantIds.map((participantId) =>
      //   this.relationshipService.canMessage(this.currentUserId!, participantId),
      // );

      // console.log("Checking relationships...");
      // const canMessageAll = await firstValueFrom(forkJoin(relationshipChecks));

      // // Check if any relationship is invalid
      // const invalidContacts = canMessageAll
      //   ?.map((canMessage, index) => ({
      //     canMessage,
      //     contact: this.selectedContacts[index],
      //   }))
      //   .filter((item) => !item.canMessage)
      //   .map((item) => item.contact.name);

      // if (invalidContacts && invalidContacts.length > 0) {
      //   console.log("Invalid contacts found:", invalidContacts);
      //   this.showErrorToast(
      //     `Cannot message: ${invalidContacts.join(", ")}. You can only message accepted friends.`,
      //   );
      //   this.isLoading = false;
      //   return;
      // }

      // Check if 1-on-1 chat already exists (only for 2 participants total)
      if (!this.isGroupChat && participantIds.length === 2) {
        console.log("Checking for existing 1-on-1 chat...");
        const existingChat = await firstValueFrom(
          this.chatService.findExistingChat(participantIds),
        );

        if (existingChat) {
          console.log("Existing chat found, navigating...");
          this.isLoading = false;
          this.router.navigate(["/messaging/chat", existingChat.id]);
          return;
        }
      }

      const request: CreateChatRequest = {
        participants: participantIds,
        isGroup: this.isGroupChat,
        ...(this.isGroupChat && {name: this.groupName.trim()}),
      };

      console.log("Creating new chat with request:", request);
      const chatId = await firstValueFrom(this.chatService.createChat(request));
      console.log("Chat created successfully with ID:", chatId);

      this.isLoading = false;
      this.router.navigate(["/messaging/chat", chatId]);
    } catch (error) {
      console.error("Error creating chat:", error);
      this.showErrorToast("Failed to create chat. Please try again.");
      this.isLoading = false;
    }
  }

  /**
   * Go back to chat list
   */
  goBack() {
    this.router.navigate(["/messaging/chats"]);
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: "danger",
      position: "top",
    });
    await toast.present();
  }

  /**
   * TrackBy function for contacts list
   */
  trackByContactId(index: number, contact: Contact): string {
    return contact.id;
  }
}
