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
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
  IonContent,
  ToastController,
  ActionSheetController,
} from "@ionic/angular";
import {Observable, Subject, combineLatest} from "rxjs";
import {takeUntil, map} from "rxjs/operators";
import {
  Chat,
  Message,
  MessageType,
  SendMessageRequest,
} from "../../models/chat.model";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: "app-chat-window",
  templateUrl: "./chat-window.page.html",
  styleUrls: ["./chat-window.page.scss"],
})
export class ChatWindowPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, {static: false}) content!: IonContent;
  @ViewChild("messageInput", {static: false}) messageInput!: ElementRef;

  chatId!: string;
  chat$!: Observable<Chat | null>;
  messages$!: Observable<Message[]>;
  newMessage = "";
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
  ) {}

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get("id")!;

    if (!this.chatId) {
      this.router.navigate(["/messaging/chats"]);
      return;
    }

    // Load chat and messages
    this.chat$ = this.chatService.getChat(this.chatId);
    this.messages$ = this.chatService.getChatMessages(this.chatId);

    // Subscribe to messages for auto-scroll
    this.messages$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (messages) => {
        if (messages.length > 0) {
          this.scrollToBottom();
        }
      },
      error: (error) => {
        console.error("Error loading messages:", error);
        this.showErrorToast("Failed to load messages");
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Send a text message
   */
  async sendMessage() {
    if (!this.newMessage.trim() || this.isLoading) return;

    const messageText = this.newMessage.trim();
    this.newMessage = "";
    this.isLoading = true;

    const request: SendMessageRequest = {
      chatId: this.chatId,
      text: messageText,
      type: MessageType.TEXT,
    };

    try {
      await this.chatService.sendMessage(request).toPromise();
      this.scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      this.showErrorToast("Failed to send message");
      // Restore message text on error
      this.newMessage = messageText;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Handle attachment button click
   */
  async showAttachmentOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: "Send Attachment",
      buttons: [
        {
          text: "Photo",
          icon: "image-outline",
          handler: () => {
            this.selectFile("image/*");
          },
        },
        {
          text: "Document",
          icon: "document-outline",
          handler: () => {
            this.selectFile("*/*");
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
   * Handle file selection
   */
  private selectFile(accept: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.uploadAndSendFile(file);
      }
    };
    input.click();
  }

  /**
   * Upload file and send as message
   */
  private async uploadAndSendFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      this.showErrorToast("File size must be less than 10MB");
      return;
    }

    this.isLoading = true;

    try {
      // Upload file to storage
      const fileUrl = await this.chatService
        .uploadFile(file, this.chatId)
        .toPromise();

      // Determine message type
      let messageType = MessageType.FILE;
      if (file.type.startsWith("image/")) {
        messageType = MessageType.IMAGE;
      } else if (file.type.startsWith("video/")) {
        messageType = MessageType.VIDEO;
      } else if (file.type.startsWith("audio/")) {
        messageType = MessageType.AUDIO;
      }

      // Send message with file
      const request: SendMessageRequest = {
        chatId: this.chatId,
        fileUrl: fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        type: messageType,
      };

      await this.chatService.sendMessage(request).toPromise();
      this.scrollToBottom();
    } catch (error) {
      console.error("Error uploading file:", error);
      this.showErrorToast("Failed to send file");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Show chat options (block, info, etc.)
   */
  async showChatOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: "Chat Options",
      buttons: [
        {
          text: "Chat Info",
          icon: "information-circle-outline",
          handler: () => {
            // TODO: Navigate to chat info page
            console.log("TODO: Show chat info");
          },
        },
        {
          text: "Block Contact",
          icon: "ban-outline",
          role: "destructive",
          handler: () => {
            this.blockContact();
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
   * Block the contact
   */
  private async blockContact() {
    try {
      // TODO: Implement blocking logic
      console.log("TODO: Block contact");
      this.showSuccessToast("Contact blocked");
    } catch (error) {
      console.error("Error blocking contact:", error);
      this.showErrorToast("Failed to block contact");
    }
  }

  /**
   * Navigate back to chat list
   */
  goBack() {
    this.router.navigate(["/messaging/chats"]);
  }

  /**
   * Scroll to bottom of message list
   */
  private scrollToBottom() {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    }, 100);
  }

  /**
   * Handle Enter key press in input
   */
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Check if message is from current user
   */
  isOwnMessage(message: Message): boolean {
    return message.senderId === this.getCurrentUserId();
  }

  /**
   * Get display name for message sender
   */
  getSenderName(message: Message): string {
    if (message.senderName) {
      return message.senderName;
    }
    return this.isOwnMessage(message) ? "You" : "User " + message.senderId;
  }

  /**
   * Format message timestamp
   */
  formatMessageTime(timestamp: any): string {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  /**
   * Get chat display name
   */
  getChatDisplayName(chat: Chat | null): string {
    if (!chat) return "Loading...";

    if (chat.isGroup) {
      return chat.name || chat.groupName || "Group Chat";
    }

    // TODO: Get other user's name from account service
    const otherParticipants = chat.participants.filter(
      (id) => id !== this.getCurrentUserId(),
    );
    return otherParticipants.length > 0
      ? "User " + otherParticipants[0]
      : "Unknown User";
  }

  getCurrentUserId(): string {
    // TODO: Get from auth service
    return "current-user-id";
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

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: "success",
      position: "top",
    });
    await toast.present();
  }

  /**
   * Track by function for messages
   */
  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number | undefined): string {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
  }

  /**
   * Open image preview
   */
  openImagePreview(url: string) {
    // TODO: Implement image preview modal
    window.open(url, "_blank");
  }

  /**
   * Download file
   */
  downloadFile(url: string, filename: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  }
}
