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
import {Listing} from "../../../../shared/models/listing.model";
import {environment} from "../../../environments/environment";
import {
  FirebaseFunctionsService,
  CreateListingRequest,
  SearchListingsRequest,
} from "./firebase-functions.service";

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
    private firebaseFunctions: FirebaseFunctionsService,
  ) {}

  // ===== CALLABLE FUNCTION METHODS =====

  /**
   * Create a new listing using callable function
   */
  createListing(listingData: CreateListingRequest): Observable<any> {
    return this.firebaseFunctions.createListing(listingData);
  }

  /**
   * Update listing using callable function
   */
  updateListing(
    listingId: string,
    updates: Partial<CreateListingRequest>,
  ): Observable<any> {
    return this.firebaseFunctions.updateListing(listingId, updates);
  }

  /**
   * Delete listing using callable function
   */
  deleteListing(listingId: string): Observable<any> {
    return this.firebaseFunctions.deleteListing(listingId);
  }

  /**
   * Apply to listing using callable function
   */
  applyToListing(
    listingId: string,
    notes?: string,
    customMessage?: string,
    resumeUrl?: string | null,
    coverLetterUrl?: string | null,
  ): Observable<any> {
    return this.firebaseFunctions.applyToListing(
      listingId,
      notes,
      customMessage,
      resumeUrl,
      coverLetterUrl,
    );
  }

  /**
   * Save a listing for the current user via callable
   */
  saveListing(listingId: string): Observable<any> {
    return this.firebaseFunctions.saveListing(listingId);
  }

  /**
   * Unsave a listing for the current user via callable
   */
  unsaveListing(listingId: string): Observable<any> {
    return this.firebaseFunctions.unsaveListing(listingId);
  }

  manageApplication(
    listingId: string,
    applicantId: string,
    status: "accepted" | "declined",
    notes?: string,
  ): Observable<any> {
    return this.firebaseFunctions.manageApplication(
      listingId,
      applicantId,
      status,
      notes,
    );
  }

  /**
   * Search listings using callable function with filtering options
   */
  searchListings(searchParams: SearchListingsRequest): Observable<Listing[]> {
    return this.firebaseFunctions.searchListings(searchParams).pipe(
      map((result) => result.listings || []),
      catchError((error) => {
        console.error("Error searching listings:", error);
        return of([]);
      }),
    );
  }

  // ===== ENHANCED HOMEPAGE LISTINGS =====

  /**
   * Fetch homepage listings with user's location using callable functions when available
   * Falls back to legacy HTTP endpoint for backward compatibility
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
    // Use searchListings callable function for enhanced functionality
    const searchParams: SearchListingsRequest = {
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      radiusKm: 50, // Default 50km radius for homepage
      limit,
      ...(category && {category}),
    };

    return this.searchListings(searchParams).pipe(
      catchError(() => {
        // Fallback to legacy HTTP endpoint if callable function fails
        console.warn(
          "Callable function failed, falling back to legacy endpoint",
        );
        let params = new HttpParams()
          .set("limit", limit)
          .set("status", status)
          .set("latitude", location.latitude)
          .set("longitude", location.longitude);

        if (category) {
          params = params.set("category", category);
        }

        return this.http.get<Listing[]>(this.endpoint, {params});
      }),
    );
  }

  // ===== LEGACY METHODS (keeping for backward compatibility) =====

  /**
   * @deprecated Use searchListings() with SearchListingsRequest instead
   */
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

  /**
   * @deprecated Use searchListings() with SearchListingsRequest instead
   */
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
