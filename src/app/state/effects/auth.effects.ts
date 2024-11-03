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
// src/app/core/store/auth/auth.effects.ts

import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as AuthActions from "../actions/auth.actions";
import * as AccountActions from "../actions/account.actions";
import {
  Auth,
  getAuth,
  signInWithEmailLink,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
} from "firebase/auth";
import {catchError, from, map, switchMap, of, tap, exhaustMap} from "rxjs";
import {ErrorHandlerService} from "../../core/services/error-handler.service";
import {SuccessHandlerService} from "../../core/services/success-handler.service";
import {Router} from "@angular/router";
import {AlertController, LoadingController} from "@ionic/angular";
import {AuthUser} from "../../models/auth-user.model";

@Injectable()
export class AuthEffects {
  private auth: Auth;
  private actionCodeSettings = {
    url: `${window.location.origin}/auth/login`,
    handleCodeInApp: true,
  };

  constructor(
    private actions$: Actions,
    private errorHandler: ErrorHandlerService,
    private successHandler: SuccessHandlerService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.auth = getAuth();
  }

  // Effect to Initialize Auth and Process Sign-In Link
  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      switchMap(() => {
        const url = window.location.href;
        if (isSignInWithEmailLink(this.auth, url)) {
          // Retrieve the email from local storage
          const email = window.localStorage.getItem("emailForSignIn");
          if (email) {
            // Dispatch action to process the sign-in link
            return of(AuthActions.processSignInLink({email, link: url}));
          } else {
            // Email not found, prompt the user to enter it
            return from(this.promptForEmail()).pipe(
              switchMap((email) => {
                if (email) {
                  return of(AuthActions.processSignInLink({email, link: url}));
                } else {
                  return of(
                    AuthActions.processSignInLinkFailure({
                      error: "Email is required to complete sign-in.",
                    }),
                  );
                }
              }),
              catchError((error) =>
                of(AuthActions.processSignInLinkFailure({error})),
              ),
            );
          }
        } else {
          // Not a sign-in link, do nothing or handle accordingly
          return of({type: "NO_ACTION"});
        }
      }),
    ),
  );

  // Helper method to prompt the user for their email
  private async promptForEmail(): Promise<string | null> {
    const alert = await this.alertController.create({
      header: "Email Required",
      message: "Please enter your email to complete sign-in.",
      inputs: [
        {
          name: "email",
          type: "email",
          placeholder: "Enter your email",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Submit",
          handler: (data) => {
            if (data.email) {
              window.localStorage.setItem("emailForSignIn", data.email);
              return data.email;
            } else {
              return null;
            }
          },
        },
      ],
    });

    await alert.present();

    return new Promise((resolve) => {
      alert.onDidDismiss().then((result) => {
        if (result.role === "cancel") {
          resolve(null);
        } else {
          resolve(result.data?.values?.email || null);
        }
      });
    });
  }

  // Process Sign-In Link and Load Account
  processSignInLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.processSignInLink),
      switchMap(({email, link}) =>
        from(signInWithEmailLink(this.auth, email, link)).pipe(
          tap((result) => {
            this.successHandler.handleSuccess(
              "Successfully signed in with email link!",
            );
            // Navigate to "/{uid}"
            this.router.navigateByUrl(`/${result.user.uid}`, {
              replaceUrl: true,
            });
          }),
          map((result) => {
            const authUser: AuthUser = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              emailVerified: result.user.emailVerified,
            };
            return AuthActions.processSignInLinkSuccess({user: authUser});
          }),
          catchError((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
            return of(AuthActions.processSignInLinkFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Sign-Up Effect
  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      switchMap(({email, password}) =>
        from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
          tap((result) => {
            this.successHandler.handleSuccess("Successfully signed up!");
            // Navigate to "/registration/:uid"
            this.router.navigateByUrl(`/registration/${result.user.uid}`, {
              replaceUrl: true,
            });
          }),
          map((result) => {
            const authUser: AuthUser = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              emailVerified: result.user.emailVerified,
              // Add other properties as needed
            };
            return AuthActions.signUpSuccess({user: authUser});
          }),
          catchError((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
            return of(AuthActions.signUpFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Sign-In Effect
  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),
      switchMap(({email, password}) =>
        from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
          tap((result) => {
            this.successHandler.handleSuccess("Successfully signed in!");
            // Navigate to "/{uid}"
            this.router.navigateByUrl(`/${result.user.uid}`, {
              replaceUrl: true,
            });
          }),
          map((result) => {
            const authUser: AuthUser = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              emailVerified: result.user.emailVerified,
              // Add other properties as needed
            };
            return AuthActions.signInSuccess({user: authUser});
          }),
          catchError((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
            return of(AuthActions.signInFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Sign-In Success Effect: Load Account Data
  signInSuccessLoadAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      switchMap(({user}) => [
        AccountActions.loadAccount({accountId: user.uid}),
        AccountActions.setSelectedAccount({accountId: user.uid}),
      ]),
    ),
  );

  // Sign-In with Google Effect
  signInWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInWithGoogle),
      switchMap(() =>
        from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
          tap((result) => {
            this.successHandler.handleSuccess(
              "Successfully signed in with Google!",
            );
            // Navigate to "/{uid}"
            this.router.navigateByUrl(`/${result.user.uid}`, {
              replaceUrl: true,
            });
          }),
          map((result) => {
            const authUser: AuthUser = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              emailVerified: result.user.emailVerified,
              // Add other properties as needed
            };
            return AuthActions.signInWithGoogleSuccess({user: authUser});
          }),
          catchError((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
            return of(AuthActions.signInWithGoogleFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Effect to Handle Google Sign-In Success and Load Account
  signInWithGoogleSuccessLoadAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInWithGoogleSuccess),
      switchMap(({user}) => [
        AccountActions.loadAccount({accountId: user.uid}),
        AccountActions.setSelectedAccount({accountId: user.uid}),
      ]),
    ),
  );

  // Sign-Out Effect
  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signOut),
      switchMap(() =>
        from(signOut(this.auth)).pipe(
          map(() => {
            this.successHandler.handleSuccess("You have been signed out!");
            this.router.navigate(["login"]);
            return AuthActions.signOutSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
            return of(AuthActions.signOutFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Send Password Reset Email Effect
  sendPasswordResetEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendPasswordResetEmail),
      switchMap(({email}) =>
        from(sendPasswordResetEmail(this.auth, email)).pipe(
          map(() => {
            this.successHandler.handleSuccess(
              "Please check your email for further instructions!",
            );
            return AuthActions.sendPasswordResetEmailSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
            return of(AuthActions.sendPasswordResetEmailFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Send Verification Mail Effect
  sendVerificationMail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendVerificationMail),
      switchMap(({email}) =>
        from(
          sendSignInLinkToEmail(this.auth, email, this.actionCodeSettings),
        ).pipe(
          map(() => {
            this.successHandler.handleSuccess(
              "Verification email sent to " +
                email +
                "! Please check your inbox.",
              30000,
            );
            return AuthActions.sendVerificationMailSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
            return of(AuthActions.sendVerificationMailFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Send Sign-In Link to Email Effect
  sendSignInLinkToEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendSignInLinkToEmail),
      exhaustMap(({email}) =>
        from(this.loadingController.create()).pipe(
          tap((loading) => loading.present()),
          switchMap((loading) =>
            from(
              sendSignInLinkToEmail(this.auth, email, this.actionCodeSettings),
            ).pipe(
              map(() => {
                loading.dismiss();
                window.localStorage.setItem("emailForSignIn", email);
                return AuthActions.sendSignInLinkToEmailSuccess();
              }),
              catchError((error) => {
                loading.dismiss();
                return of(AuthActions.sendSignInLinkToEmailFailure({error}));
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Success Alert for Sign-In Link
  sendSignInLinkToEmailSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sendSignInLinkToEmailSuccess),
        tap(async () => {
          const alert = await this.alertController.create({
            header: "Email Sent",
            message: "A sign-in link has been sent to your email address.",
            buttons: ["OK"],
          });
          await alert.present();
        }),
      ),
    {dispatch: false},
  );

  // Failure Alert for Sign-In Link
  sendSignInLinkToEmailFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sendSignInLinkToEmailFailure),
        tap(async ({error}) => {
          const alert = await this.alertController.create({
            header: "Error",
            message: `Failed to send sign-in link: ${error.message || error}`,
            buttons: ["OK"],
          });
          await alert.present();
        }),
      ),
    {dispatch: false},
  );
}
