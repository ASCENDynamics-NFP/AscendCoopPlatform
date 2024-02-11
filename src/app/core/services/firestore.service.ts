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
import {Injectable} from "@angular/core";
import {
  Firestore,
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  onSnapshot,
  DocumentData,
  and,
  or,
} from "firebase/firestore";
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  combineLatestAll,
  map,
  switchMap,
} from "rxjs";
import {FirebaseError} from "firebase/app";
import {RelatedAccount} from "../../models/account.model";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  private ignoreCollectionList: string[] = ["feedback"];
  /**
   * A BehaviorSubject that holds an array of objects, each representing a Firestore collection to listen to.
   * Each object contains the name of the collection and an array of document ids to listen to in that collection.
   *
   * The BehaviorSubject is initialized with an empty array, but can be updated with new collections and ids to listen to.
   *
   * Example:
   * [
   *   {
   *     collectionName: "accounts",
   *     ids: ["account1", "account2"],
   *   },
   * ]
   *
   * @private
   * @type {BehaviorSubject<{collectionName: string; ids: string[]}[]>}
   */
  private collectionIdsSubject = new BehaviorSubject<
    {collectionName: string; ids: string[]}[]
  >([]);
  firestore: Firestore;

  constructor() {
    this.firestore = getFirestore();
  }

  // Obserable Logic (Start) //
  /**
   * Returns the BehaviorSubject that holds the collections and ids to listen to.
   * @returns {BehaviorSubject<{collectionName: string; ids: string[]}[]>} - The BehaviorSubject that holds the collections and ids to listen to.
   * @memberof FirestoreService
   * @example
   * const collectionIdsSubject = firestoreService.getCollectionsSubject();
   * collectionIdsSubject.next([
   *  {
   *   collectionName: "accounts",
   *  ids: ["account1", "account2"],
   * },
   * ]);
   * // This will cause the FirestoreService to listen to the documents with ids "account1" and "account2" in the "accounts" collection.
   * // Whenever any of these documents change, the FirestoreService will emit the new data of all the documents.
   * // If the documents don't exist, the FirestoreService will emit null.
   * // If the documents are deleted, the FirestoreService will emit null.
   * // If the documents are created, the FirestoreService will emit the new data of all the documents.
   * // If the documents are updated, the FirestoreService will emit the new data of all the documents.
   * // If the documents are updated, but the new data is the same as the old data, the FirestoreService will not emit anything.
   */
  getCollectionsSubject() {
    return this.collectionIdsSubject;
  }

  /**
   * Listen to multiple documents in multiple Firestore collections.
   * The documents and collections to listen to are determined by the value of collectionIdsSubject.
   * @param {BehaviorSubject<Object[]>} collectionIdsSubject - A BehaviorSubject of an array of objects, each containing the name of the collection and the ids of the documents to listen to.
   * @returns {Observable<DocumentData[]>} - An Observable that emits the data of the documents whenever any of them change.
   */

  // Observable Logic for Multiple Documents
  /**
   * Listen to multiple documents in multiple Firestore collections.
   * The documents and collections to listen to are determined by the value of collectionIdsSubject.
   * @param {BehaviorSubject<Object[]>} collectionIdsSubject - A BehaviorSubject of an array of objects, each containing the name of the collection and the ids of the documents to listen to.
   * @returns {Observable<DocumentData[]>} - An Observable that emits the data of the documents whenever any of them change.
   */
  listenToMultipleDocumentsInMultipleCollections(): Observable<DocumentData[]> {
    return this.collectionIdsSubject.pipe(
      switchMap((collections) => {
        return combineLatest(
          collections.map((collection) => {
            const docObservables = collection.ids.map((id) => {
              return new Observable<DocumentData>((subscriber) => {
                const unsubscribe = onSnapshot(
                  doc(this.firestore, collection.collectionName, id),
                  (docSnapshot) => {
                    // Include the id in the emitted data
                    const data = docSnapshot.data();
                    if (data) {
                      data["id"] = docSnapshot.id;
                      subscriber.next(data);
                    }
                  },
                  (error) => {
                    subscriber.error(error);
                  },
                );

                return unsubscribe; // This function will be called when the Observable is unsubscribed from
              });
            });

            return combineLatest(docObservables);
          }),
        ).pipe(
          map((arrays) => arrays.flat()), // Flatten the array of arrays into a single array
        );
      }),
    );
  }

  /**
   * Adds an id to the collection with the given name in the collectionIdsSubject.
   * @param collectionName - The name of the collection to add the id to.
   * @param id - The id to add to the collection.
   */
  addIdToCollection(collectionName: string, id: string): void {
    if (this.ignoreCollectionList.includes(collectionName)) {
      return;
    }
    const currentCollections = this.collectionIdsSubject.getValue();
    const collectionIndex = currentCollections.findIndex(
      (collection) => collection.collectionName === collectionName,
    );
    if (collectionIndex === -1) {
      currentCollections.push({collectionName, ids: [id]});
    } else {
      // Check if id already exists in the array
      if (!currentCollections[collectionIndex].ids.includes(id)) {
        currentCollections[collectionIndex].ids.push(id);
      }
    }
    this.collectionIdsSubject.next(currentCollections);
  }

  /**
   * Removes an id from the collection with the given name in the collectionIdsSubject.
   * @param collectionName - The name of the collection to remove the id from.
   * @param id - The id to remove from the collection.
   */
  removeIdFromCollection(collectionName: string, id: string): void {
    const currentCollections = this.collectionIdsSubject.getValue();
    const collectionIndex = currentCollections.findIndex(
      (collection) => collection.collectionName === collectionName,
    );
    if (collectionIndex !== -1) {
      // Check if id exists in the array
      if (currentCollections[collectionIndex].ids.includes(id)) {
        currentCollections[collectionIndex].ids = currentCollections[
          collectionIndex
        ].ids.filter((currentId) => currentId !== id);
        this.collectionIdsSubject.next(currentCollections);
      }
    }
  }

  /**
   * Clears the data in the collectionIdsSubject.
   * This method sets the BehaviorSubject's value to an empty array, effectively clearing its data.
   */
  clearCollectionIdsData() {
    this.collectionIdsSubject.next([]);
  }

  // Obserable Logic (End) //

  // Firebase Query Logic (Start) //
  /**
   * Retrieves a specific document from a given collection.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} documentId - ID of the document to retrieve.
   * @returns {Promise<any | null>} - Returns the document data if found, otherwise null.
   */
  async getDocument(collectionName: string, documentId: string) {
    try {
      const documentRef = doc(this.firestore, collectionName, documentId);
      const documentSnap = await getDoc(documentRef);

      if (documentSnap.exists()) {
        const data = documentSnap.data();
        data["id"] = documentSnap.id;
        return data;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving document: ", error);
      return null;
    }
  }

  /**
   * Adds a new document to a specified collection.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {any} documentData - Data of the document to add.
   * @returns {Promise<string | null>} - Returns the ID of the added document, otherwise null.
   */
  // Document Manipulation Methods
  async addDocument(
    collectionName: string,
    documentData: any,
  ): Promise<string | null> {
    try {
      const documentRef = await addDoc(
        collection(this.firestore, collectionName),
        documentData,
      );
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
      const documentRef = doc(this.firestore, docPath);
      await setDoc(documentRef, documentData, options || {});
      console.log("Document set successfully at path:", docPath);
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
   */
  async updateDocument(
    collectionName: string,
    documentId: string,
    updatedData: any,
  ) {
    try {
      await setDoc(
        doc(this.firestore, collectionName, documentId),
        updatedData,
        {merge: true},
      );
    } catch (error) {
      throw new FirebaseError(
        "update-document-error",
        `Error updating document: ${error}`,
      );
    }
  }

  /**
   * Deletes a specific document from a given collection.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} documentId - ID of the document to delete.
   */
  async deleteDocument(collectionName: string, documentId: string) {
    try {
      await deleteDoc(doc(this.firestore, collectionName, documentId));
    } catch (error) {
      throw new FirebaseError(
        "delete-document-error",
        `Error deleting document: ${error}`,
      );
    }
  }

  /**
   * Retrieves documents from a collection based on a specified condition.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} field - Field name to apply the condition on.
   * @param {any} condition - Condition to apply.
   * @param {any} value - Value to match against.
   * @returns {Promise<DocumentData[] | null>} - Returns an array of documents that match the condition, otherwise null.
   */
  getCollectionWithCondition(
    collectionName: string,
    field: string,
    condition: any,
    value: any,
  ): Promise<DocumentData[] | null> {
    return getDocs(
      query(
        collection(this.firestore, collectionName),
        where(field, condition, value),
      ),
    )
      .then((querySnapshot) => {
        const documents: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          documents.push(data);
        });
        return documents;
      })
      .catch((error) => {
        console.error("Error retrieving collection: ", error);
        return null;
      });
  }

  /**
   * Searches for documents in a collection based on a name field.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} searchTerm - Term to search for.
   * @param {string} userId - Current user Id.
   * @returns {Promise<DocumentData[] | null>} - Returns an array of documents that match the search term, otherwise null.
   */
  searchAccountByName(
    collectionName: string,
    searchTerm: string,
    userId: string | undefined,
  ): Promise<DocumentData[] | null> {
    return getDocs(
      query(
        collection(this.firestore, collectionName),
        and(
          or(
            and(
              // query as-is:
              where("name", ">=", searchTerm),
              where("name", "<=", searchTerm + "\uf8ff"),
            ),
            and(
              // capitalize first letter:
              where(
                "name",
                ">=",
                searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1),
              ),
              where(
                "name",
                "<=",
                searchTerm.charAt(0).toUpperCase() +
                  searchTerm.slice(1) +
                  "\uf8ff",
              ),
            ),
            and(
              // lowercase:
              where("name", ">=", searchTerm.toLowerCase()),
              where("name", "<=", searchTerm.toLowerCase() + "\uf8ff"),
            ),
          ),
          where("privacy", "==", "public"),
          where("type", "in", ["user", "group"]),
          //         or(
          //           where("privacy", "==", "public"),
          //           and(
          //             where("privacy", "==", "friends-only"),
          //             where("associations.accounts", "array-contains", userId),
          //           ),
          //           and(
          //             where("privacy", "==", "groups-only"),
          //             where("associations.accounts", "array-contains", userId),
          //           ),
          //         ),
        ),
      ),
    )
      .then((querySnapshot) => {
        return this.processFirebaseData(querySnapshot);
      })
      .catch((error) => {
        throw new FirebaseError(
          "get-document-error",
          `Error getting document: ${error}`,
        );
      });
  }

  /**
   * Deletes a document at the given path in Firestore.
   *
   * @param docPath The full path to the document, including its ID.
   */
  async deleteDocumentAtPath(docPath: string): Promise<void> {
    const documentRef = doc(this.firestore, docPath);
    await deleteDoc(documentRef);
  }

  /**
   * Retrieves documents from a relatedAccounts sub-collection for a given account.
   *
   * @param {string} accountId - ID of the account.
   * @returns {Promise<Partial<any>[]>} - Returns an array of related accounts.
   */
  async getRelatedAccounts(
    accountId: string,
  ): Promise<Partial<RelatedAccount>[]> {
    try {
      const relatedAccountsRef = collection(
        this.firestore,
        `accounts/${accountId}/relatedAccounts`,
      );
      const querySnapshot = await getDocs(relatedAccountsRef);
      return this.processFirebaseData(querySnapshot);
    } catch (error) {
      throw new FirebaseError(
        "get-document-error",
        `Error getting documents: ${error}`,
      );
    }
  }

  // Firebase Query Logic (Ends) //

  // Helper Functions (Start) //
  /**
   * Processes Firebase data and returns it in a structured format.
   *
   * @param {QuerySnapshot | DocumentSnapshot} querySnapshot - Snapshot of the data from Firebase.
   * @returns {any} - Returns an array of documents if multiple documents are found, a single document if one is found, or null if none are found.
   */
  processFirebaseData(querySnapshot: any): any[] {
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));
    }
    return []; // Return an empty array if no documents found
  }
  // Helper Functions (End) //
}
