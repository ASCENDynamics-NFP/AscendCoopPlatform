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
import {ModalController} from "@ionic/angular";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {
  NotificationService,
  NotificationSettings,
} from "../../services/notification.service";

@Component({
  selector: "app-notification-settings-modal",
  templateUrl: "./notification-settings-modal.component.html",
  styleUrls: ["./notification-settings-modal.component.scss"],
})
export class NotificationSettingsModalComponent implements OnInit, OnDestroy {
  settings: NotificationSettings = {
    enabled: true,
    sound: true,
    vibration: true,
    showPreview: true,
  };

  private destroy$ = new Subject<void>();

  constructor(
    private modalController: ModalController,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    // Load current settings
    this.notificationService
      .getNotificationSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        this.settings = {...settings};
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Close the modal
   */
  dismiss() {
    this.modalController.dismiss();
  }

  /**
   * Save settings and close modal
   */
  saveSettings() {
    this.notificationService.updateNotificationSettings(this.settings);
    this.modalController.dismiss({saved: true});
  }

  /**
   * Toggle all notifications
   */
  toggleNotifications() {
    if (!this.settings.enabled) {
      // If disabling, also disable all sub-settings
      this.settings.sound = false;
      this.settings.vibration = false;
      this.settings.showPreview = false;
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.settings.enabled = true;
      }
    }
  }

  /**
   * Get notification permission status
   */
  get notificationPermission(): string {
    if (!("Notification" in window)) {
      return "unsupported";
    }
    return Notification.permission;
  }
}
