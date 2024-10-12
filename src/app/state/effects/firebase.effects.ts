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
// src/app/state/firestore/firestore.effects.ts
import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as FirestoreActions from "../actions/firestore.actions";
import {FirestoreService} from "../../core/services/firestore.service";
import {map, catchError, switchMap} from "rxjs/operators";
import {of} from "rxjs";

@Injectable()
export class FirestoreEffects {
  loadDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FirestoreActions.loadDocument),
      switchMap(({collectionName, documentId}) =>
        this.firestoreService.getDocument(collectionName, documentId).pipe(
          map((document) => FirestoreActions.loadDocumentSuccess({document})),
          catchError((error) =>
            of(FirestoreActions.loadDocumentFailure({error})),
          ),
        ),
      ),
    ),
  );

  // ...other effects for add, update, delete documents

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
  ) {}
}
