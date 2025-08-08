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
import {Component, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {ChatService} from "../../services/chat.service";
import {RelationshipService} from "../../services/relationship.service";
import {CreateChatRequest} from "../../models/chat.model";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {
  forkJoin,
  firstValueFrom,
  combineLatest,
  Subject,
  of,
  timer,
} from "rxjs";
import {
  map,
  filter,
  take,
  takeUntil,
  timeout,
  catchError,
} from "rxjs/operators";
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
export class NewChatPage implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  selectedContacts: Contact[] = [];
  isGroupChat = false;
  groupName = "";
  isLoading = false;
  currentUserId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private chatService: ChatService,
    private relationshipService: RelationshipService,
    private toastController: ToastController,
    private store: Store<{auth: AuthState}>,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // Get current user ID
    this.store
      .select(selectAuthUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user?.uid) {
          this.currentUserId = user.uid;
          this.loadContacts();
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
            this.cdr.detectChanges();
            return;
          }

          // Load account data for each contact
          const accountObservables = contactIds.map((contactId) => {
            // Dispatch action to load account if needed
            this.store.dispatch(
              AccountActions.loadAccount({accountId: contactId}),
            );

            // Return observable for this account with timeout to prevent hanging
            return this.store.select(selectAccountById(contactId)).pipe(
              timeout(5000), // 5 second timeout
              filter((account) => account !== null), // Wait until account data is loaded
              take(1), // Take the first loaded value
              map((account) => {
                return {
                  id: contactId,
                  name: account?.name || `User`,
                  iconImage: account?.iconImage || undefined,
                  tagline: account?.tagline || undefined,
                  type: (account?.type as "user" | "group") || undefined,
                  selected: false,
                } as Contact;
              }),
              catchError((error) => {
                console.warn(
                  `Timeout loading account ${contactId}, using fallback:`,
                  error,
                );
                // Return fallback contact data on timeout
                return of({
                  id: contactId,
                  name: `User ${contactId.substring(0, 8)}`,
                  selected: false,
                } as Contact);
              }),
            );
          });

          // Combine all account observables
          forkJoin(accountObservables).subscribe({
            next: (contacts) => {
              this.contacts = contacts;
              // Manually trigger change detection to ensure UI updates
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error("Error loading contact account data:", error);
              // Fallback to basic contact data
              this.contacts = contactIds.map((contactId) => ({
                id: contactId,
                name: `User ${contactId.substring(0, 8)}`,
                selected: false,
              }));
              this.cdr.detectChanges();
            },
          });
        },
        error: (error) => {
          console.error("Error loading contacts:", error);
          this.showErrorToast("Failed to load contacts");
          // Fallback to dummy data for development
          this.contacts = [];
        },
      });
  }

  /**
   * Toggle contact selection
   */
  toggleContact(contact: Contact) {
    contact.selected = !contact.selected;
    this.updateSelectedContacts();
    this.cdr.detectChanges();
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

      // Check if chat already exists (works for both 1-on-1 and group chats)
      const existingChat = await firstValueFrom(
        this.chatService.findExistingChat(participantIds),
      );

      if (existingChat) {
        this.isLoading = false;
        this.router.navigate(["/messaging/chat", existingChat.id]);
        return;
      }

      const request: CreateChatRequest = {
        participants: participantIds,
        isGroup: this.isGroupChat,
        ...(this.isGroupChat && {name: this.groupName.trim()}),
      };

      const chatId = await firstValueFrom(this.chatService.createChat(request));

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
   * Make input field editable (removes readonly to prevent password manager interference)
   */
  makeEditable(event: any) {
    if (event?.target) {
      // Remove readonly attribute to allow typing
      event.target.removeAttribute("readonly");
      // Focus on the input
      setTimeout(() => {
        event.target.focus();
      }, 10);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * TrackBy function for contacts list
   */
  trackByContactId(index: number, contact: Contact): string {
    return contact.id;
  }
}
