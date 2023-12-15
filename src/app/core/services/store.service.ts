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
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Account} from "../../models/account.model";
import {AuthStoreService} from "./auth-store.service";
import {environment} from "../../../environments/environment";
import {FirestoreService} from "./firestore.service";
import {
  prepareDataForCreate,
  prepareDataForUpdate,
} from "../utils/firebase.util";
import {AppRelationship} from "../../models/relationship.model";

@Injectable({
  providedIn: "root",
})
/**
 * Service to manage the state of the application.
 */
export class StoreService {
  updatePrivacySetting(selectedPrivacySetting: string) {
    throw new Error("Method not implemented.");
  }
  /**
   * Subscription to the Firestore collections.
   */
  private collectionsSubscription: Subscription;
  /**
   * Subjects for each collection in the Firestore database.
   */
  private collectionsSubject: {[key: string]: BehaviorSubject<Partial<any>[]>} =
    {
      accounts: new BehaviorSubject<Partial<Account>[]>([]),
      relationships: new BehaviorSubject<Partial<AppRelationship>[]>([]),
    };
  /**
   * Observable of the accounts collection.
   */
  accounts$: Observable<Partial<Account>[]> =
    this.collectionsSubject["accounts"].asObservable();

  /**
   * Observable of the relationships collection.
   */
  relationships$ = this.collectionsSubject["relationships"].asObservable();

  /**
   * Constructor for the StoreService.
   * @param {AuthStoreService} authStoreService - Service for managing authentication state.
   * @param {FirestoreService} firestoreService - Service for interacting with Firestore.
   */
  constructor(
    private authStoreService: AuthStoreService,
    private firestoreService: FirestoreService,
  ) {
    this.collectionsSubscription = this.firestoreService
      .listenToMultipleDocumentsInMultipleCollections(
        this.firestoreService.getCollectionsSubject(),
      )
      .subscribe((data) => {
        // Get the current collections from the subject
        const currentCollections = this.firestoreService
          .getCollectionsSubject()
          .getValue();

        // Go through each document
        data.forEach((doc) => {
          doc = {...doc, id: doc["id"]};
          // Check each collection
          currentCollections.forEach((collection) => {
            // If the collection's ids include the document's id, add the document to the corresponding array
            if (collection.ids.includes(doc["id"])) {
              this.addDocToState(collection.collectionName, doc);
            }
          });
        });
        if (!environment.production) {
          console.log(
            "Firestore",
            this.firestoreService.getCollectionsSubject().getValue(),
            data,
            "Accounts",
            this.collectionsSubject["accounts"].getValue(),
            "Users",
            this.collectionsSubject["users"].getValue(),
          );
        }
      });
    this.loadInitialData();
  }

