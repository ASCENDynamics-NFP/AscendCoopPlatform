/*******************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/
// src/app/modules/time-tracking/pages/timer/timer.page.ts

import {Component} from "@angular/core";
import {Store} from "@ngrx/store";
import * as TimeActions from "../../../../state/actions/time.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {Observable} from "rxjs";
import {AuthUser} from "@shared/models/auth-user.model";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.page.html",
  styleUrls: ["./timer.page.scss"],
})
export class TimerPage {
  authUser$: Observable<AuthUser | null>;
  runningEntryId: string | null = null;

  constructor(private store: Store) {
    this.authUser$ = this.store.select(selectAuthUser);
  }

  start() {
    this.authUser$
      .subscribe((user) => {
        if (user) {
          this.store.dispatch(
            TimeActions.startEntry({userId: user.uid, entry: {}}),
          );
        }
      })
      .unsubscribe();
  }

  stop() {
    if (!this.runningEntryId) return;
    this.authUser$
      .subscribe((user) => {
        if (user) {
          this.store.dispatch(
            TimeActions.stopEntry({
              userId: user.uid,
              entryId: this.runningEntryId!,
            }),
          );
          this.runningEntryId = null;
        }
      })
      .unsubscribe();
  }
}
