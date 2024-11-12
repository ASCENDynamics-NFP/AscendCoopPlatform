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
// src/app/modules/account/pages/group-list/group-list.page.spec.ts

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import {GroupListPage} from "./group-list.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {FormsModule} from "@angular/forms";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {AuthUser} from "../../../../models/auth-user.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  selectAccountLoading,
  selectFilteredAccounts,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {Timestamp} from "firebase/firestore";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {of} from "rxjs";

describe("GroupListPage", () => {
  let component: GroupListPage;
  let fixture: ComponentFixture<GroupListPage>;
  let store: MockStore;

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

  const mockGroup: Account = {
    id: "groupId",
    name: "Test Group",
    type: "group",
    privacy: "public",
    tagline: "Test Tagline",
    description: "",
    iconImage: "icon.png",
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
      declarations: [GroupListPage],
      imports: [FormsModule],
      providers: [provideMockStore()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAuthUser, null);
    store.overrideSelector(selectAccountLoading, false);

    const filteredAccountsSelector = selectFilteredAccounts("", "group");
    store.overrideSelector(filteredAccountsSelector, []);

    const relatedAccountsSelector = selectRelatedAccountsByAccountId("12345");
    store.overrideSelector(relatedAccountsSelector, []);

    fixture = TestBed.createComponent(GroupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize observables and dispatch loadAccounts on ngOnInit", () => {
    spyOn(store, "dispatch");
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(AccountActions.loadAccounts());
  });

  it("should load related accounts in ionViewWillEnter when auth user exists", () => {
    spyOn(store, "dispatch");
    store.overrideSelector(selectAuthUser, mockAuthUser);
    store.refreshState();
    component.ionViewWillEnter();
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadRelatedAccounts({accountId: mockAuthUser.uid}),
    );
  });

  it("should update searchTerms when search is called", () => {
    spyOn(component["searchTerms"], "next");
    const mockEvent = {target: {value: "test"}};
    component.search(mockEvent);
    expect(component["searchTerms"].next).toHaveBeenCalledWith("test");
  });

  it("should dispatch createRelatedAccount with correct payload", () => {
    spyOn(store, "dispatch");
    store.overrideSelector(selectAuthUser, mockAuthUser);
    store.refreshState();
    component.ngOnInit();

    component.sendRequest(mockGroup);

    const expectedRelatedAccount: RelatedAccount = {
      id: mockGroup.id,
      accountId: mockAuthUser.uid,
      initiatorId: mockAuthUser.uid,
      targetId: mockGroup.id,
      type: "group",
      status: "pending",
      relationship: "member",
      tagline: mockGroup.tagline,
      name: mockGroup.name,
      iconImage: mockGroup.iconImage,
    };

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.createRelatedAccount({
        accountId: mockAuthUser.uid,
        relatedAccount: expectedRelatedAccount,
      }),
    );
  });

  // it("should return false from showRequestButton for matching relationship", (done) => {
  //   const mockRelatedAccount: RelatedAccount = {
  //     id: mockGroup.id,
  //     accountId: mockAuthUser.uid,
  //     initiatorId: mockAuthUser.uid,
  //     targetId: mockGroup.id,
  //     type: "group",
  //     status: "pending",
  //     relationship: "member",
  //     tagline: mockGroup.tagline,
  //     name: mockGroup.name,
  //     iconImage: mockGroup.iconImage,
  //   };

  //   store.overrideSelector(selectAuthUser, mockAuthUser);
  //   const relatedAccountsSelector = selectRelatedAccountsByAccountId(
  //     mockAuthUser.uid,
  //   );
  //   store.overrideSelector(relatedAccountsSelector, [mockRelatedAccount]);
  //   store.refreshState();

  //   component.showRequestButton(mockGroup).subscribe((result) => {
  //     expect(result).toBeFalse();
  //     done();
  //   });
  // });

  // it("should return true from showRequestButton when no matching relationship exists", fakeAsync(() => {
  //   store.overrideSelector(
  //     selectRelatedAccountsByAccountId(mockAuthUser.uid),
  //     [],
  //   );
  //   store.refreshState();

  //   let result: boolean | undefined;
  //   component.showRequestButton(mockGroup).subscribe((value) => {
  //     result = value;
  //   });

  //   tick();

  //   expect(result).toBeTrue();
  // }));
});
