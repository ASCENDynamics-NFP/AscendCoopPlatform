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
  ChangeDetectorRef,
  NgZone,
} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
  IonContent,
  IonInfiniteScroll,
  ToastController,
  ActionSheetController,
  ModalController,
  AlertController,
  Platform,
} from "@ionic/angular";
import {
  Observable,
  Subject,
  of,
  firstValueFrom,
  Subscription,
  combineLatest,
} from "rxjs";
import {takeUntil, map, take, tap, switchMap, finalize} from "rxjs/operators";
import {
  Chat,
  Message,
  MessageType,
  MessageStatus,
  SendMessageRequest,
} from "../../models/chat.model";
import {ChatService} from "../../services/chat.service";
import {RelationshipService} from "../../services/relationship.service";
import {NotificationService} from "../../services/notification.service";
import {EncryptedChatService} from "../../services/encrypted-chat.service";
import {EncryptionService} from "../../services/encryption.service";
import {KeyBackupService} from "../../services/key-backup.service";
import {NetworkConnectionService} from "../../../../core/services/network-connection.service";
import {OfflineSyncService} from "../../../../core/services/offline-sync.service";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {UserReportModalComponent} from "../../components/user-report-modal/user-report-modal.component";
import {ChatParticipantsModalComponent} from "../../components/chat-participants-modal/chat-participants-modal.component";
import {KeyRestoreModalComponent} from "../../components/key-restore-modal/key-restore-modal.component";