  /**
   * Loads the initial data for the application.
   */
  loadInitialData() {
    const currentUser = this.authStoreService.getCurrentUser();
    this.authStoreService.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.firestoreService.addIdToCollection("accounts", authUser.uid);
      } else {
        this.collectionsSubscription?.unsubscribe();
        // clear all existing state data when user logs out
        this.firestoreService.clearCollectionIdsData();
        this.clearCollectionsData();
      }
    });
    if (currentUser) {
      this.firestoreService
        .getCollectionWithCondition(
          "accounts",
          "group.admins",
          "array-contains",
          currentUser.uid,
        )
        .then((accounts) => {
          if (accounts) {
            accounts.forEach((account) => {
              this.addDocToState("accounts", account as Partial<any>);
              this.firestoreService.addIdToCollection(
                "accounts",
                account["id"],
              );
            });
          }
        });
      this.getDocsWithSenderOrRecieverId("relationships", currentUser.uid);
    }
  }

  /**
   * Retrieves documents from a specified collection where either the sender or receiver ID matches the provided ID.
   * After retrieval, each document is added to the state.
   *
   * @param {string} collectionName - Name of the collection to query.
   * @param {string} senderOrRecieverId - ID to match against sender or receiver fields in the collection.
   */
  getDocsWithSenderOrRecieverId(
    collectionName: string,
    senderOrRecieverId: string,
  ) {
    this.firestoreService
      .getDocsWithSenderOrRecieverId(collectionName, senderOrRecieverId)
      .then((relationships) => {
        relationships.forEach((relationship) => {
          this.addDocToState(collectionName, relationship);
        });
      });
  }

  /**
   * Retrieves the current value of a specified collection from the subject.
   *
   * @param {string} collectionName - Name of the collection to retrieve.
   * @returns {any[]} - Returns the current value of the specified collection.
   */
  getCollection(collectionName: string) {
    return this.collectionsSubject[collectionName].getValue();
  }

  /**
   * Fetches a document by its id and adds it to the state if it doesn't already exist.
   * @param {string} collectionName - The name of the collection to fetch the document from.
   * @param {string | null} docId - The id of the document to fetch and add to the state.
   */
  getDocById(collectionName: string, docId: string | null): void {
    if (!docId) return;

    const currentState = this.collectionsSubject[collectionName].getValue();
    const docExists = currentState.some((doc) => doc["id"] === docId);

    if (!docExists) {
      this.firestoreService.getDocument(collectionName, docId).then((doc) => {
        if (doc) {
          this.addDocToState(collectionName, doc as Partial<any>);
          if (!environment.production) {
            console.log(`Document with id ${docId} added to state.`);
          }
        } else {
          if (!environment.production) {
            console.log(`Document with id ${docId} not found.`);
          }
        }
      });
    } else {
      if (!environment.production) {
        console.log(`Document with id ${docId} already exists in state.`);
      }
    }
  }

  /**
   * Searches for documents by name and adds them to the state.
   * @param {string} collectionName - The name of the collection to search in.
   * @param {string} name - The name to search for.
   */
  searchDocsByName(collectionName: string, name: string): void {
    if (collectionName === "users") {
      this.firestoreService
        .searchUserByName(
          collectionName,
          name,
          this.authStoreService.getCurrentUser()?.uid,
        )
        .then((docs) => {
          if (docs) {
            docs.forEach((doc) => {
              this.addDocToState(collectionName, doc as Partial<any>);
            });
          }
        });
    } else {
      this.firestoreService.searchByName(collectionName, name).then((docs) => {
        if (docs) {
          docs.forEach((doc) => {
            this.addDocToState(collectionName, doc as Partial<any>);
          });
        }
      });
    }
  }

  /**
   * Creates a new document and adds it to the state.
   * @param {string} collectionName - The name of the collection to add the document to.
   * @param {Partial<any>} doc - The document to create.
   */
  async createDoc(collectionName: string, doc: Partial<any>) {
    let docId = await this.firestoreService.addDocument(
      collectionName,
      prepareDataForCreate(doc, this.authStoreService.getCurrentUser()?.uid),
    );
    if (!docId) throw new Error("Document must have an id");
    this.firestoreService.addIdToCollection(collectionName, docId);
    return docId;
  }

  /**
   * Updates a document and updates it in the state.
   * @param {string} collectionName - The name of the collection that the document is in.
   * @param {Partial<any>} doc - The document to update.
   */
  updateDoc(collectionName: string, doc: Partial<any>) {
    this.firestoreService.updateDocument(
      collectionName,
      doc["id"],
      prepareDataForUpdate(doc, this.authStoreService.getCurrentUser()?.uid),
    );
    this.updateDocInState(collectionName, doc);
  }

  /**
   * Deletes a document and removes it from the state.
   * @param {string} collectionName - The name of the collection that the document is in.
   * @param {string} docId - The id of the document to delete.
   */
  deleteDoc(collectionName: string, docId: string) {
    this.firestoreService.deleteDocument(collectionName, docId);
    this.firestoreService.removeIdFromCollection(collectionName, docId);
    this.removeDocFromState(collectionName, docId);
  }

  /**
   * Adds a document to the state.
   * @param {string} collectionName - The name of the collection that the document is in.
   * @param {Partial<any>} doc - The document to add to the state.
   */
  addDocToState(collectionName: string, doc: Partial<any>) {
    const currentState = this.collectionsSubject[collectionName].getValue();
    const docIndex = currentState.findIndex((d) => d["id"] === doc["id"]);
    if (!environment.production) {
      console.log("StoreService: addDocToState");
      if (docIndex !== -1) {
        console.log("Document already exists in the state, update it");
      }
    }
    if (docIndex !== -1) {
      // Document already exists in the state, update it
      currentState[docIndex] = doc;
    } else {
      // Document doesn't exist in the state, add it
      currentState.push(doc);
    }

    this.collectionsSubject[collectionName].next(currentState);
  }

  /**
   * Updates a document in the state.
   * @param {string} collectionName - The name of the collection that the document is in.
   * @param {Partial<any>} doc - The document to update in the state.
   */
  updateDocInState(collectionName: string, doc: Partial<any>) {
    const currentState = this.collectionsSubject[collectionName].getValue();
    const updatedState = currentState.map((d) =>
      d["id"] === doc["id"] ? {...d, ...doc} : d,
    );
    this.collectionsSubject[collectionName].next(updatedState);
  }

  /**
   * Removes a document from the state.
   * @param {string} collectionName - The name of the collection that the document is in.
   * @param {string} docId - The id of the document to remove from the state.
   */
  removeDocFromState(collectionName: string, docId: string) {
    const currentState = this.collectionsSubject[collectionName].getValue();
    const updatedState = currentState.filter((d) => d["id"] !== docId);
    this.collectionsSubject[collectionName].next(updatedState);
  }

  /**
   * Clears the data in the collectionsSubject for each collection.
   * This method sets the BehaviorSubject's value for each collection to an empty array.
   */
  clearCollectionsData() {
    for (const key in this.collectionsSubject) {
      if (this.collectionsSubject.hasOwnProperty(key)) {
        this.collectionsSubject[key].next([]);
      }
    }
  }

  /**
   * Logs changes to the state.
   * @param {string} collection - The name of the collection that changed.
   * @param {any} newValue - The new value of the collection.
   * @param {any} currentState - The current state of the collection.
   * @param {any} updatedState - The updated state of the collection.
   */
  logChange(
    collection: string,
    newValue: any,
    currentState: any,
    updatedState: any,
  ) {
    if (!environment.production) {
      console.log(
        "StoreService: " + "collectionSubject: ",
        this.firestoreService.getCollectionsSubject().getValue(),
        collection,
        newValue,
        "Previous state",
        currentState,
        "Updated state",
        updatedState,
      );
    }
  }
}
