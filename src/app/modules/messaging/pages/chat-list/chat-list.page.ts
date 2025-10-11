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
import {Chat, Message} from "../../models/chat.model";
import {ChatService} from "../../services/chat.service";
import {NotificationService} from "../../services/notification.service";
import {EncryptedChatService} from "../../services/encrypted-chat.service";
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
  private chatAvatarCache = new Map<string, string | null>();
  private chatAvatarLoadState = new Map<string, boolean>();
  private chatLastMessageCache = new Map<string, string>();
  private currentUserId: string | null = null;

  constructor(
    private chatService: ChatService,
    private notificationService: NotificationService,
    private router: Router,
    private store: Store<{auth: AuthState}>,
    private encryptedChatService: EncryptedChatService,
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
   * Preload account information, avatars and last messages
   */
  private preloadChatDisplayNames(chats: Chat[]) {
    const currentUserId = this.getCurrentUserId();

    chats.forEach((chat) => {
      if (chat.isGroup) {
        const displayName = chat.name || chat.groupName || "Group Chat";
        this.chatDisplayNameCache.set(chat.id, displayName);
        const groupIcon = (chat as any)?.iconImage || null;
        this.chatAvatarCache.set(chat.id, groupIcon);
        this.chatAvatarLoadState.set(chat.id, !!groupIcon);
      } else {
        const otherParticipants = chat.participants.filter(
          (id) => id !== currentUserId,
        );

        if (otherParticipants.length > 0) {
          const otherUserId = otherParticipants[0];

          this.store.dispatch(
            AccountActions.loadAccount({accountId: otherUserId}),
          );

          this.store
            .select(selectAccountById(otherUserId))
            .pipe(takeUntil(this.destroy$), take(1))
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

                let avatar = account?.iconImage || account?.photoURL || null;
                if (avatar?.startsWith("src/")) {
                  avatar = avatar.replace(/^src\//, "");
                }
                this.chatAvatarCache.set(chat.id, avatar);
                this.chatAvatarLoadState.set(chat.id, !!avatar);
              },
              error: (error) => {
                console.warn(`Error loading account ${otherUserId}:`, error);
                this.chatDisplayNameCache.set(chat.id, "Unknown User");
                this.chatAvatarCache.set(chat.id, null);
                this.chatAvatarLoadState.set(chat.id, false);
              },
            });
        } else {
          this.chatDisplayNameCache.set(chat.id, "Unknown User");
          this.chatAvatarCache.set(chat.id, null);
          this.chatAvatarLoadState.set(chat.id, false);
        }
      }

      // Load and decrypt last message
      this.loadLastMessage(chat, currentUserId);
    });
  }

  /**
   * Load and decrypt last message for a chat
   */
  private loadLastMessage(chat: Chat, currentUserId: string) {
    this.chatService
      .getChatMessages(chat.id, 1)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: async (messages: Message[]) => {
          if (!messages.length) {
            this.chatLastMessageCache.set(chat.id, "No messages yet");
            return;
          }

          const msg = messages[0];
          let text = msg.text || "";

          if (msg.isEncrypted) {
            try {
              text = await this.encryptedChatService.decryptMessage(
                msg,
                currentUserId,
              );
            } catch (error) {
              console.warn(
                `Error decrypting last message for chat ${chat.id}:`,
                error,
              );
              text = "🔒 Encrypted message (unable to decrypt)";
            }
          }

          if (!text) {
            if (msg.fileName) {
              text = `📎 ${msg.fileName}`;
            } else if (msg.fileUrl) {
              text = "File attachment";
            }
          }

          this.chatLastMessageCache.set(chat.id, text);
        },
        error: (err) => {
          console.warn(`Error loading last message for chat ${chat.id}:`, err);
          this.chatLastMessageCache.set(
            chat.id,
            chat.lastMessage || "No messages yet",
          );
        },
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
   * Get chat avatar URL if available
   */
  getChatAvatar(chat: Chat | null): string | null {
    if (!chat) return null;
    const cached = this.chatAvatarCache.get(chat.id);
    const isLoaded = this.chatAvatarLoadState.get(chat.id);
    if (!cached || isLoaded === false) {
      return null;
    }
    return cached;
  }

  /**
   * Handle avatar load errors to use icon fallback
   */
  onAvatarError(chatId: string) {
    this.chatAvatarLoadState.set(chatId, false);
  }

  getChatAvatarIcon(chat: Chat | null): string {
    if (!chat) return "person-circle";
    return chat.isGroup ? "people-circle-outline" : "person-circle";
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
   * Get last message text for a chat
   */
  getLastMessage(chat: Chat | null): string {
    if (!chat) return "";
    if (this.chatLastMessageCache.has(chat.id)) {
      return this.chatLastMessageCache.get(chat.id)!;
    }
    return chat.lastMessage || "";
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
