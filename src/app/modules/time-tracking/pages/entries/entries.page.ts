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
// src/app/modules/time-tracking/pages/entries/entries.page.ts

import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {TimeEntry} from "@shared/models/time-entry.model";
import * as TimeActions from "../../../../state/actions/time.actions";
import {
  selectAllEntries,
  selectLoading,
} from "../../../../state/selectors/time.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AuthUser} from "@shared/models/auth-user.model";

@Component({
  selector: "app-entries",
  templateUrl: "./entries.page.html",
  styleUrls: ["./entries.page.scss"],
})
export class EntriesPage implements OnInit {
  entries$: Observable<TimeEntry[]>;
  loading$: Observable<boolean>;
  authUser$: Observable<AuthUser | null>;

  constructor(private store: Store) {
    this.entries$ = this.store.select(selectAllEntries);
    this.loading$ = this.store.select(selectLoading);
    this.authUser$ = this.store.select(selectAuthUser);
  }

  ngOnInit() {
    this.authUser$
      .subscribe((user) => {
        if (user) {
          this.store.dispatch(TimeActions.loadEntries({userId: user.uid}));
        }
      })
      .unsubscribe();
  }
}
