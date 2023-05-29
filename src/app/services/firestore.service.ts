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
} from "firebase/firestore";

const db = getFirestore();

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  firestore = db;
  constructor() {}

  async getDocument(collectionName: string, documentId: string) {
    try {
      const documentRef = doc(db, collectionName, documentId);
      const documentSnap = await getDoc(documentRef);

      if (documentSnap.exists()) {
        return documentSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving document: ", error);
    }
  }

  async addDocument(collectionName: string, documentData: any) {
    try {
      const collectionRef = collection(db, collectionName);
      const documentRef = await addDoc(collectionRef, documentData);

      return documentRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async updateDocument(
    collectionName: string,
    documentId: string,
    updatedData: any,
  ) {
    try {
      const documentRef = doc(db, collectionName, documentId);
      await setDoc(documentRef, updatedData, {merge: true});
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  async deleteDocument(collectionName: string, documentId: string) {
    try {
      const documentRef = doc(db, collectionName, documentId);
      await deleteDoc(documentRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  async getCollectionWithCondition(
    collectionName: string,
    field: string,
    condition: any,
    value: any,
  ) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, where(field, condition, value));
      const querySnapshot = await getDocs(q);
      const documents: any[] = [];
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      return documents;
    } catch (error) {
      console.error("Error retrieving collection: ", error);
    }
  }
}
