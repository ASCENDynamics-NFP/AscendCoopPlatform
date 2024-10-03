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
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import {DetailsPage} from "./details.page";
import {ActivatedRoute, Router} from "@angular/router";
import {StoreModule, Store} from "@ngrx/store";
import {authReducer} from "../../../../state/reducers/auth.reducer";
import {accountReducer} from "../../../../state/reducers/account.reducer";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {of} from "rxjs";
import {By} from "@angular/platform-browser";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
import {AppProfileComponent} from "../../../../shared/components/app-profile/app-profile.component";
import {AppContactInformationComponent} from "../../../../shared/components/app-contact-information/app-contact-information.component";
import {AppProfessionalInfoComponent} from "../../../../shared/components/app-professional-info/app-professional-info.component";
import {AppRelatedAccountsComponent} from "../../../../shared/components/app-related-accounts/app-related-accounts.component";
import {AppVolunteerPreferenceInfoComponent} from "../../../../shared/components/app-volunteer-preference-info/app-volunteer-preference-info.component";
import {AppMutualAidCommunityInfoComponent} from "../../../../shared/components/app-mutual-aid-community-info/app-mutual-aid-community-info.component";

describe("DetailsPage", () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;
  let store: Store;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      declarations: [
        DetailsPage,
        AppHeaderComponent,
        AppProfileComponent,
        AppContactInformationComponent,
        AppProfessionalInfoComponent,
        AppRelatedAccountsComponent,
        AppVolunteerPreferenceInfoComponent,
        AppMutualAidCommunityInfoComponent,
      ],
      imports: [
        StoreModule.forRoot({auth: authReducer, account: accountReducer}),
        TranslateModule.forRoot(),
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {paramMap: {get: () => "account123"}},
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create DetailsPage component", () => {
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

  it("should navigate to registration if account.type is falsy", fakeAsync(() => {
    spyOn(router, "navigate");

    // Mock the selected account with type falsy
    store.dispatch({
      type: "[Account] Load Account Success",
      account: {
        id: "account123",
        name: "Test Account",
        type: null,
      },
    });

    tick();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(["/registration/account123"]);
  }));

  it("should map fullAccount correctly when account is present", () => {
    // Mock the selected account with type truthy
    store.dispatch({
      type: "[Account] Load Account Success",
      account: {
        id: "account123",
        name: "Test Account",
        type: "user",
      },
    });

    store.dispatch({
      type: "[Account] Load Related Accounts Success",
      relatedAccounts: [
        {id: "related1", name: "Related Account 1"},
        {id: "related2", name: "Related Account 2"},
      ],
    });

    fixture.detectChanges();

    component.fullAccount$.subscribe((fullAccount) => {
      expect(fullAccount).toEqual({
        id: "account123",
        name: "Test Account",
        type: "user",
        relatedAccounts: [
          {id: "related1", name: "Related Account 1"},
          {id: "related2", name: "Related Account 2"},
        ],
      });
    });
  });

  it("should set isProfileOwner to true if authUser.uid matches account.id", () => {
    // Mock authUser
    store.dispatch({
      type: "[Auth] Sign In Success",
      user: {
        uid: "account123",
        email: "user@example.com",
        displayName: "User Name",
        photoURL: "http://example.com/photo.jpg",
        emailVerified: true,
      },
    });

    // Mock the selected account
    store.dispatch({
      type: "[Account] Load Account Success",
      account: {
        id: "account123",
        name: "Test Account",
        type: "user",
      },
    });

    fixture.detectChanges();

    component.isProfileOwner$.subscribe((isOwner) => {
      expect(isOwner).toBeTrue();
    });
  });

  it("should set isProfileOwner to false if authUser.uid does not match account.id", () => {
    // Mock authUser
    store.dispatch({
      type: "[Auth] Sign In Success",
      user: {
        uid: "differentAccount",
        email: "user@example.com",
        displayName: "User Name",
        photoURL: "http://example.com/photo.jpg",
        emailVerified: true,
      },
    });

    // Mock the selected account
    store.dispatch({
      type: "[Account] Load Account Success",
      account: {
        id: "account123",
        name: "Test Account",
        type: "user",
      },
    });

    fixture.detectChanges();

    component.isProfileOwner$.subscribe((isOwner) => {
      expect(isOwner).toBeFalse();
    });
  });

  it("should render app-profile and app-contact-information components", () => {
    // Mock authUser
    store.dispatch({
      type: "[Auth] Sign In Success",
      user: {
        uid: "account123",
        email: "user@example.com",
        displayName: "User Name",
        photoURL: "http://example.com/photo.jpg",
        emailVerified: true,
      },
    });

    // Mock the selected account
    store.dispatch({
      type: "[Account] Load Account Success",
      account: {
        id: "account123",
        name: "Test Account",
        type: "user",
      },
    });

    fixture.detectChanges();

    const profileComponent = fixture.debugElement.query(
      By.directive(AppProfileComponent),
    );
    expect(profileComponent).toBeTruthy();

    const contactInfoComponent = fixture.debugElement.query(
      By.directive(AppContactInformationComponent),
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
