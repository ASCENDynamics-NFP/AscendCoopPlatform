import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
  User,
  getAdditionalUserInfo,
  UserCredential,
} from "firebase/auth";
import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {ErrorHandlerService} from "./error-handler.service";
import {SuccessHandlerService} from "./success-handler.service";
import {LoadingController} from "@ionic/angular";
import {Timestamp} from "firebase/firestore";
import {UsersService} from "./users.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  auth: Auth;
  private userSubject = new BehaviorSubject<User | null>(null); // User | null type
  // any time the user logs in or out (i.e., when currentUserSubject is updated), all subscribers to currentUser$ will receive the updated user state.
  user$ = this.userSubject.asObservable();
  actionCodeSettings = {
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

  constructor(
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private loadingController: LoadingController,
    private successHandler: SuccessHandlerService,
    private usersService: UsersService,
  ) {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in.
        this.userSubject.next(user);
      } else {
        // User is signed out.
        this.userSubject.next(null);
      }
    });
  }
  /* CURRENT USER METHODS */
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    return this.getCurrentUser() !== null ? true : false;
  }

  // Call method when wanting to pull in user status async
  getCurrentUser(): User | null {
    return this.userSubject.value;
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
        // Set user data
        const timestamp = Timestamp.now();
        await this.usersService.createUser({
          email: email,
          displayName: "",
          profilePicture: "",
          emailVerified: false,
          bio: "",
          lastLoginAt: timestamp,
          name: "",
          id: result.user.uid,
        });

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
  async signInWithGoogle() {
    const loading = await this.loadingController.create();
    await loading.present();
    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then((result) => {
        // handle successful sign in
        // Check if the user is new or existing.
        if (getAdditionalUserInfo(result)?.isNewUser) {
          // This is a new user
          this.onLoginCreateUserRecord(result);
        } else {
          console.log("This is an existing user");
          this.onLoginUpdateUserRecord(result?.user?.uid);
        }
        this.successHandler.handleSuccess("Successfully signed in!");
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  // Sign In With Email/Password
  async signIn(
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
    signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.onLoginUpdateUserRecord(result?.user?.uid);
        this.successHandler.handleSuccess("Successfully signed in!");
      })
      .catch((error) => {
        this.errorHandler.handleFirebaseAuthError(error);
      })
      .finally(() => {
        loading.dismiss();
      });
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
  async onSignInWithEmailLink() {
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
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(this.auth, email, window.location.href)
          .then((result) => {
            // Clear email from storage.
            window.localStorage.removeItem("emailForSignIn");
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
            this.successHandler.handleSuccess("You have been signed in!");
            this.onLoginUpdateUserRecord(result?.user?.uid);
          })
          .catch((error) => {
            this.errorHandler.handleFirebaseAuthError(error);
          })
          .finally(() => {
            loading.dismiss();
          });
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

  onLoginUpdateUserRecord(userId: string) {
    this.usersService.updateUser({
      lastLoginAt: Timestamp.now(),
      id: userId,
    });
  }

  onLoginCreateUserRecord(record: UserCredential) {
    if (!record.user || !record.user.uid || !record.user.email) {
      throw new Error("Could not create user record");
    }
    this.usersService.createUser({
      email: record.user.email,
      displayName: record.user.displayName ? record.user.displayName : "",
      profilePicture: record.user.photoURL ? record.user.photoURL : "",
      emailVerified: record.user.emailVerified,
      bio: "I enjoy volunteering and helping others.",
      lastLoginAt: Timestamp.now(),
      name: record?.user?.displayName ? record.user.displayName : "",
      id: record.user.uid,
      language: "en",
    });
  }
}
