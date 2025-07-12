

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
// src/app/core/services/accounts.service.ts

import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {combineLatest, Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Account, RelatedAccount} from "@shared/models/account.model";
import {RelatedListing} from "@shared/models/related-listing.model";
import {FirestoreService} from "./firestore.service";

@Injectable({
  providedIn: "root",
})
export class AccountsService {
  constructor(private afs: AngularFirestore, private firestore: FirestoreService) {}

  searchAccountByName(collectionName: string, searchTerm: string): Observable<Account[]> {
    const collectionRef = this.afs.collection<Account>(collectionName, (ref) => {
      let queryRef = ref
        .where("privacy", "==", "public")
        .where("type", "in", ["user", "group"]);

      queryRef = queryRef.orderBy("name").startAt(searchTerm).endAt(searchTerm + "\uf8ff");
      return queryRef;
    });

    return collectionRef.valueChanges({idField: "id"}).pipe(
      catchError((error) => {
        console.error("Error searching accounts:", error);
        return of([]);
      }),
    );
  }

  getRelatedAccounts(accountId: string): Observable<RelatedAccount[]> {
    const relatedAccountsRef = this.afs.collection<RelatedAccount>(`accounts/${accountId}/relatedAccounts`);

    return relatedAccountsRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((action) => {
          const data = action.payload.doc.data() as RelatedAccount;
          const id = action.payload.doc.id;
          return {...data, id};
        }),
      ),
      catchError((error) => {
        console.error("Error getting related accounts:", error);
        return of([]);
      }),
    );
  }

  getAllAccounts(): Observable<Account[]> {
    return this.afs
      .collection<Account>("accounts", (ref) =>
        ref.where("privacy", "==", "public").where("type", "in", ["user", "group"]),
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data() as Account;
            const id = action.payload.doc.id;
            return {...data, id};
          }),
        ),
        catchError((error) => {
          console.error("Error getting accounts:", error);
          return of([]);
        }),
      );
  }

  getAccountWithRelated(accountId: string): Observable<{
    account: Account | null;
    relatedAccounts: RelatedAccount[];
    relatedListings: RelatedListing[];
  }> {
    return combineLatest([
      this.firestore.getDocument<Account>("accounts", accountId),
      this.getRelatedAccounts(accountId),
      this.afs
        .collection<RelatedListing>(`accounts/${accountId}/relatedListings`)
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((action) => {
              const data = action.payload.doc.data() as RelatedListing;
              const id = action.payload.doc.id;
              return {...data, id};
            }),
          ),
          catchError(() => of([])),
        ),
    ]).pipe(
      map(([account, relatedAccounts, relatedListings]) => ({account, relatedAccounts, relatedListings})),
      catchError((error) => {
        console.error("Error getting account with related data:", error);
        return of({account: null, relatedAccounts: [], relatedListings: []});
      }),
    );
  }
}

