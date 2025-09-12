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
import {Observable, of, firstValueFrom} from "rxjs";
import {map, catchError} from "rxjs/operators";
import {FirebaseError} from "firebase/app";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  constructor(private afs: AngularFirestore) {}

  // Helper to ensure documents have an id property
  private populateId<T>(data: T, id: string): T {
    return {...data, id} as T;
  }

  /**
   * Get a document reference for direct operations
   * @param collectionName
   * @param documentId
   * @returns Document reference
   */
  getDocumentReference(collectionName: string, documentId: string) {
    return this.afs.collection(collectionName).doc(documentId);
  }

  /**
   * Update document and verify the update was successful
   * @param collectionName
   * @param documentId
   * @param updatedData
   * @returns Promise<void>
   */
  async updateDocumentWithVerification(
    collectionName: string,
    documentId: string,
    updatedData: any,
  ): Promise<void> {
    try {
      const docRef = this.afs.collection(collectionName).doc(documentId);

      // Check document exists first
      const beforeSnapshot = await firstValueFrom(docRef.get());
      const beforeData = beforeSnapshot?.data() as any;

      // Perform the update
      await docRef.update(updatedData);

      // Verify the update
      const afterSnapshot = await firstValueFrom(docRef.get());

      // Check if the update was successful
      const isVerified = Object.keys(updatedData).every((key) => {
        const expected = updatedData[key];
        const actualData = afterSnapshot?.data() as any;
        const actual = actualData?.[key];
        return actual === expected;
      });

      if (!isVerified) {
        throw new Error("Document update verification failed");
      }
    } catch (error) {
      console.error("FirestoreService: Document update failed", {
        collectionName,
        documentId,
        updatedData,
        error: error,
      });
      throw new FirebaseError(
        "update-document-error",
        `Error updating document: ${error}`,
      );
    }
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
      const result = await this.afs
        .collection(collectionName)
        .doc(documentId)
        .update(updatedData);
    } catch (error) {
      console.error("FirestoreService: Document update failed", {
        collectionName,
        documentId,
        updatedData,
        error: error,
      });
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
}
