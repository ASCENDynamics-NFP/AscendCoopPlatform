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
import {SettingsComponent} from "./settings.component";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {TranslateService} from "@ngx-translate/core";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import {AuthUser} from "../../../../../../models/auth-user.model";
import {Account} from "../../../../../../models/account.model";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe("SettingsComponent", () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj("Store", ["dispatch"]);
    mockTranslateService = jasmine.createSpyObj("TranslateService", ["use"]);

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {provide: Store, useValue: mockStore},
        {provide: TranslateService, useValue: mockTranslateService},
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors for unknown components
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initialize the component
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with default values", () => {
    expect(component.settingsForm.value).toEqual({
      privacy: "public",
      language: "en",
    });
  });

  it("should update the form when account input changes", () => {
    const account: Partial<Account> = {
      privacy: "private",
      accessibility: {preferredLanguage: "fr"},
    };
    component.account = account;

    component.ngOnChanges(); // Trigger the changes

    expect(component.settingsForm.value).toEqual({
      privacy: "private",
      language: "fr",
    });
  });

  it("should emit languageChange event and update the translation service on language change", () => {
    spyOn(component.languageChange, "emit");

    component.settingsForm.patchValue({language: "fr"});
    component.onLanguageChange();

    expect(mockTranslateService.use).toHaveBeenCalledWith("fr");
    expect(component.languageChange.emit).toHaveBeenCalledWith("fr");
  });

  it("should dispatch updateAccount action on updateSetting", () => {
    const authUser: AuthUser = {
      uid: "12345",
      email: null,
      displayName: null,
      photoURL: null,
      emailVerified: false,
    };
    component.authUser = authUser;
    component.settingsForm.patchValue({privacy: "private", language: "fr"});

    component.updateSetting();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AccountActions.updateAccount({
        account: {
          id: "12345",
          privacy: "private",
          accessibility: {preferredLanguage: "fr"},
        } as Account,
      }),
    );
  });

  it("should not dispatch updateAccount action if authUser is not defined", () => {
    component.authUser = null; // No user
    component.updateSetting();

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it("should toggle dark theme class on the document body", () => {
    const event = {detail: {checked: true}} as CustomEvent;

    component.toggleDarkTheme(event);

    expect(document.body.classList.contains("dark")).toBeTrue();

    event.detail.checked = false;
    component.toggleDarkTheme(event);

    expect(document.body.classList.contains("dark")).toBeFalse();
  });
});
