/*******************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 ********************************************************************************/
// src/app/modules/time-tracking/components/status-history-modal/status-history-modal.component.ts

import {Component, Input, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {Timestamp} from "firebase/firestore";

interface StatusHistoryItem {
  status: "draft" | "pending" | "approved" | "rejected";
  changedBy: string;
  changedByName: string;
  changedAt: Timestamp;
  reason?: string;
}

interface GroupedEntry {
  userId: string;
  userName: string;
  userEmail: string;
  weekStart: Date;
  totalHours: number;
  status: "draft" | "pending" | "approved" | "rejected";
  entries: any[];
}

@Component({
  selector: "app-status-history-modal",
  templateUrl: "./status-history-modal.component.html",
  styleUrls: ["./status-history-modal.component.scss"],
})
export class StatusHistoryModalComponent implements OnInit {
  @Input() group!: GroupedEntry;

  statusHistory: StatusHistoryItem[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.loadStatusHistory();
  }

  private loadStatusHistory() {
    // Collect all status history entries from all entries in the group
    const allHistory: StatusHistoryItem[] = [];

    if (this.group?.entries) {
      this.group.entries.forEach((entry) => {
        if (entry.statusHistory && Array.isArray(entry.statusHistory)) {
          entry.statusHistory.forEach((historyItem: StatusHistoryItem) => {
            allHistory.push({
              ...historyItem,
              changedAt: this.toTimestamp(historyItem.changedAt),
            });
          });
        }
      });
    }

    // Sort by date, newest first
    this.statusHistory = allHistory.sort((a, b) => {
      const aDate = this.toDate(a.changedAt)?.getTime() ?? 0;
      const bDate = this.toDate(b.changedAt)?.getTime() ?? 0;
      return bDate - aDate; // Newest first
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "draft":
        return "document-outline";
      case "pending":
        return "hourglass-outline";
      case "approved":
        return "checkmark-circle";
      case "rejected":
        return "close-circle";
      default:
        return "help-circle-outline";
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "draft":
        return "medium";
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "medium";
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "draft":
        return "Draft";
      case "pending":
        return "Submitted for Approval";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  }

  formatTimestamp(timestamp: Timestamp | any): string {
    const date = this.toDate(timestamp);
    if (!date) {
      return "";
    }

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleDateString("en-US", options);
  }

  getRelativeTime(timestamp: Timestamp | any): string {
    const date = this.toDate(timestamp);
    if (!date) {
      return "";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    } else {
      return this.formatTimestamp(timestamp);
    }
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  private toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value && typeof value.toDate === "function") return value.toDate();
    if (value && typeof value.seconds === "number") {
      return new Date(value.seconds * 1000 + (value.nanoseconds ?? 0) / 1e6);
    }
    if (value && typeof value._seconds === "number") {
      return new Date(value._seconds * 1000 + (value._nanoseconds ?? 0) / 1e6);
    }
    const date = value instanceof Date ? value : new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  private toTimestamp(value: any): Timestamp {
    if (value instanceof Timestamp) return value;
    const asDate = this.toDate(value) ?? new Date();
    return Timestamp.fromDate(asDate);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
