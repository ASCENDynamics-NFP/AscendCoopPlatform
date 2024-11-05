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

// import {ComponentFixture, TestBed} from "@angular/core/testing";
// import {EditPage} from "./edit.page";
// import {ActivatedRoute, Router} from "@angular/router";
// import {Store, StoreModule} from "@ngrx/store";
// import {of} from "rxjs";
// import {NO_ERRORS_SCHEMA} from "@angular/core";
// import * as AccountActions from "../../../../state/actions/account.actions";
// import {selectAccountById} from "../../../../state/selectors/account.selectors";
// import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
// import {AuthUser} from "../../../../models/auth-user.model";
// import {Account} from "../../../../models/account.model";
// import { Timestamp } from "firebase/firestore";

// describe("EditPage", () => {
//   let component: EditPage;
//   let fixture: ComponentFixture<EditPage>;
//   let mockActivatedRoute: any;
//   let mockRouter: any;
//   let mockStore: any;

//   const mockAccountId = "12345";
//   const mockAuthUser: AuthUser = {
//     uid: "12345",
//     email: "test@example.com",
//     displayName: null,
//     photoURL: null,
//     emailVerified: false,
//   };

//   const mockAccount: Account = {
//     id: "12345",
//     name: "Test Account",
//     type: "user",
//     privacy: "public",
//     tagline: "",
//     description: "",
//     iconImage: "",
//     heroImage: "",
//     legalAgreements: {
//       termsOfService: {
//         accepted: false,
//         datetime: new Timestamp(0, 0),
//         version: "",
//       },
//       privacyPolicy: {
//         accepted: false,
//         datetime: new Timestamp(0, 0),
//         version: "",
//       },
//     },
//     webLinks: [],
//     lastLoginAt: new Timestamp(0, 0),
//     email: "",
//   };

//   beforeEach(async () => {
//     mockActivatedRoute = {
//       snapshot: {
//         paramMap: {
//           get: jasmine.createSpy().and.returnValue(mockAccountId),
//         },
//       },
//     };

//     mockRouter = {
//       navigate: jasmine.createSpy("navigate"),
//     };

//     mockStore = {
//       dispatch: jasmine.createSpy("dispatch"),
//       select: jasmine.createSpy("select"),
//     };

//     await TestBed.configureTestingModule({
//       declarations: [EditPage],
//       providers: [
//         {provide: ActivatedRoute, useValue: mockActivatedRoute},
//         {provide: Router, useValue: mockRouter},
//         {provide: Store, useValue: mockStore},
//       ],
//       imports: [StoreModule.forRoot({})],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(EditPage);
//     component = fixture.componentInstance;

//     // Set up default store selector return values
//     mockStore.select.withArgs(selectAuthUser).and.returnValue(of(mockAuthUser));
//     mockStore.select
//       .withArgs(selectAccountById(mockAccountId))
//       .and.returnValue(of(mockAccount));

//     fixture.detectChanges();
//   });

//   it("should create the component", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should set accountId from route parameters", () => {
//     expect(component["accountId"]).toBe(mockAccountId);
//   });

//   it("should dispatch loadAccount action on ngOnInit if accountId is present", () => {
//     component.ngOnInit();
//     expect(mockStore.dispatch).toHaveBeenCalledWith(
//       AccountActions.loadAccount({accountId: mockAccountId}),
//     );
//   });

//   it("should select authUser and account on ngOnInit", () => {
//     component.ngOnInit();
//     component.authUser$.subscribe((authUser) => {
//       expect(authUser).toEqual(mockAuthUser);
//     });
//     component.account$.subscribe((account) => {
//       expect(account).toEqual(mockAccount);
//     });
//   });

//   it("should set isProfileOwner$ to true if the auth user is the account owner", (done) => {
//     component.ngOnInit();
//     component.isProfileOwner$.subscribe((isOwner) => {
//       expect(isOwner).toBeTrue();
//       done();
//     });
//   });

//   it("should navigate to account page if user is not the profile owner", (done) => {
//     mockStore.select
//       .withArgs(selectAuthUser)
//       .and.returnValue(of({uid: "67890"})); // Different user ID
//     component.ngOnInit();
//     component.isProfileOwner$.subscribe(() => {
//       expect(mockRouter.navigate).toHaveBeenCalledWith([`/${mockAccountId}`]);
//       done();
//     });
//   });

//   it("should change selectedForm on onItemSelected", () => {
//     component.onItemSelected("advanced");
//     expect(component.selectedForm).toBe("advanced");
//   });
// });
