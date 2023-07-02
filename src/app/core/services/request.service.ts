import {Injectable} from "@angular/core";
import {FirestoreService} from "./firestore.service";
import {
  setDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import {AppRequest} from "../../models/request.model";

@Injectable({
  providedIn: "root",
})
export class RequestService {
  private collectionName = "requests";

  constructor(private firestoreService: FirestoreService) {}

  sendRequest(requestBody: AppRequest) {
    setDoc(
      doc(this.firestoreService.firestore, this.collectionName),
      requestBody,
    )
      .then(() => {
        console.log("Request successfully written!");
      })
      .catch((error) => {
        console.error("Error creating request: ", error);
      });
  }

  async updateRequestStatus(id: string | null, status: string) {
    if (!id) throw new Error("Id must be provided");
    try {
      await updateDoc(
        doc(this.firestoreService.firestore, this.collectionName, id),
        {status},
      );
      console.log("Request status updated successfully!");
    } catch (error) {
      console.error("Error updating request status: ", error);
    }
  }

  async getRequestsByReceiverId(receiverId: string) {
    const q = query(
      collection(this.firestoreService.firestore, this.collectionName),
      where("receiverId", "==", receiverId),
    );
    const querySnapshot = await getDocs(q);
    let requests: AppRequest[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      requests.push(doc.data() as AppRequest);
    });
    return requests;
  }

  async getProfile(friendId: string | undefined) {
    if (!friendId) throw new Error("Friend id must be provided");
    try {
      const docSnapshot = await getDoc(
        doc(this.firestoreService.firestore, "users", friendId),
      );
      if (docSnapshot.exists()) {
        console.log("Profile data:", docSnapshot.data());
        // return docSnapshot.data();
      } else {
        console.log("No such profile exists!");
      }
    } catch (error) {
      console.error("Error getting profile: ", error);
    }
  }
}
