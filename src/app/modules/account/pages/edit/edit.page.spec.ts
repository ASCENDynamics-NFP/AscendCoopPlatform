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
  waitForAsync,
} from "@angular/core/testing";
import {EditPage} from "./edit.page";
import {ActivatedRoute} from "@angular/router";
import {StoreModule, Store} from "@ngrx/store";
import {authReducer} from "../../../../state/reducers/auth.reducer";
import {accountReducer} from "../../../../state/reducers/account.reducer";
import {TranslateModule} from "@ngx-translate/core";
import {of} from "rxjs";
import {By} from "@angular/platform-browser";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
import {AppEditMenuComponent} from "../../../../shared/components/app-edit-menu/app-edit-menu.component";
import {AppBasicInfoComponent} from "../../../../shared/components/app-basic-info/app-basic-info.component";
import {AppContactInfoComponent} from "../../../../shared/components/app-contact-info/app-contact-info.component";
import {AppProfessionalInfoComponent} from "../../../../shared/components/app-professional-info/app-professional-info.component";
import {AppVolunteerPreferenceInfoComponent} from "../../../../shared/components/app-volunteer-preference-info/app-volunteer-preference-info.component";
import {AppMutualAidCommunityEngagementComponent} from "../../../../shared/components/app-mutual-aid-community-engagement/app-mutual-aid-community-engagement.component";
import {AppLaborRightsInfoComponent} from "../../../../shared/components/app-labor-rights-info/app-labor-rights-info.component";

describe("EditPage", () => {
  let component: EditPage;
  let fixture: ComponentFixture<EditPage>;
  let store: Store;
  let activatedRoute: ActivatedRoute;

  beforeEach(waitForAsync(() => {
    const activatedRouteSpy = {
      snapshot: {paramMap: {get: () => "account123"}},
    };

    TestBed.configureTestingModule({
      declarations: [
        EditPage,
        AppHeaderComponent,
        AppEditMenuComponent,
        AppBasicInfoComponent,
        AppContactInfoComponent,
        AppProfessionalInfoComponent,
        AppVolunteerPreferenceInfoComponent,
        AppMutualAidCommunityEngagementComponent,
        AppLaborRightsInfoComponent,
      ],
      imports: [
        StoreModule.forRoot({auth: authReducer, account: accountReducer}),
        TranslateModule.forRoot(),
      ],
      providers: [{provide: ActivatedRoute, useValue: activatedRouteSpy}],
    }).compileComponents();

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(EditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create EditPage component", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadAccount on initialization", () => {
    spyOn(store, "dispatch");
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: "[Account] Load Account",
        accountId: "account123",
      }),
    );
  });

  it("should set authUser correctly from the store", () => {
    // Mock authUser
    const mockAuthUser: AuthUser = {
      uid: "account123",
      email: "user@example.com",
      displayName: "User Name",
      photoURL: "http://example.com/photo.jpg",
      emailVerified: true,
    };

    store.dispatch({
      type: "[Auth] Sign In Success",
      user: mockAuthUser,
    });

    fixture.detectChanges();

    expect(component.authUser).toEqual(mockAuthUser);
  });

  it("should set account correctly from the store", () => {
    const mockAccount: Account = {
      id: "account123",
      name: "Test Account",
      type: "user",
      // Add other necessary properties
    };

    store.dispatch({
      type: "[Account] Load Account Success",
      account: mockAccount,
    });

    fixture.detectChanges();

    expect(component.account).toEqual(mockAccount);
  });

  it("should determine isProfileOwner correctly", () => {
    const mockAuthUser: AuthUser = {
      uid: "account123",
      email: "user@example.com",
      displayName: "User Name",
      photoURL: "http://example.com/photo.jpg",
      emailVerified: true,
    };

    store.dispatch({
      type: "[Auth] Sign In Success",
      user: mockAuthUser,
    });

    const mockAccount: Account = {
      id: "account123",
      name: "Test Account",
      type: "user",
      // Add other necessary properties
    };

    store.dispatch({
      type: "[Account] Load Account Success",
      account: mockAccount,
    });

    fixture.detectChanges();

    expect(component.isProfileOwner).toBeTrue();

    // Change account ID to test false case
    const mockDifferentAccount: Account = {
      id: "differentAccount",
      name: "Different Account",
      type: "user",
      // Add other necessary properties
    };

    store.dispatch({
      type: "[Account] Load Account Success",
      account: mockDifferentAccount,
    });

    fixture.detectChanges();

    expect(component.isProfileOwner).toBeFalse();
  });

  it("should render app-profile and app-contact-information components", () => {
    const mockAccount: Account = {
      id: "account123",
      name: "Test Account",
      type: "user",
      // Add other necessary properties
    };

    store.dispatch({
      type: "[Account] Load Account Success",
      account: mockAccount,
    });

    fixture.detectChanges();

    const profileComponent = fixture.debugElement.query(
      By.directive(AppProfileComponent),
    );
    expect(profileComponent).toBeTruthy();

    const contactInfoComponent = fixture.debugElement.query(
      By.directive(AppContactInfoComponent),
    );
    expect(contactInfoComponent).toBeTruthy();
  });

  it("should display loading template when account data is not yet loaded", () => {
    // Ensure account is not loaded
    store.dispatch({
      type: "[Account] Load Account",
      accountId: "account123",
    });

    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css("ng-template"));
    expect(loadingElement).toBeTruthy();
  });
});
