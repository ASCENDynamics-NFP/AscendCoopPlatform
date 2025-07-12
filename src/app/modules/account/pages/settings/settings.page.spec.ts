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
// src/app/modules/account/pages/settings/settings.page.spec.ts

import {TestBed, ComponentFixture} from "@angular/core/testing";
import {SettingsPage} from "./settings.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AuthUser} from "@shared/models/auth-user.model";
import {Account} from "@shared/models/account.model";
import {Timestamp} from "firebase/firestore";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("SettingsPage", () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let store: MockStore;
  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: null,
    iconImage: null,
    emailVerified: true,
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
  };

  // Initial mock state
  const initialState = {
    auth: {user: mockAuthUser},
    accounts: {[mockAuthUser.uid]: mockAccount},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [provideMockStore({initialState})],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit undefined if no authenticated user is found", () => {
    store.overrideSelector(selectAuthUser, null);

    let account: Account | undefined;
    component.account$.subscribe((acc) => (account = acc));

    expect(account).toBeUndefined();
  });

  it("should handle a user without a valid UID gracefully", () => {
    store.overrideSelector(selectAuthUser, {...mockAuthUser, uid: ""});

    let account: Account | undefined;
    component.account$.subscribe((acc) => (account = acc));

    expect(account).toBeUndefined();
  });
});
