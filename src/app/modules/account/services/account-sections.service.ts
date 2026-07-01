import {Injectable} from "@angular/core";
import {getApp} from "firebase/app";
import {from, Observable, of} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";
import {
  ContactInformation,
  ProfessionalInformation,
} from "@shared/models/account.model";
import {getAuth} from "firebase/auth";
import {doc, getDoc, getFirestore} from "firebase/firestore";

@Injectable({providedIn: "root"})
export class AccountSectionsService {
  /**
   * Reads a Firestore document at `path` using the modular Firebase SDK.
   * Explicitly passes the Firebase app instance (via getApp()) to getFirestore
   * and getAuth so they always use the same app that app.module.ts initialized,
   * rather than relying on the default-app singleton which can be ambiguous
   * when compat + modular SDKs are both present.
   * Waits for authStateReady() before reading so gated sections have a valid
   * token on the very first navigation (before Firebase Auth restores from
   * IndexedDB).
   */
  private readSection$<T>(path: string): Observable<T | null> {
    const firebaseApp = getApp();
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    return from(auth.authStateReady()).pipe(
      switchMap(() => {
        if (!auth.currentUser) {
          return of(null);
        }
        return from(getDoc(doc(db, path))).pipe(
          map((snap) => (snap.exists() ? (snap.data() as T) : null)),
          catchError((err) => {
            console.error("[AccountSectionsService] readSection$ error:", err);
            return of(null);
          }),
        );
      }),
    );
  }

  /**
   * Reads accounts/{accountId}/sections/contactInfo.
   * Returns null when not accessible or missing.
   */
  contactInfo$(accountId: string): Observable<ContactInformation | null> {
    return this.readSection$<ContactInformation>(
      `accounts/${accountId}/sections/contactInfo`,
    );
  }

  /**
   * Reads accounts/{accountId}/sections/professionalInfo.
   */
  professionalInfo$(
    accountId: string,
  ): Observable<ProfessionalInformation | null> {
    return this.readSection$<ProfessionalInformation>(
      `accounts/${accountId}/sections/professionalInfo`,
    );
  }

  /**
   * Reads accounts/{accountId}/sections/laborRights.
   */
  laborRights$(accountId: string): Observable<any | null> {
    return this.readSection$<any>(`accounts/${accountId}/sections/laborRights`);
  }
}
