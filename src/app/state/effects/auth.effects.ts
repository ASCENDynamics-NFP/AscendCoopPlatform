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
// src/app/state/effects/auth.effects.ts

import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as AuthActions from "../actions/auth.actions";
import * as AccountActions from "../actions/account.actions";
import * as ListingsActions from "../actions/listings.actions";
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
  User,
} from "firebase/auth";
import {
  catchError,
  from,
  map,
  switchMap,
  of,
  tap,
  exhaustMap,
  withLatestFrom,
  Observable,
  take,
} from "rxjs";
import {ErrorHandlerService} from "../../core/services/error-handler.service";
import {SuccessHandlerService} from "../../core/services/success-handler.service";
import {AuthNavigationService} from "../../core/services/auth-navigation.service";
import {Router} from "@angular/router";
import {
  AlertController,
  LoadingController,
  MenuController,
} from "@ionic/angular";
import {AuthUser} from "@shared/models/auth-user.model";
import {selectAuthUser} from "../selectors/auth.selectors";
import {Store} from "@ngrx/store";
import {AuthState} from "../reducers/auth.reducer";
import {Settings} from "@shared/models/account.model";
import {selectAccountById} from "../selectors/account.selectors";

@Injectable()
export class AuthEffects {
  private auth: Auth = getAuth();
  private actionCodeSettings = {
    url: `${window.location.origin}/auth/login`,
    handleCodeInApp: true,
    android: {
      packageName: "org.ascendcoopplatform.app",
      installApp: true,
      // minimumVersion: "1", // Set your minimum app version if needed
    },
  };

  constructor(
    private actions$: Actions,
    private errorHandler: ErrorHandlerService,
    private successHandler: SuccessHandlerService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private store: Store<{auth: AuthState}>,
    private menuCtrl: MenuController,
    private authNavigationService: AuthNavigationService,
  ) {}

