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
import {Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {takeUntil, take} from "rxjs/operators";
import {Chat} from "../../models/chat.model";
import {ChatService} from "../../services/chat.service";
import {NotificationService} from "../../services/notification.service";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../../state/reducers/auth.reducer";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-chat-list",
  templateUrl: "./chat-list.page.html",
  styleUrls: ["./chat-list.page.scss"],
})
export class ChatListPage implements OnInit, OnDestroy {
  chats$: Observable<Chat[]>;
  unreadCounts$: Observable<{[chatId: string]: number}>;
  totalUnreadCount$: Observable<number>;
  private destroy$ = new Subject<void>();
  private chatDisplayNameCache = new Map<string, string>();
  private currentUserId: string | null = null;

  constructor(
    private chatService: ChatService,
    private notificationService: NotificationService,
    private router: Router,
    private store: Store<{auth: AuthState}>,
  ) {
    this.chats$ = this.chatService.getUserChats();
    this.unreadCounts$ = this.notificationService.getUnreadCounts();
    this.totalUnreadCount$ = this.notificationService.getTotalUnreadCount();
  }

  ngOnInit() {
    // Get current user ID from store
    this.store
      .select(selectAuthUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUserId = user?.uid || null;
      });

    // Subscribe to chats for real-time updates
    this.chats$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chats) => {
        // Preload account information for all chat participants
        this.preloadChatDisplayNames(chats);
      },
      error: (error) => {
        console.error("Error loading chats:", error);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // Clear cache to prevent memory leaks
    this.chatDisplayNameCache.clear();
  }

  /**
   * Navigate to chat window
   */
  openChat(chat: Chat) {
    // Mark notifications as read for this chat
    this.notificationService.markChatNotificationsAsRead(chat.id);

    this.router.navigate(["/messaging/chat", chat.id]);
  }

  /**
   * Navigate to new chat creation
   */
  startNewChat() {
    this.router.navigate(["/messaging/new-chat"]);
  }

  /**
   * Get unread count for a specific chat
   */
  getUnreadCount(chatId: string): Observable<number> {
    return new Observable((observer) => {
      this.unreadCounts$.pipe(takeUntil(this.destroy$)).subscribe((counts) => {
        observer.next(counts[chatId] || 0);
      });
    });
  }

  /**
   * Preload account information for chat display names
   */
  private preloadChatDisplayNames(chats: Chat[]) {
    const currentUserId = this.getCurrentUserId();

    chats.forEach((chat) => {
      if (chat.isGroup) {
        // Group chats use the group name
        const displayName = chat.name || chat.groupName || "Group Chat";
        this.chatDisplayNameCache.set(chat.id, displayName);
      } else {
        // For 1-on-1 chats, get the other participant's name
        const otherParticipants = chat.participants.filter(
          (id) => id !== currentUserId,
        );

        if (otherParticipants.length > 0) {
          const otherUserId = otherParticipants[0];

          // Load account if not already loaded
          this.store.dispatch(
            AccountActions.loadAccount({accountId: otherUserId}),
          );

          // Subscribe to account updates to populate cache
          this.store
            .select(selectAccountById(otherUserId))
            .pipe(
              takeUntil(this.destroy$),
              take(1), // Only take the first emission to avoid repeated updates
            )
            .subscribe({
              next: (account: any) => {
                let displayName = "User";
                if (account?.name) {
                  displayName = account.name;
                } else if (account?.email) {
                  displayName = account.email;
                } else {
                  displayName = `User ${otherUserId.substring(0, 8)}...`;
                }
                this.chatDisplayNameCache.set(chat.id, displayName);
              },
              error: (error) => {
                console.warn(`Error loading account ${otherUserId}:`, error);
                this.chatDisplayNameCache.set(chat.id, "Unknown User");
              },
            });
        } else {
          this.chatDisplayNameCache.set(chat.id, "Unknown User");
        }
      }
    });
  }

  /**
   * Get chat display name
   */
  getChatDisplayName(chat: Chat | null): string {
    if (!chat) return "Loading...";

    // Check cache first for better performance
    if (this.chatDisplayNameCache.has(chat.id)) {
      return this.chatDisplayNameCache.get(chat.id)!;
    }

    if (chat.isGroup) {
      const displayName = chat.name || chat.groupName || "Group Chat";
      this.chatDisplayNameCache.set(chat.id, displayName);
      return displayName;
    }

    // For 1-on-1 chats, get the other user's name
    const otherParticipants = chat.participants.filter(
      (id) => id !== this.getCurrentUserId(),
    );

    if (otherParticipants.length > 0) {
      const otherUserId = otherParticipants[0];

      // Load account if not already loaded
      this.store.dispatch(AccountActions.loadAccount({accountId: otherUserId}));

      // Try to get from store synchronously (might be null if not loaded yet)
      let displayName = "Loading...";
      this.store
        .select(selectAccountById(otherUserId))
        .pipe(take(1))
        .subscribe((account) => {
          if (account?.name) {
            displayName = account.name;
          } else if (account?.email) {
            displayName = account.email;
          } else if (account) {
            displayName = `User ${otherUserId.substring(0, 8)}...`;
          }
        });

      this.chatDisplayNameCache.set(chat.id, displayName);
      return displayName;
    }

    const fallback = "Unknown User";
    this.chatDisplayNameCache.set(chat.id, fallback);
    return fallback;
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

  getCurrentUserId(): string {
    return this.currentUserId || "";
  }

  /**
   * TrackBy function for chat list performance
   */
  trackByFn(index: number, item: Chat): string {
    return item.id;
  }
}
