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
  DocumentData,
  Firestore,
  onSnapshot,
  QuerySnapshot,
  or,
  and,
  DocumentSnapshot,
} from "firebase/firestore";
import {BehaviorSubject, Observable, combineLatest, map, switchMap} from "rxjs";
import {AppGroup} from "../../models/group.model";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  /**
   * A BehaviorSubject that holds an array of objects, each representing a Firestore collection to listen to.
   * Each object contains the name of the collection and an array of document ids to listen to in that collection.
   *
   * The BehaviorSubject is initialized with an empty array, but can be updated with new collections and ids to listen to.
   *
   * Example:
   * [
   *   {
   *     collectionName: "users",
   *     ids: ["user1", "user2"],
   *   },
   *   {
   *     collectionName: "groups",
   *     ids: ["group"],
   *   },
   * ]
   *
   * @private
   * @type {BehaviorSubject<{collectionName: string; ids: string[]}[]>}
   */
  private collectionsSubject = new BehaviorSubject<
    {collectionName: string; ids: string[]}[]
  >([]);
  firestore: Firestore;
  errorHandler: any;

  constructor() {
    this.firestore = getFirestore();
  }

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

  async addDocument(
    collectionName: string,
    documentData: any,
  ): Promise<string | null> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const documentRef = await addDoc(collectionRef, documentData);

      return documentRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  async updateDocument(
    collectionName: string,
    documentId: string,
    updatedData: any,
  ) {
    try {
      const documentRef = doc(this.firestore, collectionName, documentId);
      await setDoc(documentRef, updatedData, {merge: true});
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  async deleteDocument(collectionName: string, documentId: string) {
    try {
      const documentRef = doc(this.firestore, collectionName, documentId);
      await deleteDoc(documentRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

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

  searchByName(
    collectionName: string,
    searchTerm: string,
  ): Promise<DocumentData[] | null> {
    return getDocs(
      query(
        collection(this.firestore, collectionName),
        or(
          // query as-is:
          and(
            where("name", ">=", searchTerm),
            where("name", "<=", searchTerm + "\uf8ff"),
          ),
          // capitalize first letter:
          and(
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
          // lowercase:
          and(
            where("name", ">=", searchTerm.toLowerCase()),
            where("name", "<=", searchTerm.toLowerCase() + "\uf8ff"),
          ),
        ),
      ),
    )
      .then((querySnapshot) => {
        return this.processFirebaseData(querySnapshot);
      })
      .catch((error) => {
        console.error("Error retrieving collection: ", error);
        this.errorHandler.handleFirebaseAuthError(error);
        return [];
      });
  }

  processFirebaseData(querySnapshot: QuerySnapshot | DocumentSnapshot): any {
    if (querySnapshot instanceof QuerySnapshot) {
      // Processing for array of documents
      const documents: Partial<any>[] = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data() as Partial<any>;
        data = {...data, id: doc.id};
        documents.push(data);
      });
      return documents;
    } else if (querySnapshot instanceof DocumentSnapshot) {
      // Processing for single document
      if (querySnapshot.exists()) {
        let data = querySnapshot.data() as Partial<any>;
        data = {...data, id: querySnapshot.id};
        return data;
      }
    }
    return null;
  }

  getCollectionsSubject() {
    return this.collectionsSubject;
  }

  /**
   * Listen to multiple documents in multiple Firestore collections.
   * The documents and collections to listen to are determined by the value of collectionsSubject.
   * @param {BehaviorSubject<Object[]>} collectionsSubject - A BehaviorSubject of an array of objects, each containing the name of the collection and the ids of the documents to listen to.
   * @returns {Observable<DocumentData[]>} - An Observable that emits the data of the documents whenever any of them change.
   */
  listenToMultipleDocumentsInMultipleCollections(
    collectionsSubject: BehaviorSubject<
      {collectionName: string; ids: string[]}[]
    >,
  ): Observable<DocumentData[]> {
    return collectionsSubject.pipe(
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
                    }
                    subscriber.next(data);
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
   * Adds an id to the collection with the given name in the collectionsSubject.
   * @param collectionName - The name of the collection to add the id to.
   * @param id - The id to add to the collection.
   */
  addIdToCollection(collectionName: string, id: string): void {
    const currentCollections = this.collectionsSubject.getValue();
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
    this.collectionsSubject.next(currentCollections);
  }

  /**
   * Removes an id from the collection with the given name in the collectionsSubject.
   * @param collectionName - The name of the collection to remove the id from.
   * @param id - The id to remove from the collection.
   */
  removeIdFromCollection(collectionName: string, id: string): void {
    const currentCollections = this.collectionsSubject.getValue();
    const collectionIndex = currentCollections.findIndex(
      (collection) => collection.collectionName === collectionName,
    );
    if (collectionIndex !== -1) {
      // Check if id exists in the array
      if (currentCollections[collectionIndex].ids.includes(id)) {
        currentCollections[collectionIndex].ids = currentCollections[
          collectionIndex
        ].ids.filter((currentId) => currentId !== id);
        this.collectionsSubject.next(currentCollections);
      }
    }
  }
}
