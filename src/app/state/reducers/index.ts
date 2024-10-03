// src/app/state/reducers/index.ts

import {ActionReducerMap} from "@ngrx/store";
import {AuthState, authReducer} from "./auth.reducer";
import {AccountState, accountReducer} from "./account.reducer";
// Other imports...

export interface AppState {
  auth: AuthState;
  account: AccountState;
  // Other states...
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  account: accountReducer,
  // Other reducers...
};
