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
// src/app/modules/account/pages/details/details.page.spec.ts

import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DetailsPage} from "./details.page";
import {ActivatedRoute, Router} from "@angular/router";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectSelectedAccount,
  selectRelatedAccounts,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account} from "../../../../models/account.model";
import {Timestamp} from "firebase/firestore";

describe("DetailsPage", () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;
  let store: MockStore;
  let router: Router;

  const mockAccountId = "12345";
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
      declarations: [DetailsPage],
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

    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    store.overrideSelector(selectAuthUser, mockAuthUser);
    store.overrideSelector(selectSelectedAccount, mockAccount);
    store.overrideSelector(selectRelatedAccounts, []);

    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize accountId from the route params", () => {
    expect(component.accountId).toBe(mockAccountId);
  });

  it("should dispatch loadAccount, setSelectedAccount, and loadRelatedAccounts on ngOnInit", () => {
    spyOn(store, "dispatch");

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadAccount({accountId: mockAccountId}),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.setSelectedAccount({accountId: mockAccountId}),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadRelatedAccounts({accountId: mockAccountId}),
    );
  });

  it("should select the account based on accountId", (done) => {
    component.fullAccount$.subscribe((account) => {
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

  it("should redirect to the registration page if account type is not defined", () => {
    store.overrideSelector(selectSelectedAccount, mockAccount);
    fixture.detectChanges();

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith([
      "/registration/" + mockAccountId,
    ]);
  });

  it("should scroll to section correctly", () => {
    const sectionId = "test-section";
    const mockElement = document.createElement("div");
    mockElement.style.position = "absolute";
    mockElement.style.top = "200px";
    document.body.appendChild(mockElement);
    spyOn(document, "getElementById").and.returnValue(mockElement);
    spyOn(component.content, "scrollToPoint");

    component.scrollToSection(sectionId);

    expect(component.content.scrollToPoint).toHaveBeenCalledWith(0, 200, 500);
  });
});
