import {Injectable} from "@angular/core";
import {FirestoreService} from "./firestore.service";
import {Group} from "../models/group.model";
import {
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDoc,
  doc,
  DocumentData,
} from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class GroupsService {
  private collectionName = "groups";

  constructor(private firestoreService: FirestoreService) {}

  async createGroup(group: Group): Promise<string | null> {
    try {
      const documentRef = await addDoc(
        collection(this.firestoreService.firestore, this.collectionName),
        group,
      );
      return documentRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  async getGroup(groupId: string): Promise<DocumentData | null> {
    try {
      const docSnap = await getDoc(
        doc(this.firestoreService.firestore, this.collectionName, groupId),
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

  async updateGroup(groupId: string, group: Partial<Group>) {
    try {
      await updateDoc(
        doc(this.firestoreService.firestore, this.collectionName, groupId),
        group,
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  async deleteGroup(groupId: string) {
    try {
      await deleteDoc(
        doc(this.firestoreService.firestore, this.collectionName, groupId),
      );
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }
}
