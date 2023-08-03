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
import {FirestoreService} from "./firestore.service";
import {AppUser} from "../../models/user.model";
import {
  collection,
  updateDoc,
  deleteDoc,
  getDoc,
  doc,
  where,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
  or,
  and,
  DocumentSnapshot,
  QuerySnapshot,
  // onSnapshot,
} from "firebase/firestore";
import {
  prepareDataForCreate,
  prepareDataForUpdate,
} from "../utils/firebase.util";
import {LoadingController} from "@ionic/angular";
import {ErrorHandlerService} from "./error-handler.service";
import {SuccessHandlerService} from "./success-handler.service";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private collectionName = "users";

  constructor(
    private firestoreService: FirestoreService,
    private loadingController: LoadingController,
    private errorHandler: ErrorHandlerService,
    private successHandler: SuccessHandlerService,
  ) {}

  createUser(user: Partial<AppUser>): void {
    if (!user.id) throw new Error("User must have a id");
    // Create a user document in Firestore
    setDoc(
      doc(this.firestoreService.firestore, "users", user.id),
      prepareDataForCreate(user, user.id),
    )
      .then(() => {
        console.log("User successfully written!");
      })
      .catch((error) => {
        console.error("Error creating user: ", error);
      });
  }

  async getUserById(userId: string | null): Promise<AppUser | null> {
    if (!userId) {
      this.errorHandler.handleFirebaseAuthError({
        code: "",
        message: "User id must be provided",
      });
      return null;
    }
    const loading = await this.loadingController.create();
    await loading.present();
    return await getDoc(
      doc(this.firestoreService.firestore, this.collectionName, userId),
    )
      .then((querySnapshot) => {
        return this.processFirebaseData(querySnapshot);
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
        return [];
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  // This method will now return an unsubscribe function
  // observeUserById(
  //   userId: string | null,
  //   callback: (user: Partial<AppUser> | null) => void,
  // ): () => void {
  //   if (!userId) {
  //     this.errorHandler.handleFirebaseAuthError({
  //       code: "",
  //       message: "User id must be provided",
  //     });
  //     return () => {};
  //   }

  //   return onSnapshot(
  //     doc(this.firestoreService.firestore, this.collectionName, userId),
  //     (docSnapshot) => {
  //       callback(this.processFirebaseData(docSnapshot));
  //     },
  //     (error) => {
  //       this.errorHandler.handleFirebaseAuthError(error);
  //     },
  //   );
  // }

  async updateUser(user: Partial<AppUser>) {
    if (!user.id) throw new Error("User must have a id");
    const loading = await this.loadingController.create();
    await loading.present();
    await updateDoc(
      doc(this.firestoreService.firestore, this.collectionName, user.id),
      prepareDataForUpdate(user, user.id),
    )
      .then(() => {
        this.successHandler.handleSuccess("User updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
        this.errorHandler.handleFirebaseAuthError(error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async deleteUser(userId: string) {
    await deleteDoc(
      doc(this.firestoreService.firestore, this.collectionName, userId),
    )
      .then(() => {
        this.successHandler.handleSuccess("Group deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
        this.errorHandler.handleFirebaseAuthError(error);
        return null;
      });
  }

  async getUsersWithCondition(
    field: string,
    condition: any,
    value: any,
    orderByField: string = "email",
    recordLimit: number = 1,
  ): Promise<AppUser[] | null> {
    return await getDocs(
      query(
        collection(this.firestoreService.firestore, this.collectionName),
        where(field, condition, value),
        orderBy(orderByField),
        limit(recordLimit),
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

  searchUsersByName(searchTerm: string): Promise<AppUser[] | null> {
    return getDocs(
      query(
        collection(this.firestoreService.firestore, this.collectionName),
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
        return null;
      });
  }

  processFirebaseData(querySnapshot: QuerySnapshot | DocumentSnapshot): any {
    if (querySnapshot instanceof QuerySnapshot) {
      // Processing for array of documents
      const documents: Partial<AppUser>[] = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data() as Partial<AppUser>;
        data = {...data, id: doc.id};
        documents.push(data);
      });
      return documents;
    } else if (querySnapshot instanceof DocumentSnapshot) {
      // Processing for single document
      if (querySnapshot.exists()) {
        let data = querySnapshot.data() as Partial<AppUser>;
        data = {...data, id: querySnapshot.id};
        return data;
      }
    }
    return null;
  }
}
