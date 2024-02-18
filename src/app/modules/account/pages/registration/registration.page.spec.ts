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
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {RegistrationPage} from "./registration.page";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe("RegistrationPage", () => {
  let component: RegistrationPage;
  let fixture: ComponentFixture<RegistrationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        RouterTestingModule,
        RegistrationPage, // Add the standalone component here in imports
      ],
      providers: [
        // ... your mock providers
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with default values", () => {
    expect(component.selectedType).toEqual("");
    expect(component.accountId).toBeNull();
  });

  it("should set selectedType when selectType is called", () => {
    component.selectType("user");
    expect(component.selectedType).toEqual("user");
    component.selectType("group");
    expect(component.selectedType).toEqual("group");
  });

  // Add more tests as needed
});
