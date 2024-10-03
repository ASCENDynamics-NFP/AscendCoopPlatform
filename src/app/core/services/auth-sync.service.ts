// src/app/core/services/auth-sync.service.ts
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import * as AuthActions from "../../state/actions/auth.actions";

@Injectable({providedIn: "root"})
export class AuthSyncService {
  private auth = getAuth();

  constructor(private store: Store) {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.store.dispatch(AuthActions.signInSuccess({user}));
      } else {
        this.store.dispatch(AuthActions.signOutSuccess());
      }
    });
  }
}
