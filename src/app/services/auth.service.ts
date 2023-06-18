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
} from "firebase/auth";
import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

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

  constructor(public router: Router) {
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
  async signUp(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* SIGN IN METHODS */
  // Sign In With Google
  signInWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // Sign In With Email/Password
  async signIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Email Link Sign In
  async onSendSignInLinkToEmail(email: string) {
    try {
      const result = await sendSignInLinkToEmail(
        this.auth,
        email,
        this.actionCodeSettings,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Confirm Email Link Sign In
  onSignInWithEmailLink() {
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
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(this.auth, email, window.location.href)
          .then((result) => {
            console.log(result);
            // Clear email from storage.
            window.localStorage.removeItem("emailForSignIn");
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
          })
          .catch((error) => {
            console.log(error);
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
          });
      }
    }
  }

  /* SIGN OUT METHOD */
  signOut() {
    try {
      signOut(this.auth)
        .then(() => {
          this.router.navigate(["user-login"]);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* PASSWORD RESET METHODS */
  onSendPasswordResetEmail(email: string): Promise<void> {
    try {
      const result = sendPasswordResetEmail(this.auth, email);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
