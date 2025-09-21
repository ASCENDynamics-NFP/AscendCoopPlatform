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
import {Observable} from "rxjs";
import {
  FirebaseFunctionsService,
  GetUserNotificationsRequest,
  MarkNotificationAsReadRequest,
  SendAdminNotificationRequest,
} from "../../core/services/firebase-functions.service";

@Injectable({
  providedIn: "root",
})
export class NotificationFunctionsService {
  constructor(private firebaseFunctions: FirebaseFunctionsService) {}

  /**
   * Get user notifications with pagination
   * @param data Notification request data
   * @returns Observable of user notifications
   */
  getUserNotifications(data: GetUserNotificationsRequest): Observable<any> {
    return this.firebaseFunctions.getUserNotifications(data);
  }

  /**
   * Mark a notification as read
   * @param data Notification read request data
   * @returns Observable of the operation result
   */
  markNotificationAsRead(data: MarkNotificationAsReadRequest): Observable<any> {
    return this.firebaseFunctions.markNotificationAsRead(data);
  }

  /**
   * Send admin notification (admin-only function)
   * @param data Admin notification data
   * @returns Observable of the operation result
   */
  sendAdminNotification(data: SendAdminNotificationRequest): Observable<any> {
    return this.firebaseFunctions.sendAdminNotification(data);
  }

  // Convenience methods with common parameter patterns

  /**
   * Get recent notifications for the current user
   * @param limit Number of notifications to retrieve (default: 20)
   * @returns Observable of recent notifications
   */
  getRecentNotifications(limit: number = 20): Observable<any> {
    return this.getUserNotifications({limit});
  }

  /**
   * Get notifications with pagination
   * @param limit Number of notifications to retrieve
   * @param lastNotificationId ID of the last notification for pagination
   * @returns Observable of paginated notifications
   */
  getPaginatedNotifications(
    limit: number = 20,
    lastNotificationId?: string,
  ): Observable<any> {
    return this.getUserNotifications({limit, lastNotificationId});
  }

  /**
   * Mark a notification as read by ID
   * @param notificationId The ID of the notification to mark as read
   * @returns Observable of the operation result
   */
  markAsRead(notificationId: string): Observable<any> {
    return this.markNotificationAsRead({notificationId});
  }

  /**
   * Send a system notification to admins
   * @param accountId Account ID related to the notification
   * @param type Type of notification (e.g., 'member_request', 'content_report')
   * @param message Notification message
   * @param data Optional additional data
   * @returns Observable of the operation result
   */
  notifyAdmins(
    accountId: string,
    type: string,
    message: string,
    data?: any,
  ): Observable<any> {
    return this.sendAdminNotification({
      accountId,
      type,
      message,
      data,
    });
  }

  /**
   * Send a member request notification to admins
   * @param accountId Account ID of the requesting member
   * @param memberName Name of the requesting member
   * @param organizationName Name of the organization
   * @returns Observable of the operation result
   */
  notifyAdminsOfMemberRequest(
    accountId: string,
    memberName: string,
    organizationName: string,
  ): Observable<any> {
    return this.notifyAdmins(
      accountId,
      "member_request",
      `New member request from ${memberName} for ${organizationName}`,
      {
        memberName,
        organizationName,
        requestType: "membership",
      },
    );
  }

  /**
   * Send a content report notification to admins
   * @param accountId Account ID related to the reported content
   * @param contentType Type of content reported (e.g., 'listing', 'project', 'message')
   * @param contentId ID of the reported content
   * @param reportReason Reason for the report
   * @param reporterName Name of the person reporting
   * @returns Observable of the operation result
   */
  notifyAdminsOfContentReport(
    accountId: string,
    contentType: string,
    contentId: string,
    reportReason: string,
    reporterName: string,
  ): Observable<any> {
    return this.notifyAdmins(
      accountId,
      "content_report",
      `Content reported: ${contentType} by ${reporterName}`,
      {
        contentType,
        contentId,
        reportReason,
        reporterName,
      },
    );
  }

  /**
   * Send a system error notification to admins
   * @param accountId Account ID where the error occurred
   * @param errorType Type of error
   * @param errorMessage Error message
   * @param errorContext Additional context about the error
   * @returns Observable of the operation result
   */
  notifyAdminsOfSystemError(
    accountId: string,
    errorType: string,
    errorMessage: string,
    errorContext?: any,
  ): Observable<any> {
    return this.notifyAdmins(
      accountId,
      "system_error",
      `System error: ${errorType} - ${errorMessage}`,
      {
        errorType,
        errorMessage,
        errorContext,
        timestamp: new Date().toISOString(),
      },
    );
  }
}
