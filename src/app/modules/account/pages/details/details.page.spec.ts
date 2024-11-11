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

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import {DetailsPage} from "./details.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {ActivatedRoute, Router} from "@angular/router";
import {of} from "rxjs";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {AuthUser} from "../../../../models/auth-user.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  selectAccountById,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {Timestamp} from "firebase/firestore";

describe("DetailsPage", () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;
  let store: MockStore;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockAccountId = "12345";
  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: null,
    iconImage: null,
    emailVerified: false,
    heroImage: null,
    tagline: null,
    type: null,
    createdAt: null,
    lastLoginAt: null,
    phoneNumber: null,
    providerData: [],
    settings: {language: "en", theme: "light"},
  };

  const mockAccount: Account = {
    id: "12345",
    name: "Test Account",
    type: "user",
    privacy: "public",
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
    relatedAccountIds: ["ra1", "ra2"],
    relatedListingIds: ["rl1", "rl2"],
  };

  const mockRelatedAccounts: RelatedAccount[] = [
    {id: "ra1", type: "user", status: "accepted", accountId: mockAccountId},
    {id: "ra2", type: "group", status: "accepted", accountId: mockAccountId},
  ];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [DetailsPage],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => mockAccountId,
            }),
          },
        },
        {provide: Router, useValue: routerSpy},
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;

    // Mock the selectors
    store.overrideSelector(selectAuthUser, mockAuthUser);
    store.overrideSelector(selectAccountById(mockAccountId), mockAccount);
    store.overrideSelector(selectRelatedAccountsByAccountId(mockAccountId), []);

    // Spy on dispatch
    spyOn(store, "dispatch");

    // Call lifecycle methods
    component.ngOnInit();
    component.ionViewWillEnter();

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadAccount and setSelectedAccount on ionViewWillEnter", () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadAccount({accountId: mockAccountId}),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.setSelectedAccount({accountId: mockAccountId}),
    );
  });

  // it("should select related accounts for the current account", (done) => {
  //   component.relatedAccounts$.subscribe((relatedAccounts) => {
  //     expect(relatedAccounts).toEqual([]);
  //     done();
  //   });
  // });

  // it("should combine account and auth user to determine profile ownership", fakeAsync(() => {
  //   let isOwner: boolean | undefined;
  //   component.isProfileOwner$.subscribe((value) => {
  //     isOwner = value;
  //   });

  //   tick();

  //   expect(isOwner).toBeFalse(); // Or true, depending on your mock data
  // }));
});
