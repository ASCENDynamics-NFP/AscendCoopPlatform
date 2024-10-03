// src/app/core/store/auth/auth.actions.ts

import {createAction, props} from "@ngrx/store";
import {AuthUser} from "../../models/auth-user.model";

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
  props<{user: AuthUser}>(),
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
