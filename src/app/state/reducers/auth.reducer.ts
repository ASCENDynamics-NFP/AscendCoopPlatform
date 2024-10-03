// src/app/state/reducers/auth.reducer.ts

import {createReducer, on} from "@ngrx/store";
import * as AuthActions from "../actions/auth.actions";
import {AuthUser} from "../../models/auth-user.model";

export interface AuthState {
  user: AuthUser | null;
  error: any;
  loading: boolean;
}

export const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,

  // Start Loading Actions
  on(
    AuthActions.signUp,
    AuthActions.signIn,
    AuthActions.signInWithGoogle,
    AuthActions.signOut,
    AuthActions.sendPasswordResetEmail,
    AuthActions.sendSignInLinkToEmail,
    AuthActions.confirmSignInWithEmailLink,
    AuthActions.processSignInLink,
    AuthActions.initializeAuth,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  // Success Actions
  on(
    AuthActions.signUpSuccess,
    AuthActions.signInSuccess,
    AuthActions.signInWithGoogleSuccess,
    AuthActions.confirmSignInWithEmailLinkSuccess,
    AuthActions.processSignInLinkSuccess,
    (state, {user}) => ({
      ...state,
      user,
      loading: false,
      error: null,
    }),
  ),

  on(AuthActions.signOutSuccess, () => ({
    ...initialState,
  })),

  on(
    AuthActions.sendPasswordResetEmailSuccess,
    AuthActions.sendSignInLinkToEmailSuccess,
    (state) => ({
      ...state,
      loading: false,
      error: null,
    }),
  ),

  // Failure Actions
  on(
    AuthActions.signUpFailure,
    AuthActions.signInFailure,
    AuthActions.signInWithGoogleFailure,
    AuthActions.signOutFailure,
    AuthActions.sendPasswordResetEmailFailure,
    AuthActions.sendSignInLinkToEmailFailure,
    AuthActions.confirmSignInWithEmailLinkFailure,
    AuthActions.processSignInLinkFailure,
    (state, {error}) => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);
