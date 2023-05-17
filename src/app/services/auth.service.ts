import {User} from "firebase/auth"; // import User type
import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  auth = getAuth();
  private userSubject = new BehaviorSubject<User | null>(null); // User | null type
  user$ = this.userSubject.asObservable();
  constructor() {
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

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
