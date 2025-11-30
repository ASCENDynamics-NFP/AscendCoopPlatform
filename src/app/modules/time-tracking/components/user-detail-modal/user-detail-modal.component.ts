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
 *******************************************************************************/
import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule, ModalController} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";

export interface UserDetailData {
  userId: string;
  userName: string;
  totalHours: number;
  approvedHours: number;
  entryCount: number;
  entries: UserTimeEntry[];
}

export interface UserTimeEntry {
  id: string;
  date: string;
  hours: number;
  status: "draft" | "pending" | "approved" | "rejected";
  projectId: string;
  projectName: string;
  notes?: string;
}

interface ProjectBreakdown {
  projectId: string;
  projectName: string;
  totalHours: number;
  entryCount: number;
}

interface StatusBreakdown {
  status: string;
  hours: number;
  count: number;
}

@Component({
  selector: "app-user-detail-modal",
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
  templateUrl: "./user-detail-modal.component.html",
  styleUrls: ["./user-detail-modal.component.scss"],
})
export class UserDetailModalComponent implements OnInit {
  @Input() userData!: UserDetailData;
  @Input() dateRange?: {start: string; end: string};

  projectBreakdown: ProjectBreakdown[] = [];
  statusBreakdown: StatusBreakdown[] = [];
  selectedView: "overview" | "entries" | "projects" = "overview";
  hasDetailedEntries = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.hasDetailedEntries =
      this.userData.entries && this.userData.entries.length > 0;
    if (this.hasDetailedEntries) {
      this.calculateProjectBreakdown();
      this.calculateStatusBreakdown();
    }
  }

  private calculateProjectBreakdown() {
    const projectMap = new Map<string, ProjectBreakdown>();

    for (const entry of this.userData.entries) {
      const existing = projectMap.get(entry.projectId);
      if (existing) {
        existing.totalHours += entry.hours;
        existing.entryCount++;
      } else {
        projectMap.set(entry.projectId, {
          projectId: entry.projectId,
          projectName: entry.projectName || "Unknown Project",
          totalHours: entry.hours,
          entryCount: 1,
        });
      }
    }

    this.projectBreakdown = Array.from(projectMap.values()).sort(
      (a, b) => b.totalHours - a.totalHours,
    );
  }

  private calculateStatusBreakdown() {
    const statusMap = new Map<string, StatusBreakdown>();

    for (const entry of this.userData.entries) {
      const existing = statusMap.get(entry.status);
      if (existing) {
        existing.hours += entry.hours;
        existing.count++;
      } else {
        statusMap.set(entry.status, {
          status: entry.status,
          hours: entry.hours,
          count: 1,
        });
      }
    }

    this.statusBreakdown = Array.from(statusMap.values());
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      approved: "success",
      pending: "warning",
      rejected: "danger",
      draft: "medium",
    };
    return colors[status] || "medium";
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      approved: "checkmark-circle",
      pending: "time",
      rejected: "close-circle",
      draft: "document",
    };
    return icons[status] || "document";
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  formatDateRange(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  getApprovalRate(): number {
    if (this.userData.totalHours === 0) return 0;
    return (this.userData.approvedHours / this.userData.totalHours) * 100;
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
