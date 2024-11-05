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

import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Store} from "@ngrx/store";
import {SettingsPage} from "./settings.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account} from "../../../../models/account.model";
import {Timestamp} from "firebase/firestore";
import {SharedModule} from "../../../../shared/shared.module";
import {AngularDelegate, IonicModule, PopoverController} from "@ionic/angular";
import {of} from "rxjs";

describe("SettingsPage", () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: null,
    photoURL: null,
    emailVerified: true,
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPage],
      imports: [SharedModule, IonicModule.forRoot()],
      providers: [provideMockStore(), AngularDelegate, PopoverController],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    dispatchSpy = spyOn(store, "dispatch");

    // Set up the mock selectors to return observables
    store.overrideSelector(selectAuthUser, mockAuthUser);

    // Use the selector factory with the correct accountId and override its return value
    store.overrideSelector(selectAccountById("12345"), mockAccount);

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;

    // Call ngOnInit explicitly
    component.ngOnInit();
  });

  beforeEach(() => {
    // Reset the calls for dispatchSpy between tests
    dispatchSpy.calls.reset();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should select authUser$", (done) => {
    component.authUser$.subscribe((authUser) => {
      expect(authUser).toEqual(mockAuthUser);
      done();
    });
  });

  // it("should dispatch loadAccount action on authUser change", (done) => {
  //   component.authUser$.subscribe(() => {
  //     expect(dispatchSpy).toHaveBeenCalledWith(
  //       AccountActions.loadAccount({accountId: mockAuthUser.uid}),
  //     );
  //     done();
  //   });
  // });

  // it("should select account$ based on authUser uid", (done) => {
  //   component.account$.subscribe((account) => {
  //     expect(account).toEqual(mockAccount);
  //     done();
  //   });
  // });

  it("should not dispatch loadAccount if authUser is null", (done) => {
    store.overrideSelector(selectAuthUser, null);
    component.ngOnInit(); // Call ngOnInit to trigger the logic

    component.authUser$.subscribe(() => {
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        AccountActions.loadAccount({accountId: mockAuthUser.uid}),
      );
      done();
    });
  });
});
