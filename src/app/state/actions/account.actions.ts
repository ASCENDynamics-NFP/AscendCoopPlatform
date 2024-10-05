// src/app/state/actions/account.actions.ts

import {createAction, props} from "@ngrx/store";
import {Account, RelatedAccount} from "../../models/account.model";

export const clearAccounts = createAction("[Account] Clear Accounts");

// Load Accounts
export const loadAccounts = createAction("[Account] Load Accounts");

export const loadAccountsSuccess = createAction(
  "[Account] Load Accounts Success",
  props<{accounts: Account[]}>(),
);

export const loadAccountsFailure = createAction(
  "[Account] Load Accounts Failure",
  props<{error: any}>(),
);

// Load Account by ID
export const loadAccount = createAction(
  "[Account] Load Account",
  props<{accountId: string}>(),
);

export const loadAccountSuccess = createAction(
  "[Account] Load Account Success",
  props<{account: Account}>(),
);

export const loadAccountFailure = createAction(
  "[Account] Load Account Failure",
  props<{error: any}>(),
);

// Set Selected Account
export const setSelectedAccount = createAction(
  "[Account] Set Selected Account",
  props<{accountId: string}>(),
);

// Create Account
export const createAccount = createAction(
  "[Account] Create Account",
  props<{account: Account}>(),
);

export const createAccountSuccess = createAction(
  "[Account] Create Account Success",
  props<{account: Account}>(),
);

export const createAccountFailure = createAction(
  "[Account] Create Account Failure",
  props<{error: any}>(),
);

// Update Account
export const updateAccount = createAction(
  "[Account] Update Account",
  props<{account: Account}>(),
);

export const updateAccountSuccess = createAction(
  "[Account] Update Account Success",
  props<{account: Account}>(),
);

export const updateAccountFailure = createAction(
  "[Account] Update Account Failure",
  props<{error: any}>(),
);

// Delete Account
export const deleteAccount = createAction(
  "[Account] Delete Account",
  props<{accountId: string}>(),
);

export const deleteAccountSuccess = createAction(
  "[Account] Delete Account Success",
  props<{accountId: string}>(),
);

export const deleteAccountFailure = createAction(
  "[Account] Delete Account Failure",
  props<{error: any}>(),
);

// Search Accounts
export const searchAccounts = createAction(
  "[Account] Search Accounts",
  props<{query: string}>(),
);

export const searchAccountsSuccess = createAction(
  "[Account] Search Accounts Success",
  props<{accounts: Account[]}>(),
);

export const searchAccountsFailure = createAction(
  "[Account] Search Accounts Failure",
  props<{error: any}>(),
);

// Add the createRelatedAccount action
export const createRelatedAccount = createAction(
  "[Account] Create Related Account",
  props<{accountId: string; relatedAccount: RelatedAccount}>(),
);

export const createRelatedAccountSuccess = createAction(
  "[Account] Create Related Account Success",
  props<{relatedAccount: RelatedAccount}>(),
);

export const createRelatedAccountFailure = createAction(
  "[Account] Create Related Account Failure",
  props<{error: any}>(),
);

// Delete Related Account
export const deleteRelatedAccount = createAction(
  "[Account] Delete Related Account",
  props<{accountId: string; relatedAccountId: string}>(),
);

export const deleteRelatedAccountSuccess = createAction(
  "[Account] Delete Related Account Success",
  props<{accountId: string; relatedAccountId: string}>(),
);

export const deleteRelatedAccountFailure = createAction(
  "[Account] Delete Related Account Failure",
  props<{error: any}>(),
);

// Load Related Accounts
export const loadRelatedAccounts = createAction(
  "[Account] Load Related Accounts",
  props<{accountId: string}>(),
);

export const loadRelatedAccountsSuccess = createAction(
  "[Account] Load Related Accounts Success",
  props<{relatedAccounts: RelatedAccount[]}>(),
);

export const loadRelatedAccountsFailure = createAction(
  "[Account] Load Related Accounts Failure",
  props<{error: any}>(),
);

// Update Related Account
export const updateRelatedAccount = createAction(
  "[Account] Update Related Account",
  props<{accountId: string; relatedAccount: RelatedAccount}>(),
);

export const updateRelatedAccountSuccess = createAction(
  "[Account] Update Related Account Success",
  props<{relatedAccount: RelatedAccount}>(),
);

export const updateRelatedAccountFailure = createAction(
  "[Account] Update Related Account Failure",
  props<{error: any}>(),
);
