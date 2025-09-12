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
// src/app/core/services/time-tracking.service.ts

import {Injectable} from "@angular/core";
import {Observable, of, firstValueFrom} from "rxjs";
import {map, catchError} from "rxjs/operators";
import {
  FirebaseFunctionsService,
  CreateTimeEntryRequest,
  UpdateTimeEntryRequest,
  GetAccountTimeEntriesRequest,
  TimeTrackingStatsRequest,
} from "./firebase-functions.service";
import {TimeEntry} from "../../../../shared/models/time-entry.model";
import {ProjectService} from "./project.service";

/**
 * TimeTrackingService - Wrapper around FirebaseFunctionsService for time tracking operations
 */
@Injectable({
  providedIn: "root",
})
export class TimeTrackingService {
  constructor(
    private firebaseFunctions: FirebaseFunctionsService,
    private projectService: ProjectService,
  ) {}

  /**
   * Create a new time entry
   * @param data The time entry data to create
   * @returns Observable of the created time entry
   */
  createTimeEntry(data: CreateTimeEntryRequest): Observable<TimeEntry> {
    return this.firebaseFunctions.createTimeEntry(data).pipe(
      map((response) => response.timeEntry),
      catchError((error) => {
        console.error("Error creating time entry:", error);
        throw error;
      }),
    );
  }

  /**
   * Update an existing time entry
   * @param timeEntryId The ID of the time entry to update
   * @param updates The fields to update
   * @returns Observable of the updated time entry
   */
  updateTimeEntry(
    timeEntryId: string,
    updates: Partial<CreateTimeEntryRequest>,
  ): Observable<TimeEntry> {
    return this.firebaseFunctions
      .updateTimeEntry({
        timeEntryId,
        updates,
      })
      .pipe(
        map((response) => response.timeEntry),
        catchError((error) => {
          console.error("Error updating time entry:", error);
          throw error;
        }),
      );
  }

  /**
   * Delete a time entry
   * @param timeEntryId The ID of the time entry to delete
   * @returns Observable of the deletion result
   */
  deleteTimeEntry(timeEntryId: string): Observable<any> {
    return this.firebaseFunctions.deleteTimeEntry(timeEntryId).pipe(
      catchError((error) => {
        console.error("Error deleting time entry:", error);
        throw error;
      }),
    );
  }

  /**
   * Get time entries for an account
   * @param accountId The account ID
   * @param options Optional query parameters
   * @returns Observable of time entries
   */
  getAccountTimeEntries(
    accountId: string,
    options: Partial<GetAccountTimeEntriesRequest> = {},
  ): Observable<TimeEntry[]> {
    return this.firebaseFunctions
      .getAccountTimeEntries({
        accountId,
        ...options,
      })
      .pipe(
        map((response) => response.timeEntries || []),
        catchError((error) => {
          console.error("Error loading time entries:", error);
          return of([]);
        }),
      );
  }

  /**
   * Get time entries for a specific user
   * @param accountId The account ID
   * @param userId The user ID
   * @param options Optional query parameters
   * @returns Observable of time entries
   */
  getUserTimeEntries(
    accountId: string,
    userId: string,
    options: Partial<GetAccountTimeEntriesRequest> = {},
  ): Observable<TimeEntry[]> {
    return this.getAccountTimeEntries(accountId, {
      ...options,
      userId,
    });
  }

  /**
   * Get time entries for a specific project
   * @param accountId The account ID
   * @param projectId The project ID
   * @param options Optional query parameters
   * @returns Observable of time entries
   */
  getProjectTimeEntries(
    accountId: string,
    projectId: string,
    options: Partial<GetAccountTimeEntriesRequest> = {},
  ): Observable<TimeEntry[]> {
    return this.getAccountTimeEntries(accountId, {
      ...options,
      projectId,
    });
  }

  /**
   * Get time tracking statistics
   * @param accountId The account ID
   * @param options Optional query parameters for stats
   * @returns Observable of time tracking statistics
   */
  getTimeTrackingStats(
    accountId: string,
    options: Partial<TimeTrackingStatsRequest> = {},
  ): Observable<any> {
    return this.firebaseFunctions
      .getTimeTrackingStats({
        accountId,
        ...options,
      })
      .pipe(
        map((response) => response.stats),
        catchError((error) => {
          console.error("Error loading time tracking stats:", error);
          throw error;
        }),
      );
  }

  /**
   * Legacy method for backward compatibility - get projects for an account
   * Note: This now uses the ProjectService instead of direct Firestore
   * @param accountId The account ID
   * @returns Observable of projects
   */
  getProjects(accountId: string): Observable<any[]> {
    // Delegate to ProjectService for actual data
    return this.projectService.getAccountProjects(accountId).pipe(
      catchError((error) => {
        console.error("Error loading projects:", error);
        return of([]);
      }),
    );
  }

  /**
   * Legacy method for backward compatibility
   * @param accountId Account ID
   * @param userId User ID
   * @returns Observable of time entries
   */
  getUserEntries(accountId: string, userId: string): Observable<TimeEntry[]> {
    return this.getUserTimeEntries(accountId, userId);
  }

  /**
   * Legacy method for backward compatibility
   * @param entry Time entry data
   * @returns Promise of the created time entry ID
   */
  addTimeEntry(entry: any): Promise<string> {
    const createRequest: CreateTimeEntryRequest = {
      accountId: entry.accountId,
      listingId: entry.listingId,
      projectId: entry.projectId,
      date: entry.date,
      hours: entry.hours,
      description: entry.description,
      category: entry.category,
      isVolunteer: entry.isVolunteer,
    };

    return firstValueFrom(
      this.createTimeEntry(createRequest).pipe(
        map((timeEntry) => timeEntry.id),
      ),
    );
  }

  /**
   * Legacy method for backward compatibility
   * @param entry Time entry data with updates
   * @returns Promise of void
   */
  updateTimeEntry_legacy(entry: any): Promise<void> {
    const updates = {
      date: entry.date,
      hours: entry.hours,
      description: entry.description,
      category: entry.category,
      isVolunteer: entry.isVolunteer,
    };

    return firstValueFrom(
      this.updateTimeEntry(entry.id, updates).pipe(map(() => void 0)),
    );
  }
}
