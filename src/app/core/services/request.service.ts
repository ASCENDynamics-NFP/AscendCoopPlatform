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
import {
  doc,
  updateDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {AppRequest} from "../../models/request.model";
import {
  prepareDataForCreate,
  prepareDataForUpdate,
} from "../utils/firebase.util";
import {LoadingController} from "@ionic/angular";
import {ErrorHandlerService} from "./error-handler.service";
import {SuccessHandlerService} from "./success-handler.service";
import {AuthStoreService} from "./auth-store.service";

@Injectable({
  providedIn: "root",
})
export class RequestService {
  private collectionName = "requests";

  constructor(
    private firestoreService: FirestoreService,
    private authStoreService: AuthStoreService,
    private loadingController: LoadingController,
    private errorHandler: ErrorHandlerService,
    private successHandler: SuccessHandlerService,
  ) {}

  async sendRequest(requestData: Partial<AppRequest>) {
    const loading = await this.loadingController.create();
    await loading.present();
    return await addDoc(
      collection(this.firestoreService.firestore, this.collectionName),
      prepareDataForCreate(
        requestData,
        this.authStoreService.getCurrentUser()?.uid,
      ),
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

  async updateRequestStatus(id: string | null, status: string) {
    if (!id) throw new Error("Id must be provided");
    const loading = await this.loadingController.create();
    await loading.present();
    await updateDoc(
      doc(this.firestoreService.firestore, this.collectionName, id),
      prepareDataForUpdate(
        {status},
        this.authStoreService.getCurrentUser()?.uid,
      ),
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

  async getRequestsByReceiverId(receiverId: string) {
    const loading = await this.loadingController.create();
    await loading.present();
    return await getDocs(
      query(
        collection(this.firestoreService.firestore, this.collectionName),
        where("receiverId", "==", receiverId),
      ),
    )
      .then((querySnapshot) => {
        let requests: AppRequest[] = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const data = doc.data() as AppRequest;
          data.id = doc.id; // add this line
          requests.push(data);
        });
        return requests;
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
        return [];
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async getProfile(friendId: string | undefined) {
    if (!friendId) throw new Error("Friend id must be provided");
    const loading = await this.loadingController.create();
    await loading.present();
    return await getDoc(doc(this.firestoreService.firestore, "users", friendId))
      .then((doc) => {
        this.successHandler.handleSuccess("Profile data fetched successfully!");
        if (doc.exists()) {
          return doc.data();
        } else {
          console.log("No such profile exists!");
          return null;
        }
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
        // console.error("Error getting profile: ", error);
        return null;
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
