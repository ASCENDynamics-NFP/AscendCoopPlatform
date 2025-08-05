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
import {BaseDocument} from "./base-document";

// Report reason enum for consistency
export enum ReportReason {
  SPAM = "spam",
  INAPPROPRIATE_CONTENT = "inappropriate_content",
  HARASSMENT = "harassment",
  THREATS = "threats",
  FAKE_PROFILE = "fake_profile",
  SCAM = "scam",
  OTHER = "other",
}

// Report context enum
export enum ReportContext {
  CHAT = "chat",
  PROFILE = "profile",
  LISTING = "listing",
  GROUP = "group",
  EVENT = "event",
}

// Report severity levels
export enum ReportSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Action taken by administrators
export enum AdminAction {
  NONE = "none",
  WARNING = "warning",
  TEMPORARY_SUSPENSION = "temporary_suspension",
  PERMANENT_BAN = "permanent_ban",
  CONTENT_REMOVAL = "content_removal",
  UNDER_REVIEW = "under_review",
}

export interface AppFeedback extends BaseDocument {
  email: string; // Email of the user who submitted the feedback
  emailVerified: boolean; // Whether the user's email has been verified
  name: string; // Name of the user who submitted the feedback
  feedback: string; // Feedback text
  type: string; // Feedback type
  attachment: string; // URL of the attachment
  rating: number; // Rating of the feedback
  category: string; // Category of the feedback
  isRead: boolean; // Whether the feedback has been read
  isResolved: boolean; // Whether the feedback has been resolved

  // User Report specific properties
  isUserReport?: boolean; // Flag to identify if this is a user report
  reportedUserId?: string; // ID of the user being reported
  reportedUserName?: string; // Name of the user being reported
  reportedUserEmail?: string; // Email of the user being reported
  reportReason?: ReportReason; // Specific reason for the report
  reportContext?: ReportContext; // Context where the report occurred
  chatId?: string; // Chat ID if report is from messaging
  listingId?: string; // Listing ID if report is from a listing
  groupId?: string; // Group ID if report is from a group
  eventId?: string; // Event ID if report is from an event
  reportSeverity?: ReportSeverity; // Severity level of the report
  reporterUserId?: string; // ID of the user making the report
  reportDate?: Date; // Date when the report was submitted
  evidenceUrls?: string[]; // URLs to any evidence (screenshots, etc.)
  adminNotes?: string; // Notes added by administrators
  actionTaken?: AdminAction; // Action taken by administrators
  followUpRequired?: boolean; // Whether follow-up action is required
  reviewedBy?: string; // Admin user ID who reviewed the report
  reviewedDate?: Date; // Date when the report was reviewed
}

// Utility functions for report management
export class ReportUtils {
  /**
   * Check if a feedback entry is a user report
   */
  static isUserReport(feedback: AppFeedback): boolean {
    return feedback.isUserReport === true;
  }

  /**
   * Get all user reports from a list of feedback
   */
  static getUserReports(feedbackList: AppFeedback[]): AppFeedback[] {
    return feedbackList.filter((feedback) => this.isUserReport(feedback));
  }

  /**
   * Get reports by severity level
   */
  static getReportsBySeverity(
    feedbackList: AppFeedback[],
    severity: ReportSeverity,
  ): AppFeedback[] {
    return this.getUserReports(feedbackList).filter(
      (report) => report.reportSeverity === severity,
    );
  }

  /**
   * Get unresolved reports
   */
  static getUnresolvedReports(feedbackList: AppFeedback[]): AppFeedback[] {
    return this.getUserReports(feedbackList).filter(
      (report) => !report.isResolved,
    );
  }

  /**
   * Get reports requiring follow-up
   */
  static getReportsRequiringFollowUp(
    feedbackList: AppFeedback[],
  ): AppFeedback[] {
    return this.getUserReports(feedbackList).filter(
      (report) => report.followUpRequired === true,
    );
  }

  /**
   * Get reports by context (chat, profile, etc.)
   */
  static getReportsByContext(
    feedbackList: AppFeedback[],
    context: ReportContext,
  ): AppFeedback[] {
    return this.getUserReports(feedbackList).filter(
      (report) => report.reportContext === context,
    );
  }

  /**
   * Get reports against a specific user
   */
  static getReportsAgainstUser(
    feedbackList: AppFeedback[],
    userId: string,
  ): AppFeedback[] {
    return this.getUserReports(feedbackList).filter(
      (report) => report.reportedUserId === userId,
    );
  }

  /**
   * Get severity level based on report reason
   */
  static getSeverityForReason(reason: ReportReason): ReportSeverity {
    const severityMap: Record<ReportReason, ReportSeverity> = {
      [ReportReason.SPAM]: ReportSeverity.LOW,
      [ReportReason.INAPPROPRIATE_CONTENT]: ReportSeverity.MEDIUM,
      [ReportReason.HARASSMENT]: ReportSeverity.HIGH,
      [ReportReason.THREATS]: ReportSeverity.CRITICAL,
      [ReportReason.FAKE_PROFILE]: ReportSeverity.MEDIUM,
      [ReportReason.SCAM]: ReportSeverity.HIGH,
      [ReportReason.OTHER]: ReportSeverity.LOW,
    };
    return severityMap[reason];
  }

  /**
   * Check if a report reason requires immediate follow-up
   */
  static requiresFollowUp(reason: ReportReason): boolean {
    const highPriorityReasons = [
      ReportReason.HARASSMENT,
      ReportReason.THREATS,
      ReportReason.SCAM,
    ];
    return highPriorityReasons.includes(reason);
  }
}
