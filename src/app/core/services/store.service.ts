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
import {Account, RelatedAccount} from "../../models/account.model";
import {AuthStoreService} from "./auth-store.service";
import {environment} from "../../../environments/environment";
import {FirestoreService} from "./firestore.service";
import {
  prepareDataForCreate,
  prepareDataForUpdate,
} from "../utils/firebase.util";

@Injectable({
  providedIn: "root",
})
/**
 * Service to manage the state of the application.
 */
export class StoreService {
  /**
   * Subscription to the Firestore collections.
   */
  private collectionsSubscription?: Subscription;
  /**
   * Subjects for each collection in the Firestore database.
   */
  private collectionsSubject: {[key: string]: BehaviorSubject<Partial<any>[]>} =
    {
      accounts: new BehaviorSubject<Partial<Account>[]>([]),
    };
  /**
   * Observable of the accounts collection.
   */
  accounts$: Observable<Partial<Account>[]> =
    this.collectionsSubject["accounts"].asObservable();

  private relatedAccountsSubject = new BehaviorSubject<
    Partial<RelatedAccount>[]
  >([]);

  // Observable exposed to components
  public relatedAccounts$ = this.relatedAccountsSubject.asObservable();

  /**
   * Constructor for the StoreService.
   * @param {AuthStoreService} authStoreService - Service for managing authentication state.
   * @param {FirestoreService} firestoreService - Service for interacting with Firestore.
   */
  constructor(
    private authStoreService: AuthStoreService,
    private firestoreService: FirestoreService,
  ) {
    this.initSubscriptions();
    this.loadInitialData();
  }

  private initSubscriptions() {
    this.collectionsSubscription = this.firestoreService
      .listenToMultipleDocumentsInMultipleCollections()
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
          );
        }
      });
  }

  /**
   * Loads the initial data for the application.
   */

  loadInitialData() {
    this.authStoreService.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.firestoreService.addIdToCollection("accounts", authUser.uid);
        this.getAndSortRelatedAccounts(authUser.uid);
      } else {
        this.collectionsSubscription?.unsubscribe();
        this.firestoreService.clearCollectionIdsData();
        this.clearCollectionsData();
      }
    });
  }

  private async appendRelatedAccountsToAccount(
    accountId: string,
    relatedAccounts: Partial<RelatedAccount>[],
  ) {
    try {
      const account = await this.firestoreService.getDocument(
        "accounts",
        accountId,
      );
      if (account) {
        account["relatedAccounts"] = relatedAccounts;
        this.updateDocInState("accounts", account);
        this.relatedAccountsSubject.next(relatedAccounts); // May Remove this Overserver
      }
    } catch (error) {
      this.handleError(error, true);
    }
  }

  getAndSortRelatedAccounts(accountId: string) {
    this.firestoreService
      .getRelatedAccounts(accountId)
      .then((relatedAccounts) => {
        relatedAccounts.sort((a, b) => {
          const nameA = a["name"] || ""; // Default to empty string if null/undefined
          const nameB = b["name"] || "";
          return nameA.localeCompare(nameB);
        });
        this.appendRelatedAccountsToAccount(accountId, relatedAccounts);
      })
      .catch((error) => this.handleError(error, true));
  }

  /**
   * Retrieves the current value of a specified collection from the subject.
   *
   * @param {string} collectionName - Name of the collection to retrieve.
   * @returns {any[]} - Returns the current value of the specified collection.
   */
  getCollection(collectionName: string) {
    return this.collectionsSubject[collectionName]?.getValue();
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
    this.firestoreService
      .searchAccountByName(
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
        if (!environment.production) {
          console.log(
            "Firestore",
            this.firestoreService.getCollectionsSubject().getValue(),
            docs,
            "Accounts",
            this.collectionsSubject["accounts"].getValue(),
          );
        }
      });
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
   * Updates a document at a specific path in Firestore.
   * @param docPath The path to the document in Firestore.
   * @param updatedData The data to update the document with.
   */
  async updateDocAtPath(docPath: string, updatedData: any): Promise<void> {
    try {
      await this.firestoreService.setDocument(
        docPath,
        prepareDataForUpdate(
          updatedData,
          this.authStoreService.getCurrentUser()?.uid,
        ),
        {
          merge: true,
        },
      );
      console.log("Document updated successfully at path:", docPath);
    } catch (error) {
      console.error("Error updating document at path:", docPath, error);
    }
  }

  /**
   * Updates a document and updates it in the state.
   * @param {string} collectionName - The name of the collection that the document is in.
   * @param {Partial<any>} doc - The document to update.
   */
  setDoc(collectionName: string, doc: Partial<any>) {
    this.firestoreService.setDocument(
      collectionName + "/" + doc["id"],
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
   * Deletes a document at the specified path in Firestore.
   *
   * @param docPath The path to the document to delete. It should include both the collection and the document ID.
   *                For example, "accounts/{accountId}/relatedAccounts/{relatedAccountId}"
   */
  async deleteDocAtPath(docPath: string): Promise<void> {
    try {
      await this.firestoreService.deleteDocumentAtPath(docPath);
      // Optionally, handle any post-deletion logic or state updates here
      console.log(`Document at path ${docPath} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting document at path: ", docPath, error);
      // Handle errors appropriately
    }
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
      // Preserve the relatedAccounts from the existing document
      const existingDoc = currentState[docIndex];
      const updatedDoc = {
        ...existingDoc,
        ...doc,
        relatedAccounts: existingDoc["relatedAccounts"],
      };
      currentState[docIndex] = updatedDoc;
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
    const currentState = this.collectionsSubject[collectionName]?.getValue();
    const updatedState = currentState?.map((d) =>
      d["id"] === doc["id"] ? {...d, ...doc} : d,
    );
    this.collectionsSubject[collectionName]?.next(updatedState);
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

  private handleError(error: any, throwBack = false): void {
    console.error("Firestore Service Error: ", error);
    if (throwBack) throw error;
  }

  /**
   * Logs changes to the state.
   * @param {string} collection - The name of the collection that changed.
   * @param {any} newValue - The new value of the collection.
   * @param {any} currentState - The current state of the collection.
   * @param {any} updatedState - The updated state of the collection.
   */
  private logChange(
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
