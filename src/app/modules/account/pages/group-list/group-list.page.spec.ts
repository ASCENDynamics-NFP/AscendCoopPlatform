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
import {GroupListPage} from "./group-list.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {FormsModule} from "@angular/forms";
import {Subject} from "rxjs";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {AuthUser} from "../../../../models/auth-user.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  selectAccountLoading,
  selectSelectedAccount,
  selectRelatedAccounts,
} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {Timestamp} from "firebase/firestore";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("GroupListPage", () => {
  let component: GroupListPage;
  let fixture: ComponentFixture<GroupListPage>;
  let store: MockStore;
  let mockAuthUser$: Subject<AuthUser | null>;

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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupListPage],
      imports: [FormsModule],
      providers: [provideMockStore()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockAuthUser$ = new Subject<AuthUser | null>();
    store.overrideSelector(selectAuthUser, null);
    store.overrideSelector(selectAccountLoading, false);
    store.overrideSelector(selectSelectedAccount, mockAccount);
    store.overrideSelector(selectRelatedAccounts, []);

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

    expect(component.authUser$).toBeDefined();
    expect(component.accountList$).toBeDefined();
    expect(component.selectedAccount$).toBeDefined();
    expect(store.dispatch).toHaveBeenCalledWith(AccountActions.loadAccounts());
  });

  it("should dispatch setSelectedAccount and loadRelatedAccounts if authUser has uid on ngOnInit", () => {
    spyOn(store, "dispatch");

    store.overrideSelector(selectAuthUser, mockAuthUser);
    component.ngOnInit();

    mockAuthUser$.next(mockAuthUser);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.setSelectedAccount({accountId: mockAccountId}),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadRelatedAccounts({accountId: mockAccountId}),
    );
  });

  it("should update searchTerms when search is called", () => {
    spyOn(component["searchTerms"], "next");
    const mockEvent = {target: {value: "test"}};

    component.search(mockEvent);

    expect(component["searchTerms"].next).toHaveBeenCalledWith("test");
  });
  it("should call store.dispatch with createRelatedAccount when sendRequest is called", () => {
    spyOn(store, "dispatch");
    const mockAccount = {
      id: "accountId",
      type: "group",
      tagline: "Test Tagline",
      name: "Test Name",
      iconImage: "icon.png",
    } as Account;

    store.overrideSelector(selectAuthUser, mockAuthUser);
    component.ngOnInit();

    // Reset the dispatch spy after initialization
    (store.dispatch as jasmine.Spy).calls.reset();

    component.sendRequest(mockAccount);

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.createRelatedAccount({
        accountId: mockAuthUser.uid,
        relatedAccount: {
          id: "accountId",
          accountId: mockAuthUser.uid,
          initiatorId: mockAuthUser.uid,
          targetId: "accountId",
          type: "group",
          status: "pending",
          relationship: "member",
          tagline: "Test Tagline",
          name: "Test Name",
          iconImage: "icon.png",
        } as RelatedAccount,
      }),
    );
  });
  it("should return false from showRequestButton if authUser is not set or matches item.id", (done) => {
    store.overrideSelector(selectAuthUser, null);
    component.ngOnInit();

    component.showRequestButton(mockAccount).subscribe((result) => {
      expect(result).toBeFalse();
      done();
    });
  });

  it("should return false from showRequestButton if relatedAccounts contain a matching pending relationship", (done) => {
    store.overrideSelector(selectAuthUser, mockAuthUser);
    store.overrideSelector(selectRelatedAccounts, [
      {
        initiatorId: "authUserId",
        targetId: "accountId",
        status: "pending",
      } as RelatedAccount,
    ]);
    component.ngOnInit();

    component.showRequestButton(mockAccount).subscribe((result) => {
      expect(result).toBeFalse();
      done();
    });
  });

  it("should return true from showRequestButton if there is no matching relationship", (done) => {
    store.overrideSelector(selectAuthUser, {uid: "authUserId"} as AuthUser);
    store.overrideSelector(selectRelatedAccounts, []);
    component.ngOnInit();

    component.showRequestButton(mockAccount).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });
});
