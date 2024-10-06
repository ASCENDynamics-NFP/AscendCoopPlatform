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

import {ComponentFixture, TestBed} from "@angular/core/testing";
import {EditPage} from "./edit.page";
import {ActivatedRoute, Router} from "@angular/router";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account} from "../../../../models/account.model";
import {Timestamp} from "firebase/firestore";

describe("EditPage", () => {
  let component: EditPage;
  let fixture: ComponentFixture<EditPage>;
  let store: MockStore;
  let router: Router;

  const mockAccountId = "123";

  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: null,
    photoURL: null,
    emailVerified: false,
  };

  const mockAccount: Account = {
    id: "12345",
    name: "Test Account",
    type: "user",
    privacy: "public",
    relatedAccounts: [],
    tagline: "",
    description: "",
    iconImage: "",
    heroImage: "",
    legalAgreements: {
      termsOfService: {
        accepted: false,
        datetime: new Timestamp(0, 0),
        version: "",
      },
      privacyPolicy: {
        accepted: false,
        datetime: new Timestamp(0, 0),
        version: "",
      },
    },
    webLinks: [],
    lastLoginAt: new Timestamp(0, 0),
    email: "",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPage],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: {navigate: jasmine.createSpy("navigate")},
        },
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: {get: () => mockAccountId}}},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPage);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    store.overrideSelector(selectAuthUser, mockAuthUser);
    store.overrideSelector(selectAccountById(mockAccountId), mockAccount);

    fixture.detectChanges();
  });
  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize accountId from the route params", () => {
    expect(component["accountId"]).toBe(mockAccountId);
  });

  it("should dispatch loadAccount action on ngOnInit", () => {
    spyOn(store, "dispatch");

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadAccount({accountId: mockAccountId}),
    );
  });

  it("should select the account based on accountId", (done) => {
    component.account$.subscribe((account) => {
      expect(account).toEqual(mockAccount);
      done();
    });
  });

  it("should select the auth user", (done) => {
    component.authUser$.subscribe((authUser) => {
      expect(authUser).toEqual(mockAuthUser);
      done();
    });
  });

  it("should set isProfileOwner$ correctly", (done) => {
    component.isProfileOwner$.subscribe((isOwner) => {
      expect(isOwner).toBeTrue();
      done();
    });
  });

  it("should redirect to the account page if not the profile owner", () => {
    store.overrideSelector(selectAuthUser, {
      uid: "different-id",
      email: "",
      displayName: "",
      photoURL: "",
      emailVerified: false,
    });
    fixture.detectChanges();

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(["/" + mockAccountId]);
  });

  it("should set selectedForm on onItemSelected", () => {
    component.onItemSelected("contact");

    expect(component.selectedForm).toBe("contact");
  });
});
