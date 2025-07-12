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
// src/app/modules/account/pages/registration/registration.page.spec.ts

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {RegistrationPage} from "./registration.page";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {of, Subject} from "rxjs";
import {Account} from "@shared/models/account.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {AuthUser} from "@shared/models/auth-user.model";

describe("RegistrationPage", () => {
  let component: RegistrationPage;
  let fixture: ComponentFixture<RegistrationPage>;
  let store: jasmine.SpyObj<Store<any>>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj("Store", ["dispatch", "select"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [RegistrationPage],
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

    fixture = TestBed.createComponent(RegistrationPage);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadAccount action on init", () => {
    store.select.and.returnValue(of(undefined));

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadAccount({accountId: "test-account-id"}),
    );
  });

  it("should not navigate if account does not have type", fakeAsync(() => {
    const account: Account = {id: "test-account-id"} as Account;
    const accountSubject = new Subject<Account | undefined>();
    store.select.and.returnValue(accountSubject.asObservable());

    component.ngOnInit();

    // Emit the account without type
    accountSubject.next(account);
    tick();

    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it("should update selectedType when selectType is called", () => {
    component.selectType("user");
    expect(component.selectedType).toBe("user");
  });
});
