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
// src/app/core/services/auth-sync.service.ts
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import * as AuthActions from "../../state/actions/auth.actions";
import {AuthUser} from "../../models/auth-user.model";

@Injectable({providedIn: "root"})
export class AuthSyncService {
  private auth = getAuth();

  constructor(private store: Store) {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        const authUser: AuthUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          heroImage: "src/assets/image/orghero.png",
          iconImage: user.photoURL || "src/assets/avatar/male1.png",
          tagline: "",
          type: "",
          emailVerified: false,
          createdAt: user.metadata.creationTime
            ? new Date(user.metadata.creationTime)
            : new Date(),
          lastLoginAt: user.metadata.lastSignInTime
            ? new Date(user.metadata.lastSignInTime)
            : new Date(),
          phoneNumber: null,
          providerData: [],
          settings: {
            language: "en",
            theme: "system",
          },
        };
        this.store.dispatch(AuthActions.signInSuccess({user: authUser}));
      } else {
        this.store.dispatch(AuthActions.signOutSuccess());
      }
    });
  }
}
