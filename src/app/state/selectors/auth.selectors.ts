// src/app/core/store/auth/auth.selectors.ts

import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AuthState} from "../reducers/auth.reducer";
import {AuthUser} from "../../models/auth-user.model";

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user,
);

export const selectIsLoggedIn = createSelector(
  selectAuthUser,
  (user: AuthUser | null): boolean => !!user,
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading,
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error,
);
