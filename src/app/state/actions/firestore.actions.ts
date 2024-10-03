// src/app/state/firestore/firestore.actions.ts
import {createAction, props} from "@ngrx/store";
import {DocumentData} from "firebase/firestore";

export const loadDocument = createAction(
  "[Firestore] Load Document",
  props<{collectionName: string; documentId: string}>(),
);

export const loadDocumentSuccess = createAction(
  "[Firestore] Load Document Success",
  props<{document: DocumentData}>(),
);

export const loadDocumentFailure = createAction(
  "[Firestore] Load Document Failure",
  props<{error: any}>(),
);

// Similar actions for add, update, delete documents
