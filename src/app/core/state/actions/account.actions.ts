import {createAction, props} from "@ngrx/store";
import {Account} from "../../../models/account.model";

// Define an action for loading account
export const loadAccount = createAction(
  "[Account] Load Account",
  props<{accountId: string}>(),
);

// Define an action for successfully loading account
export const loadAccountSuccess = createAction(
  "[Account] Load Account Success",
  props<{account: Account}>(),
);

// Define an action for a failure in loading account
export const loadAccountFailure = createAction(
  "[Account] Load Account Failure",
  props<{error: any}>(),
);
