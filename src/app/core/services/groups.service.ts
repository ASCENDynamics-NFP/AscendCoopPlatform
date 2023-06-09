import {Injectable} from "@angular/core";
import {FirestoreService} from "./firestore.service";
import {Group} from "../../models/group.model";
import {
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  doc,
  DocumentData,
  query,
  where,
  or,
  and,
} from "firebase/firestore";
import {
  prepareDataForCreate,
  prepareDataForUpdate,
} from "../utils/firebase.util";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class GroupsService {
  private collectionName = "groups";

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
  ) {}

  async createGroup(group: Group): Promise<string | null> {
    try {
      const documentRef = await addDoc(
        collection(this.firestoreService.firestore, this.collectionName),
        prepareDataForCreate(group, this.authService.getCurrentUser()?.uid),
      );
      return documentRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  async getGroup(groupId: string | null): Promise<DocumentData | null> {
    if (!groupId) throw new Error("Group must have a groupId");
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
        prepareDataForUpdate(group, this.authService.getCurrentUser()?.uid),
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

  searchGroups(searchTerm: string): Promise<DocumentData[] | null> {
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
        const documents: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          documents.push(doc.data());
        });
        return documents;
      })
      .catch((error) => {
        console.error("Error retrieving collection: ", error);
        return null;
      });
  }

  async getGroups(): Promise<DocumentData[] | null> {
    return getDocs(
      collection(this.firestoreService.firestore, this.collectionName),
    )
      .then((querySnapshot) => {
        const documents: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          documents.push(doc.data());
        });
        return documents;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }
}
