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
import {getAuth, User} from "firebase/auth";
import {Store} from "@ngrx/store";
import * as AuthActions from "../../state/actions/auth.actions";
import {from, Observable, of} from "rxjs";
import {map, catchError, switchMap, take} from "rxjs/operators";
import {selectAccountById} from "../../state/selectors/account.selectors";
import {AuthUser} from "../../../../shared/models/auth-user.model";
import {Settings} from "../../../../shared/models/account.model";

@Injectable({
  providedIn: "root",
})
export class TokenRefreshService {
  private auth = getAuth();

  constructor(private store: Store) {}

  /**
   * Force refresh the user's ID token to get updated custom claims
   * and update the authUser in the store
   */
  refreshTokenAndUpdateUser(
    forceRefresh: boolean = true,
  ): Observable<AuthUser | null> {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      return of(null);
    }

    return from(currentUser.getIdTokenResult(forceRefresh)).pipe(
      switchMap((idTokenResult) => {
        return this.createAuthUserFromClaims(
          currentUser,
          idTokenResult.claims,
        ).pipe(
          map((authUser) => {
            // Update the auth user in the store with refreshed claims
            this.store.dispatch(AuthActions.updateAuthUser({user: authUser}));
            return authUser;
          }),
        );
      }),
      catchError((error) => {
        console.error("Error refreshing token:", error);
        return of(null);
      }),
    );
  }

  /**
   * Helper method to create AuthUser from claims and account data
   * This mirrors the logic in auth.effects.ts
   */
  private createAuthUserFromClaims(
    user: User,
    claims: any,
  ): Observable<AuthUser> {
    return this.store.select(selectAccountById(user.uid)).pipe(
      take(1),
      map((account) => {
        const defaultIconImage = user.photoURL || "src/assets/avatar/male1.png";
        const defaultHeroImage = "src/assets/image/orghero.png";
        const defaultTagline = "Helping others at ASCENDynamics NFP.";
        const defaultSettings: Settings = {
          language: "en",
          theme: "system",
        };

        return {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName:
            (claims["displayName"] as string) ||
            account?.name ||
            user.displayName,
          iconImage:
            (claims["iconImage"] as string) ||
            account?.iconImage ||
            defaultIconImage,
          heroImage:
            (claims["heroImage"] as string) ||
            account?.heroImage ||
            defaultHeroImage,
          tagline:
            (claims["tagline"] as string) || account?.tagline || defaultTagline,
          type: (claims["type"] as string) || account?.type || "",
          createdAt: user.metadata.creationTime
            ? new Date(user.metadata.creationTime)
            : new Date(),
          lastLoginAt: user.metadata.lastSignInTime
            ? new Date(user.metadata.lastSignInTime)
            : new Date(),
          phoneNumber:
            user.phoneNumber ||
            account?.contactInformation?.phoneNumbers?.[0]?.number ||
            null,
          providerData: user.providerData,
          settings:
            (claims["settings"] as Settings) ||
            account?.settings ||
            defaultSettings,
          claims: claims,
        };
      }),
    );
  }
}
