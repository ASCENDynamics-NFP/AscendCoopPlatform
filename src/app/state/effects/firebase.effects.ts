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
