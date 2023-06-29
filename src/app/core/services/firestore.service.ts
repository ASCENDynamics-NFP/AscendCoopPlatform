import {Injectable} from "@angular/core";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  DocumentData,
  Firestore,
} from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  firestore: Firestore;
  constructor() {
    this.firestore = getFirestore();
  }

  async getDocument(collectionName: string, documentId: string) {
    try {
      const documentRef = doc(this.firestore, collectionName, documentId);
      const documentSnap = await getDoc(documentRef);

      if (documentSnap.exists()) {
        return documentSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving document: ", error);
      return null;
    }
  }

  async addDocument(
    collectionName: string,
    documentData: any,
  ): Promise<string | null> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const documentRef = await addDoc(collectionRef, documentData);

      return documentRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  async updateDocument(
    collectionName: string,
    documentId: string,
    updatedData: any,
  ) {
    try {
      const documentRef = doc(this.firestore, collectionName, documentId);
      await setDoc(documentRef, updatedData, {merge: true});
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  async deleteDocument(collectionName: string, documentId: string) {
    try {
      const documentRef = doc(this.firestore, collectionName, documentId);
      await deleteDoc(documentRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  getCollectionWithCondition(
    collectionName: string,
    field: string,
    condition: any,
    value: any,
  ): Promise<DocumentData[] | null> {
    return getDocs(
      query(
        collection(this.firestore, collectionName),
        where(field, condition, value),
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
