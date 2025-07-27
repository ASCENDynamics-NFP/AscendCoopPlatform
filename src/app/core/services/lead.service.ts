/*
 *******************************************************************************
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
// src/app/core/services/lead.service.ts

import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  inquiry: string;
  message?: string;
  from: string;
}

@Injectable({
  providedIn: "root",
})
export class LeadService {
  private endpoint =
    environment.firebaseConfig.apiUrl &&
    environment.firebaseConfig.apiUrl !== "undefined"
      ? `${environment.firebaseConfig.apiUrl}/submitLead`
      : "/submitLead";

  constructor(private http: HttpClient) {}

  submitLead(data: LeadData): Observable<any> {
    return this.http.post(this.endpoint, data).pipe(
      catchError((error) => {
        console.error("Lead submission failed", error);
        return throwError(() => error);
      }),
    );
  }
}
