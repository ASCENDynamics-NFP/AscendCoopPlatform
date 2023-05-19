import {User} from "firebase/auth"; // import User type
import {BehaviorSubject, Observable} from "rxjs";
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
// import { isPlatform } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  auth = getAuth();
  private userSubject = new BehaviorSubject<User | boolean>(false); // User | false type
  // any time the user logs in or out (i.e., when currentUserSubject is updated), all subscribers to currentUser$ will receive the updated user state.
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in.
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
        // User is signed out.
        this.userSubject.next(false);
      }
    });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
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

  // async onSignInWithEmailLink(email: string) {
  //   const redirectTo = isPlatform('capacitor') ? 'firebase://login' : `${window.location.origin}/groups`;
  //   console.log('set redirect: ', redirectTo);
  //   try {
  //     const result = await signInWithEmailLink(
  //     this.auth,
  //     email,);
  //     return result;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth).then(() => {
        localStorage.removeItem('user');
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
