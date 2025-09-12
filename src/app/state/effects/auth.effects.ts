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
  signInWithCredential,
  signOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  User,
} from "firebase/auth";
import {GoogleAuth} from "@southdevs/capacitor-google-auth";
import {
  catchError,
  from,
  map,
  switchMap,
  of,
  tap,
  filter,
  exhaustMap,
  withLatestFrom,
  Observable,
  take,
  timeout,
  delay,
  concat,
} from "rxjs";
import {ErrorHandlerService} from "../../core/services/error-handler.service";
import {SuccessHandlerService} from "../../core/services/success-handler.service";
import {AuthNavigationService} from "../../core/services/auth-navigation.service";
import {TranslateService} from "@ngx-translate/core";
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
import {FirebaseFunctionsService} from "../../core/services/firebase-functions.service";

@Injectable()
export class AuthEffects {
  private auth: Auth = getAuth();
  private actionCodeSettings = {
    url: `${window.location.origin}/auth/login`,
    handleCodeInApp: true,
  } as const;

  // Helper that avoids a hard import on '@capacitor/core'
  // to keep web builds free of native-only dependencies.
  private isNativePlatform(): boolean {
    try {
      const c = (window as any)?.Capacitor;
      return typeof c?.isNativePlatform === "function"
        ? c.isNativePlatform()
        : false;
    } catch {
      return false;
    }
  }

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
    private translate: TranslateService,
    private firebaseFunctionsService: FirebaseFunctionsService,
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
                  // Use translation key for error message
                  const errorMessage = this.translate.instant(
                    "errors.email_required",
                  );
                  return of(
                    AuthActions.processSignInLinkFailure({
                      error: errorMessage,
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
      switchMap(() => {
        if (this.isNativePlatform()) {
          // Use Capacitor Google Auth for native platforms
          return from(
            GoogleAuth.signIn({
              scopes: ["profile", "email"],
            }),
          ).pipe(
            switchMap(async (result) => {
              if (!result.authentication?.idToken) {
                throw new Error("No ID token received from Google Auth");
              }

              const credential = GoogleAuthProvider.credential(
                result.authentication.idToken,
                result.authentication.accessToken,
              );

              const firebaseResult = await signInWithCredential(
                this.auth,
                credential,
              );
              const idTokenResult =
                await firebaseResult.user.getIdTokenResult();
              return {user: firebaseResult.user, claims: idTokenResult.claims};
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
              console.error("Google Sign-In Error:", error);
              this.errorHandler.handleFirebaseAuthError(error);
              return of(AuthActions.signInWithGoogleFailure({error}));
            }),
          );
        } else {
          // Use popup for web platforms
          return from(
            signInWithPopup(this.auth, new GoogleAuthProvider()),
          ).pipe(
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
          );
        }
      }),
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

  // Prefetch current user's relatedAccounts after sign-in to avoid initial blank states
  prefetchRelatedOnSignIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      map(({uid}) =>
        AccountActions.loadRelatedAccounts({accountId: uid, forceReload: true}),
      ),
    ),
  );

  // Refresh Token Success Effect: Navigate after registration completion
  refreshTokenSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenSuccess),
        // Navigation is now handled by authStateChange$ effect
        switchMap(() => of(null)),
      ),
    {dispatch: false},
  );

  // Auth State Change Effect: Handle navigation when auth state updates
  authStateChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.updateAuthUser,
          AuthActions.refreshTokenSuccess,
          AuthActions.updateAuthUserSuccess,
        ),
        delay(100), // Reduced delay from 200ms to 100ms
        withLatestFrom(this.store.select(selectAuthUser)),
        switchMap(([action, authUser]) => {
          if (authUser) {
            const currentUrl = this.router.url;

            // Check if we need to redirect from current route
            const redirectInfo =
              this.authNavigationService.shouldRedirectFromCurrentRoute(
                authUser,
                currentUrl,
              );

            if (redirectInfo.shouldRedirect && redirectInfo.redirectTo) {
              this.router.navigateByUrl(redirectInfo.redirectTo, {
                replaceUrl: true,
              });
            }
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

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deleteAccount),
      exhaustMap((action) =>
        this.firebaseFunctionsService
          .deleteAccount(action.confirmationText)
          .pipe(
            switchMap(() => {
              // After successful account deletion, sign out the user
              return concat(
                of(AuthActions.deleteAccountSuccess()),
                of(AuthActions.signOut()),
              );
            }),
            catchError((error) =>
              of(AuthActions.deleteAccountFailure({error: error.message})),
            ),
          ),
      ),
    ),
  );

  // Helper method to create AuthUser from claims and account data
  private createAuthUserFromClaims(
    user: User,
    claims: any,
  ): Observable<AuthUser> {
    // First, try to get the account from the store
    return this.store.select(selectAccountById(user.uid)).pipe(
      take(1),
      switchMap((account) => {
        // If account is not in store, load it from the database
        if (!account) {
          // For new users, we need to wait for the Firebase function to create the account
          // This is especially important for Google sign-in where there can be a race condition
          return this.waitForAccountCreation(user.uid).pipe(
            catchError((error) => {
              // If all attempts fail, create a minimal AuthUser with "new" type
              // This ensures the user can still navigate but will be directed to registration
              return of(null); // Will be handled in the map function below
            }),
          );
        }
        return of(account);
      }),
      // Bring in the current AuthUser (if any) to avoid regressing type
      withLatestFrom(this.store.select(selectAuthUser)),
      map(([account, existingAuth]) => {
        // Handle case where account couldn't be loaded
        if (!account) {
          // Create minimal AuthUser for new user who hasn't completed registration
          return {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName || user.email?.split("@")[0] || "",
            iconImage:
              user.photoURL ||
              "assets/image/logo/ASCENDynamics NFP-logos_transparent.png",
            heroImage: "src/assets/image/orghero.png",
            tagline: "New and looking to help!",
            type: "new", // This will ensure they go to registration
            createdAt: user.metadata.creationTime
              ? new Date(user.metadata.creationTime)
              : new Date(),
            lastLoginAt: user.metadata.lastSignInTime
              ? new Date(user.metadata.lastSignInTime)
              : new Date(),
            phoneNumber: user.phoneNumber || null,
            providerData: user.providerData,
            settings: {language: "en", theme: "system"},
            claims: {},
          } as AuthUser;
        }

        // Handle existing account
        // Only use Google photo as fallback if user doesn't have an existing icon
        const hasExistingIcon =
          account?.iconImage &&
          !account.iconImage.includes("assets/avatar/") &&
          !account.iconImage.includes(
            "ASCENDynamics NFP-logos_transparent.png",
          );

        // Fix Google profile image URL to get higher quality image
        const getHighQualityGoogleImage = (
          photoURL: string | null,
        ): string | null => {
          if (!photoURL) return null;

          try {
            if (photoURL.includes("googleusercontent.com")) {
              // Remove size parameters and add high quality ones
              // Also ensure the URL is properly formatted
              const cleanUrl = photoURL
                .replace(/=s\d+-c$/, "")
                .replace(/=s\d+$/, "");
              return `${cleanUrl}=s400-c`;
            }
            return photoURL;
          } catch (error) {
            console.warn("Error processing Google image URL:", error);
            return null;
          }
        };

        const defaultIconImage = hasExistingIcon
          ? account.iconImage
          : getHighQualityGoogleImage(user.photoURL) ||
            "assets/image/logo/ASCENDynamics NFP-logos_transparent.png";

        const defaultHeroImage = "src/assets/image/orghero.png";
        const defaultTagline = "Helping others at ASCENDynamics NFP.";
        const defaultSettings: Settings = {
          language: "en",
          theme: "system",
        };

        const existingType =
          existingAuth?.type && existingAuth.type !== "new"
            ? existingAuth.type
            : undefined;
        const finalType =
          (claims["type"] as string) || account?.type || existingType || "new";

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
          type: finalType,
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
          claims,
        };
      }),
    );
  }

  /**
   * Wait for account creation with multiple retries
   * This handles the race condition between Firebase Auth user creation
   * and the Firebase function that creates the account document
   */
  private waitForAccountCreation(userId: string): Observable<any> {
    let retryCount = 0;
    const maxRetries = 3; // Reduced from 5 to 3
    const baseDelay = 500; // Reduced from 1000ms to 500ms

    const tryLoadAccount = (): Observable<any> => {
      this.store.dispatch(AccountActions.loadAccount({accountId: userId}));

      return this.store.select(selectAccountById(userId)).pipe(
        delay(baseDelay + retryCount * 300), // Linear backoff instead of exponential: 500ms, 800ms, 1100ms
        filter((account) => account !== undefined),
        timeout(2000), // Reduced timeout from 3000ms to 2000ms
        take(1),
        catchError((error) => {
          retryCount++;
          if (retryCount < maxRetries) {
            return tryLoadAccount();
          } else {
            // After 3 retries (total ~2.4 seconds), give up and create minimal user
            throw error;
          }
        }),
      );
    };

    return tryLoadAccount();
  }
}
