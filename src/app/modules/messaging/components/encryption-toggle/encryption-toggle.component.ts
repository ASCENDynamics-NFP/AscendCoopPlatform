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
import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {EncryptedChatService} from "../../services/encrypted-chat.service";

@Component({
  selector: "app-encryption-toggle",
  template: `
    <div class="encryption-controls">
      <!-- Encryption Status Indicator -->
      <div class="encryption-status" *ngIf="encryptionEnabled">
        <ion-icon
          [name]="encryptionActive ? 'lock-closed' : 'lock-open'"
          [color]="encryptionActive ? 'success' : 'warning'"
          class="encryption-icon"
        >
        </ion-icon>
        <span class="encryption-text">
          {{ encryptionActive ? "Encrypted" : "Not Encrypted" }}
        </span>
      </div>

      <!-- Encryption Toggle Button -->
      <ion-button
        *ngIf="encryptionEnabled"
        fill="clear"
        size="small"
        (click)="toggleEncryption()"
        [color]="encryptionActive ? 'success' : 'medium'"
        class="encryption-toggle-btn"
      >
        <ion-icon
          [name]="encryptionActive ? 'lock-closed' : 'lock-open'"
          slot="icon-only"
        >
        </ion-icon>
      </ion-button>

      <!-- Enable Encryption Button (if not enabled) -->
      <ion-button
        *ngIf="!encryptionEnabled"
        fill="outline"
        size="small"
        (click)="enableEncryption()"
        color="primary"
        class="enable-encryption-btn"
      >
        <ion-icon name="shield-outline" slot="start"></ion-icon>
        Enable Encryption
      </ion-button>
    </div>
  `,
  styles: [
    `
      .encryption-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        background: var(--ion-color-step-50);
        border-radius: 8px;
        margin: 4px 0;
      }

      .encryption-status {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
      }

      .encryption-icon {
        font-size: 1rem;
      }

      .encryption-text {
        font-weight: 500;
      }

      .encryption-toggle-btn,
      .enable-encryption-btn {
        --padding-start: 8px;
        --padding-end: 8px;
        height: 28px;
      }

      .enable-encryption-btn {
        font-size: 0.8rem;
      }
    `,
  ],
})
export class EncryptionToggleComponent implements OnInit {
  @Input() chatId: string = "";
  @Input() encryptionActive: boolean = false;
  @Output() encryptionToggled = new EventEmitter<boolean>();

  encryptionEnabled: boolean = false;
  encryptionAvailable: boolean = false;

  constructor(private encryptedChatService: EncryptedChatService) {}

  async ngOnInit() {
    await this.checkEncryptionStatus();
  }

  private async checkEncryptionStatus() {
    try {
      // Check if user has encryption enabled
      this.encryptionEnabled =
        await this.encryptedChatService.isEncryptionEnabled();

      // Check if encryption is available for this chat
      if (this.chatId) {
        this.encryptionAvailable =
          await this.encryptedChatService.isEncryptionAvailable(this.chatId);
      }
    } catch (error) {
      console.error("Error checking encryption status:", error);
    }
  }

  async enableEncryption() {
    try {
      await this.encryptedChatService.enableEncryption();
      this.encryptionEnabled = true;
      await this.checkEncryptionStatus();
    } catch (error) {
      console.error("Error enabling encryption:", error);
    }
  }

  toggleEncryption() {
    if (this.encryptionAvailable) {
      this.encryptionActive = !this.encryptionActive;
      this.encryptionToggled.emit(this.encryptionActive);
    }
  }
}