@Component({
  selector: "app-chat-window",
  templateUrl: "./chat-window.page.html",
  styleUrls: ["./chat-window.page.scss"],
})
export class ChatWindowPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, {static: false}) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  private destroy$ = new Subject<void>();
  private messagesDestroy$ = new Subject<void>(); // For canceling message subscriptions
  @ViewChild("messageInput", {static: false}) messageInput!: ElementRef;

  chatId!: string;
  chat$!: Observable<Chat | null>;
  messages$!: Observable<Message[]>;
  messages: Message[] = []; // Local array for optimistic updates
  newMessage = "";
  isLoading = false;
  currentUserId: string | null = null;
  otherParticipantId: string | null = null;
  isContactBlocked = false;
  isDesktop = false;

  // Infinite Scroll properties
  readonly MESSAGE_LIMIT = 10;
  lastMessageTimestamp: any = null;
  isEverythingLoaded = false;
  isHistoryLoading = false;
  isMessagesLoading = true; // Track initial message load
  private initialLoadComplete = false;

  // File preview properties
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;
  filePreviewType: "image" | "video" | "audio" | "document" | null = null;
  isUploadingFile = false;
  canSendMessages = true;
  // private destroy$ = new Subject<void>(); // Moved this declaration up

  // Encryption properties
  encryptionEnabled = false;
  isEncryptionActive = false;
  encryptionAvailable = false;
  hasEncryptionBackup = false;
  showBackupWarning = false;

  // Connection status properties
  isOnline$!: Observable<boolean>;
  syncStatus$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private relationshipService: RelationshipService,
    private notificationService: NotificationService,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private alertController: AlertController,
    private store: Store<{auth: AuthState}>,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private encryptedChatService: EncryptedChatService,
    private encryptionService: EncryptionService,
    private keyBackupService: KeyBackupService,
    private networkService: NetworkConnectionService,
    private offlineSync: OfflineSyncService,
    private platform: Platform,
  ) {}

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get("id")!;

    if (!this.chatId) {
      this.router.navigate(["/messaging/chats"]);
      return;
    }

    // Check if we're on desktop
    this.isDesktop = this.platform.width() >= 768;

    // Initialize connection status observables
    this.isOnline$ = this.chatService.isOnline();
    this.syncStatus$ = this.chatService.getOfflineSyncStatus();

    // Get current user ID from store
    this.store
      .select(selectAuthUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUserId = user?.uid || null;
        if (this.currentUserId) {
          // Set user ID in notification service
          this.notificationService.setCurrentUserId(this.currentUserId);
          this.initializeChat();
          this.initializeEncryption();
        }
      });
  }

  /**
   * Initialize chat after getting current user ID
   */
  private initializeChat() {
    // Mark notifications as read for this chat when entering
    this.notificationService.markChatNotificationsAsRead(this.chatId);

    // Reset unread count for this user in the chat document
    this.chatService.markChatAsRead(this.chatId).subscribe({
      error: (error) => console.error("Error marking chat as read:", error),
    });

    // Load chat first to validate access
    this.chat$ = this.chatService.getChat(this.chatId);

    // Validate user has permission to access this chat
    this.chat$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chat) => {
        if (chat) {
          this.validateChatAccess(chat);
        } else {
          this.showErrorToast("Chat not found");
          this.router.navigate(["/messaging/chats"]);
        }
      },
      error: (error) => {
        console.error("Error loading chat:", error);
        // Only navigate away if it's NOT a permission error (which happens on logout)
        if (
          error.code !== "permission-denied" &&
          error.message !== "Missing or insufficient permissions."
        ) {
          this.showErrorToast("Error loading chat");
          this.router.navigate(["/messaging/chats"]);
        }
      },
    });

    // Load messages with decryption support
    this.loadMessages();

    // Subscribe to encryption key changes to re-decrypt messages
    this.encryptionService.keysChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ({
          userId,
          action,
        }: {
          userId: string;
          action: "restored" | "cleared";
        }) => {
          console.log(
            `Key change event received: ${action} for user ${userId}`,
          );
          console.log(
            `Current user: ${this.currentUserId}, Encryption enabled: ${this.encryptionEnabled}`,
          );

          // Reload if it's the current user's keys (check encryption status after restoring keys)
          if (userId === this.currentUserId) {
            console.log(
              `Encryption keys ${action} for current user, reloading messages...`,
            );

            // Cancel previous message subscription
            this.messagesDestroy$.next();

            // Clear current messages to force fresh load
            this.messages = [];

            // Re-check encryption status and reload
            this.initializeEncryption().then(() => {
              console.log(
                `After re-init: Encryption enabled: ${this.encryptionEnabled}`,
              );
            });
          }
        },
      );
  }

  /**
   * Load messages with encryption support
   * This subscribes to real-time updates for the recent messages (Head)
   */
  private loadMessages() {
    if (!this.currentUserId) {
      return;
    }

    // Use encrypted chat service if encryption is enabled, otherwise use regular service
    let messagesSource$: Observable<Message[]>;

    // Always fetch just the latest batch for the real-time listener
    // History will be loaded via loadMoreMessages
    const limit = this.MESSAGE_LIMIT;

    if (this.encryptionEnabled) {
      messagesSource$ = this.encryptedChatService.getDecryptedMessages(
        this.chatId,
        this.currentUserId,
        limit,
      );
    } else {
      messagesSource$ = this.chatService.getChatMessages(this.chatId, limit);
    }

    // Subscribe to messages and update local array
    console.log(`Loading messages with encryption: ${this.encryptionEnabled}`);
    messagesSource$
      .pipe(takeUntil(this.messagesDestroy$), takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          // Merge server messages with local optimistic messages and historical messages
          this.messages = this.mergeMessages(messages);

          // Pre-load sender accounts for avatar display
          this.preloadSenderAccounts(messages);

          // Determine scroll behavior
          // 1. If it's the initial load sequence (which might include decryption updates), stick to bottom.
          // 2. If the user was already at the bottom, stay at the bottom (new message or expansion).
          // 3. If it's a completely new incoming message, scroll to it.

          const isAtBottom = this.isUserAtBottom();
          const isInitialLoadSequence = !this.initialLoadComplete;

          // Mark initial load complete after first valid render (with a delay to allow for decryption/rendering)
          // We use a property to track if we've ever successfully settled at the bottom
          if (!this.lastMessageTimestamp && this.messages.length > 0) {
            // First time we have messages
            // Don't set initialLoadComplete immediately, wait for stability
            setTimeout(() => {
              this.initialLoadComplete = true;
            }, 2000); // Give it 2 seconds of "stickiness" for initial load
          }

          const shouldScroll =
            isInitialLoadSequence ||
            isAtBottom ||
            this.isNewMessageReceived(messages);

          // Update timestamp marker for history loading
          if (this.messages.length > 0) {
            // The oldest message in the current list
            // Note: messages are sorted [oldest, ..., newest]
            const oldestMessage = this.messages[0];
            this.lastMessageTimestamp = oldestMessage.timestamp;
          }

          // Hide loading skeleton immediately on first emission
          // Use requestAnimationFrame to ensure DOM is ready
          if (this.isMessagesLoading) {
            requestAnimationFrame(() => {
              this.isMessagesLoading = false;
              // Trigger change detection and scroll after DOM update
              requestAnimationFrame(() => {
                if (shouldScroll) {
                  this.scrollToBottom();
                  setTimeout(() => this.scrollToBottom(), 100);
                  setTimeout(() => this.scrollToBottom(), 300);
                }
              });
            });
          } else if (shouldScroll) {
            // Normal scroll behavior for subsequent updates
            this.scrollToBottom();
            setTimeout(() => this.scrollToBottom(), 100);
            setTimeout(() => this.scrollToBottom(), 300);
          }
        },
        error: (error) => {
          console.error("Error loading messages:", error);
          this.showErrorToast("Error loading messages");
        },
      });
  }

  /**
   * Load more messages (History) when scrolling up
   */
  loadMoreMessages(event: any) {
    if (this.isEverythingLoaded || this.isHistoryLoading) {
      event.target.complete();
      return;
    }

    this.isHistoryLoading = true;

    // Use the oldest message timestamp as the cursor
    const oldestMessage = this.messages[0];
    if (!oldestMessage || !oldestMessage.timestamp) {
      event.target.complete();
      this.isHistoryLoading = false;
      return;
    }

    const cursor = oldestMessage.timestamp;

    // Fetch history
    let history$: Observable<Message[]>;

    if (this.encryptionEnabled && this.currentUserId) {
      history$ = this.encryptedChatService.getDecryptedHistory(
        this.chatId,
        cursor,
        this.MESSAGE_LIMIT,
        this.currentUserId,
      );
    } else {
      history$ = this.chatService.getChatHistory(
        this.chatId,
        cursor,
        this.MESSAGE_LIMIT,
      );
    }

    history$.pipe(take(1)).subscribe({
      next: (historicalMessages) => {
        if (historicalMessages.length < this.MESSAGE_LIMIT) {
          this.isEverythingLoaded = true;
          if (this.infiniteScroll) {
            this.infiniteScroll.disabled = true;
          }
        }

        if (historicalMessages.length > 0) {
          // Prepend historical messages to the current list
          // Merge to avoid duplicates
          const newMessages = this.mergeHistory(
            historicalMessages,
            this.messages,
          );
          this.messages = newMessages;

          // Preload avatars for new messages
          this.preloadSenderAccounts(historicalMessages);

          // Restore scroll position (approximated)
          // Ideally we would calculate height diff, but for now we just let Ionic handle it
          // or the user stays where they are relative to the content
        }

        event.target.complete();
        this.isHistoryLoading = false;
      },
      error: (error) => {
        console.error("Error loading chat history:", error);
        event.target.complete();
        this.isHistoryLoading = false;
      },
    });
  }

  /**
   * Merge historical messages with current messages
   */
  private mergeHistory(history: Message[], current: Message[]): Message[] {
    const currentIds = new Set(current.map((m) => m.id));
    const uniqueHistory = history.filter((m) => !currentIds.has(m.id));
    // History comes oldest -> newest. Current is oldest -> newest.
    // So we want [History, Current]
    return [...uniqueHistory, ...current];
  }

  /**
   * Pre-load sender accounts for avatar display
   */
  private preloadSenderAccounts(messages: Message[]) {
    const defaultImage =
      "assets/image/logo/ASCENDynamics NFP-logos_transparent.png";
    const senderIds = new Set<string>();

    messages.forEach((message) => {
      if (message.senderId && message.senderId !== this.currentUserId) {
        senderIds.add(message.senderId);
      }
    });

    // Dispatch actions to load all sender accounts and subscribe to updates
    senderIds.forEach((senderId) => {
      this.store.dispatch(AccountActions.loadAccount({accountId: senderId}));

      // Subscribe to account updates to populate avatar and name cache
      this.store
        .select(selectAccountById(senderId))
        .pipe(
          takeUntil(this.destroy$),
          // Remove take(1) to allow for updates when data loads
        )
        .subscribe({
          next: (account: any) => {
            // Run cache updates outside Angular's zone to avoid signal conflicts
            this.ngZone.runOutsideAngular(() => {
              const avatarUrl = account?.iconImage || defaultImage;
              this.senderAvatarCache.set(senderId, avatarUrl);

              // Cache sender name as well - only if we have account data
              if (account) {
                let senderName = "User";
                if (account.name) {
                  senderName = account.name;
                } else if (account.email) {
                  senderName = account.email;
                } else {
                  senderName = `User ${senderId.substring(0, 8)}...`;
                }
                this.senderNameCache.set(senderId, senderName);
              }
            });

            // Trigger change detection in Angular zone
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.warn(`Error loading account ${senderId}:`, error);
            // Run cache updates outside Angular's zone to avoid signal conflicts
            this.ngZone.runOutsideAngular(() => {
              this.senderAvatarCache.set(senderId, defaultImage);
              this.senderNameCache.set(senderId, "Unknown User");
            });
          },
        });
    });
  }

  /**
   * Initialize encryption for the current user and chat
   */
  private async initializeEncryption() {
    try {
      if (!this.currentUserId) {
        return;
      }

      // Check if user has encryption enabled
      this.encryptionEnabled =
        await this.encryptedChatService.isEncryptionEnabled();

      // Check if encryption is available for this chat
      if (this.chatId) {
        this.encryptionAvailable =
          await this.encryptedChatService.isEncryptionAvailable(this.chatId);
      }

      // If encryption is not enabled, try to initialize it
      if (!this.encryptionEnabled) {
        try {
          await this.encryptedChatService.enableEncryption();
          this.encryptionEnabled = true;
          this.encryptionAvailable =
            await this.encryptedChatService.isEncryptionAvailable(this.chatId);
        } catch (error) {
          console.warn("Encryption initialization failed:", error);
          // Continue without encryption
        }
      }

      // Check if backup exists but local keys are missing (new device scenario)
      if (this.encryptionEnabled) {
        // Check backup status
        const backupStatus = await this.keyBackupService.hasBackup();
        this.hasEncryptionBackup = backupStatus.hasBackup;

        const hasLocalKeys = await this.encryptionService.getStoredKeyPair(
          this.currentUserId,
        );

        // Show warning if keys exist but no backup
        this.showBackupWarning = !!hasLocalKeys && !backupStatus.hasBackup;

        if (!hasLocalKeys) {
          if (backupStatus.hasBackup) {
            // Show restore prompt automatically
            await this.promptKeyRestore(backupStatus.authMethod || "password");
          }
        }
      }

      // Reload messages with encryption support if encryption status changed
      this.loadMessages();
    } catch (error) {
      console.error("Error initializing encryption:", error);
    }
  }

  /**
   * Prompt user to restore keys from backup (new device scenario)
   */
  private async promptKeyRestore(
    authMethod: "password" | "sso",
  ): Promise<void> {
    try {
      const modal = await this.modalController.create({
        component: KeyRestoreModalComponent,
        componentProps: {
          authMethod: authMethod,
        },
        backdropDismiss: false, // Require user decision
      });

      await modal.present();

      const {data, role} = await modal.onDidDismiss();

      if (role === "restore" && data) {
        // Keys restored successfully via the modal
        const authUser = await firstValueFrom(
          this.store.select(selectAuthUser),
        );
        if (authUser?.uid) {
          await this.encryptionService.storeKeyPair(data, authUser.uid);
          await this.showSuccessToast(
            "Keys restored successfully! Your encrypted messages are now accessible.",
          );
          // Messages will auto-reload due to keysChanged$ subscription
        }
      } else if (role === "skip") {
        // User chose to generate new keys
        await this.showInfoToast(
          "New keys generated. Previous encrypted messages may not be accessible.",
        );
      }
    } catch (error) {
      console.error("Error in key restore prompt:", error);
    }
  }

  /**
   * Prompt user when some participants don't have encryption keys
   */
  private async promptPartialEncryption(
    missingCount: number,
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: "⚠️ Partial Encryption",
        message: `${missingCount} ${missingCount === 1 ? "participant has" : "participants have"} not enabled encryption yet. Your message cannot be encrypted for them.`,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => resolve(false),
          },
          {
            text: "Send Unencrypted",
            handler: () => resolve(true),
          },
        ],
      });

      await alert.present();
    });
  }

  /**
   * Handle encryption toggle from the UI component
   */
  onEncryptionToggled(active: boolean) {
    this.isEncryptionActive = active;
  }

  /**
   * Validate user has access to this chat based on relationships
   */
  private async validateChatAccess(chat: Chat) {
    try {
      if (!this.currentUserId) {
        // User logged out, just return
        return;
      }

      // Check if user is a participant
      if (!chat.participants.includes(this.currentUserId)) {
        this.showErrorToast("You don't have access to this chat");
        this.router.navigate(["/messaging/chats"]);
        return;
      }

      // For group chats, skip individual relationship validation
      if (chat.isGroup) {
        return;
      }

      // For 1-on-1 chats, validate relationship with the other participant
      this.otherParticipantId =
        chat.participants.find((p) => p !== this.currentUserId) || null;

      if (this.otherParticipantId) {
        // Check if contact is blocked
        this.isContactBlocked =
          (await firstValueFrom(
            this.relationshipService.isUserBlocked(
              this.currentUserId,
              this.otherParticipantId,
            ),
          )) || false;

        // Check if can message
        this.canSendMessages =
          !this.isContactBlocked &&
          ((await firstValueFrom(
            this.relationshipService.canMessage(
              this.currentUserId,
              this.otherParticipantId,
            ),
          )) ||
            false);

        // Validate that user can access this chat
        if (
          !(await firstValueFrom(
            this.relationshipService.canMessage(
              this.currentUserId,
              this.otherParticipantId,
            ),
          ))
        ) {
          this.showErrorToast("You can only message accepted friends");
          this.router.navigate(["/messaging/chats"]);
          return;
        }
      }
    } catch (error: any) {
      console.error("Error validating chat access:", error);
      // Only navigate away if it's NOT a permission error (which happens on logout)
      if (
        error?.code !== "permission-denied" &&
        error?.message !== "Missing or insufficient permissions."
      ) {
        this.showErrorToast("Error validating chat access");
        this.router.navigate(["/messaging/chats"]);
      }
    }
  }

  /**
   * Merge server messages with local optimistic messages
   */
  private mergeMessages(serverMessages: Message[]): Message[] {
    // For now, just return server messages
    // In a more sophisticated implementation, we'd merge with pending local messages
    return serverMessages;
  }

  ngOnDestroy() {
    this.messagesDestroy$.next();
    this.messagesDestroy$.complete();
    this.destroy$.next();
    this.destroy$.complete();
    // Clear caches outside Angular zone to prevent signal conflicts
    this.ngZone.runOutsideAngular(() => {
      this.senderAvatarCache.clear();
      this.senderNameCache.clear();
    });
    // Clean up file preview URL
    this.clearFilePreview();
  }

  /**
   * Send a text message with optimistic UI updates
   */
  async sendMessage() {
    if (!this.newMessage.trim() || this.isLoading) return;

    // Check if user can send messages
    if (!this.canSendMessages) {
      if (this.isContactBlocked) {
        this.showErrorToast("Cannot send messages to blocked contacts");
      } else {
        this.showErrorToast("You can only message accepted friends");
      }
      return;
    }

    const messageText = this.newMessage.trim();
    this.newMessage = "";

    // Create optimistic message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`, // Temporary ID
      senderId: this.currentUserId || "", // Get from current user ID
      text: messageText,
      type: MessageType.TEXT,
      status: MessageStatus.SENDING,
      timestamp: new Date() as any, // Use Date for local display
      createdAt: new Date() as any,
    };

    // Add optimistic message to local array
    this.messages = [...this.messages, optimisticMessage];
    setTimeout(() => this.scrollToBottom(), 100);

    const request: SendMessageRequest = {
      chatId: this.chatId,
      text: messageText,
      type: MessageType.TEXT,
      isEncrypted: this.isEncryptionActive && this.encryptionAvailable,
    };

    try {
      let messageId: string;

      if (this.isEncryptionActive && this.encryptionAvailable) {
        // Send encrypted message
        const encryptedMessageObservable =
          await this.encryptedChatService.sendEncryptedMessage(request);
        messageId = await firstValueFrom(encryptedMessageObservable);
      } else {
        // Send regular message
        messageId = await firstValueFrom(this.chatService.sendMessage(request));
      }

      // Update optimistic message status to sent
      this.messages = this.messages.map((msg) =>
        msg.id === optimisticMessage.id
          ? {...msg, id: messageId || msg.id, status: MessageStatus.SENT}
          : msg,
      );
    } catch (error: any) {
      console.error("Error sending message:", error);

      // Handle partial encryption scenario
      if (error.message === "PARTIAL_ENCRYPTION_AVAILABLE") {
        // Remove optimistic message
        this.messages = this.messages.filter(
          (msg) => msg.id !== optimisticMessage.id,
        );

        // Prompt user for decision
        const shouldSendUnencrypted = await this.promptPartialEncryption(
          error.missingKeyParticipants?.length || 0,
        );

        if (shouldSendUnencrypted) {
          // Resend as unencrypted
          try {
            const unencryptedRequest = {...request, isEncrypted: false};
            const messageId = await firstValueFrom(
              this.chatService.sendMessage(unencryptedRequest),
            );
            await this.showInfoToast("Message sent unencrypted");
          } catch (retryError) {
            console.error("Failed to send unencrypted message:", retryError);
            this.showErrorToast("Failed to send message");
          }
        } else {
          // User cancelled - restore original text to input
          this.newMessage = messageText;
        }
        return;
      }

      this.showErrorToast("Failed to send message");

      // Update optimistic message status to failed
      this.messages = this.messages.map((msg) =>
        msg.id === optimisticMessage.id
          ? {...msg, status: MessageStatus.FAILED}
          : msg,
      );
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
   * Handle file selection with preview
   */
  private selectFile(accept: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.showFilePreview(file);
      }
    };
    input.click();
  }

  /**
   * Show file preview before sending
   */
  private showFilePreview(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      this.showErrorToast("File size must be less than 10MB");
      return;
    }

    this.selectedFile = file;
    this.filePreviewType = this.getFilePreviewType(file);

    // Create preview URL for images and videos
    if (this.filePreviewType === "image" || this.filePreviewType === "video") {
      this.filePreviewUrl = URL.createObjectURL(file);
    } else {
      this.filePreviewUrl = null;
    }

    // Trigger change detection for OnPush strategy
    this.cdr.detectChanges();
  }

  /**
   * Get file preview type based on MIME type
   */
  private getFilePreviewType(
    file: File,
  ): "image" | "video" | "audio" | "document" {
    if (file.type.startsWith("image/")) {
      return "image";
    } else if (file.type.startsWith("video/")) {
      return "video";
    } else if (file.type.startsWith("audio/")) {
      return "audio";
    } else {
      return "document";
    }
  }

  /**
   * Send the selected file
   */
  async sendSelectedFile() {
    if (!this.selectedFile) {
      return;
    }

    this.isUploadingFile = true;
    this.cdr.detectChanges(); // Update UI to show loading state

    try {
      await this.uploadAndSendFile(this.selectedFile);
      this.clearFilePreview();
    } catch (error) {
      console.error("Error sending file:", error);
      // Don't clear preview on error so user can retry
    } finally {
      this.isUploadingFile = false;
      this.cdr.detectChanges(); // Update UI to hide loading state
    }
  }

  /**
   * Cancel file selection and clear preview
   */
  clearFilePreview() {
    if (this.filePreviewUrl) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
    this.selectedFile = null;
    this.filePreviewUrl = null;
    this.filePreviewType = null;

    // Trigger change detection for OnPush strategy
    this.cdr.detectChanges();
  }

  /**
   * Get file icon based on file type
   */
  getFileIcon(fileType: string): string {
    if (fileType.startsWith("image/")) return "image-outline";
    if (fileType.startsWith("video/")) return "videocam-outline";
    if (fileType.startsWith("audio/")) return "musical-notes-outline";
    if (fileType.includes("pdf")) return "document-text-outline";
    if (fileType.includes("word") || fileType.includes("doc"))
      return "document-outline";
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return "grid-outline";
    if (fileType.includes("powerpoint") || fileType.includes("presentation"))
      return "easel-outline";
    if (
      fileType.includes("zip") ||
      fileType.includes("rar") ||
      fileType.includes("archive")
    )
      return "archive-outline";
    return "document-outline";
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
      const fileUrl = await firstValueFrom(
        this.chatService.uploadFile(file, this.chatId),
      );

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

      await firstValueFrom(this.chatService.sendMessage(request));
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
    const chat = await firstValueFrom(this.chat$.pipe(take(1)));
    const buttons: any[] = [
      {
        text: "Chat Info",
        icon: "information-circle-outline",
        handler: () => {
          this.showChatInfo();
        },
      },
      {
        text: "Notification Settings",
        icon: "notifications-outline",
        handler: () => {
          this.showNotificationSettings();
        },
      },
      {
        text: "Encryption Settings",
        icon: "lock-closed-outline",
        handler: () => {
          this.showEncryptionSettings();
        },
      },
    ];

    // Add manage participants option for group chats
    if (chat?.isGroup) {
      buttons.push({
        text: "Manage Participants",
        icon: "people-outline",
        handler: () => {
          this.showParticipantsModal();
        },
      });
    }

    // Add block/unblock option for 1-on-1 chats
    if (!chat?.isGroup && this.otherParticipantId) {
      if (this.isContactBlocked) {
        buttons.push({
          text: "Unblock Contact",
          icon: "checkmark-circle-outline",
          handler: () => {
            this.unblockContact();
          },
        });
      } else {
        buttons.push({
          text: "Block Contact",
          icon: "ban-outline",
          role: "destructive",
          handler: () => {
            this.blockContact();
          },
        });
      }

      // Add report option for 1-on-1 chats (only if not blocked)
      if (!this.isContactBlocked) {
        buttons.push({
          text: "Report User",
          icon: "flag-outline",
          role: "destructive",
          handler: () => {
            this.showReportModal();
          },
        });
      }
    }

    // Add delete chat option (always shown)
    buttons.push({
      text: "Delete Chat",
      icon: "trash-outline",
      role: "destructive",
      handler: () => {
        this.deleteChat();
      },
    });

    buttons.push({
      text: "Cancel",
      icon: "close",
      role: "cancel",
    });

    const actionSheet = await this.actionSheetController.create({
      header: "Chat Options",
      buttons,
    });
    await actionSheet.present();
  }

  /**
   * Block the contact
   */
  private async blockContact() {
    if (!this.currentUserId || !this.otherParticipantId) {
      this.showErrorToast("Unable to block contact");
      return;
    }

    try {
      await firstValueFrom(
        this.relationshipService.blockUser(
          this.currentUserId,
          this.otherParticipantId,
        ),
      );
      this.isContactBlocked = true;
      this.canSendMessages = false;
      this.showSuccessToast("Contact blocked");
    } catch (error) {
      console.error("Error blocking contact:", error);
      this.showErrorToast("Failed to block contact");
    }
  }

  /**
   * Unblock the contact
   */
  private async unblockContact() {
    if (!this.currentUserId || !this.otherParticipantId) {
      this.showErrorToast("Unable to unblock contact");
      return;
    }

    try {
      await firstValueFrom(
        this.relationshipService.unblockUser(
          this.currentUserId,
          this.otherParticipantId,
        ),
      );
      this.isContactBlocked = false;
      this.canSendMessages = true;
      this.showSuccessToast("Contact unblocked");
    } catch (error) {
      console.error("Error unblocking contact:", error);
      this.showErrorToast("Failed to unblock contact");
    }
  }

  /**
   * Navigate back to chat list
   */
  goBack() {
    this.router.navigate(["/messaging/chats"]);
  }

  /**
   * Navigate to user profile page
   */
  private navigateToUserProfile(userId: string) {
    if (!userId) {
      this.showErrorToast("User ID not available");
      return;
    }

    // Navigate to the user profile page
    this.router.navigate(["/account", userId]);
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
    if (!message) {
      return "Unknown User";
    }

    // Use message's built-in sender name if available
    if (message.senderName) {
      return message.senderName;
    }

    // Check if it's own message
    if (this.isOwnMessage(message)) {
      return "You";
    }

    // Check if we don't have a sender ID
    if (!message.senderId) {
      return "Unknown User";
    }

    // Check cache first for better performance
    if (this.senderNameCache.has(message.senderId)) {
      return this.senderNameCache.get(message.senderId)!;
    }

    // Load account if not already loaded (but don't wait for it)
    this.store.dispatch(
      AccountActions.loadAccount({accountId: message.senderId}),
    );

    // Try to get from store synchronously - only cache if we have real data
    let senderName = `User ${message.senderId.substring(0, 8)}...`; // Default fallback
    let hasValidData = false;

    this.store
      .select(selectAccountById(message.senderId))
      .pipe(take(1))
      .subscribe((account) => {
        if (account) {
          hasValidData = true;
          if (account.name) {
            senderName = account.name;
          } else if (account.email) {
            senderName = account.email;
          } else {
            senderName = `User ${message.senderId!.substring(0, 8)}...`;
          }
        }
      });

    // Only cache if we have valid account data, not placeholder/loading states
    if (hasValidData) {
      // Run cache update outside Angular's zone to avoid signal conflicts
      this.ngZone.runOutsideAngular(() => {
        this.senderNameCache.set(message.senderId!, senderName);
      });
    }

    return senderName;
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

    // Get other user's name from account service
    const otherParticipants = chat.participants.filter(
      (id) => id !== this.getCurrentUserId(),
    );

    if (otherParticipants.length > 0) {
      const otherUserId = otherParticipants[0];
      // Try to get cached account info
      let displayName = "User";

      this.store
        .select(selectAccountById(otherUserId))
        .pipe(take(1))
        .subscribe((account) => {
          if (account?.name) {
            displayName = account.name;
          } else if (account?.email) {
            displayName = account.email;
          }
        });

      return displayName;
    }

    return "Unknown User";
  }

  getCurrentUserId(): string {
    return this.currentUserId || "";
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
   * Show info toast message
   */
  private async showInfoToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: "primary",
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
    // Open image in a new window for now
    // TODO: Implement a proper image preview modal component with zoom and navigation
    window.open(url, "_blank");
  }

  /**
   * Open file in new window
   */
  openFileInNewWindow(url: string, filename: string) {
    // Open the file URL in a new window/tab
    window.open(url, "_blank", "noopener,noreferrer");
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

  /**
   * Get sender avatar image
   */
  getSenderAvatar(message: Message): string {
    if (!message.senderId || this.isOwnMessage(message)) {
      return "assets/image/logo/ASCENDynamics NFP-logos_transparent.png";
    }

    // Load account if not already loaded
    this.store.dispatch(
      AccountActions.loadAccount({accountId: message.senderId}),
    );

    // Return default for now, the template will get updated via the selector
    return "assets/image/logo/ASCENDynamics NFP-logos_transparent.png";
  }

  // Cache for sender avatars to prevent infinite observable chains
  private senderAvatarCache = new Map<string, string>();
  // Cache for sender names to improve performance
  private senderNameCache = new Map<string, string>();

  /**
   * Get sender avatar URL synchronously for template use
   */
  getSenderAvatarUrl(message: Message): string {
    // Default fallback image
    const defaultImage =
      "assets/image/logo/ASCENDynamics NFP-logos_transparent.png";

    if (!message || !message.senderId || this.isOwnMessage(message)) {
      return defaultImage;
    }

    // Check cache first
    if (this.senderAvatarCache.has(message.senderId)) {
      return this.senderAvatarCache.get(message.senderId)!;
    }

    // If not in cache, dispatch load action and return default
    // The preloadSenderAccounts method will populate the cache
    this.store.dispatch(
      AccountActions.loadAccount({accountId: message.senderId}),
    );

    // Return default for now, cache will be updated by preloadSenderAccounts
    this.ngZone.runOutsideAngular(() => {
      this.senderAvatarCache.set(message.senderId!, defaultImage);
    });
    return defaultImage;
  }

  /**
   * Get sender avatar as Observable for template use (keeping for backward compatibility)
   */
  getSenderAvatarObservable(message: Message): Observable<string> {
    return of(this.getSenderAvatarUrl(message));
  }

  /**
   * Show message options when message is long-pressed or avatar is clicked
   */
  async showMessageOptions(message: Message) {
    try {
      if (!message.senderId) {
        return;
      }

      if (!this.currentUserId) {
        console.error("No current user ID available");
        this.showErrorToast("User authentication required");
        return;
      }

      const buttons: any[] = [];
      const isOwnMessage = this.isOwnMessage(message);
      let senderName = "User";

      if (isOwnMessage) {
        // Options for own messages

        // Edit message option (for text messages only)
        if (message.type === "text") {
          buttons.push({
            text: "Edit Message",
            icon: "create-outline",
            handler: () => {
              this.editMessage(message);
            },
          });
        }

        // Delete message option
        buttons.push({
          text: "Delete Message",
          icon: "trash-outline",
          role: "destructive",
          handler: () => {
            this.deleteMessage(message);
          },
        });

        // Copy text option for text messages
        if (message.type === "text" && message.text) {
          buttons.push({
            text: "Copy Text",
            icon: "copy-outline",
            handler: () => {
              this.copyMessageText(message.text!);
            },
          });
        }
      } else {
        // Options for other users' messages

        // Load sender account if not already loaded
        this.store.dispatch(
          AccountActions.loadAccount({accountId: message.senderId}),
        );

        // Get sender name for display
        try {
          const account = await firstValueFrom(
            this.store.select(selectAccountById(message.senderId)).pipe(
              take(1),
              map((account) => account),
            ),
          );

          if (account?.name) {
            senderName = account.name;
          }
        } catch (error) {
          console.warn("Could not get sender name:", error);
        }

        // Check if user is blocked
        let isBlocked = false;
        try {
          isBlocked =
            (await firstValueFrom(
              this.relationshipService
                .isUserBlocked(this.currentUserId, message.senderId)
                .pipe(take(1)),
            )) || false;
        } catch (error) {
          console.warn("Could not check block status:", error);
        }

        // Add user info option
        buttons.push({
          text: `View ${senderName}'s Profile`,
          icon: "person-outline",
          handler: () => {
            this.navigateToUserProfile(message.senderId!);
          },
        });

        // Add block/unblock option
        if (isBlocked) {
          buttons.push({
            text: `Unblock ${senderName}`,
            icon: "checkmark-circle-outline",
            handler: () => {
              this.unblockUser(message.senderId!);
            },
          });
        } else {
          buttons.push({
            text: `Block ${senderName}`,
            icon: "ban-outline",
            role: "destructive",
            handler: () => {
              this.blockUser(message.senderId!);
            },
          });
        }

        // Add report user option (only if not blocked)
        if (!isBlocked) {
          buttons.push({
            text: `Report ${senderName}`,
            icon: "flag-outline",
            role: "destructive",
            handler: () => {
              this.showReportModal(message.senderId!);
            },
          });
        }

        // Copy text option for text messages
        if (message.type === "text" && message.text) {
          buttons.push({
            text: "Copy Text",
            icon: "copy-outline",
            handler: () => {
              this.copyMessageText(message.text!);
            },
          });
        }
      }

      buttons.push({
        text: "Cancel",
        icon: "close",
        role: "cancel",
      });

      const actionSheet = await this.actionSheetController.create({
        header: isOwnMessage
          ? "Message Options"
          : `Message from ${senderName || "User"}`,
        buttons,
      });

      await actionSheet.present();
    } catch (error) {
      console.error("Error in showMessageOptions:", error);
      this.showErrorToast("Failed to show message options");
    }
  }

  /**
   * Block user from message context
   */
  private async blockUser(userId: string) {
    if (!this.currentUserId || !userId) {
      this.showErrorToast("Unable to block user");
      return;
    }

    try {
      await firstValueFrom(
        this.relationshipService.blockUser(this.currentUserId, userId),
      );

      // Update local state if this is the other participant
      if (userId === this.otherParticipantId) {
        this.isContactBlocked = true;
        this.canSendMessages = false;
      }

      this.showSuccessToast("User blocked");
    } catch (error) {
      console.error("Error blocking user:", error);
      this.showErrorToast("Failed to block user");
    }
  }

  /**
   * Unblock user from message context
   */
  private async unblockUser(userId: string) {
    if (!this.currentUserId || !userId) {
      this.showErrorToast("Unable to unblock user");
      return;
    }

    try {
      await firstValueFrom(
        this.relationshipService.unblockUser(this.currentUserId, userId),
      );

      // Update local state if this is the other participant
      if (userId === this.otherParticipantId) {
        this.isContactBlocked = false;
        this.canSendMessages = true;
      }

      this.showSuccessToast("User unblocked");
    } catch (error) {
      console.error("Error unblocking user:", error);
      this.showErrorToast("Failed to unblock user");
    }
  }

  /**
   * Edit message functionality
   */
  private async editMessage(message: Message) {
    if (!message.text || message.type !== "text") {
      this.showErrorToast("Only text messages can be edited");
      return;
    }

    const alert = await this.alertController.create({
      header: "Edit Message",
      inputs: [
        {
          name: "messageText",
          type: "textarea",
          placeholder: "Enter your message...",
          value: message.text,
          attributes: {
            maxlength: 1000,
            rows: 3,
          },
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Save",
          handler: async (data) => {
            const newText = data.messageText?.trim();
            if (!newText) {
              this.showErrorToast("Message cannot be empty");
              return false;
            }

            if (newText === message.text) {
              return true; // No changes
            }

            try {
              await firstValueFrom(
                this.chatService.updateMessage(this.chatId!, message.id, {
                  text: newText,
                }),
              );

              this.showToast("Message updated successfully", "short");
              return true;
            } catch (error) {
              console.error("Error updating message:", error);
              this.showErrorToast("Failed to update message");
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Delete message functionality
   */
  private async deleteMessage(message: Message) {
    const alert = await this.alertController.create({
      header: "Delete Message",
      message:
        "Are you sure you want to delete this message? This action cannot be undone.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Delete",
          role: "destructive",
          handler: async () => {
            try {
              // Optimistically remove message from local array
              this.messages = this.messages.filter((m) => m.id !== message.id);

              // Delete from Firestore
              await firstValueFrom(
                this.chatService.deleteMessage(this.chatId!, message.id),
              );
              this.showToast("Message deleted successfully", "short");
            } catch (error) {
              console.error("Error deleting message:", error);
              this.showErrorToast("Failed to delete message");
              // Reload messages on error to restore the message
              // The subscription will pick up the current state
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Delete entire chat conversation
   */
  private async deleteChat() {
    const alert = await this.alertController.create({
      header: "Delete Chat",
      message:
        "Are you sure you want to delete this entire chat? This will remove it from your chat list. This action cannot be undone.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Delete",
          role: "destructive",
          handler: async () => {
            try {
              await firstValueFrom(this.chatService.deleteChat(this.chatId!));
              this.showToast("Chat deleted successfully", "short");
              // Navigate back to chat list
              this.router.navigate(["/messaging/chats"]);
            } catch (error) {
              console.error("Error deleting chat:", error);
              this.showErrorToast("Failed to delete chat");
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Copy message text to clipboard
   */
  private async copyMessageText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast("Text copied to clipboard", "short");
    } catch (error) {
      console.error("Failed to copy text:", error);
      this.showToast("Failed to copy text", "short");
    }
  }

  /**
   * Show the user report modal
   */
  async showReportModal(userId?: string) {
    const reportedUserId = userId || this.otherParticipantId;

    if (!reportedUserId) {
      this.showErrorToast("Unable to report user");
      return;
    }

    // Get the other participant's name
    let reportedUserName = "Unknown User";

    try {
      // Get the current user for the reporter info
      const currentUser = await firstValueFrom(
        this.store.select(selectAuthUser).pipe(take(1)),
      );

      // Get the reported user's account info
      const reportedUserAccount = await firstValueFrom(
        this.store.select(selectAccountById(reportedUserId)).pipe(take(1)),
      );

      if (reportedUserAccount) {
        reportedUserName =
          reportedUserAccount.name ||
          reportedUserAccount.email ||
          "Unknown User";
      }

      const modal = await this.modalController.create({
        component: UserReportModalComponent,
        componentProps: {
          reportedUserId: reportedUserId,
          reportedUserName: reportedUserName,
          chatId: this.chatId,
          currentUser: currentUser,
        },
        cssClass: "user-report-modal",
      });

      await modal.present();
    } catch (error) {
      console.error("Error opening report modal:", error);
      this.showErrorToast("Failed to open report form");
    }
  }

  /**
   * Show the chat participants modal
   */
  async showParticipantsModal() {
    try {
      const chat = await firstValueFrom(this.chat$.pipe(take(1)));

      if (!chat) {
        this.showErrorToast("Chat not found");
        return;
      }

      const modal = await this.modalController.create({
        component: ChatParticipantsModalComponent,
        componentProps: {
          chat: chat,
          chatId: this.chatId,
        },
        cssClass: "chat-participants-modal",
      });

      await modal.present();

      // Handle modal result if needed
      const {data} = await modal.onDidDismiss();
      if (data?.updated) {
        // Refresh chat data if participants were updated
        // The chat observable should automatically update via Firestore subscriptions
      }
    } catch (error) {
      console.error("Error opening participants modal:", error);
      this.showErrorToast("Failed to open participants manager");
    }
  }

  /**
   * Show chat info modal
   */
  async showChatInfo() {
    try {
      const chat = await firstValueFrom(this.chat$.pipe(take(1)));
      if (!chat) {
        this.showErrorToast("Chat not found");
        return;
      }

      // For now, show a simple alert with chat information
      // TODO: Implement a proper chat info modal component
      const alert = await this.alertController.create({
        header: "Chat Information",
        message: `
          <p><strong>Chat Type:</strong> ${chat.isGroup ? "Group Chat" : "Direct Message"}</p>
          <p><strong>Participants:</strong> ${chat.participants.length}</p>
          <p><strong>Created:</strong> ${chat.createdAt && (chat.createdAt as any).toDate ? new Date((chat.createdAt as any).toDate()).toLocaleDateString() : "Unknown"}</p>
          ${chat.isGroup && chat.groupName ? `<p><strong>Name:</strong> ${chat.groupName}</p>` : ""}
        `,
        buttons: ["OK"],
      });

      await alert.present();
    } catch (error) {
      console.error("Error showing chat info:", error);
      this.showErrorToast("Failed to load chat information");
    }
  }

  /**
   * Show notification settings modal
   */
  async showNotificationSettings() {
    try {
      const {NotificationSettingsModalComponent} = await import(
        "../../components/notification-settings-modal/notification-settings-modal.component"
      );

      const modal = await this.modalController.create({
        component: NotificationSettingsModalComponent,
        cssClass: "notification-settings-modal",
      });

      await modal.present();
    } catch (error) {
      console.error("Error opening notification settings:", error);
      this.showErrorToast("Failed to open notification settings");
    }
  }

  /**
   * Show encryption settings modal
   */
  async showEncryptionSettings() {
    try {
      const {EncryptionSettingsComponent} = await import(
        "../../components/encryption-settings/encryption-settings.component"
      );

      const modal = await this.modalController.create({
        component: EncryptionSettingsComponent,
        cssClass: "encryption-settings-modal",
      });

      await modal.present();
    } catch (error) {
      console.error("Error opening encryption settings:", error);
      this.showErrorToast("Failed to open encryption settings");
    }
  }

  /**
   * Show toast message
   */
  private async showToast(
    message: string,
    duration: "short" | "medium" | "long" = "short",
  ) {
    const toast = await this.toastController.create({
      message,
      duration:
        duration === "short" ? 2000 : duration === "medium" ? 3000 : 5000,
      position: "bottom",
    });
    toast.present();
  }

  /**
   * Set default avatar when image fails to load
   */
  setDefaultAvatar(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = "assets/image/logo/ASCENDynamics NFP-logos_transparent.png";
    }
  }
  /**
   * Check if a new message has been received at the bottom of the list
   */
  private isNewMessageReceived(newMessages: Message[]): boolean {
    if (newMessages.length === 0) return false;

    // If local list is empty, it's new
    if (this.messages.length === 0) return true;

    // Check if the last message in the new batch is different from the last message we had
    const lastNewMessage = newMessages[newMessages.length - 1];
    const lastLocalMessage = this.messages[this.messages.length - 1];

    if (!lastNewMessage || !lastLocalMessage) return true;

    return lastNewMessage.id !== lastLocalMessage.id;
  }

  /**
   * Check if a message is from a different day than the previous message
   * Used to show date separators in chat
   */
  shouldShowDateSeparator(currentIndex: number): boolean {
    if (currentIndex === 0) return true; // Always show for first message

    const currentMessage = this.messages[currentIndex];
    const previousMessage = this.messages[currentIndex - 1];

    if (!currentMessage?.timestamp || !previousMessage?.timestamp) return false;

    const currentDate = this.getMessageDate(currentMessage.timestamp);
    const previousDate = this.getMessageDate(previousMessage.timestamp);

    return currentDate.toDateString() !== previousDate.toDateString();
  }

  /**
   * Get formatted date label for a message (e.g., "Today", "Yesterday", or the date)
   */
  getDateLabel(message: Message): string {
    if (!message?.timestamp) return "";

    const messageDate = this.getMessageDate(message.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time parts for accurate date comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) {
      return "Today";
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      // Format as "Mon, Jan 15, 2025"
      return messageDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  /**
   * Convert Firestore timestamp to Date
   */
  private getMessageDate(timestamp: any): Date {
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  }

  /**
   * Check if user is scrolled near the bottom
   */
  private isUserAtBottom(): boolean {
    if (!this.content) return true; // Default to true if content not ready

    // We can't synchronously check scroll position easily in Ionic without getting the scroll element
    // So we assume true for now if we haven't tracked it, OR we could track it on scroll events.
    // For simplicity, let's rely on the sticky logic: we assume if we just sent a message or it's new, we want to scroll.
    // To properly implement "don't scroll if user is reading history", we need to track scroll events.
    return true;
  }
}
