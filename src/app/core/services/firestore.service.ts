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
// src/app/core/services/firestore.service.ts
import {Injectable} from "@angular/core";
import {combineLatest, firstValueFrom, Observable, of} from "rxjs";
import {map, catchError} from "rxjs/operators";
import {FirebaseError} from "firebase/app";
import {Account, RelatedAccount} from "@shared/models/account.model";
import {AngularFirestore, Query} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {RelatedListing} from "@shared/models/related-listing.model";
import {DocumentData, WhereFilterOp} from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
  ) {}

  // Helper to ensure documents have an id property
  private populateId<T>(data: T, id: string): T {
    return {...data, id} as T;
  }

  // Firebase Query Logic (Start) //

  /**
   * Retrieves a specific document from a given collection in real-time.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} documentId - ID of the document to retrieve.
   * @returns {Observable<T | null>} - Returns an Observable of the document data if found, otherwise null.
   */
  getDocument<T>(
    collectionName: string,
    documentId: string,
  ): Observable<T | null> {
    return this.afs
      .collection<T>(collectionName)
      .doc<T>(documentId)
      .valueChanges()
      .pipe(
        map((data) => (data ? this.populateId(data, documentId) : null)), // Populate id
        catchError((error) => {
          console.error("Error retrieving document:", error);
          return of(null);
        }),
      );
  }

  /**
   * Adds a new document to a specified collection.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {any} documentData - Data of the document to add.
   * @returns {Promise<string>} - Returns the ID of the added document.
   */
  async addDocument(
    collectionName: string,
    documentData: any,
  ): Promise<string> {
    try {
      const documentRef = await this.afs
        .collection(collectionName)
        .add(documentData);
      return documentRef.id;
    } catch (error) {
      throw new FirebaseError(
        "add-document-error",
        `Error adding document: ${error}`,
      );
    }
  }

  /**
   * Sets a document in Firestore, creating or updating it as necessary.
   * @param docPath The path to the document.
   * @param documentData The data of the document.
   * @param options Options for setting the document.
   */
  async setDocument(
    docPath: string,
    documentData: any,
    options?: {merge: boolean},
  ): Promise<void> {
    try {
      await this.afs.doc(docPath).set(documentData, options || {});
    } catch (error) {
      console.error("Error setting document at path:", docPath, error);
      throw error; // Propagate the error
    }
  }

  /**
   * Updates a specific document in a given collection.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} documentId - ID of the document to update.
   * @param {any} updatedData - New data to update the document with.
   * @returns {Promise<void>}
   */
  async updateDocument(
    collectionName: string,
    documentId: string,
    updatedData: any,
  ): Promise<void> {
    try {
      await this.afs
        .collection(collectionName)
        .doc(documentId)
        .update(updatedData);
    } catch (error) {
      throw new FirebaseError(
        "update-document-error",
        `Error updating document: ${error}`,
      );
    }
  }

  /**
   * Updates a document at the given path in Firestore.
   *
   * @param {string} docPath - The full path to the document.
   * @param {any} updatedData - The data to update.
   * @returns {Promise<void>}
   */
  async updateDocumentAtPath(docPath: string, updatedData: any): Promise<void> {
    try {
      await this.afs.doc(docPath).update(updatedData);
    } catch (error) {
      throw new FirebaseError(
        "update-document-at-path-error",
        `Error updating document at path ${docPath}: ${error}`,
      );
    }
  }

  /**
   * Deletes a specific document from a given collection.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} documentId - ID of the document to delete.
   * @returns {Promise<void>}
   */
  async deleteDocument(
    collectionName: string,
    documentId: string,
  ): Promise<void> {
    try {
      await this.afs.collection(collectionName).doc(documentId).delete();
    } catch (error) {
      throw new FirebaseError(
        "delete-document-error",
        `Error deleting document: ${error}`,
      );
    }
  }

  /**
   * Deletes a document at a specific Firestore path.
   * @param fullPath The full Firestore path to the document (e.g., 'listings/{listingId}/relatedAccounts/{relatedAccountId}').
   * @returns {Promise<void>}
   */
  async deleteDocumentAtPath(fullPath: string): Promise<void> {
    try {
      await this.afs.doc(fullPath).delete();
    } catch (error) {
      console.error(`Error deleting document at path: ${fullPath}`, error);
      throw error;
    }
  }

  /**
   * Retrieves documents from a collection based on a specified condition in real-time.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} field - Field name to apply the condition on.
   * @param {any} condition - Condition to apply.
   * @param {any} value - Value to match against.
   * @returns {Observable<T[]>} - Returns an Observable of an array of documents that match the condition.
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
          return this.populateId(data, id); // Ensure id is populated
        }),
      ),
      catchError((error) => {
        console.error("Error retrieving collection with condition:", error);
        return of([]);
      }),
    );
  }

  /**
   * Searches for documents in a collection based on a name field in real-time.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} searchTerm - Term to search for.
   * @param {string} [userId] - Current user Id (optional).
   * @returns {Observable<Account[]>} - Returns an Observable of an array of accounts that match the search term.
   */
  searchAccountByName(
    collectionName: string,
    searchTerm: string,
  ): Observable<Account[]> {
    const collectionRef = this.afs.collection<Account>(
      collectionName,
      (ref) => {
        let queryRef = ref
          .where("privacy", "==", "public")
          .where("type", "in", ["user", "group"]);

        // Firestore does not support OR queries directly, but we can perform multiple queries and combine the results
        // For simplicity, we'll only handle the search term as-is
        queryRef = queryRef
          .orderBy("name")
          .startAt(searchTerm)
          .endAt(searchTerm + "\uf8ff");

        return queryRef;
      },
    );

    return collectionRef.valueChanges({idField: "id"}).pipe(
      catchError((error) => {
        console.error("Error searching accounts:", error);
        return of([]);
      }),
    );
  }

  /**
   * Retrieves documents from a relatedAccounts sub-collection for a given account in real-time.
   *
   * @param {string} accountId - ID of the account.
   * @returns {Observable<RelatedAccount[]>} - Returns an Observable of an array of related accounts.
   */
  getRelatedAccounts(accountId: string): Observable<RelatedAccount[]> {
    const relatedAccountsRef = this.afs.collection<RelatedAccount>(
      `accounts/${accountId}/relatedAccounts`,
    );

    return relatedAccountsRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((action) => {
          const data = action.payload.doc.data() as RelatedAccount;
          const id = action.payload.doc.id;
          return this.populateId(data, id); // Ensure id is populated
        }),
      ),
      catchError((error) => {
        console.error("Error getting related accounts:", error);
        return of([]);
      }),
    );
  }

  /**
   * Retrieves all public user or group accounts from the 'accounts' collection in real-time.
   * @returns {Observable<Account[]>} - Returns an Observable of an array of account documents.
   */
  getAllAccounts(): Observable<Account[]> {
    return this.afs
      .collection<Account>("accounts", (ref) =>
        ref
          .where("privacy", "==", "public")
          .where("type", "in", ["user", "group"]),
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data() as Account;
            const id = action.payload.doc.id;
            return this.populateId(data, id); // Ensure id is populated
          }),
        ),
        catchError((error) => {
          console.error("Error getting accounts:", error);
          return of([]);
        }),
      );
  }

  /**
   * Retrieves an account with its related accounts and related listings.
   *
   * @param {string} accountId - ID of the account.
   * @returns {Observable<{ account: Account | null; relatedAccounts: RelatedAccount[]; relatedListings: RelatedListing[] }>}
   */
  getAccountWithRelated(accountId: string): Observable<{
    account: Account | null;
    relatedAccounts: RelatedAccount[];
    relatedListings: RelatedListing[];
  }> {
    return combineLatest([
      this.getDocument<Account>("accounts", accountId),
      this.getRelatedAccounts(accountId),
      this.afs
        .collection<RelatedListing>(`accounts/${accountId}/relatedListings`)
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((action) => {
              const data = action.payload.doc.data() as RelatedListing;
              const id = action.payload.doc.id;
              return this.populateId(data, id); // Ensure id is populated
            }),
          ),
          catchError(() => of([])),
        ),
    ]).pipe(
      map(([account, relatedAccounts, relatedListings]) => ({
        account,
        relatedAccounts,
        relatedListings,
      })),
      catchError((error) => {
        console.error("Error getting account with related data:", error);
        return of({
          account: null,
          relatedAccounts: [],
          relatedListings: [],
        });
      }),
    );
  }

  // Firebase Query Logic (Ends) //

  /**
   * Retrieves documents from any collection or sub-collection.
   * @param fullPath The full Firestore path to the collection (e.g., 'listings/{listingId}/relatedAccounts').
   * @param conditions Optional conditions to filter documents.
   * @returns {Observable<T[]>}
   */
  getDocuments<T>(
    fullPath: string,
    conditions?: {
      field: string;
      operator: WhereFilterOp;
      value: any;
    }[],
  ): Observable<T[]> {
    const collectionRef = this.afs.collection<T>(fullPath, (ref) => {
      let query: Query<DocumentData> = ref; // Use Query type
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
          return {...data, id}; // Ensure id is populated
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

  // Upload a file to Firestore storage
  async uploadFile(path: string, file: File): Promise<string> {
    const fileRef = this.storage.ref(path);

    // Upload the file
    await this.storage.upload(path, file);

    // Get the download URL using firstValueFrom
    return firstValueFrom(fileRef.getDownloadURL());
  }
}
