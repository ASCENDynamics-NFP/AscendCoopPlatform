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
import {AppGroup} from "../../models/group.model";
import {
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  or,
  and,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import {
  prepareDataForCreate,
  prepareDataForUpdate,
} from "../utils/firebase.util";
import {AuthService} from "./auth.service";
import {LoadingController} from "@ionic/angular";
import {ErrorHandlerService} from "./error-handler.service";
import {SuccessHandlerService} from "./success-handler.service";

@Injectable({
  providedIn: "root",
})
export class GroupsService {
  private collectionName = "groups";

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private loadingController: LoadingController,
    private errorHandler: ErrorHandlerService,
    private successHandler: SuccessHandlerService,
  ) {}

  async createGroup(group: Partial<AppGroup>): Promise<string | null> {
    const loading = await this.loadingController.create();
    await loading.present();
    const userId = this.authService.getCurrentUser()?.uid;
    if (userId) {
      group.admins = [userId];
      group.members = [userId];
    }
    group.logoImage = "assets/icon/favicon.png";
    group.heroImage = "assets/image/orghero.png";
    return await addDoc(
      collection(this.firestoreService.firestore, this.collectionName),
      prepareDataForCreate(group, userId),
    )
      .then((docRef) => {
        this.successHandler.handleSuccess("Request sent successfully!");
        return docRef.id;
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        this.errorHandler.handleFirebaseAuthError(error);
        return null;
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async getGroupById(
    groupId: string | null,
  ): Promise<Partial<AppGroup> | null> {
    if (!groupId) {
      this.errorHandler.handleFirebaseAuthError({
        code: "",
        message: "Group id must be provided",
      });
      return null;
    }
    const loading = await this.loadingController.create();
    await loading.present();
    return await getDoc(
      doc(this.firestoreService.firestore, this.collectionName, groupId),
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

  async updateGroup(group: Partial<AppGroup>) {
    if (!group.id) throw new Error("Group must have a groupId");
    const loading = await this.loadingController.create();
    await loading.present();
    await updateDoc(
      doc(this.firestoreService.firestore, this.collectionName, group.id),
      prepareDataForUpdate(group, this.authService.getCurrentUser()?.uid),
    )
      .then(() => {
        this.successHandler.handleSuccess(
          "Request status updated successfully!",
        );
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
        this.errorHandler.handleFirebaseAuthError(error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async deleteGroup(groupId: string) {
    await deleteDoc(
      doc(this.firestoreService.firestore, this.collectionName, groupId),
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

  searchGroups(searchTerm: string): Promise<AppGroup[] | []> {
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
        this.errorHandler.handleFirebaseAuthError(error);
        return [];
      });
  }

  async getGroups(): Promise<AppGroup[] | []> {
    const loading = await this.loadingController.create();
    await loading.present();
    return getDocs(
      collection(this.firestoreService.firestore, this.collectionName),
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

  processFirebaseData(querySnapshot: QuerySnapshot | DocumentSnapshot): any {
    if (querySnapshot instanceof QuerySnapshot) {
      // Processing for array of documents
      const documents: Partial<AppGroup>[] = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data() as Partial<AppGroup>;
        data = {...data, id: doc.id};
        documents.push(data);
      });
      return documents;
    } else if (querySnapshot instanceof DocumentSnapshot) {
      // Processing for single document
      if (querySnapshot.exists()) {
        let data = querySnapshot.data() as Partial<AppGroup>;
        data = {...data, id: querySnapshot.id};
        return data;
      }
    }
    return null;
  }
}
