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
// settings.component.spec.ts

// import {ComponentFixture, TestBed} from "@angular/core/testing";
// import {SettingsComponent} from "./settings.component";
// import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
// import {TranslateService} from "@ngx-translate/core";
// import {Store, StoreModule} from "@ngrx/store";
// import {NO_ERRORS_SCHEMA} from "@angular/core";
// import {AuthUser} from "@shared/models/auth-user.model";
// import {Account} from "@shared/models/account.model";
// import * as AccountActions from "../../../../../../state/actions/account.actions";
// import {By} from "@angular/platform-browser";
// import {Timestamp} from "firebase/firestore";

// describe("SettingsComponent", () => {
//   let component: SettingsComponent;
//   let fixture: ComponentFixture<SettingsComponent>;
//   let mockStore: any;
//   let mockTranslateService: any;

//   const mockAccountId = "12345";
//   const mockAuthUser: AuthUser = {
//     uid: mockAccountId,
//     email: "test@example.com",
//     displayName: "Test User",
//     photoURL: null,
//     emailVerified: true,
//   };

//   // Mock Data
//   const mockAccount: Account = {
//     id: mockAccountId,
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
//     mockStore = {
//       dispatch: jasmine.createSpy("dispatch"),
//     };

//     mockTranslateService = {
//       use: jasmine.createSpy("use"),
//     };

//     await TestBed.configureTestingModule({
//       declarations: [SettingsComponent],
//       imports: [ReactiveFormsModule, StoreModule.forRoot({})],
//       providers: [
//         FormBuilder,
//         {provide: Store, useValue: mockStore},
//         {provide: TranslateService, useValue: mockTranslateService},
//       ],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SettingsComponent);
//     component = fixture.componentInstance;
//     component.authUser = mockAuthUser;
//     component.account = mockAccount;
//     fixture.detectChanges();
//   });

//   it("should create the component", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should initialize the form with default values", () => {
//     expect(component.settingsForm).toBeDefined();
//     expect(component.settingsForm.get("privacy")?.value).toBe("public");
//     expect(component.settingsForm.get("language")?.value).toBe("en");
//   });

//   it("should load account data into the form on ngOnChanges", () => {
//     component.ngOnChanges();
//     expect(component.settingsForm.get("privacy")?.value).toBe(
//       "accepted-users-only",
//     );
//     expect(component.settingsForm.get("language")?.value).toBe("fr");
//   });

//   it("should call translateService.use and emit languageChange when onLanguageChange is called", () => {
//     component.settingsForm.patchValue({language: "fr"});
//     spyOn(component.languageChange, "emit");

//     component.onLanguageChange();

//     expect(mockTranslateService.use).toHaveBeenCalledWith("fr");
//     expect(component.languageChange.emit).toHaveBeenCalledWith("fr");
//   });

//   it("should dispatch updateAccount action on updateSetting if authUser is defined", () => {
//     component.settingsForm.patchValue({
//       privacy: "private",
//       language: "en",
//     });

//     component.updateSetting();

//     expect(mockStore.dispatch).toHaveBeenCalledWith(
//       AccountActions.updateAccount({
//         account: {
//           id: "12345",
//           privacy: "private",
//           accessibility: {preferredLanguage: "en"},
//           type: "user",
//           name: "",
//           tagline: "",
//           description: "",
//           iconImage: "",
//           heroImage: "",
//           legalAgreements: {
//             termsOfService: {
//               accepted: false,
//               datetime: new Timestamp(0, 0),
//               version: "",
//             },
//             privacyPolicy: {
//               accepted: false,
//               datetime: new Timestamp(0, 0),
//               version: "",
//             },
//           },
//           webLinks: [],
//           lastLoginAt: new Timestamp(0, 0),
//           email: "",
//         },
//       }),
//     );
//   });

//   it("should not dispatch updateAccount action on updateSetting if authUser is not defined", () => {
//     component.authUser = null;

//     component.updateSetting();

//     expect(mockStore.dispatch).not.toHaveBeenCalled();
//   });

//   it("should toggle dark theme on toggleDarkTheme", () => {
//     const event = {detail: {checked: true}} as CustomEvent;
//     spyOn(document.body.classList, "toggle");

//     component.toggleDarkTheme(event);

//     expect(document.body.classList.toggle).toHaveBeenCalledWith("dark", true);
//   });
// });
