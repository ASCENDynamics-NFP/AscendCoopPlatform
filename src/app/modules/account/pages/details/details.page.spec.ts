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
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {Router, ActivatedRoute} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  selectSelectedAccount,
  selectRelatedAccountsByAccountId,
  selectRelatedAccounts,
} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors"; // Corrected import path
import {Timestamp} from "firebase/firestore";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {AuthUser} from "../../../../models/auth-user.model";
import {of} from "rxjs";
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
    await TestBed.configureTestingModule({
      declarations: [DetailsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            account: {
              accounts: [mockAccount],
              relatedAccounts: mockRelatedAccounts,
              selectedAccount: mockAccount,
              loading: false,
              error: null,
            },
          },
          selectors: [
            {selector: selectAuthUser, value: mockAuthUser},
            {selector: selectSelectedAccount, value: mockAccount},
            {selector: selectRelatedAccounts, value: mockRelatedAccounts},
          ],
        }),
        {provide: Router, useValue: {navigate: jasmine.createSpy("navigate")}},
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({get: () => mockAccountId}),
            snapshot: {paramMap: {get: () => mockAccountId}},
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadAccount and setSelectedAccount on ngOnInit", () => {
    spyOn(store, "dispatch");
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadAccount({accountId: mockAccountId}),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.setSelectedAccount({accountId: mockAccountId}),
    );
  });

  it("should select related accounts for the current account", (done) => {
    component.ngOnInit();

    component.relatedAccounts$.subscribe((relatedAccounts) => {
      expect(relatedAccounts).toEqual(mockRelatedAccounts);
      done();
    });
  });

  it("should combine account and auth user to determine profile ownership", (done) => {
    component.isProfileOwner$.subscribe((isOwner) => {
      expect(isOwner).toBeTrue();
      done();
    });
  });
});
