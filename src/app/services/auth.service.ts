import {
  User,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
} from "firebase/auth"; // import User type
import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  auth = getAuth();
  private userSubject = new BehaviorSubject<User | boolean>(false); // User | false type
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

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in.
        this.userSubject.next(user);
        localStorage.setItem("user", JSON.stringify(user));
        JSON.parse(localStorage.getItem("user")!);
      } else {
        localStorage.setItem("user", "null");
        JSON.parse(localStorage.getItem("user")!);
        // User is signed out.
        this.userSubject.next(false);
      }
    });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user")!);
    return user !== null ? true : false;
  }

  // Sign up with email/password
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

  // Sign in with email/password
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

  onSendPasswordResetEmail(email: string): Promise<void> {
    try {
      const result = sendPasswordResetEmail(this.auth, email);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

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
            // Clear email from storage.
            window.localStorage.removeItem("emailForSignIn");
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
          })
          .catch((error) => {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
          });
      }
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth).then(() => {
        localStorage.removeItem("user");
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Call method when wanting to pull in user status async
  getCurrentUser(): User | boolean {
    return this.userSubject.value;
  }
}
