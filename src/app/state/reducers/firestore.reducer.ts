/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
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
    documents: {...state.documents, [document["id"]]: document},
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
