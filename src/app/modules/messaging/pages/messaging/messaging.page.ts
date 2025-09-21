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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Platform, ActionSheetController} from "@ionic/angular";
import {Subject, Observable, of, BehaviorSubject} from "rxjs";
import {
  takeUntil,
  map,
  distinctUntilChanged,
  shareReplay,
  take,
} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {ChatService} from "../../services/chat.service";
import {NotificationService} from "../../services/notification.service";
import {Chat} from "../../models/chat.model";
import {AuthState} from "../../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-messaging",
  templateUrl: "./messaging.page.html",
  styleUrls: ["./messaging.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingPage implements OnInit, OnDestroy {
  selectedChatId: string | null = null;
  isDesktop = false;
  isDesktop$: Observable<boolean>;
  hasChats = false;
  chats$: Observable<Chat[]>;
  unreadCounts$: Observable<{[chatId: string]: number}>;
  private destroy$ = new Subject<void>();
  private stableChats$ = new BehaviorSubject<Chat[]>([]);
  private isDesktopSubject$ = new BehaviorSubject<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private platform: Platform,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private store: Store<{auth: AuthState}>,
    private actionSheetController: ActionSheetController,
    private cdr: ChangeDetectorRef,
  ) {
    // Initialize chats observable with stable references
    this.chats$ = this.createStableChatObservable();
    this.unreadCounts$ = this.notificationService.getUnreadCounts();
    this.isDesktop$ = this.isDesktopSubject$.asObservable();
  }

  ngOnInit() {
    // Check if we're on desktop
    this.isDesktop = this.platform.width() >= 768;
    this.isDesktopSubject$.next(this.isDesktop);

    // Listen for platform changes
    this.platform.resize.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isDesktop = this.platform.width() >= 768;
      this.isDesktopSubject$.next(this.isDesktop);
    });

    // Listen for route changes to track selected chat
    this.route.firstChild?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.selectedChatId = params["id"] || null;
      });

    // Subscribe to chats to check if user has any conversations
    // and pre-load participant accounts (use original observable for data loading)
    this.chatService
      .getUserChats()
      .pipe(takeUntil(this.destroy$))
      .subscribe((chats) => {
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
    this.isDesktopSubject$.complete();
  }

  /**
   * Create a stable chat observable that doesn't re-render on timestamp changes
   */
  private createStableChatObservable(): Observable<Chat[]> {
    return this.chatService.getUserChats().pipe(
      map((chats) => {
        // Create stable references for chats by only tracking essential properties
        return chats.map((chat) => ({
          ...chat,
          // Create a stable reference by only including properties that affect the UI
          _stableId: `${chat.id}_${chat.participants.join("_")}_${chat.isGroup ? chat.name : ""}`,
        }));
      }),
      distinctUntilChanged((prev, curr) => {
        // Only re-render if the actual chat list structure changes (not timestamps)
        if (prev.length !== curr.length) return false;

        return prev.every((prevChat, index) => {
          const currChat = curr[index];
          return (
            prevChat.id === currChat.id &&
            prevChat.isGroup === currChat.isGroup &&
            prevChat.name === currChat.name &&
            JSON.stringify(prevChat.participants) ===
              JSON.stringify(currChat.participants)
          );
        });
      }),
      shareReplay(1),
      takeUntil(this.destroy$),
    );
  }

  /**
   * Handle chat selection
   */
  onChatSelected(chatId: string) {
    // Mark notifications as read for this chat
    this.notificationService.markChatNotificationsAsRead(chatId);

    this.selectedChatId = chatId;
    this.router.navigate(["/messaging/chat", chatId]);
  }

  /**
   * Handle new chat creation
   */
  onNewChat() {
    // Manually trigger change detection to ensure proper state
    this.cdr.detectChanges();

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
            const uid = this.getCurrentUserId();
            if (uid) {
              // Load current user's account and route based on type
              this.store.dispatch(AccountActions.loadAccount({accountId: uid}));
              this.store
                .select(selectAccountById(uid))
                .pipe(take(1))
                .subscribe((account) => {
                  if (account?.type === "group") {
                    this.router.navigate(["/account", uid, "admin"], {
                      queryParams: {tab: "settings"},
                    });
                  } else {
                    this.router.navigate([`/account/${uid}/edit`], {
                      queryParams: {section: "settings"},
                    });
                  }
                });
            }
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
   * Get unread count for a specific chat
   */
  getUnreadCount(chatId: string): Observable<number> {
    return this.unreadCounts$.pipe(map((counts) => counts[chatId] || 0));
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
