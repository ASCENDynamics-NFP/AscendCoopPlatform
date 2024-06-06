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
  User,
  GoogleAuthProvider,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendSignInLinkToEmail,
  onAuthStateChanged,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
} from "firebase/auth";
import {BehaviorSubject} from "rxjs";
import {map} from "rxjs/operators";
import {ErrorHandlerService} from "./error-handler.service";
import {SuccessHandlerService} from "./success-handler.service";
import {Router} from "@angular/router";

@Injectable({providedIn: "root"})
export class AuthStoreService {
  private auth = getAuth();
  private userSubject = new BehaviorSubject<User | null>(null);
  private actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: `${window.location.origin}/login`,
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

  // Error Handling Method
  private handleError(error: any) {
    this.errorHandler.handleFirebaseAuthError(error);
  }

  // Loading Controller Method
  private async presentLoading() {
    const loading = await this.loadingController.create();
    await loading.present();
    return loading;
  }

  /* SIGN UP METHODS */

  // Sign Up
  async signUp(
    email: string | null | undefined,
    password: string | null | undefined,
  ) {
    if (!email || !password) {
      this.handleError({
        code: "",
        message: "Email and password are required!",
      });
      return;
    }

    const loading = await this.presentLoading();
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (result) => {
        // await this.sendVerificationMail(email);  // commenting this out for now, as AuthGuard also triggers this method at the moment.
        this.storeEmailForSignIn(email); // Store email for verification
        this.successHandler.handleSuccess(
          "Successfully signed up! Please verify your email.",
        );
        this.router.navigate([`/registration/${result.user.uid}`]);
      })
      .catch((error) => this.handleError(error))
      .finally(() => loading.dismiss());
  }

  // Send Verification Mail
  async sendVerificationMail(email: string) {
    sendSignInLinkToEmail(this.auth, email, this.actionCodeSettings)
      .then(() =>
        this.successHandler.handleSuccess(
          "Verification email sent to " + email + "! Please check your inbox.",
          30000,
        ),
      )
      .catch((error) => this.handleError(error));
  }

  /* SIGN IN METHODS */

  // Google Sign-In
  async signInWithGoogle(): Promise<string | void> {
    const loading = await this.presentLoading();
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      if (!result) {
        throw new Error("Google Sign-In was cancelled");
      }

      // Check if the user is new or existing.
      if (getAdditionalUserInfo(result)?.isNewUser) {
        this.successHandler.handleSuccess("Successfully created account!");
      } else {
        this.successHandler.handleSuccess("Successfully signed in!");
      }

      // Return the user ID
      return result.user?.uid;
    } catch (error) {
      this.handleError(error);
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
      this.handleError({code: "", message: "Email and password are required!"});
      return;
    }

    const loading = await this.presentLoading();
    signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.successHandler.handleSuccess("Successfully signed in!");
        return result.user?.uid;
      })
      .catch((error) => this.handleError(error))
      .finally(() => loading.dismiss());
  }

  // Sign-In with Email Link Method
  async onSendSignInLinkToEmail(email: string) {
    const loading = await this.presentLoading();
    sendSignInLinkToEmail(this.auth, email, this.actionCodeSettings)
      .then(() => {
        this.storeEmailForSignIn(email);
        this.successHandler.handleSuccess(
          "Email sent! Check your inbox for the magic link.",
        );
      })
      .catch((error) => this.handleError(error))
      .finally(() => loading.dismiss());
  }

  // Confirm Email Link Sign-In Method
  async onSignInWithEmailLink(): Promise<string | void> {
    if (isSignInWithEmailLink(this.auth, window.location.href)) {
      let email = this.getEmailForSignIn();
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }

      if (email) {
        const loading = await this.presentLoading();
        signInWithEmailLink(this.auth, email, window.location.href)
          .then((result) => {
            this.clearEmailForSignIn(); // Clear stored email after verification
            this.successHandler.handleSuccess("You have been signed in!");
            return result.user?.uid;
          })
          .catch((error) => this.handleError(error))
          .finally(() => loading.dismiss());
      }
    }
  }

  /* SIGN OUT METHOD */
  async signOut() {
    const loading = await this.presentLoading();
    signOut(this.auth)
      .then(() => {
        this.successHandler.handleSuccess("You have been signed out!");
        this.router.navigate(["login"]);
      })
      .catch((error) => this.handleError(error))
      .finally(() => loading.dismiss());
  }

  /* PASSWORD RESET METHODS */
  async onSendPasswordResetEmail(email: string): Promise<void> {
    const loading = await this.presentLoading();
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.successHandler.handleSuccess(
          "Please check your email for further instructions!",
        );
      })
      .catch((error) => this.handleError(error))
      .finally(() => loading.dismiss());
  }

  // Secure Email Storage Methods
  private storeEmailForSignIn(email: string) {
    // Securely store the email
    window.localStorage.setItem("emailForSignIn", email);
  }

  private getEmailForSignIn(): string | null {
    // Retrieve the securely stored email
    return window.localStorage.getItem("emailForSignIn");
  }

  private clearEmailForSignIn() {
    // Clear the stored email
    window.localStorage.removeItem("emailForSignIn");
  }
}
