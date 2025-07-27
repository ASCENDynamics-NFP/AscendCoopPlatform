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
// src/app/core/services/listings.service.ts

import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {AngularFirestore, Query} from "@angular/fire/compat/firestore";
import {DocumentData, WhereFilterOp} from "firebase/firestore";
import {Listing} from "@shared/models/listing.model";
import {environment} from "../../../environments/environment";

/** Listings Service */
@Injectable({
  providedIn: "root",
})
export class ListingsService {
  private endpoint =
    environment.firebaseConfig.apiUrl &&
    environment.firebaseConfig.apiUrl !== "undefined"
      ? `${environment.firebaseConfig.apiUrl}/getHomepageListings`
      : "/getHomepageListings";

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
  ) {}

  /**
   * Fetch homepage listings with user's location
   * @param location User's browser location (latitude, longitude)
   * @param limit Number of listings to fetch (default: 10)
   * @param status Listing status filter (default: active)
   * @param category Optional category filter
   */
  getHomepageListings(
    location: {latitude: number; longitude: number},
    limit: number = 4,
    status: string = "active",
    category?: string,
  ): Observable<Listing[]> {
    let params = new HttpParams()
      .set("limit", limit)
      .set("status", status)
      .set("latitude", location.latitude)
      .set("longitude", location.longitude);

    if (category) {
      params = params.set("category", category);
    }

    return this.http.get<Listing[]>(this.endpoint, {params});
  }

  getCollectionWithCondition<T>(
    collectionName: string,
    field: string,
    condition: any,
    value: any,
  ): Observable<T[]> {
    const collectionRef = this.afs.collection<T>(collectionName, (ref) =>
      ref.where(field, condition, value),
    );
    return collectionRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((action) => {
          const data = action.payload.doc.data() as T;
          const id = action.payload.doc.id;
          return {...data, id};
        }),
      ),
      catchError((error) => {
        console.error("Error retrieving collection with condition:", error);
        return of([]);
      }),
    );
  }

  getDocuments<T>(
    fullPath: string,
    conditions?: {field: string; operator: WhereFilterOp; value: any}[],
  ): Observable<T[]> {
    const collectionRef = this.afs.collection<T>(fullPath, (ref) => {
      let query: Query<DocumentData> = ref;
      if (conditions) {
        conditions.forEach((condition) => {
          query = query.where(
            condition.field,
            condition.operator,
            condition.value,
          );
        });
      }
      return query;
    });

    return collectionRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((action) => {
          const data = action.payload.doc.data() as T;
          const id = action.payload.doc.id;
          return {...data, id};
        }),
      ),
      catchError((error) => {
        console.error(
          `Error retrieving documents from path: ${fullPath}`,
          error,
        );
        return of([]);
      }),
    );
  }
}
