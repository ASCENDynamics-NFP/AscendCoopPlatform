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
  and,
  or,
  onSnapshot,
} from "firebase/firestore";
import {AppRelationship} from "../../models/relationship.model";
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
export class RelationshipsCollectionService {
  private collectionName = "relationships";

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private errorHandler: ErrorHandlerService,
    private successHandler: SuccessHandlerService,
  ) {}

  async sendRequest(requestData: Partial<AppRelationship>) {
    const loading = await this.loadingController.create();
    await loading.present();
    return await addDoc(
      collection(this.firestoreService.firestore, this.collectionName),
      prepareDataForCreate(requestData, this.authService.getCurrentUser()?.uid),
    )
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
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
      prepareDataForUpdate({status}, this.authService.getCurrentUser()?.uid),
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
        let requests: AppRelationship[] = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          const data = doc.data() as AppRelationship;
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

  async getRelationships(senderOrReceiverId: string | null) {
    if (!senderOrReceiverId)
      this.errorHandler.handleFirebaseAuthError({
        code: "",
        message: "User id must be provided",
      });
    const loading = await this.loadingController.create();
    await loading.present();
    return await getDocs(
      query(
        collection(this.firestoreService.firestore, this.collectionName),
        and(
          where("status", "in", ["pending", "accepted"]),
          or(
            where("senderId", "==", senderOrReceiverId),
            where("receiverId", "==", senderOrReceiverId),
          ),
        ),
      ),
    )
      .then((querySnapshot) => {
        let requests: AppRelationship[] = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          const data = doc.data() as AppRelationship;
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
}
