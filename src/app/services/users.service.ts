import {Injectable} from "@angular/core";
import {FirestoreService} from "./firestore.service";
import {User} from "../models/user.model";
import {
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDoc,
  doc,
} from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private collectionName = "users";

  constructor(private firestoreService: FirestoreService) {}

  async createUser(user: User) {
    try {
      await addDoc(
        collection(this.firestoreService.firestore, this.collectionName),
        user,
      );
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async getUser(userId: string) {
    try {
      const docSnap = await getDoc(
        doc(this.firestoreService.firestore, this.collectionName, userId),
      );
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

  async updateUser(userId: string, user: Partial<User>) {
    try {
      await updateDoc(
        doc(this.firestoreService.firestore, this.collectionName, userId),
        user,
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  async deleteUser(userId: string) {
    try {
      await deleteDoc(
        doc(this.firestoreService.firestore, this.collectionName, userId),
      );
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }
}
