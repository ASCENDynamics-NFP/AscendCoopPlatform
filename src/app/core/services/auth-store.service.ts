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
import {Injectable} from "@angular/core";
import {LoadingController} from "@ionic/angular";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  getAuth,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {BehaviorSubject} from "rxjs";
import {map} from "rxjs/operators";
import {ErrorHandlerService} from "./error-handler.service";
import {SuccessHandlerService} from "./success-handler.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthStoreService {
  private auth = getAuth();
  private userSubject = new BehaviorSubject<User | null>(null);
  private actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: `${window.location.origin}/user-login`,
    // This must be true.
    handleCodeInApp: true,
    // iOS: {
    //   bundleId: 'com.example.ios'
    // },
    // android: {
    //   packageName: 'com.example.android',
    //   installApp: true,
    //   minimumVersion: '12'
    // },
    // dynamicLinkDomain: 'example.page.link'
  };
  authUser$ = this.userSubject.asObservable();
  isLoggedIn$ = this.authUser$.pipe(map((authUser) => authUser !== null));

  constructor(
    private errorHandler: ErrorHandlerService,
    private loadingController: LoadingController,
    private successHandler: SuccessHandlerService,
    private router: Router,
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  setUser(user: User | null): void {
    this.userSubject.next(user);
  }

  getAuth() {
    return this.auth;
  }

  /* SIGN UP METHODS */
  // Sign Up With Email/Password
  async signUp(
    email: string | null | undefined,
    password: string | null | undefined,
  ) {
    if (!email || !password) {
      // Handle the case where email or password is not provided.
      this.errorHandler.handleFirebaseAuthError({
        code: "",
        message: "Email and password are required!",
      });
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (result) => {
        // Send verification email
        await this.sendVerificationMail(email);

        this.successHandler.handleSuccess(
          "Successfully signed up! Please verify your email.",
        );
        this.router.navigate(["user-profile/" + result.user.uid]);
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  sendVerificationMail(email: string) {
    sendSignInLinkToEmail(this.auth, email, this.actionCodeSettings)
      .then(() => {
        this.successHandler.handleSuccess(
          "Verification email sent! Please check your inbox.",
        );
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
      });
  }

  /* SIGN IN METHODS */
  // Sign In With Google
  async signInWithGoogle(): Promise<string | void> {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());

      // handle successful sign in
      // Check if the user is new or existing.
      if (getAdditionalUserInfo(result)?.isNewUser) {
        // This is a new user
        this.successHandler.handleSuccess("Successfully created account!");
      } else {
        this.successHandler.handleSuccess("Successfully signed in!");
        return result?.user?.uid;
      }
    } catch (error) {
      this.errorHandler.handleFirebaseAuthError(
        error as {code: string; message: string},
      );
    } finally {
      loading.dismiss();
    }
  }

  // Sign In With Email/Password
  async signIn(
    email: string | null | undefined,
    password: string | null | undefined,
  ): Promise<string | void> {
    if (!email || !password) {
      this.errorHandler.handleFirebaseAuthError({
        code: "",
        message: "Email and password are required!",
      });
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      this.successHandler.handleSuccess("Successfully signed in!");
      return result.user?.uid;
    } catch (error) {
      this.errorHandler.handleFirebaseAuthError(
        error as {code: string; message: string},
      );
    } finally {
      loading.dismiss();
    }
  }

  // Email Link Sign In
  async onSendSignInLinkToEmail(email: string) {
    const loading = await this.loadingController.create();
    await loading.present();
    sendSignInLinkToEmail(this.auth, email, this.actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        this.successHandler.handleSuccess(
          "Email sent! Check your inbox for the magic link.",
        );
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  // Confirm Email Link Sign In
  async onSignInWithEmailLink(): Promise<string | void> {
    // Confirm the link is a sign-in with email link.
    if (isSignInWithEmailLink(this.auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }

      if (email != null) {
        const loading = await this.loadingController.create();
        await loading.present();
        try {
          const result = await signInWithEmailLink(
            this.auth,
            email,
            window.location.href,
          );
          window.localStorage.removeItem("emailForSignIn");
          this.successHandler.handleSuccess("You have been signed in!");
          return result.user?.uid;
        } catch (error) {
          this.errorHandler.handleFirebaseAuthError(
            error as {code: string; message: string},
          );
        } finally {
          loading.dismiss();
        }
      }
    }
  }

  /* SIGN OUT METHOD */
  async signOut() {
    const loading = await this.loadingController.create();
    await loading.present();
    signOut(this.auth)
      .then(() => {
        this.successHandler.handleSuccess("You have been signed out!");
        this.router.navigate(["user-login"]);
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  /* PASSWORD RESET METHODS */
  async onSendPasswordResetEmail(email: string): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.successHandler.handleSuccess(
          "Please check your email for further instructions!",
        );
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
