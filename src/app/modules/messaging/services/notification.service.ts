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
import {Injectable} from "@angular/core";
import {ToastController} from "@ionic/angular";
import {BehaviorSubject, Observable} from "rxjs";
import {Message, Chat} from "../models/chat.model";

export interface NotificationData {
  id: string;
  chatId: string;
  message: Message;
  chat: Chat;
  timestamp: Date;
  isRead: boolean;
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private activeNotifications$ = new BehaviorSubject<NotificationData[]>([]);
  private unreadCounts$ = new BehaviorSubject<{[chatId: string]: number}>({});

  constructor(private toastController: ToastController) {}

  /**
   * Get observable of active notifications
   */
  getActiveNotifications(): Observable<NotificationData[]> {
    return this.activeNotifications$.asObservable();
  }

  /**
   * Get observable of unread message counts per chat
   */
  getUnreadCounts(): Observable<{[chatId: string]: number}> {
    return this.unreadCounts$.asObservable();
  }

  /**
   * Get total unread count across all chats
   */
  getTotalUnreadCount(): Observable<number> {
    return new Observable((observer) => {
      this.unreadCounts$.subscribe((counts) => {
        const total = Object.values(counts).reduce(
          (sum, count) => sum + count,
          0,
        );
        observer.next(total);
      });
    });
  }

  /**
   * Show in-app notification for new message
   */
  async showNewMessageNotification(
    message: Message,
    chat: Chat,
    currentChatId?: string,
  ): Promise<void> {
    // Don't show notification for current active chat
    if (currentChatId === chat.id) {
      return;
    }

    const notificationData: NotificationData = {
      id: `${chat.id}-${message.id}`,
      chatId: chat.id,
      message,
      chat,
      timestamp: new Date(),
      isRead: false,
    };

    // Add to active notifications
    const currentNotifications = this.activeNotifications$.value;
    this.activeNotifications$.next([...currentNotifications, notificationData]);

    // Update unread count
    this.incrementUnreadCount(chat.id);

    // Show toast notification
    await this.showToastNotification(message, chat);

    // Auto-remove notification after 10 seconds
    setTimeout(() => {
      this.removeNotification(notificationData.id);
    }, 10000);
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): void {
    const notifications = this.activeNotifications$.value;
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? {...notification, isRead: true}
        : notification,
    );
    this.activeNotifications$.next(updatedNotifications);
  }

  /**
   * Mark all notifications for a chat as read
   */
  markChatNotificationsAsRead(chatId: string): void {
    const notifications = this.activeNotifications$.value;
    const updatedNotifications = notifications.map((notification) =>
      notification.chatId === chatId
        ? {...notification, isRead: true}
        : notification,
    );
    this.activeNotifications$.next(updatedNotifications);

    // Reset unread count for this chat
    this.resetUnreadCount(chatId);
  }

  /**
   * Remove notification
   */
  removeNotification(notificationId: string): void {
    const notifications = this.activeNotifications$.value;
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== notificationId,
    );
    this.activeNotifications$.next(updatedNotifications);
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    this.activeNotifications$.next([]);
  }

  /**
   * Increment unread count for a chat
   */
  private incrementUnreadCount(chatId: string): void {
    const currentCounts = this.unreadCounts$.value;
    const newCounts = {
      ...currentCounts,
      [chatId]: (currentCounts[chatId] || 0) + 1,
    };
    this.unreadCounts$.next(newCounts);
  }

  /**
   * Reset unread count for a chat
   */
  private resetUnreadCount(chatId: string): void {
    const currentCounts = this.unreadCounts$.value;
    const newCounts = {...currentCounts};
    delete newCounts[chatId];
    this.unreadCounts$.next(newCounts);
  }

  /**
   * Show toast notification
   */
  private async showToastNotification(
    message: Message,
    chat: Chat,
  ): Promise<void> {
    const senderName = this.getSenderDisplayName(message, chat);
    const messageText = this.getMessagePreview(message);

    const toast = await this.toastController.create({
      header: chat.isGroup ? chat.name : senderName,
      message: chat.isGroup ? `${senderName}: ${messageText}` : messageText,
      duration: 5000,
      position: "top",
      color: "primary",
      buttons: [
        {
          text: "View",
          handler: () => {
            // TODO: Navigate to chat
            console.log("Navigate to chat:", chat.id);
          },
        },
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });

    await toast.present();
  }

  /**
   * Get sender display name
   */
  private getSenderDisplayName(message: Message, chat: Chat): string {
    // TODO: Get actual user name from user service
    return `User ${message.senderId.substring(0, 8)}`;
  }

  /**
   * Get message preview text
   */
  private getMessagePreview(message: Message): string {
    switch (message.type) {
      case "text":
        return message.text?.substring(0, 50) || "";
      case "image":
        return "📸 Image";
      case "file":
        return `📎 ${message.fileName || "File"}`;
      default:
        return "New message";
    }
  }
}
