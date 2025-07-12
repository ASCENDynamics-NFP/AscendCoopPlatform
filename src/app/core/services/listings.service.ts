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
import {Observable} from "rxjs";
import {Listing} from "@shared/models/listing.model";
import {environment} from "../../../environments/environment";

/** Listings Service */
@Injectable({
  providedIn: "root",
})
export class ListingsService {
  private endpoint = `${environment.firebaseConfig.apiUrl}/getHomepageListings`;

  constructor(private http: HttpClient) {}

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
}
