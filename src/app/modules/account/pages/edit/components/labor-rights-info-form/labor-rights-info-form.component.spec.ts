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
// import {ComponentFixture, TestBed} from "@angular/core/testing";
// import {LaborRightsInfoComponent} from "./labor-rights-info.component";
// import {ReactiveFormsModule, FormBuilder} from "@angular/forms";
// import {Store, StoreModule} from "@ngrx/store";
// import {NO_ERRORS_SCHEMA} from "@angular/core";
// import {Account} from "../../../../../../models/account.model";
// import * as AccountActions from "../../../../../../state/actions/account.actions";
// import {Timestamp} from "firebase/firestore";

// describe("LaborRightsInfoComponent", () => {
//   let component: LaborRightsInfoComponent;
//   let fixture: ComponentFixture<LaborRightsInfoComponent>;
//   let mockStore: any;

//   const mockAccount: Account = {
//     id: "12345",
//     name: "Test Account",
//     type: "user",
//     privacy: "public",
//     relatedAccounts: [],
//     tagline: "",
//     description: "",
//     iconImage: "",
//     heroImage: "",
//     laborRights: {
//       unionMembership: "Yes",
//       workplaceConcerns: ["Low wages"],
//       preferredAdvocacyAreas: ["Healthcare", "Education"],
//       experienceWithLaborRightsIssues: "Intermediate",
//     },
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
//     mockStore = {
//       dispatch: jasmine.createSpy("dispatch"),
//     };

//     await TestBed.configureTestingModule({
//       declarations: [LaborRightsInfoComponent],
//       imports: [ReactiveFormsModule, StoreModule.forRoot({})],
//       providers: [FormBuilder, {provide: Store, useValue: mockStore}],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LaborRightsInfoComponent);
//     component = fixture.componentInstance;
//     component.account = mockAccount;
//     fixture.detectChanges();
//   });

//   it("should create the component", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should initialize the form with default values", () => {
//     expect(component.laborRightsInfoForm).toBeDefined();
//     expect(
//       component.laborRightsInfoForm.get("unionMembership")?.value,
//     ).toBeNull();
//     expect(component.laborRightsInfoForm.get("workplaceConcerns")?.value).toBe(
//       "",
//     );
//     expect(
//       component.laborRightsInfoForm.get("preferredAdvocacyAreas")?.value,
//     ).toEqual([]);
//     expect(
//       component.laborRightsInfoForm.get("experienceWithLaborRightsIssues")
//         ?.value,
//     ).toBeNull();
//   });

//   it("should load form data when account.laborRights is defined", () => {
//     component.ngOnInit();
//     expect(component.laborRightsInfoForm.get("unionMembership")?.value).toBe(
//       "Yes",
//     );
//     expect(component.laborRightsInfoForm.get("workplaceConcerns")?.value).toBe(
//       "Low wages",
//     );
//     expect(
//       component.laborRightsInfoForm.get("preferredAdvocacyAreas")?.value,
//     ).toEqual(["Healthcare", "Education"]);
//     expect(
//       component.laborRightsInfoForm.get("experienceWithLaborRightsIssues")
//         ?.value,
//     ).toBe("Intermediate");
//   });

//   it("should dispatch updateAccount action on valid form submission", () => {
//     component.ngOnInit();
//     component.laborRightsInfoForm.patchValue({
//       unionMembership: "No",
//       workplaceConcerns: "Safety issues",
//       preferredAdvocacyAreas: ["Environment"],
//       experienceWithLaborRightsIssues: "Beginner",
//     });

//     component.onSubmit();

//     expect(mockStore.dispatch).toHaveBeenCalledWith(
//       AccountActions.updateAccount({
//         account: {
//           ...mockAccount,
//           laborRights: {
//             unionMembership: "No",
//             workplaceConcerns: ["Safety issues"],
//             preferredAdvocacyAreas: ["Environment"],
//             experienceWithLaborRightsIssues: "Beginner",
//           },
//         },
//       }),
//     );
//   });

//   it("should not dispatch updateAccount action if form is invalid", () => {
//     component.ngOnInit();
//     component.laborRightsInfoForm.patchValue({
//       unionMembership: null, // Required field not set
//     });

//     component.onSubmit();

//     expect(mockStore.dispatch).not.toHaveBeenCalled();
//   });
// });
