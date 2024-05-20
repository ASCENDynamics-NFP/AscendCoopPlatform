import {createReducer, on} from "@ngrx/store";
import {
  loadAccountFailure,
  loadAccountSuccess,
} from "./../actions/account.actions";
import {Account} from "../../../models/account.model";

// Initial state for the accounts
export interface AccountState {
  account: Account | null;
  loading: boolean;
  error: any;
}

export const initialState: AccountState = {
  account: null,
  loading: false,
  error: null,
};

// Create a reducer function for accounts
const _accountReducer = createReducer(
  initialState,
  on(loadAccountSuccess, (state, {account}) => ({
    ...state,
    account,
    loading: false,
    error: null,
  })),
  on(loadAccountFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
);

// Export the reducer function
export function accountReducer(state: any, action: any) {
  return _accountReducer(state, action);
}