  // Initialize Auth and Process Sign-In Link
  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      switchMap(() => {
        const url = window.location.href;
        if (isSignInWithEmailLink(this.auth, url)) {
          const email = window.localStorage.getItem("emailForSignIn");
          if (email) {
            return of(AuthActions.processSignInLink({email, link: url}));
          } else {
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
          switchMap(async (result) => {
            const idTokenResult = await result.user.getIdTokenResult();
            return {user: result.user, claims: idTokenResult.claims};
          }),
          switchMap(({user, claims}) =>
            this.createAuthUserFromClaims(user, claims).pipe(
              map((authUser) => {
                this.store.dispatch(
                  AuthActions.updateAuthUser({user: authUser}),
                );
                return AuthActions.signInSuccess({uid: authUser.uid});
              }),
            ),
          ),
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
          switchMap(async (result) => {
            const idTokenResult = await result.user.getIdTokenResult();
            return {user: result.user, claims: idTokenResult.claims};
          }),
          switchMap(({user, claims}) =>
            this.createAuthUserFromClaims(user, claims).pipe(
              map((authUser) => {
                this.store.dispatch(
                  AuthActions.updateAuthUser({user: authUser}),
                );
                // Navigate to registration after auth state is updated
                this.router.navigateByUrl(
                  `/account/registration/${authUser.uid}`,
                  {replaceUrl: true},
                );
                return AuthActions.signUpSuccess({user: authUser});
              }),
            ),
          ),
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
          switchMap(async (result) => {
            const idTokenResult = await result.user.getIdTokenResult();
            return {user: result.user, claims: idTokenResult.claims};
          }),
          switchMap(({user, claims}) =>
            this.createAuthUserFromClaims(user, claims).pipe(
              map((authUser) => {
                this.store.dispatch(
                  AuthActions.updateAuthUser({user: authUser}),
                );
                return AuthActions.signInSuccess({uid: authUser.uid});
              }),
            ),
          ),
          catchError((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
            return of(AuthActions.signInFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Sign-In with Google Effect
  signInWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInWithGoogle),
      switchMap(() =>
        from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
          switchMap(async (result) => {
            const idTokenResult = await result.user.getIdTokenResult();
            return {user: result.user, claims: idTokenResult.claims};
          }),
          switchMap(({user, claims}) =>
            this.createAuthUserFromClaims(user, claims).pipe(
              map((authUser) => {
                this.store.dispatch(
                  AuthActions.updateAuthUser({user: authUser}),
                );
                return AuthActions.signInSuccess({uid: authUser.uid});
              }),
            ),
          ),
          catchError((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
            return of(AuthActions.signInWithGoogleFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Sign-In Success Effect: Navigate to Account Page
  signInSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        withLatestFrom(this.store.select(selectAuthUser)),
        switchMap(([{uid}, authUser]) => {
          if (authUser) {
            // Use the navigation service for consistent routing logic
            this.authNavigationService.navigateAfterAuth(authUser);
          }
          return of(null);
        }),
      ),
    {dispatch: false},
  );

  // Sign-Out Effect
  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signOut),
      switchMap(() =>
        from(signOut(this.auth)).pipe(
          tap(() => {
            this.successHandler.handleSuccess("You have been signed out!");
            this.router.navigate(["/auth/login"]);
          }),
          switchMap(() => [
            AuthActions.signOutSuccess(),
            AccountActions.clearAccountsState(),
            ListingsActions.clearListingsState(),
          ]),
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
          tap(() => {
            this.successHandler.handleSuccess(
              "Please check your email for further instructions!",
            );
          }),
          map(() => AuthActions.sendPasswordResetEmailSuccess()),
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
          tap(() => {
            this.successHandler.handleSuccess(
              `Verification email sent to ${email}! Please check your inbox.`,
              30000,
            );
          }),
          map(() => AuthActions.sendVerificationMailSuccess()),
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
              tap(() => {
                window.localStorage.setItem("emailForSignIn", email);
              }),
              map(() => {
                loading.dismiss();
                return AuthActions.sendSignInLinkToEmailSuccess();
              }),
              catchError((error) => {
                loading.dismiss();
                this.errorHandler.handleFirebaseAuthError(error);
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

  // Update Auth User Effect
  updateAuthUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateAuthUser),
      withLatestFrom(this.store.select(selectAuthUser)),
      map(([{user}, currentUser]) => ({
        user: {...currentUser, ...user} as AuthUser,
      })),
      map(({user}) => AuthActions.updateAuthUserSuccess({user})),
      catchError((error) => of(AuthActions.updateAuthUserFailure({error}))),
    ),
  );

  // Refresh Token Effect
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(({forceRefresh = true}) => {
        const currentUser = this.auth.currentUser;

        if (!currentUser) {
          return of(
            AuthActions.refreshTokenFailure({
              error: "No authenticated user found",
            }),
          );
        }

        return from(currentUser.getIdTokenResult(forceRefresh)).pipe(
          switchMap((idTokenResult) => {
            return this.createAuthUserFromClaims(
              currentUser,
              idTokenResult.claims,
            ).pipe(
              map((authUser) =>
                AuthActions.refreshTokenSuccess({user: authUser}),
              ),
            );
          }),
          catchError((error) => {
            console.error("Error refreshing token:", error);
            return of(AuthActions.refreshTokenFailure({error}));
          }),
        );
      }),
    ),
  );

  // Helper method to create AuthUser from claims and account data
  private createAuthUserFromClaims(
    user: User,
    claims: any,
  ): Observable<AuthUser> {
    return this.store.select(selectAccountById(user.uid)).pipe(
      take(1),
      map((account) => {
        // Handle undefined account
        const defaultIconImage = user.photoURL || "src/assets/avatar/male1.png";
        const defaultHeroImage = "src/assets/image/orghero.png";
        const defaultTagline = "Helping others at ASCENDynamics NFP.";
        const defaultSettings: Settings = {
          language: "en",
          theme: "system",
        };
        return {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName:
            (claims["displayName"] as string) ||
            account?.name ||
            user.displayName,
          iconImage:
            (claims["iconImage"] as string) ||
            account?.iconImage ||
            defaultIconImage,
          heroImage:
            (claims["heroImage"] as string) ||
            account?.heroImage ||
            defaultHeroImage,
          tagline:
            (claims["tagline"] as string) || account?.tagline || defaultTagline,
          type: (claims["type"] as string) || account?.type || "",
          createdAt: user.metadata.creationTime
            ? new Date(user.metadata.creationTime)
            : new Date(),
          lastLoginAt: user.metadata.lastSignInTime
            ? new Date(user.metadata.lastSignInTime)
            : new Date(),
          phoneNumber:
            user.phoneNumber ||
            account?.contactInformation?.phoneNumbers?.[0]?.number ||
            null,
          providerData: user.providerData,
          settings:
            (claims["settings"] as Settings) ||
            account?.settings ||
            defaultSettings,
        };
      }),
    );
  }
}
