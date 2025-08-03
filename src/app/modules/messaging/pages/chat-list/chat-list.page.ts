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
import {takeUntil} from "rxjs/operators";
import {Chat} from "../../models/chat.model";
import {ChatService} from "../../services/chat.service";
import {NotificationService} from "../../services/notification.service";

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

  constructor(
    private chatService: ChatService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    this.chats$ = this.chatService.getUserChats();
    this.unreadCounts$ = this.notificationService.getUnreadCounts();
    this.totalUnreadCount$ = this.notificationService.getTotalUnreadCount();
  }

  ngOnInit() {
    // Subscribe to chats for real-time updates
    this.chats$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chats) => {
        console.log("Chats updated:", chats);
      },
      error: (error) => {
        console.error("Error loading chats:", error);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
   * Get display name for chat
   */
  getChatDisplayName(chat: Chat): string {
    if (chat.isGroup) {
      return chat.name || chat.groupName || "Group Chat";
    }

    // TODO: For 1-on-1 chats, get the other user's name
    // This will require integration with the account service
    const otherParticipants = chat.participants.filter(
      (id) => id !== this.getCurrentUserId(),
    );
    return otherParticipants.length > 0
      ? "User " + otherParticipants[0]
      : "Unknown User";
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
    // TODO: Get from auth service
    return "current-user-id";
  }

  /**
   * TrackBy function for chat list performance
   */
  trackByFn(index: number, item: Chat): string {
    return item.id;
  }
}
