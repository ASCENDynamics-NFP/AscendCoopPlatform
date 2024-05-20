import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs/operators";
import {of} from "rxjs";
import {FirestoreService} from "./../../services/firestore.service";
import {
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
} from "./../actions/account.actions";

@Injectable()
export class AccountEffects {
  loadAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAccount),
      mergeMap((action) =>
        this.firestoreService.getDocById("accounts", action.accountId).pipe(
          map((account) => loadAccountSuccess({account})),
          catchError((error) => of(loadAccountFailure({error}))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
  ) {}
}
