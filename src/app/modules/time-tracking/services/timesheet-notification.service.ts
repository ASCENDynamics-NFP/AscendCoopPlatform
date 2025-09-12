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
// src/app/modules/time-tracking/services/timesheet-notification.service.ts

import {Injectable} from "@angular/core";
import {ToastController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Timestamp} from "firebase/firestore";
import {TimeEntry} from "../../../../../shared/models/time-entry.model";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";
import {filter, take} from "rxjs/operators";
import {firstValueFrom} from "rxjs";

interface TimesheetNotification {
  id: string;
  type: "approval" | "rejection" | "submission" | "note_added";
  userId: string; // Recipient
  fromUserId: string; // Sender
  fromUserName: string;
  timesheetId?: string;
  weekStart: Date;
  projectName?: string;
  message: string;
  data?: any;
  createdAt: Timestamp;
  read: boolean;
  accountId: string;
}

@Injectable({
  providedIn: "root",
})
export class TimesheetNotificationService {
  constructor(
    private toastController: ToastController,
    private store: Store,
    private firestore: AngularFirestore,
  ) {}

  /**
   * Send notification when timesheet is submitted for approval
   */
  async notifyTimesheetSubmitted(
    entries: TimeEntry[],
    weekStart: Date,
    adminUserIds: string[],
  ) {
    if (!entries.length || !adminUserIds.length) return;

    const currentUser = await this.getCurrentUser();
    if (!currentUser) return;

    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    const message = `${currentUser.displayName || currentUser.email} submitted ${totalHours} hours for approval`;

    // Create notifications for each admin
    for (const adminId of adminUserIds) {
      const notification: TimesheetNotification = {
        id: `submission_${Date.now()}_${adminId}`,
        type: "submission",
        userId: adminId,
        fromUserId: currentUser.uid,
        fromUserName: currentUser.displayName || currentUser.email || "Unknown",
        weekStart,
        message,
        data: {
          totalHours,
          entryCount: entries.length,
        },
        createdAt: Timestamp.now(),
        read: false,
        accountId: entries[0].accountId,
      };

      await this.saveNotification(notification);
    }
  }

  /**
   * Send notification when timesheet is approved
   */
  async notifyTimesheetApproved(
    userId: string,
    weekStart: Date,
    totalHours: number,
    approverName: string,
    accountId: string,
  ) {
    const message = `Your timesheet for ${totalHours} hours has been approved by ${approverName}`;

    const notification: TimesheetNotification = {
      id: `approval_${Date.now()}_${userId}`,
      type: "approval",
      userId,
      fromUserId: "system",
      fromUserName: approverName,
      weekStart,
      message,
      data: {totalHours},
      createdAt: Timestamp.now(),
      read: false,
      accountId,
    };

    await this.saveNotification(notification);
    await this.showToast(message, "success");
  }

  /**
   * Send notification when timesheet is rejected
   */
  async notifyTimesheetRejected(
    userId: string,
    weekStart: Date,
    totalHours: number,
    reason: string,
    rejectorName: string,
    accountId: string,
  ) {
    const message = reason
      ? `Your timesheet has been rejected: ${reason}`
      : `Your timesheet for ${totalHours} hours has been rejected by ${rejectorName}`;

    const notification: TimesheetNotification = {
      id: `rejection_${Date.now()}_${userId}`,
      type: "rejection",
      userId,
      fromUserId: "system",
      fromUserName: rejectorName,
      weekStart,
      message,
      data: {totalHours, reason},
      createdAt: Timestamp.now(),
      read: false,
      accountId,
    };

    await this.saveNotification(notification);
    await this.showToast(message, "warning");
  }

  /**
   * Send notification when note is added to timesheet
   */
  async notifyNoteAdded(
    entry: TimeEntry,
    noteContent: string,
    isAdminNote: boolean,
  ) {
    // Notify the other party (if admin adds note, notify user and vice versa)
    const recipientId = isAdminNote ? entry.userId : entry.approvedBy;

    if (!recipientId) return;

    const currentUser = await this.getCurrentUser();
    if (!currentUser) return;

    const message = `New note added to your timesheet: "${noteContent.substring(0, 50)}${noteContent.length > 50 ? "..." : ""}"`;

    const notification: TimesheetNotification = {
      id: `note_${Date.now()}_${recipientId}`,
      type: "note_added",
      userId: recipientId,
      fromUserId: currentUser.uid,
      fromUserName: currentUser.displayName || currentUser.email || "Unknown",
      weekStart: entry.date.toDate(),
      projectName: entry.projectName,
      message,
      data: {noteContent, entryId: entry.id},
      createdAt: Timestamp.now(),
      read: false,
      accountId: entry.accountId,
    };

    await this.saveNotification(notification);
  }

  private async saveNotification(notification: TimesheetNotification) {
    try {
      await this.firestore
        .collection("notifications")
        .doc(notification.id)
        .set(notification);
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  }

  private async getCurrentUser() {
    return firstValueFrom(
      this.store.select(selectAuthUser).pipe(
        filter((user) => !!user),
        take(1),
      ),
    );
  }

  private async showToast(message: string, color: string = "primary") {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      color,
      position: "top",
      buttons: [
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }

  /**
   * Get notifications for current user
   */
  getUserNotifications(userId: string) {
    return this.firestore
      .collection<TimesheetNotification>("notifications", (ref) =>
        ref
          .where("userId", "==", userId)
          .orderBy("createdAt", "desc")
          .limit(50),
      )
      .valueChanges();
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    try {
      await this.firestore
        .collection("notifications")
        .doc(notificationId)
        .update({read: true});
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }
}
