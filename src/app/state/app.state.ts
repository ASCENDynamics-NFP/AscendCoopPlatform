// src/app/state/app.state.ts
import {AuthState} from "./reducers/auth.reducer";
import {FirestoreState} from "./reducers/firestore.reducer";

export interface AppState {
  auth: AuthState;
  firestore: FirestoreState;
}
