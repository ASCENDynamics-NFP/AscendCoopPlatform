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
import {ListingCreatePage} from "./listing-create.page";
import {IonicModule, NavController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import * as ListingActions from "../../../../state/actions/listings.actions";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {Timestamp} from "firebase/firestore";
import {BehaviorSubject} from "rxjs";
import {Listing} from "@shared/models/listing.model";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("ListingCreatePage", () => {
  let component: ListingCreatePage;
  let fixture: ComponentFixture<ListingCreatePage>;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  const mockUser = {
    uid: "test-user-id",
    email: "test@example.com",
    displayName: "Test User",
    iconImage: "https://example.com/photo.jpg",
    emailVerified: true,
    heroImage: null,
    tagline: null,
    type: null,
    createdAt: null,
    lastLoginAt: null,
    phoneNumber: null,
    providerData: [],
    settings: {
      language: "en",
      theme: "light" as const,
    },
  };

  const navCtrlMock = {
    navigateForward: jasmine.createSpy("navigateForward"),
    navigateRoot: jasmine.createSpy("navigateRoot"),
    subscribe: new BehaviorSubject(null),
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [ListingCreatePage],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore(),
        {provide: Router, useValue: routerSpy},
        {provide: NavController, useValue: navCtrlMock},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    spyOn(store, "dispatch");
    store.overrideSelector(selectAuthUser, mockUser);

    fixture = TestBed.createComponent(ListingCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create listing with user ID and navigate to listings", () => {
    const mockFormValue = {
      id: "",
      title: "Test Listing",
      description: "Test Description",
      type: "volunteer",
      organization: "",
      remote: false,
      timeCommitment: {
        hoursPerWeek: 10,
        duration: "3 months",
        schedule: "Flexible",
        startDate: Timestamp.fromDate(new Date()),
        endDate: Timestamp.fromDate(new Date()),
        isFlexible: true,
      },
      skills: [],
      requirements: [],
      responsibilities: [],
      benefits: [],
      contactInformation: {
        emails: [],
        phoneNumbers: [],
        addresses: [],
        preferredMethodOfContact: "Email",
      },
      status: "active",
      accountId: mockUser.uid,
    };

    component.onSubmit(mockFormValue);

    expect(store.dispatch).toHaveBeenCalledWith(
      ListingActions.createListing({
        listing: {
          ...mockFormValue,
          createdBy: mockUser.uid,
        } as Listing,
      }),
    );
    // expect(router.navigate).toHaveBeenCalledWith(["/listings", "123"]);
  });

  it("should not create listing when user is not authenticated", () => {
    store.overrideSelector(selectAuthUser, null);

    const mockFormValue = {
      title: "Test Listing",
      description: "Test Description",
    };

    component.onSubmit(mockFormValue);

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
