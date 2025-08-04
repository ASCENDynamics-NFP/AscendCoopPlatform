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
import {Platform, ActionSheetController} from "@ionic/angular";
import {Subject, Observable, of} from "rxjs";
import {takeUntil, map} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {ChatService} from "../../services/chat.service";
import {Chat} from "../../models/chat.model";
import {AuthState} from "../../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-messaging",
  templateUrl: "./messaging.page.html",
  styleUrls: ["./messaging.page.scss"],
})
export class MessagingPage implements OnInit, OnDestroy {
  selectedChatId: string | null = null;
  isDesktop = false;
  hasChats = false;
  chats$: Observable<Chat[]>;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private platform: Platform,
    private chatService: ChatService,
    private store: Store<{auth: AuthState}>,
    private actionSheetController: ActionSheetController,
  ) {
    // Initialize chats observable
    this.chats$ = this.chatService.getUserChats();
  }

  ngOnInit() {
    // Check if we're on desktop
    this.isDesktop = this.platform.width() >= 768;

    // Listen for platform changes
    this.platform.resize.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isDesktop = this.platform.width() >= 768;
    });

    // Listen for route changes to track selected chat
    this.route.firstChild?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.selectedChatId = params["id"] || null;
      });

    // Subscribe to chats to check if user has any conversations
    // and pre-load participant accounts
    this.chats$.pipe(takeUntil(this.destroy$)).subscribe((chats) => {
      this.hasChats = chats.length > 0;

      // Pre-load participant accounts for all chats
      const participantIds = new Set<string>();
      chats.forEach((chat) => {
        chat.participants.forEach((participantId) => {
          if (participantId !== this.getCurrentUserId()) {
            participantIds.add(participantId);
          }
        });
      });

      // Dispatch actions to load all participant accounts
      participantIds.forEach((participantId) => {
        this.store.dispatch(
          AccountActions.loadAccount({accountId: participantId}),
        );
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle chat selection from the list
   */
  onChatSelected(chatId: string) {
    this.selectedChatId = chatId;
    if (this.isDesktop) {
      // On desktop, update the detail view
      this.router.navigate(["chat", chatId], {relativeTo: this.route});
    } else {
      // On mobile, navigate to the chat page
      this.router.navigate(["/messaging/chat", chatId]);
    }
  }

  /**
   * Handle new chat creation
   */
  onNewChat() {
    if (this.isDesktop) {
      this.router.navigate(["new-chat"], {relativeTo: this.route});
    } else {
      this.router.navigate(["/messaging/new-chat"]);
    }
  }

  /**
   * Show messaging options menu
   */
  async showMessagingOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: "Messaging Options",
      buttons: [
        {
          text: "Blocked Users",
          icon: "ban",
          handler: () => {
            this.router.navigate(["/messaging/blocked-users"]);
          },
        },
        {
          text: "Settings",
          icon: "settings",
          handler: () => {
            this.router.navigate(["/account/settings"]);
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
   * Close detail view (return to list on mobile)
   */
  onCloseDetail() {
    this.selectedChatId = null;
    if (!this.isDesktop) {
      this.router.navigate(["/messaging/chats"]);
    }
  }

  /**
   * Get display name for chat
   */
  getChatDisplayName(chat: Chat): Observable<string> {
    if (chat.isGroup) {
      return of(chat.name || chat.groupName || "Group Chat");
    }

    // For 1-on-1 chats, get the other user's name
    const otherParticipants = chat.participants.filter(
      (id) => id !== this.getCurrentUserId(),
    );

    if (otherParticipants.length === 0) {
      return of("Unknown User");
    }

    const otherUserId = otherParticipants[0];

    // Get account name from store (account should already be loading from ngOnInit)
    return this.store
      .select(selectAccountById(otherUserId))
      .pipe(map((account) => account?.name || `User ${otherUserId}`));
  }

  /**
   * Get avatar image for chat
   */
  getChatAvatarImage(chat: Chat): Observable<string> {
    if (chat.isGroup) {
      // For group chats, you might want a group icon or first participant's avatar
      return of("assets/image/logo/ASCENDynamics NFP-logos_transparent.png");
    }

    // For 1-on-1 chats, get the other user's avatar
    const otherParticipants = chat.participants.filter(
      (id) => id !== this.getCurrentUserId(),
    );

    if (otherParticipants.length === 0) {
      return of("assets/image/logo/ASCENDynamics NFP-logos_transparent.png");
    }

    const otherUserId = otherParticipants[0];

    // Get account avatar from store (account should already be loading from ngOnInit)
    return this.store
      .select(selectAccountById(otherUserId))
      .pipe(
        map(
          (account) =>
            account?.iconImage ||
            "assets/image/logo/ASCENDynamics NFP-logos_transparent.png",
        ),
      );
  }

  /**
   * Get truncated last message for display
   */
  getTruncatedMessage(
    message: string | undefined,
    maxLength: number = 50,
  ): string {
    if (!message) return "No messages yet";
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  }

  /**
   * Get formatted timestamp for last message
   */
  getFormattedTime(timestamp: any): string {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than 24 hours - show time
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    // Less than a week - show day
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString("en-US", {weekday: "short"});
    }

    // Older - show date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  getCurrentUserId(): string {
    // Get user ID through chat service which has auth integration
    return (this.chatService as any).getCurrentUserIdSync();
  }

  /**
   * TrackBy function for chat list performance
   */
  trackByFn(index: number, item: Chat): string {
    return item.id;
  }
}
