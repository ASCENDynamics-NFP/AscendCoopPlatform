import {Injectable, Injector} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ContactInformation} from "@shared/models/account.model";

@Injectable({providedIn: "root"})
export class AccountSectionsService {
  constructor(private injector: Injector) {}

  /**
   * Reads accounts/{accountId}/sections/contactInfo with graceful fallback on permission errors.
   * Returns null when not accessible or missing.
   */
  contactInfo$(accountId: string): Observable<ContactInformation | null> {
    let afs: AngularFirestore | null = null;
    try {
      afs = this.injector.get(AngularFirestore);
    } catch (e) {
      // Tests or environments without AngularFire setup
      return of(null);
    }
    const doc = afs.doc<ContactInformation>(
      `accounts/${accountId}/sections/contactInfo`,
    );
    return doc.valueChanges().pipe(
      map((v) => (v ? v : null)),
      catchError(() => of(null)),
    );
  }
}
