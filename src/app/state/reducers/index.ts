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
// src/app/state/reducers/index.ts

import {ActionReducerMap} from "@ngrx/store";
import {AuthState, authReducer} from "./auth.reducer";
import {AccountState, accountReducer} from "./account.reducer";
import {ListingsState, listingsReducer} from "./listings.reducer";
// Other imports...

export interface AppState {
  auth: AuthState;
  account: AccountState;
  listing: ListingsState;
  // Other states...
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  account: accountReducer,
  listing: listingsReducer,
  // Other reducers...
};
