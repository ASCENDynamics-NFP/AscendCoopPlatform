/*******************************************************************************
 ****************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 ********************************************************************************
 ***************/
// src/app/modules/listing/relatedAccount/pages/applicants/applicants.page.spec.ts

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {ApplicantsPage} from "./applicants.page";
import {IonicModule, ModalController} from "@ionic/angular";
import {RouterTestingModule} from "@angular/router/testing";
import {Store} from "@ngrx/store";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {AppState} from "../../../../../state/app.state";
import * as ListingsActions from "../../../../../state/actions/listings.actions";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";

import {
  listingsAdapter,
  ListingsState,
} from "../../../../../state/reducers/listings.reducer";
import {
  accountAdapter,
  AccountState,
} from "../../../../../state/reducers/account.reducer";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthUser} from "@shared/models/auth-user.model";
import {Listing} from "@shared/models/listing.model";
import {ListingRelatedAccount} from "@shared/models/listing-related-account.model";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ApplicantDetailsModalComponent} from "./components/applicant-details-modal/applicant-details-modal.component";
import {MetaService} from "../../../../../core/services/meta.service";
import {Timestamp} from "firebase/firestore";

describe("ApplicantsPage", () => {
  let component: ApplicantsPage;
  let fixture: ComponentFixture<ApplicantsPage>;
  let store: MockStore<AppState>;
  let router: jasmine.SpyObj<Router>;
  let modalController: jasmine.SpyObj<ModalController>;

  const mockListingId = "listing123";
  const mockListing: Listing = {
    id: mockListingId,
    title: "Test Listing",
    description: "Test Description",
    type: "job",
    organization: "Test Org",
    remote: false,
    contactInformation: {
      emails: [],
      phoneNumbers: [],
      addresses: [],
      preferredMethodOfContact: "Email",
    },
    timeCommitment: {
      hoursPerWeek: 1,
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
    status: "active",
    createdBy: "ownerUser",
  };

  const mockAuthUser: AuthUser = {
    uid: "ownerUser",
    email: "owner@example.com",
    displayName: "Owner User",
    iconImage: null,
    emailVerified: true,
    heroImage: null,
    tagline: null,
    type: "user",
    createdAt: new Date(),
    lastLoginAt: new Date(),
    phoneNumber: null,
    providerData: [],
    settings: {language: "en", theme: "light"},
  };

  const mockAccounts: ListingRelatedAccount[] = Array.from(
    {length: 35},
    (_, i) => ({
      id: `account${i}`,
      accountId: `account${i}`,
      listingId: mockListingId,
      firstName: `First${i}`,
      lastName: `Last${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      status: "applied",
      applicationDate: Timestamp.fromDate(new Date()),
      iconImage: "",
    }),
  );

  const routeStub = {
    snapshot: {
      paramMap: {
        get: () => mockListingId,
      },
    },
  } as unknown as ActivatedRoute;

  function createState(ownerId = "ownerUser"): AppState {
    const listing: Listing = {...mockListing, createdBy: ownerId};
    const listingsState: ListingsState = listingsAdapter.addOne(
      listing,
      listingsAdapter.getInitialState({
        relatedAccounts: {[mockListingId]: mockAccounts},
        selectedListingId: null,
        loading: false,
        error: null,
        filterType: "all",
        searchQuery: "",
        listingsLastUpdated: null,
        relatedAccountsLastUpdated: {},
      }),
    );

    const accountsState: AccountState = accountAdapter.getInitialState({
      relatedAccounts: {},
      relatedListings: {},
      selectedAccountId: null,
      loading: false,
      error: null,
      accountsLastUpdated: null,
      relatedAccountsLastUpdated: {},
      relatedListingsLastUpdated: {},
    });

    return {
      listings: listingsState,
      auth: {user: mockAuthUser, error: null, loading: false},
      accounts: accountsState,
    };
  }

  beforeEach(async () => {
    modalController = jasmine.createSpyObj("ModalController", ["create"]);
    router = jasmine.createSpyObj("Router", ["navigate"]);
    const metaServiceSpy = jasmine.createSpyObj("MetaService", [
      "updateMetaTags",
    ]);

    await TestBed.configureTestingModule({
      declarations: [ApplicantsPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        provideMockStore({initialState: createState()}),
        {provide: ActivatedRoute, useValue: routeStub},
        {provide: ModalController, useValue: modalController},
        {provide: Router, useValue: router},
        {provide: MetaService, useValue: metaServiceSpy},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<AppState>;

    fixture = TestBed.createComponent(ApplicantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadListingRelatedAccounts on ionViewWillEnter", () => {
    spyOn(store, "dispatch");
    component.ionViewWillEnter();
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingsActions.loadListingRelatedAccounts({listingId: mockListingId}),
    );
  });

  it("should calculate pages and paginate accounts", fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    let pages: number | undefined;
    component.totalPages$.subscribe((p) => (pages = p));
    tick();
    expect(pages).toBe(2);

    let firstPage: ListingRelatedAccount[] | undefined;
    component.paginatedAccounts$.subscribe((a) => (firstPage = a));
    tick();
    expect(firstPage?.length).toBe(20);

    component.nextPage();
    let secondPage: ListingRelatedAccount[] | undefined;
    component.paginatedAccounts$.subscribe((a) => (secondPage = a));
    tick();
    expect(secondPage?.length).toBe(15);
  }));

  // it("should open applicant details modal if user is owner", fakeAsync(() => {
  //   component.ionViewWillEnter();
  //   tick();
  //   const selectedAccount = mockAccounts[0];
  //   const modalSpy = jasmine.createSpyObj("HTMLIonModalElement", ["present"]);
  //   modalController.create.and.returnValue(Promise.resolve(modalSpy));

  //   component.openApplicantDetailsModal(selectedAccount);
  //   tick();

  //   expect(modalController.create).toHaveBeenCalledWith({
  //     component: ApplicantDetailsModalComponent,
  //     componentProps: {relatedAccount: selectedAccount, isOwner: true},
  //   });
  //   expect(router.navigate).not.toHaveBeenCalled();
  // }));

  it("should navigate to account page if user is not owner", fakeAsync(() => {
    store.setState(createState("anotherUser"));
    store.refreshState();
    component.ionViewWillEnter();
    tick();

    const selectedAccount = mockAccounts[0];
    component.openApplicantDetailsModal(selectedAccount);
    tick();

    expect(router.navigate).toHaveBeenCalledWith([
      "/account",
      selectedAccount.id,
    ]);
  }));
});
