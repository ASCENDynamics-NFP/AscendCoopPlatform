// src/app/state/firestore/firestore.reducer.ts
import {createReducer, on} from "@ngrx/store";
import * as FirestoreActions from "../actions/firestore.actions";
import {DocumentData} from "firebase/firestore";

export interface FirestoreState {
  documents: {[id: string]: DocumentData};
  loading: boolean;
  error: any;
}

export const initialState: FirestoreState = {
  documents: {},
  loading: false,
  error: null,
};

export const firestoreReducer = createReducer(
  initialState,
  on(FirestoreActions.loadDocument, (state) => ({...state, loading: true})),
  on(FirestoreActions.loadDocumentSuccess, (state, {document}) => ({
    ...state,
    documents: {...state.documents, [document.id]: document},
    loading: false,
    error: null,
  })),
  on(FirestoreActions.loadDocumentFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
  // ...handle other actions similarly
);
