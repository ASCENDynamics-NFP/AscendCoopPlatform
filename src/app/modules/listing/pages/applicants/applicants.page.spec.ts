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
import {ApplicantsPage} from "./applicants.page";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {ListingRelatedAccount} from "../../../../models/listing-related-account.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import * as ListingsSelectors from "../../../../state/selectors/listings.selectors";

describe("ApplicantsPage", () => {
  let component: ApplicantsPage;
  let fixture: ComponentFixture<ApplicantsPage>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;
  let route: ActivatedRoute;

  const initialState = {
    listings: {
      loading: false,
      error: null,
      relatedAccounts: {},
      entities: {},
      selectedListingId: null,
      filterType: null,
      searchQuery: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicantsPage],
      providers: [
        provideMockStore({initialState}),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => "test-listing-id",
              },
            },
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    dispatchSpy = spyOn(store, "dispatch").and.callThrough();
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(ApplicantsPage);
    component = fixture.componentInstance;
  });

  it("should create the ApplicantsPage component", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should get listingId from route parameters", () => {
    expect(component.listingId).toEqual("test-listing-id");
  });

  it("should dispatch loadListingRelatedAccounts action on ngOnInit", () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      ListingsActions.loadListingRelatedAccounts({
        listingId: "test-listing-id",
      }),
    );
  });

  // it("should select relatedAccounts$ observable from store", (done) => {
  //   const relatedAccounts = [
  //     {id: "1", name: "Applicant 1"},
  //     {id: "2", name: "Applicant 2"},
  //   ] as ListingRelatedAccount[];

  //   store.overrideSelector(
  //     ListingsSelectors.selectRelatedAccountsByListingId("test-listing-id"),
  //     relatedAccounts,
  //   );

  //   fixture.detectChanges();

  //   component.relatedAccounts$.subscribe((accounts) => {
  //     expect(accounts).toEqual(relatedAccounts);
  //     done();
  //   });
  // });

  // it("should select loading$ observable from store", (done) => {
  //   store.overrideSelector(ListingsSelectors.selectLoading, true);

  //   fixture.detectChanges();

  //   component.loading$.subscribe((loading) => {
  //     expect(loading).toBeTrue();
  //     done();
  //   });
  // });

  // it("should select error$ observable from store", (done) => {
  //   store.overrideSelector(ListingsSelectors.selectError, "An error occurred");

  //   fixture.detectChanges();

  //   component.error$.subscribe((error) => {
  //     expect(error).toEqual("An error occurred");
  //     done();
  //   });
  // });

  // it('should call approveApplicant method with correct parameters', () => {
  //   spyOn(component, 'approveApplicant');
  //   const applicantId = '1';
  //   component.approveApplicant(applicantId);
  //   expect(component.approveApplicant).toHaveBeenCalledWith(applicantId);
  // });
});
