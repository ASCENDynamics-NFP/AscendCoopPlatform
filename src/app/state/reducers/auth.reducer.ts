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
