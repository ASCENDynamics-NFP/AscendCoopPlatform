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
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {
  NetworkConnectionService,
  ConnectionStatus,
} from "../../../core/services/network-connection.service";
import {
  OfflineSyncService,
  OfflineSyncStatus,
} from "../../../core/services/offline-sync.service";

@Component({
  selector: "app-connection-status",
  templateUrl: "./connection-status.component.html",
  styleUrls: ["./connection-status.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {
  @Input() showDetails = false;
  @Input() compactMode = false;

  connectionStatus$: Observable<ConnectionStatus>;
  syncStatus$: Observable<OfflineSyncStatus>;

  private destroy$ = new Subject<void>();

  constructor(
    private networkService: NetworkConnectionService,
    private syncService: OfflineSyncService,
  ) {
    this.connectionStatus$ = this.networkService.getConnectionStatus();
    this.syncStatus$ = this.syncService.getSyncStatus();
  }

  ngOnInit(): void {
    // Optional: Add any initialization logic
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Retry failed messages
   */
  retryFailedMessages(): void {
    this.syncService.retryFailedMessages();
  }

  /**
   * Test network connectivity
   */
  async testConnection(): Promise<void> {
    await this.networkService.testConnectivity();
  }

  /**
   * Get connection quality color
   */
  getConnectionColor(status: ConnectionStatus): string {
    if (!status.isOnline) {
      return "danger";
    }

    switch (status.connectionType) {
      case "wifi":
      case "ethernet":
        return "success";
      case "cellular":
        return "warning";
      default:
        return "medium";
    }
  }

  /**
   * Get connection icon
   */
  getConnectionIcon(status: ConnectionStatus): string {
    if (!status.isOnline) {
      return "cloud-offline-outline";
    }

    switch (status.connectionType) {
      case "wifi":
        return "wifi-outline";
      case "ethernet":
        return "ethernet-outline";
      case "cellular":
        return "cellular-outline";
      default:
        return "cloud-outline";
    }
  }

  /**
   * Get status text
   */
  getStatusText(
    connectionStatus: ConnectionStatus,
    syncStatus: OfflineSyncStatus,
  ): string {
    if (!connectionStatus.isOnline) {
      return syncStatus.queuedMessagesCount > 0
        ? `Offline (${syncStatus.queuedMessagesCount} queued)`
        : "Offline";
    }

    if (syncStatus.isSyncing) {
      return "Syncing...";
    }

    if (syncStatus.queuedMessagesCount > 0) {
      return `Online (${syncStatus.queuedMessagesCount} pending)`;
    }

    if (syncStatus.failedMessagesCount > 0) {
      return `Online (${syncStatus.failedMessagesCount} failed)`;
    }

    return "Online";
  }
}
