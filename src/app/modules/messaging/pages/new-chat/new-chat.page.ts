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
import {CreateChatRequest} from "../../models/chat.model";

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

  constructor(
    private router: Router,
    private chatService: ChatService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  /**
   * Load user's accepted contacts
   */
  private loadContacts() {
    // TODO: Load from account service relatedAccounts with status='accepted'
    // For now, using dummy data
    this.contacts = [
      {id: "user1", name: "Alice Johnson", selected: false},
      {id: "user2", name: "Bob Smith", selected: false},
      {id: "user3", name: "Carol Davis", selected: false},
      {id: "user4", name: "David Wilson", selected: false},
    ];
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

    this.isLoading = true;

    try {
      const participantIds = this.selectedContacts.map((c) => c.id);

      // Check if 1-on-1 chat already exists
      if (!this.isGroupChat) {
        const existingChat = await this.chatService
          .findExistingChat(participantIds)
          .toPromise();

        if (existingChat) {
          this.router.navigate(["/messaging/chat", existingChat.id]);
          return;
        }
      }

      const request: CreateChatRequest = {
        participants: participantIds,
        isGroup: this.isGroupChat,
        name: this.isGroupChat ? this.groupName.trim() : undefined,
      };

      const chatId = await this.chatService.createChat(request).toPromise();
      this.router.navigate(["/messaging/chat", chatId]);
    } catch (error) {
      console.error("Error creating chat:", error);
      this.showErrorToast("Failed to create chat");
    } finally {
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
