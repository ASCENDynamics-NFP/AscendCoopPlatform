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
import {TestBed, ComponentFixture, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {ReactiveFormsModule, FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {StoreService} from "../../../../core/services/store.service";
import {SettingsComponent} from "./components/settings/settings.component";
import {User} from "firebase/auth";
import {Account} from "../../../../models/account.model";

describe("SettingsComponent", () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let storeService: jasmine.SpyObj<StoreService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(waitForAsync(() => {
    const storeServiceSpy = jasmine.createSpyObj("StoreService", ["updateDoc"]);
    const translateServiceSpy = jasmine.createSpyObj("TranslateService", [
      "use",
    ]);

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      declarations: [],
      providers: [
        FormBuilder,
        {provide: StoreService, useValue: storeServiceSpy},
        {provide: TranslateService, useValue: translateServiceSpy},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    storeService = TestBed.inject(StoreService) as jasmine.SpyObj<StoreService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as jasmine.SpyObj<TranslateService>;

    fixture.detectChanges();
  }));

  it("should create the settings component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with default values", () => {
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
    component.ngOnChanges();
    expect(component.settingsForm.value).toEqual({
      privacy: "private",
      language: "fr",
    });
  });

  it("should emit language change event and call translate service on language change", () => {
    spyOn(component.languageChange, "emit");
    component.settingsForm.patchValue({language: "fr"});
    component.onLanguageChange();
    expect(translateService.use).toHaveBeenCalledWith("fr");
    expect(component.languageChange.emit).toHaveBeenCalledWith("fr");
  });

  it("should update settings in the store when updateSetting is called", () => {
    const authUser: User = {uid: "12345"} as User;
    component.authUser = authUser;
    component.settingsForm.patchValue({privacy: "private", language: "fr"});
    component.updateSetting();
    expect(storeService.updateDoc).toHaveBeenCalledWith("accounts", {
      id: "12345",
      privacy: "private",
      accessibility: {preferredLanguage: "fr"},
    });
  });

  it("should toggle dark theme", () => {
    const event = {detail: {checked: true}} as CustomEvent;
    component.toggleDarkTheme(event);
    expect(document.body.classList.contains("dark")).toBe(true);

    event.detail.checked = false;
    component.toggleDarkTheme(event);
    expect(document.body.classList.contains("dark")).toBe(false);
  });
});
