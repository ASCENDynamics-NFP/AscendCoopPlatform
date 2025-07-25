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
// shared/models/time-entry.model.ts

import {Timestamp} from "firebase/firestore";
import {BaseDocument} from "./base-document";

export interface TimeEntry extends BaseDocument {
  /** The account/group this entry belongs to */
  accountId: string;
  projectId: string;
  /** The project name for display purposes */
  projectName?: string;
  userId: string;
  /** The user's display name for approval workflows */
  userName?: string;
  date: Timestamp;
  hours: number;
  /**
   * Approval status of the time entry. Newly created entries should be
   * saved with 'draft' status, then submitted as 'pending' for approval,
   * and may later transition to 'approved' or 'rejected'.
   */
  status?: "draft" | "pending" | "approved" | "rejected";
  notes?: string;

  // Audit fields for approval workflow
  /** ID of the user who approved/rejected this entry */
  approvedBy?: string;
  /** Name of the user who approved/rejected this entry */
  approvedByName?: string;
  /** Timestamp when the approval/rejection occurred */
  approvedAt?: Timestamp;
  /** Reason for rejection (if applicable) */
  rejectionReason?: string;
  /** Original submitted hours (in case of modifications during approval) */
  originalHours?: number;
  /** History of status changes for audit trail */
  statusHistory?: {
    status: "draft" | "pending" | "approved" | "rejected";
    changedBy: string;
    changedByName: string;
    changedAt: Timestamp;
    reason?: string;
  }[];
}
