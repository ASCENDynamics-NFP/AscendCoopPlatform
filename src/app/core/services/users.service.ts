import {Injectable} from "@angular/core";
import {FirestoreService} from "./firestore.service";
import {AppUser} from "../../models/user.model";
import {
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
  or,
  and,
} from "firebase/firestore";
import {
  prepareDataForCreate,
  prepareDataForUpdate,
} from "../utils/firebase.util";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private collectionName = "users";

  constructor(private firestoreService: FirestoreService) {}

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
    if (!user.id) throw new Error("User must have a id");
    try {
      await updateDoc(
        doc(this.firestoreService.firestore, this.collectionName, user.id),
        prepareDataForUpdate(user, user.id),
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
        const data = doc.data() as AppUser;
        data.id = doc.id; // add this line
        documents.push(data);
      });
      return documents;
    } catch (error) {
      console.error("Error retrieving collection: ", error);
      return null;
    }
  }

  searchUsersByName(searchTerm: string): Promise<DocumentData[] | null> {
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
}
