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
// src/app/modules/listing/relatedAccount/pages/applicants/components/applicant-pipeline/applicant-pipeline.component.ts

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import {
  ListingRelatedAccount,
  ApplicationStatus,
} from "@shared/models/listing-related-account.model";

export interface PipelineColumn {
  id: ApplicationStatus;
  label: string;
  color: string;
  accounts: ListingRelatedAccount[];
}

@Component({
  selector: "app-applicant-pipeline",
  templateUrl: "./applicant-pipeline.component.html",
  styleUrls: ["./applicant-pipeline.component.scss"],
})
export class ApplicantPipelineComponent {
  @Input() set accountsByStatus(
    value: Record<ApplicationStatus, ListingRelatedAccount[]>,
  ) {
    if (value) {
      this.columns = this.buildColumns(value);
    }
  }

  @Output() statusChange = new EventEmitter<{
    account: ListingRelatedAccount;
    newStatus: ApplicationStatus;
  }>();

  @Output() applicantClick = new EventEmitter<ListingRelatedAccount>();

  columns: PipelineColumn[] = [];

  private buildColumns(
    accountsByStatus: Record<ApplicationStatus, ListingRelatedAccount[]>,
  ): PipelineColumn[] {
    return [
      {
        id: "applied",
        label: "Applied",
        color: "primary",
        accounts: accountsByStatus.applied || [],
      },
      {
        id: "reviewing",
        label: "Reviewing",
        color: "secondary",
        accounts: accountsByStatus.reviewing || [],
      },
      {
        id: "interviewed",
        label: "Interviewed",
        color: "tertiary",
        accounts: accountsByStatus.interviewed || [],
      },
      {
        id: "accepted",
        label: "Accepted",
        color: "success",
        accounts: accountsByStatus.accepted || [],
      },
      {
        id: "declined",
        label: "Declined",
        color: "danger",
        accounts: accountsByStatus.declined || [],
      },
      {
        id: "withdrawn",
        label: "Withdrawn",
        color: "medium",
        accounts: accountsByStatus.withdrawn || [],
      },
    ];
  }

  getConnectedLists(): string[] {
    return this.columns.map((col) => `pipeline-${col.id}`);
  }

  drop(
    event: CdkDragDrop<ListingRelatedAccount[]>,
    targetColumn: PipelineColumn,
  ) {
    if (event.previousContainer === event.container) {
      // Reordering within the same column
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      // Moving to a different column
      const account = event.previousContainer.data[event.previousIndex];

      // Don't allow moving from/to withdrawn (user-initiated only)
      if (targetColumn.id === "withdrawn") {
        return;
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Emit status change event
      this.statusChange.emit({
        account: {...account, status: targetColumn.id},
        newStatus: targetColumn.id,
      });
    }
  }

  onApplicantClick(account: ListingRelatedAccount) {
    this.applicantClick.emit(account);
  }

  trackByAccountId(index: number, account: ListingRelatedAccount): string {
    return account.id;
  }

  trackByColumnId(index: number, column: PipelineColumn): string {
    return column.id;
  }
}
