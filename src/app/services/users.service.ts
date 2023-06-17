import {Injectable} from "@angular/core";
import {FirestoreService} from "./firestore.service";
import {AppUser} from "../models/user.model";
import {
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDoc,
  doc,
  DocumentData,
  where,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
} from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private collectionName = "users";

  constructor(private firestoreService: FirestoreService) {}

  createUser(user: Partial<AppUser>): void {
    if (!user.uid) throw new Error("User must have a uid");
    // Create a user document in Firestore
    setDoc(doc(this.firestoreService.firestore, "users", user.uid), user)
      .then(() => {
        console.log("User successfully written!");
      })
      .catch((error) => {
        console.error("Error creating user: ", error);
      });
  }

  async getUser(userId: any): Promise<DocumentData | null> {
    // if (typeof userId !== "string") {
    // console.error("Error getting document: userId is not a string");
    // return null;
    // }
    try {
      const docSnap = await getDoc(
        doc(this.firestoreService.firestore, this.collectionName, userId),
      );
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  }

  async updateUser(user: Partial<AppUser>) {
    if (!user.uid) throw new Error("User must have a uid");
    try {
      await updateDoc(
        doc(this.firestoreService.firestore, this.collectionName, user?.uid),
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

  async getUsersWithCondition(
    field: string,
    condition: any,
    value: any,
    orderByField: string = "email",
    recordLimit: number = 1,
  ): Promise<DocumentData[] | null> {
    try {
      const collectionRef = collection(
        this.firestoreService.firestore,
        this.collectionName,
      );
      const q = query(
        collectionRef,
        where(field, condition, value),
        orderBy(orderByField),
        limit(recordLimit),
      );
      const querySnapshot = await getDocs(q);
      const documents: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      return documents;
    } catch (error) {
      console.error("Error retrieving collection: ", error);
      return null;
    }
  }
}
