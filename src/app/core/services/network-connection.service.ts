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
import {Observable, BehaviorSubject, fromEvent, merge, of} from "rxjs";
import {
  map,
  startWith,
  distinctUntilChanged,
  shareReplay,
} from "rxjs/operators";
import {Platform} from "@ionic/angular";

export interface ConnectionStatus {
  isOnline: boolean;
  connectionType: "wifi" | "cellular" | "ethernet" | "none" | "unknown";
  timestamp: Date;
}

@Injectable({
  providedIn: "root",
})
export class NetworkConnectionService {
  private connectionStatus$ = new BehaviorSubject<ConnectionStatus>({
    isOnline: navigator.onLine,
    connectionType: this.getConnectionType(),
    timestamp: new Date(),
  });

  constructor(private platform: Platform) {
    this.initializeConnectionMonitoring();
  }

  /**
   * Get current connection status as observable
   */
  getConnectionStatus(): Observable<ConnectionStatus> {
    return this.connectionStatus$.asObservable();
  }

  /**
   * Get current online status
   */
  isOnline(): Observable<boolean> {
    return this.connectionStatus$.pipe(
      map((status) => status.isOnline),
      distinctUntilChanged(),
    );
  }

  /**
   * Get current offline status
   */
  isOffline(): Observable<boolean> {
    return this.isOnline().pipe(map((online) => !online));
  }

  /**
   * Get current connection status synchronously
   */
  getCurrentStatus(): ConnectionStatus {
    return this.connectionStatus$.value;
  }

  /**
   * Check if currently online synchronously
   */
  isCurrentlyOnline(): boolean {
    return this.connectionStatus$.value.isOnline;
  }

  /**
   * Initialize connection monitoring
   */
  private initializeConnectionMonitoring(): void {
    if (typeof window !== "undefined") {
      // Browser events
      const online$ = fromEvent(window, "online").pipe(map(() => true));
      const offline$ = fromEvent(window, "offline").pipe(map(() => false));

      // Merge online/offline events
      const connectionEvents$ = merge(online$, offline$).pipe(
        startWith(navigator.onLine),
        distinctUntilChanged(),
        shareReplay(1),
      );

      // Subscribe to connection changes
      connectionEvents$.subscribe((isOnline) => {
        this.updateConnectionStatus(isOnline);
      });

      // For mobile platforms, also listen to network state changes
      if (this.platform.is("mobile")) {
        this.initializeMobileNetworkMonitoring();
      }
    }
  }

  /**
   * Initialize mobile-specific network monitoring
   */
  private initializeMobileNetworkMonitoring(): void {
    // Check if Network Information API is available
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;

      if (connection) {
        connection.addEventListener("change", () => {
          this.updateConnectionStatus(navigator.onLine);
        });
      }
    }

    // For Capacitor/Cordova environments
    if (this.platform.is("capacitor")) {
      // Listen to Capacitor network events if available
      document.addEventListener("networkstatuschange", (e: any) => {
        this.updateConnectionStatus(e.detail.connected);
      });
    }
  }

  /**
   * Update connection status
   */
  private updateConnectionStatus(isOnline: boolean): void {
    const newStatus: ConnectionStatus = {
      isOnline,
      connectionType: this.getConnectionType(),
      timestamp: new Date(),
    };

    this.connectionStatus$.next(newStatus);
  }

  /**
   * Get connection type
   */
  private getConnectionType():
    | "wifi"
    | "cellular"
    | "ethernet"
    | "none"
    | "unknown" {
    if (!navigator.onLine) {
      return "none";
    }

    // Check Network Information API
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;

      if (connection && connection.effectiveType) {
        switch (connection.effectiveType) {
          case "slow-2g":
          case "2g":
          case "3g":
          case "4g":
            return "cellular";
          default:
            return "unknown";
        }
      }
    }

    // Platform-specific detection
    if (this.platform.is("desktop")) {
      return "ethernet";
    } else if (this.platform.is("mobile")) {
      return "cellular";
    }

    return "unknown";
  }

  /**
   * Test network connectivity by making a simple request
   */
  async testConnectivity(): Promise<boolean> {
    try {
      // Try to fetch a small resource to test actual connectivity
      const response = await fetch("/assets/manifest.json", {
        method: "HEAD",
        cache: "no-cache",
        mode: "same-origin",
      });

      const isConnected = response.ok;

      // Update status if it differs from current
      if (isConnected !== this.connectionStatus$.value.isOnline) {
        this.updateConnectionStatus(isConnected);
      }

      return isConnected;
    } catch (error) {
      // Update to offline if test fails
      if (this.connectionStatus$.value.isOnline) {
        this.updateConnectionStatus(false);
      }
      return false;
    }
  }

  /**
   * Get network quality estimation
   */
  getNetworkQuality(): "slow" | "moderate" | "fast" | "unknown" {
    if (!navigator.onLine) {
      return "unknown";
    }

    if ("connection" in navigator) {
      const connection = (navigator as any).connection;

      if (connection && connection.effectiveType) {
        switch (connection.effectiveType) {
          case "slow-2g":
            return "slow";
          case "2g":
          case "3g":
            return "moderate";
          case "4g":
            return "fast";
          default:
            return "unknown";
        }
      }
    }

    return "unknown";
  }

  /**
   * Get connection info for debugging
   */
  getConnectionInfo(): any {
    const info: any = {
      online: navigator.onLine,
      userAgent: navigator.userAgent,
      platform: this.platform.platforms(),
      timestamp: new Date().toISOString(),
    };

    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      info.connection = {
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
      };
    }

    return info;
  }
}
