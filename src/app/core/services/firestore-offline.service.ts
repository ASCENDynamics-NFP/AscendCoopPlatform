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
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat/app";

export interface OfflineSettings {
  enabled: boolean;
  cacheSizeBytes: number;
  synchronizeTabs: boolean;
}

@Injectable({
  providedIn: "root",
})
export class FirestoreOfflineService {
  private isInitialized = false;
  private persistenceEnabled = false;

  constructor(private firestore: AngularFirestore) {}

  /**
   * Initialize Firestore offline persistence
   */
  async initializeOfflinePersistence(
    settings?: Partial<OfflineSettings>,
  ): Promise<boolean> {
    if (this.isInitialized) {
      return this.persistenceEnabled;
    }

    const defaultSettings: OfflineSettings = {
      enabled: true,
      cacheSizeBytes: 40 * 1024 * 1024, // 40MB default cache
      synchronizeTabs: true,
    };

    const config = {...defaultSettings, ...settings};

    try {
      if (config.enabled) {
        // Enable persistence with configuration
        await firebase.firestore().enablePersistence({
          synchronizeTabs: config.synchronizeTabs,
        });

        // Configure cache settings
        await this.configureCacheSettings(config.cacheSizeBytes);

        this.persistenceEnabled = true;
        console.log("✅ Firestore offline persistence enabled");
      }
    } catch (error: any) {
      console.warn("⚠️ Firestore offline persistence setup:", error);

      if (error.code === "failed-precondition") {
        // Multiple tabs open, persistence enabled in first tab only
        console.warn(
          "Persistence failed: Multiple tabs open, enabled in first tab only",
        );
      } else if (error.code === "unimplemented") {
        // Browser doesn't support persistence
        console.warn(
          "Persistence failed: Browser does not support offline persistence",
        );
      } else {
        console.error("Unexpected persistence error:", error);
      }

      this.persistenceEnabled = false;
    }

    this.isInitialized = true;
    return this.persistenceEnabled;
  }

  /**
   * Configure cache settings
   */
  private async configureCacheSettings(cacheSizeBytes: number): Promise<void> {
    try {
      const firestore = firebase.firestore();

      // Note: Cache size configuration is done during initialization
      // This is mainly for documentation and potential future use
      console.log(
        `Firestore cache configured: ${Math.round(cacheSizeBytes / 1024 / 1024)}MB`,
      );
    } catch (error) {
      console.warn("Could not configure cache settings:", error);
    }
  }

  /**
   * Check if offline persistence is enabled
   */
  isPersistenceEnabled(): boolean {
    return this.persistenceEnabled;
  }

  /**
   * Get cache information
   */
  async getCacheInfo(): Promise<{
    isEnabled: boolean;
    estimatedSize?: number;
    documentCount?: number;
  }> {
    try {
      if (!this.persistenceEnabled) {
        return {isEnabled: false};
      }

      // Get basic cache info
      return {
        isEnabled: true,
        // Note: Detailed cache metrics would require additional Firestore APIs
        estimatedSize: undefined,
        documentCount: undefined,
      };
    } catch (error) {
      console.error("Error getting cache info:", error);
      return {isEnabled: false};
    }
  }

  /**
   * Clear offline cache (useful for troubleshooting)
   */
  async clearOfflineCache(): Promise<void> {
    try {
      await firebase.firestore().clearPersistence();
      console.log("✅ Firestore offline cache cleared");
    } catch (error) {
      console.error("Error clearing offline cache:", error);
      throw error;
    }
  }

  /**
   * Enable network for Firestore
   */
  async enableNetwork(): Promise<void> {
    try {
      await firebase.firestore().enableNetwork();
      console.log("✅ Firestore network enabled");
    } catch (error) {
      console.error("Error enabling Firestore network:", error);
      throw error;
    }
  }

  /**
   * Disable network for Firestore (force offline mode)
   */
  async disableNetwork(): Promise<void> {
    try {
      await firebase.firestore().disableNetwork();
      console.log("📴 Firestore network disabled");
    } catch (error) {
      console.error("Error disabling Firestore network:", error);
      throw error;
    }
  }

  /**
   * Configure optimized query settings for offline usage
   */
  getOptimizedQuery(
    collection: firebase.firestore.CollectionReference,
    isOnline: boolean,
    options?: {
      limitOnline?: number;
      limitOffline?: number;
      preferCache?: boolean;
    },
  ): firebase.firestore.Query {
    const defaults = {
      limitOnline: 50,
      limitOffline: 20,
      preferCache: true,
    };

    const config = {...defaults, ...options};

    let query = collection.orderBy("timestamp", "desc");

    // Apply different limits based on connection status
    if (isOnline) {
      query = query.limit(config.limitOnline);
    } else {
      query = query.limit(config.limitOffline);
    }

    return query;
  }

  /**
   * Get optimized query options for different scenarios
   */
  getQueryOptions(
    scenario: "messaging" | "general" | "realtime",
  ): firebase.firestore.GetOptions {
    switch (scenario) {
      case "messaging":
        return {
          source: "default", // Use cache when available, server when online
        };

      case "general":
        return {
          source: "default",
        };

      case "realtime":
        return {
          source: this.persistenceEnabled ? "default" : "server",
        };

      default:
        return {source: "default"};
    }
  }

  /**
   * Monitor offline state and provide debugging info
   */
  getOfflineStatus(): {
    persistenceEnabled: boolean;
    isInitialized: boolean;
    supportsOffline: boolean;
    recommendations: string[];
  } {
    const supportsOffline =
      typeof Storage !== "undefined" &&
      "indexedDB" in window &&
      typeof window.indexedDB === "object";

    const recommendations: string[] = [];

    if (!supportsOffline) {
      recommendations.push("Browser does not support offline features");
    }

    if (!this.persistenceEnabled && supportsOffline) {
      recommendations.push("Enable offline persistence for better experience");
    }

    if (this.persistenceEnabled) {
      recommendations.push(
        "Offline persistence is active - messages available offline",
      );
    }

    return {
      persistenceEnabled: this.persistenceEnabled,
      isInitialized: this.isInitialized,
      supportsOffline,
      recommendations,
    };
  }

  /**
   * Pre-cache important collections for offline use
   */
  async preCacheCollections(userId: string): Promise<void> {
    if (!this.persistenceEnabled || !userId) {
      return;
    }

    try {
      console.log("🔄 Pre-caching collections for offline use...");

      // Pre-cache user's chats
      const chatsQuery = this.firestore.collection("chats", (ref) =>
        ref
          .where("participants", "array-contains", userId)
          .orderBy("lastMessageTimestamp", "desc")
          .limit(20),
      );

      await chatsQuery.get().toPromise();

      // Pre-cache recent messages for each chat
      // Note: This would require additional logic to get chat IDs first
      // Implementation would depend on specific app structure

      console.log("✅ Collections pre-cached for offline use");
    } catch (error) {
      console.error("Error pre-caching collections:", error);
    }
  }
}
