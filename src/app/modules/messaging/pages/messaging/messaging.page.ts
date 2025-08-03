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
import {Platform} from "@ionic/angular";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: "app-messaging",
  templateUrl: "./messaging.page.html",
  styleUrls: ["./messaging.page.scss"],
})
export class MessagingPage implements OnInit, OnDestroy {
  selectedChatId: string | null = null;
  isDesktop = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform,
  ) {}

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
   * Close detail view (return to list on mobile)
   */
  onCloseDetail() {
    this.selectedChatId = null;
    if (!this.isDesktop) {
      this.router.navigate(["/messaging/chats"]);
    }
  }
}
