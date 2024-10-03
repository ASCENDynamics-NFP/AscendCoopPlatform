// src/app/core/services/auth.service.ts

import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import * as AuthActions from "../../state/actions/auth.actions";
import {
  selectAuthUser,
  selectAuthLoading,
  selectIsLoggedIn,
  selectAuthError,
} from "../../state/selectors/auth.selectors";
import {AuthState} from "../../state/reducers/auth.reducer";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Observables for components to subscribe to
  authUser$ = this.store.select(selectAuthUser);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  constructor(private store: Store<AuthState>) {}

  // Sign-Up
  signUp(email: string, password: string): void {
    this.store.dispatch(AuthActions.signUp({email, password}));
  }

  // Sign-In
  signIn(email: string, password: string): void {
    this.store.dispatch(AuthActions.signIn({email, password}));
  }

  // Sign-In with Google
  signInWithGoogle(): void {
    this.store.dispatch(AuthActions.signInWithGoogle());
  }

  // Sign-Out
  signOut(): void {
    this.store.dispatch(AuthActions.signOut());
  }

  // Send Password Reset Email
  sendPasswordResetEmail(email: string): void {
    this.store.dispatch(AuthActions.sendPasswordResetEmail({email}));
  }

  // Send Sign-In Link to Email
  sendSignInLinkToEmail(email: string): void {
    this.store.dispatch(AuthActions.sendSignInLinkToEmail({email}));
  }

  // Confirm Sign-In with Email Link
  confirmSignInWithEmailLink(url: string): void {
    this.store.dispatch(AuthActions.confirmSignInWithEmailLink({url}));
  }

  // Store Email for Sign-In (using localStorage)
  storeEmailForSignIn(email: string): void {
    window.localStorage.setItem("emailForSignIn", email);
  }

  // Retrieve Stored Email for Sign-In
  getEmailForSignIn(): string | null {
    return window.localStorage.getItem("emailForSignIn");
  }

  // Clear Stored Email after Sign-In
  clearEmailForSignIn(): void {
    window.localStorage.removeItem("emailForSignIn");
  }
}
