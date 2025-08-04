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
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {forkJoin, firstValueFrom, combineLatest} from "rxjs";
import {map, filter, take} from "rxjs/operators";
import * as AccountActions from "../../../../state/actions/account.actions";

interface Contact {
  id: string;
  name: string;
  iconImage?: string;
  tagline?: string;
  type?: "user" | "group";
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
          // Get the contact IDs from relationships
          const contactIds = relationships.map((rel) =>
            rel.targetId === this.currentUserId
              ? rel.initiatorId
              : rel.targetId,
          );

          // If no relationships, set empty contacts
          if (contactIds.length === 0) {
            this.contacts = [];
            return;
          }

          // Load account data for each contact
          const accountObservables = contactIds.map((contactId) => {
            // Dispatch action to load account if needed
            this.store.dispatch(
              AccountActions.loadAccount({accountId: contactId}),
            );

            // Return observable for this account - wait for account to be loaded
            return this.store.select(selectAccountById(contactId)).pipe(
              filter((account) => account !== null), // Wait until account data is loaded
              take(1), // Take the first loaded value
              map((account) => {
                return {
                  id: contactId,
                  name: account?.name || `User ${contactId}`,
                  iconImage: account?.iconImage || undefined,
                  tagline: account?.tagline || undefined,
                  type: (account?.type as "user" | "group") || undefined,
                  selected: false,
                } as Contact;
              }),
            );
          });

          // Combine all account observables
          forkJoin(accountObservables).subscribe({
            next: (contacts) => {
              // Don't filter out contacts - show them even if account data is still loading
              this.contacts = contacts;
            },
            error: (error) => {
              console.error("Error loading contact account data:", error);
              // Fallback to basic contact data
              this.contacts = contactIds.map((contactId) => ({
                id: contactId,
                name: `User ${contactId}`,
                selected: false,
              }));
            },
          });
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

      // Validate relationships for all selected contacts
      const relationshipChecks = this.selectedContacts.map((contact) => {
        return this.relationshipService.canMessage(
          this.currentUserId!,
          contact.id,
        );
      });

      // const canMessageAll = await firstValueFrom(forkJoin(relationshipChecks));
      // console.log("Relationship check results:", canMessageAll);

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
