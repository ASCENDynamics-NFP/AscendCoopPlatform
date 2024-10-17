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
import {map} from "rxjs/operators";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccounts} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account} from "../../../../models/account.model";
import {Timestamp} from "firebase/firestore";

describe("SearchPage", () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;
  let mockStore: any;
  let mockActivatedRoute: any;

  const mockAuthUser: AuthUser = {
    uid: "user123",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
    emailVerified: true,
  };

  const mockAccounts: Account[] = [
    {
      id: "group1",
      name: "Group 1",
      type: "group",
      groupDetails: {admins: ["user123"]},
    } as Account,
    {id: "user2", name: "User 2", type: "user"} as Account,
    {
      id: "group2",
      name: "Group 2",
      type: "group",
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
      groupDetails: {admins: []},
    } as Account,
  ];

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy("select").and.callFake((selector: any) => {
        if (selector === selectAuthUser) {
          return of(mockAuthUser);
        } else if (selector === selectAccounts) {
          return of(mockAccounts);
        }
        return of([]);
      }),
      dispatch: jasmine.createSpy("dispatch"),
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy("get").and.returnValue("group1"),
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [SearchPage],
      providers: [
        {provide: Store, useValue: mockStore},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
      ],
      imports: [StoreModule.forRoot({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the SearchPage component", () => {
    expect(component).toBeTruthy();
  });

  it("should load accountId from route parameters", () => {
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith(
      "accountId",
    );
    expect(component.accountId).toEqual("group1");
  });

  it("should dispatch loadAccounts action on ngOnInit", () => {
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AccountActions.loadAccounts(),
    );
  });

  it("should select authUser from store", (done) => {
    component.authUser$.subscribe((user) => {
      expect(user).toEqual(mockAuthUser);
      done();
    });
  });

  it("should select accounts from store and filter groups and users correctly", (done) => {
    component.groups$.subscribe((groups) => {
      expect(groups.length).toBe(2);
      expect(groups[0].name).toEqual("Group 1");
    });

    component.users$.subscribe((users) => {
      expect(users.length).toBe(1);
      expect(users[0].name).toEqual("User 2");
      done();
    });
  });

  it("should correctly compute currentGroup$", (done) => {
    component.currentGroup$.subscribe((group) => {
      expect(group).toBeDefined();
      expect(group?.id).toEqual("group1");
      done();
    });
  });

  it("should correctly compute isAdmin$ when the user is an admin", (done) => {
    component.isAdmin$.subscribe((isAdmin) => {
      expect(isAdmin).toBeTrue();
      done();
    });
  });

  it("should correctly compute isAdmin$ when the user is not an admin", (done) => {
    // Change mockActivatedRoute to simulate a different group
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue("group2");
    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.isAdmin$.subscribe((isAdmin) => {
      expect(isAdmin).toBeFalse();
      done();
    });
  });

  it("should sort accounts by name", () => {
    const sortedAccounts = component.sortByName(mockAccounts);
    expect(sortedAccounts[0].name).toEqual("Group 1");
    expect(sortedAccounts[1].name).toEqual("Group 2");
    expect(sortedAccounts[2].name).toEqual("User 2");
  });
});
