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
// src/app/core/services/time-tracking.service.ts

import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {from, Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {FirestoreService} from "./firestore.service";
import {TimeEntry} from "@shared/models/time-entry.model";
import {serverTimestamp} from "@angular/fire/firestore";

@Injectable({providedIn: "root"})
export class TimeTrackingService {
  constructor(
    private afs: AngularFirestore,
    private firestore: FirestoreService,
  ) {}

  private collectionPath(userId: string) {
    return `accounts/${userId}/timeEntries`;
  }

  startEntry(userId: string, entry: Partial<TimeEntry>): Promise<string> {
    const data = {
      ...entry,
      userId,
      startTime: serverTimestamp(),
    } as Partial<TimeEntry>;
    return this.firestore.addDocument(this.collectionPath(userId), data);
  }

  stopEntry(userId: string, entryId: string): Promise<void> {
    return this.firestore.updateDocument(this.collectionPath(userId), entryId, {
      endTime: serverTimestamp(),
    });
  }

  createEntry(userId: string, entry: TimeEntry): Promise<string> {
    return this.firestore.addDocument(this.collectionPath(userId), entry);
  }

  updateEntry(userId: string, entry: TimeEntry): Promise<void> {
    return this.firestore.updateDocument(
      this.collectionPath(userId),
      entry.id,
      entry,
    );
  }

  deleteEntry(userId: string, entryId: string): Promise<void> {
    return this.firestore.deleteDocument(this.collectionPath(userId), entryId);
  }

  getEntriesForUser(userId: string): Observable<TimeEntry[]> {
    return this.afs
      .collection<TimeEntry>(this.collectionPath(userId))
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
          console.error("Error fetching time entries", error);
          return of([]);
        }),
      );
  }
}
