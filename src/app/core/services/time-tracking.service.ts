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
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable, of, from} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {FirestoreService} from "./firestore.service";
import {Project} from "@shared/models/project.model";
import {TimeEntry} from "@shared/models/time-entry.model";

@Injectable({
  providedIn: "root",
})
export class TimeTrackingService {
  constructor(
    private afs: AngularFirestore,
    private firestore: FirestoreService,
  ) {}

  getProjects(accountId: string): Observable<Project[]> {
    return this.afs
      .collection<Project>(`accounts/${accountId}/projects`, (ref) =>
        ref.where("archived", "==", false),
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Project;
            const id = a.payload.doc.id;
            return {...data, id};
          }),
        ),
        catchError((error) => {
          console.error("Error loading projects:", error);
          return of([]);
        }),
      );
  }

  getUserEntries(accountId: string, userId: string): Observable<TimeEntry[]> {
    return this.afs
      .collection<TimeEntry>(`accounts/${accountId}/timeEntries`, (ref) =>
        ref.where("userId", "==", userId),
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as TimeEntry;
            const id = a.payload.doc.id;
            return {...data, id};
          }),
        ),
        catchError((error) => {
          console.error("Error loading time entries:", error);
          return of([]);
        }),
      );
  }

  addTimeEntry(entry: TimeEntry): Promise<string> {
    return this.firestore.addDocument(
      `accounts/${entry.accountId}/timeEntries`,
      entry,
    );
  }

  updateTimeEntry(entry: TimeEntry): Promise<void> {
    return this.firestore.updateDocument(
      `accounts/${entry.accountId}/timeEntries`,
      entry.id,
      entry,
    );
  }
}
