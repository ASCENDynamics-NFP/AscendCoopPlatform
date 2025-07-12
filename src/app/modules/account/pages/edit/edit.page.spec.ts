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
// src/app/modules/account/pages/edit/edit.page.spec.ts

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {EditPage} from "./edit.page";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {of, BehaviorSubject} from "rxjs";
import {Account} from "@shared/models/account.model";
import {AuthUser} from "@shared/models/auth-user.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";

describe("EditPage", () => {
  let component: EditPage;
  let fixture: ComponentFixture<EditPage>;
  let store: jasmine.SpyObj<Store<any>>;
  let activatedRoute: ActivatedRoute;
  let router: jasmine.SpyObj<Router>;

  let authUserSubject: BehaviorSubject<AuthUser | null>;
  let accountSubject: BehaviorSubject<Account | undefined>;

  beforeEach(async () => {
    authUserSubject = new BehaviorSubject<AuthUser | null>(null);
    accountSubject = new BehaviorSubject<Account | undefined>(undefined);

    const storeSpy = jasmine.createSpyObj("Store", ["dispatch", "select"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [EditPage],
      providers: [
        {provide: Store, useValue: storeSpy},
        {provide: Router, useValue: routerSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => "test-account-id",
            }),
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    store.select.and.callFake((selector: any) => {
      if (selector === selectAuthUser) {
        return authUserSubject.asObservable();
      }
      if (selector.toString().includes("selectAccountById")) {
        return accountSubject.asObservable();
      }
      return of(null);
    });

    fixture = TestBed.createComponent(EditPage);
    component = fixture.componentInstance;
  });

  it("should dispatch loadAccount and setSelectedAccount on init", () => {
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadAccount({accountId: "test-account-id"}),
    );
  });

  //   it("should redirect if user is not profile owner", fakeAsync(() => {
  //     const authUser: AuthUser = {uid: "user-123"} as AuthUser;
  //     const account: Account = {id: "user-123"} as Account;

  //     authUserSubject.next(authUser);
  //     accountSubject.next(account);

  //     component.ngOnInit();

  //     tick();

  //     expect(router.navigate).toHaveBeenCalledWith(["/account/user-123"]);
  //   }));

  it("should not redirect if user is profile owner", fakeAsync(() => {
    const authUser: AuthUser = {uid: "test-account-id"} as AuthUser;
    const account: Account = {id: "test-account-id"} as Account;

    authUserSubject.next(authUser);
    accountSubject.next(account);

    component.ngOnInit();

    tick();

    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it("should set selectedForm when onItemSelected is called", () => {
    component.onItemSelected("advanced");

    expect(component.selectedForm).toBe("advanced");
  });
});
