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
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SearchPage} from "./search.page";
import {ActivatedRoute} from "@angular/router";
import {Store, StoreModule} from "@ngrx/store";
import {of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account} from "../../../../models/account.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccounts} from "../../../../state/selectors/account.selectors";
import {Timestamp} from "firebase/firestore";

describe("SearchPage", () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;
  let mockActivatedRoute: any;
  let mockStore: any;

  const mockAccountId = "12345";
  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
    emailVerified: true,
  };

  const mockAccounts: Account[] = [
    {
      id: "12345",
      name: "Test Group",
      type: "group",
      groupDetails: {
        admins: ["12345"],
      },
      privacy: "public",
      relatedAccounts: [],
      tagline: "",
      description: "",
      iconImage: "",
      heroImage: "",
      legalAgreements: {
        termsOfService: {
          accepted: true,
          datetime: new Timestamp(0, 0),
          version: "",
        },
        privacyPolicy: {
          accepted: true,
          datetime: new Timestamp(0, 0),
          version: "",
        },
      },
      webLinks: [],
      lastLoginAt: new Timestamp(0, 0),
      email: "",
    },
    {
      id: "67890",
      name: "Test User",
      type: "user",
      privacy: "public",
      relatedAccounts: [],
      tagline: "",
      description: "",
      iconImage: "",
      heroImage: "",
      legalAgreements: {
        termsOfService: {
          accepted: true,
          datetime: new Timestamp(0, 0),
          version: "",
        },
        privacyPolicy: {
          accepted: true,
          datetime: new Timestamp(0, 0),
          version: "",
        },
      },
      webLinks: [],
      lastLoginAt: new Timestamp(0, 0),
      email: "user@test.com",
    },
  ];

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy().and.returnValue(mockAccountId),
        },
      },
    };

    mockStore = {
      dispatch: jasmine.createSpy("dispatch"),
      select: jasmine.createSpy("select"),
    };

    await TestBed.configureTestingModule({
      declarations: [SearchPage],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Store, useValue: mockStore},
      ],
      imports: [StoreModule.forRoot({})],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;

    // Set up default store selector return values
    mockStore.select.withArgs(selectAuthUser).and.returnValue(of(mockAuthUser));
    mockStore.select.withArgs(selectAccounts).and.returnValue(of(mockAccounts));

    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should set accountId from route parameters", () => {
    expect(component.accountId).toBe(mockAccountId);
  });

  it("should dispatch loadAccounts action on ngOnInit", () => {
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AccountActions.loadAccounts(),
    );
  });

  it("should subscribe to auth user and set the user property", () => {
    component.ngOnInit();
    expect(component.user).toEqual(mockAuthUser);
  });

  it("should subscribe to accounts and filter groups and users", () => {
    component.ngOnInit();
    expect(component.groups).toEqual([mockAccounts[0]]);
    expect(component.users).toEqual([mockAccounts[1]]);
  });

  it("should set currentGroup to the account matching accountId", () => {
    component.ngOnInit();
    expect(component.currentGroup).toEqual(mockAccounts[0]);
  });

  it("should return true for isAdmin if the current user is an admin of the group", () => {
    component.currentGroup = mockAccounts[0];
    component.user = mockAuthUser;
    expect(component.isAdmin).toBeTrue();
  });

  it("should return false for isAdmin if the current user is not an admin of the group", () => {
    component.currentGroup = {
      ...mockAccounts[0],
      groupDetails: {admins: ["67890"]},
    };
    component.user = mockAuthUser;
    expect(component.isAdmin).toBeFalse();
  });

  it("should unsubscribe from all subscriptions on ngOnDestroy", () => {
    spyOn(component["subscriptions"], "unsubscribe");
    component.ngOnDestroy();
    expect(component["subscriptions"].unsubscribe).toHaveBeenCalled();
  });

  it("should sort accounts by name in ascending order", () => {
    const unsortedAccounts: Account[] = [
      {...mockAccounts[1], name: "Zebra"},
      {...mockAccounts[0], name: "Apple"},
    ];
    const sortedAccounts = component.sortByName(unsortedAccounts);
    expect(sortedAccounts[0].name).toBe("Apple");
    expect(sortedAccounts[1].name).toBe("Zebra");
  });
});
