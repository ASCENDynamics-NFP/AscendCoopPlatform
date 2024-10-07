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
import {UsersPage} from "./users.page";
import {Store, StoreModule} from "@ngrx/store";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {of, Subject} from "rxjs";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account, RelatedAccount} from "../../../../models/account.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  selectFilteredAccounts,
  selectAccountLoading,
  selectSelectedAccount,
  selectRelatedAccounts,
} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {Timestamp} from "firebase/firestore";

describe("UsersPage", () => {
  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;
  let mockStore: any;
  let searchTerms: Subject<string>;

  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
    emailVerified: true,
  };

  const mockAccount: Account = {
    id: "67890",
    name: "Test Account",
    type: "user",
    privacy: "public",
    relatedAccounts: [],
    tagline: "Sample tagline",
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
  };

  const mockRelatedAccounts: RelatedAccount[] = [
    {
      id: "67890",
      initiatorId: "12345",
      targetId: "67890",
      type: "user",
      status: "pending",
      relationship: "friend",
      tagline: "Sample tagline",
      name: "Test Account",
      iconImage: "",
    },
  ];

  beforeEach(async () => {
    searchTerms = new Subject<string>();

    mockStore = {
      dispatch: jasmine.createSpy("dispatch"),
      select: jasmine.createSpy("select"),
    };

    await TestBed.configureTestingModule({
      declarations: [UsersPage],
      providers: [{provide: Store, useValue: mockStore}],
      imports: [StoreModule.forRoot({})],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
    component["searchTerms"] = searchTerms;

    // Set up store selector return values
    mockStore.select.withArgs(selectAuthUser).and.returnValue(of(mockAuthUser));
    mockStore.select
      .withArgs(selectFilteredAccounts("", "user"))
      .and.returnValue(of([mockAccount]));
    mockStore.select.withArgs(selectAccountLoading).and.returnValue(of(false));
    mockStore.select
      .withArgs(selectSelectedAccount)
      .and.returnValue(of(mockAccount));
    mockStore.select
      .withArgs(selectRelatedAccounts)
      .and.returnValue(of(mockRelatedAccounts));

    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadAccounts on ngOnInit", () => {
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AccountActions.loadAccounts(),
    );
  });

  it("should set authUser and selectedAccount observables on ngOnInit", () => {
    component.ngOnInit();
    component.authUser$.subscribe((authUser) => {
      expect(authUser).toEqual(mockAuthUser);
    });
    component.selectedAccount$.subscribe((account) => {
      expect(account).toEqual(mockAccount);
    });
  });

  it("should dispatch setSelectedAccount and loadRelatedAccounts if authUser exists on ngOnInit", () => {
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AccountActions.setSelectedAccount({accountId: mockAuthUser.uid}),
    );
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AccountActions.loadRelatedAccounts({accountId: mockAuthUser.uid}),
    );
  });

  //   it("should filter accounts based on search terms", (done) => {
  //     component.ngOnInit();
  //     component.accountList$.subscribe((accounts) => {
  //       expect(accounts).toEqual([mockAccount]);
  //       done();
  //     });
  //     searchTerms.next("Test Account");
  //   });

  it("should call store dispatch with createRelatedAccount on sendRequest", () => {
    component.sendRequest(mockAccount);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AccountActions.createRelatedAccount({
        accountId: mockAuthUser.uid,
        relatedAccount: {
          id: mockAccount.id,
          initiatorId: mockAuthUser.uid,
          targetId: mockAccount.id,
          type: mockAccount.type,
          status: "pending",
          relationship: "friend",
          tagline: mockAccount.tagline,
          name: mockAccount.name,
          iconImage: mockAccount.iconImage,
        },
      }),
    );
  });

  //   it("should not call store dispatch if sendRequest is called with invalid authUser or account", () => {
  //     component.authUser$ = of(null);
  //     component.sendRequest(mockAccount);
  //     expect(mockStore.dispatch).not.toHaveBeenCalled();
  //   });

  it("should show request button when showRequestButton is called", (done) => {
    component.showRequestButton(mockAccount).subscribe((show) => {
      expect(show).toBeFalse(); // Because mockRelatedAccounts contains a pending request
      done();
    });
  });

  it("should return true for showRequestButton if no related account exists", (done) => {
    mockStore.select.withArgs(selectRelatedAccounts).and.returnValue(of([]));
    component.showRequestButton(mockAccount).subscribe((show) => {
      expect(show).toBeTrue();
      done();
    });
  });

  it("should emit search terms when search is called", () => {
    spyOn(searchTerms, "next");
    const event = {target: {value: "test"}};
    component.search(event);
    expect(searchTerms.next).toHaveBeenCalledWith("test");
  });
});
