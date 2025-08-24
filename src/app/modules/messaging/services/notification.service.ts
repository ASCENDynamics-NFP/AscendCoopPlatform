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
import {BehaviorSubject, Observable, firstValueFrom} from "rxjs";
import {Message, Chat} from "../models/chat.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {Platform} from "@ionic/angular";

export interface NotificationData {
  id: string;
  chatId: string;
  message: Message;
  chat: Chat;
  timestamp: Date;
  isRead: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  showPreview: boolean;
  muteUntil?: Date;
}

export interface ChatNotificationSettings {
  [chatId: string]: {
    muted: boolean;
    muteUntil?: Date;
    customSound?: string;
  };
}

export interface AdminNotificationSettings {
  memberJoinRequests: boolean;
  newListingApplications: boolean;
  groupActivity: boolean;
  emailNotifications: boolean;
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private activeNotifications$ = new BehaviorSubject<NotificationData[]>([]);
  private unreadCounts$ = new BehaviorSubject<{[chatId: string]: number}>({});
  private notificationSettings$ = new BehaviorSubject<NotificationSettings>({
    enabled: true,
    sound: true,
    vibration: true,
    showPreview: true,
  });
  private chatSettings$ = new BehaviorSubject<ChatNotificationSettings>({});
  private currentUserId: string | null = null;

  constructor(
    private toastController: ToastController,
    private firestore: AngularFirestore,
    private router: Router,
    private platform: Platform,
  ) {
    this.initializePushNotifications();
  }

  /**
   * Initialize push notifications and request permission
   */
  private async initializePushNotifications() {
    try {
      // Check if notifications are supported
      if (!("Notification" in window)) {
        console.warn("This browser does not support notifications");
        return;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Notification permission granted
      } else {
        console.warn("Notification permission denied");
      }
    } catch (error) {
      console.error("Error initializing push notifications:", error);
    }
  }

  /**
   * Set current user ID and load settings
   */
  async setCurrentUserId(userId: string) {
    this.currentUserId = userId;
    await this.loadUserSettings(userId);
  }

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
   * Get notification settings
   */
  getNotificationSettings(): Observable<NotificationSettings> {
    return this.notificationSettings$.asObservable();
  }

  /**
   * Update notification settings
   */
  updateNotificationSettings(settings: Partial<NotificationSettings>) {
    const currentSettings = this.notificationSettings$.value;
    const newSettings = {...currentSettings, ...settings};
    this.notificationSettings$.next(newSettings);

    // Save to localStorage for persistence
    localStorage.setItem("notificationSettings", JSON.stringify(newSettings));

    // Save to Firestore if user is logged in
    if (this.currentUserId) {
      this.firestore
        .collection("accounts")
        .doc(this.currentUserId)
        .update({notificationSettings: newSettings})
        .catch((error) =>
          console.error("Error saving notification settings:", error),
        );
    }
  }

  /**
   * Get chat-specific notification settings
   */
  getChatNotificationSettings(): Observable<ChatNotificationSettings> {
    return this.chatSettings$.asObservable();
  }

  /**
   * Update chat-specific notification settings
   */
  updateChatNotificationSettings(
    chatId: string,
    settings: Partial<ChatNotificationSettings[string]>,
  ) {
    const currentSettings = this.chatSettings$.value;
    const newSettings = {
      ...currentSettings,
      [chatId]: {...currentSettings[chatId], ...settings},
    };
    this.chatSettings$.next(newSettings);

    // Save to localStorage for persistence
    localStorage.setItem(
      "chatNotificationSettings",
      JSON.stringify(newSettings),
    );

    // Save to Firestore if user is logged in
    if (this.currentUserId) {
      this.firestore
        .collection("accounts")
        .doc(this.currentUserId)
        .update({chatNotificationSettings: newSettings})
        .catch((error) =>
          console.error("Error saving chat notification settings:", error),
        );
    }
  }

  /**
   * Mute/unmute a chat
   */
  muteChat(chatId: string, duration?: number) {
    const muteUntil = duration ? new Date(Date.now() + duration) : undefined;
    this.updateChatNotificationSettings(chatId, {
      muted: true,
      muteUntil,
    });
  }

