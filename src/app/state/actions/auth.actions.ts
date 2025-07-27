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
// src/app/core/store/auth/auth.actions.ts

import {createAction, props} from "@ngrx/store";
import {AuthUser} from "@shared/models/auth-user.model";

export const initializeAuth = createAction("[Auth] Initialize Auth");

export const sendVerificationMail = createAction(
  "[Auth] Send Verification Mail",
  props<{email: string}>(),
);

export const sendVerificationMailSuccess = createAction(
  "[Auth] Send Verification Mail Success",
);

export const sendVerificationMailFailure = createAction(
  "[Auth] Send Verification Mail Failure",
  props<{error: any}>(),
);

export const signUp = createAction(
  "[Auth] Sign Up",
  props<{email: string; password: string}>(),
);

export const signUpSuccess = createAction(
  "[Auth] Sign Up Success",
  props<{user: AuthUser}>(),
);

export const signUpFailure = createAction(
  "[Auth] Sign Up Failure",
  props<{error: any}>(),
);

export const signIn = createAction(
  "[Auth] Sign In",
  props<{email: string; password: string}>(),
);

export const signInSuccess = createAction(
  "[Auth] Sign In Success",
  props<{uid: string}>(),
);

export const signInFailure = createAction(
  "[Auth] Sign In Failure",
  props<{error: any}>(),
);

export const signInWithGoogle = createAction("[Auth] Sign In With Google");

export const signInWithGoogleSuccess = createAction(
  "[Auth] Sign In With Google Success",
  props<{user: AuthUser}>(),
);

export const signInWithGoogleFailure = createAction(
  "[Auth] Sign In With Google Failure",
  props<{error: any}>(),
);

export const signOut = createAction("[Auth] Sign Out");

export const signOutSuccess = createAction("[Auth] Sign Out Success");

export const signOutFailure = createAction(
  "[Auth] Sign Out Failure",
  props<{error: any}>(),
);

export const sendPasswordResetEmail = createAction(
  "[Auth] Send Password Reset Email",
  props<{email: string}>(),
);

export const sendPasswordResetEmailSuccess = createAction(
  "[Auth] Send Password Reset Email Success",
);

export const sendPasswordResetEmailFailure = createAction(
  "[Auth] Send Password Reset Email Failure",
  props<{error: any}>(),
);

export const sendSignInLinkToEmail = createAction(
  "[Auth] Send Sign-In Link To Email",
  props<{email: string}>(),
);

export const sendSignInLinkToEmailSuccess = createAction(
  "[Auth] Send Sign-In Link To Email Success",
);

export const sendSignInLinkToEmailFailure = createAction(
  "[Auth] Send Sign-In Link To Email Failure",
  props<{error: any}>(),
);

export const confirmSignInWithEmailLink = createAction(
  "[Auth] Confirm Sign-In With Email Link",
  props<{url: string}>(),
);

export const confirmSignInWithEmailLinkSuccess = createAction(
  "[Auth] Confirm Sign-In With Email Link Success",
  props<{user: AuthUser}>(),
);

export const confirmSignInWithEmailLinkFailure = createAction(
  "[Auth] Confirm Sign-In With Email Link Failure",
  props<{error: any}>(),
);

// New Actions for Processing Sign-In Links
export const processSignInLink = createAction(
  "[Auth] Process Sign-In Link",
  props<{email: string; link: string}>(),
);

export const processSignInLinkSuccess = createAction(
  "[Auth] Process Sign-In Link Success",
  props<{user: AuthUser}>(),
);

export const processSignInLinkFailure = createAction(
  "[Auth] Process Sign-In Link Failure",
  props<{error: any}>(),
);

export const updateAuthUser = createAction(
  "[Auth] Update Auth User",
  props<{user: Partial<AuthUser>}>(),
);

export const updateAuthUserSuccess = createAction(
  "[Auth] Update Auth User Success",
  props<{user: AuthUser}>(),
);

export const updateAuthUserFailure = createAction(
  "[Auth] Update Auth User Failure",
  props<{error: any}>(),
);

export const refreshToken = createAction(
  "[Auth] Refresh Token",
  props<{forceRefresh?: boolean}>(),
);

export const refreshTokenSuccess = createAction(
  "[Auth] Refresh Token Success",
  props<{user: AuthUser}>(),
);

export const refreshTokenFailure = createAction(
  "[Auth] Refresh Token Failure",
  props<{error: any}>(),
);