  /**
   * Unmute a chat
   */
  unmuteChat(chatId: string) {
    this.updateChatNotificationSettings(chatId, {
      muted: false,
      muteUntil: undefined,
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

    const settings = this.notificationSettings$.value;
    const chatSettings = this.chatSettings$.value[chat.id];

    // Check if notifications are enabled and chat is not muted
    if (!settings.enabled || chatSettings?.muted) {
      return;
    }

    // Check if chat is muted temporarily
    if (chatSettings?.muteUntil && new Date() < chatSettings.muteUntil) {
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

    // Show browser notification if permission granted
    await this.showBrowserNotification(message, chat);

    // Show toast notification
    await this.showToastNotification(message, chat);

    // Play notification sound
    if (settings.sound) {
      this.playNotificationSound(chatSettings?.customSound);
    }

    // Vibrate if enabled
    if (settings.vibration && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // Auto-remove notification after 10 seconds
    setTimeout(() => {
      this.removeNotification(notificationData.id);
    }, 10000);
  }

  /**
   * Show browser notification
   */
  private async showBrowserNotification(message: Message, chat: Chat) {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const settings = this.notificationSettings$.value;
    const senderName = this.getSenderDisplayName(message, chat);
    const messageText = this.getMessagePreview(message);

    const notification = new Notification(
      chat.isGroup ? chat.name || "Group Chat" : senderName,
      {
        body: settings.showPreview
          ? chat.isGroup
            ? `${senderName}: ${messageText}`
            : messageText
          : "New message",
        icon: "/assets/icon/icon-192x192.png",
        badge: "/assets/icon/icon-72x72.png",
        tag: `chat-${chat.id}`,
        data: {chatId: chat.id, messageId: message.id},
        requireInteraction: false,
        silent: !settings.sound,
      },
    );

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      this.navigateToChat(chat.id);
      notification.close();
    };

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  /**
   * Play notification sound
   */
  private playNotificationSound(customSound?: string) {
    try {
      const audio = new Audio(customSound || "/assets/sounds/notification.mp3");
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.warn("Could not play notification sound:", error);
      });
    } catch (error) {
      console.warn("Error playing notification sound:", error);
    }
  }

  /**
   * Navigate to chat
   */
  private navigateToChat(chatId: string) {
    this.router.navigate(["/messaging/chat", chatId]);
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
    const settings = this.notificationSettings$.value;

    const toast = await this.toastController.create({
      header: chat.isGroup ? chat.name || "Group Chat" : senderName,
      message: settings.showPreview
        ? chat.isGroup
          ? `${senderName}: ${messageText}`
          : messageText
        : "New message",
      duration: 5000,
      position: "top",
      color: "primary",
      buttons: [
        {
          text: "View",
          handler: () => {
            this.navigateToChat(chat.id);
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
    return message.senderName || `User ${message.senderId.substring(0, 8)}`;
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
      case "video":
        return "🎥 Video";
      case "audio":
        return "🎵 Audio";
      case "file":
        return `📎 ${message.fileName || "File"}`;
      default:
        return "New message";
    }
  }

  /**
   * Load user settings from storage and Firestore
   */
  private async loadUserSettings(userId: string) {
    try {
      // Load from localStorage first for immediate UI update
      const localNotificationSettings = localStorage.getItem(
        "notificationSettings",
      );
      const localChatSettings = localStorage.getItem(
        "chatNotificationSettings",
      );

      if (localNotificationSettings) {
        this.notificationSettings$.next(JSON.parse(localNotificationSettings));
      }

      if (localChatSettings) {
        this.chatSettings$.next(JSON.parse(localChatSettings));
      }

      // Then load from Firestore for authoritative data
      const userDoc = await firstValueFrom(
        this.firestore.collection("accounts").doc(userId).get(),
      );

      if (userDoc && userDoc.exists) {
        const userData = userDoc.data() as any;

        if (userData.notificationSettings) {
          this.notificationSettings$.next({
            ...this.notificationSettings$.value,
            ...userData.notificationSettings,
          });
        }

        if (userData.chatNotificationSettings) {
          this.chatSettings$.next({
            ...this.chatSettings$.value,
            ...userData.chatNotificationSettings,
          });
        }
      }
    } catch (error) {
      console.error("Error loading user notification settings:", error);
    }
  }

  /**
   * Show admin notification for member join requests
   */
  async showMemberJoinRequestNotification(
    requesterName: string,
    groupName: string,
    groupId: string,
  ) {
    const settings = this.notificationSettings$.value;
    if (!settings.enabled) return;

    // Show browser notification
    if (Notification.permission === "granted") {
      const notification = new Notification(
        `New Member Request - ${groupName}`,
        {
          body: `${requesterName} has requested to join your group`,
          icon: "/assets/icon/icon-192x192.png",
          tag: `member-request-${groupId}`,
          data: {type: "member_request", groupId, requesterName},
        },
      );

      notification.onclick = () => {
        console.log("Browser notification clicked, navigating to members tab");
        window.focus();
        this.router.navigate(["/account", groupId, "admin"], {
          queryParams: {tab: "members"},
        });
        notification.close();
      };
    }

    // Show toast notification
    const toast = await this.toastController.create({
      message: `${requesterName} wants to join ${groupName}`,
      duration: 5000,
      color: "primary",
      position: "top",
      buttons: [
        {
          text: "Review",
          handler: () => {
            console.log("Navigating to admin dashboard with members tab");
            this.router.navigate(["/account", groupId, "admin"], {
              queryParams: {tab: "members"},
            });
          },
        },
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });
    await toast.present();

    // Play notification sound and vibrate
    if (settings.sound) {
      this.playNotificationSound();
    }
    if (settings.vibration && navigator.vibrate) {
      navigator.vibrate([300, 100, 300]);
    }
  }

  /**
   * Show admin notification for listing applications
   */
  async showListingApplicationNotification(
    applicantName: string,
    listingTitle: string,
    listingId: string,
  ) {
    const settings = this.notificationSettings$.value;
    if (!settings.enabled) return;

    // Show browser notification
    if (Notification.permission === "granted") {
      const notification = new Notification(
        `New Application - ${listingTitle}`,
        {
          body: `${applicantName} has applied to your listing`,
          icon: "/assets/icon/icon-192x192.png",
          tag: `listing-application-${listingId}`,
          data: {type: "listing_application", listingId, applicantName},
        },
      );

      notification.onclick = () => {
        window.focus();
        this.router.navigate(["/listings", listingId]);
        notification.close();
      };
    }

    // Show toast notification
    const toast = await this.toastController.create({
      message: `New application from ${applicantName} for "${listingTitle}"`,
      duration: 5000,
      color: "success",
      position: "top",
      buttons: [
        {
          text: "View",
          handler: () => {
            this.router.navigate(["/listings", listingId]);
          },
        },
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });
    await toast.present();

    // Play notification sound and vibrate
    if (settings.sound) {
      this.playNotificationSound();
    }
    if (settings.vibration && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }

  /**
   * Check admin notification preferences for a specific group
   */
  async checkAdminNotificationSettings(
    groupId: string,
    notificationType: string,
  ): Promise<boolean> {
    try {
      const accountDoc = await this.firestore
        .collection("accounts")
        .doc(groupId)
        .get()
        .toPromise();

      if (!accountDoc || !accountDoc.exists) {
        return true; // Default to enabled if no settings found
      }

      const accountData = accountDoc.data() as any;
      const notificationPrefs =
        accountData?.administrativeSettings?.notificationPreferences;

      if (!notificationPrefs) {
        return true; // Default to enabled
      }

      try {
        const prefs = JSON.parse(notificationPrefs);
        return prefs[notificationType] !== false; // Default to true unless explicitly disabled
      } catch {
        return true; // Default to enabled if parsing fails
      }
    } catch (error) {
      console.error("Error checking admin notification settings:", error);
      return true; // Default to enabled on error
    }
  }
}
