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
import {ProfileComponent} from "./profile.component";

describe("ProfileComponent", () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    // Provide a default value for the account input
    component.account = {
      type: "user",
      description: "Test description",
      webLinks: [],
    };

    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return correct section title for user type", () => {
    component.account = {type: "user"};
    fixture.detectChanges();
    expect(component.getSectionTitle).toBe("Profile");
  });

  it("should return correct section title for non-user type", () => {
    component.account = {
      type: "group",
      groupDetails: {
        groupType: "Nonprofit",
      },
    };
    fixture.detectChanges();
    expect(component.getSectionTitle).toBe("Organization (Nonprofit)");
  });

  it("should filter web links by category", () => {
    component.account = {
      webLinks: [
        {
          name: "LinkedIn",
          url: "https://linkedin.com",
          category: "Social Media",
        },
        {
          name: "Personal Blog",
          url: "https://blog.com",
          category: "Personal Website",
        },
      ],
    };
    fixture.detectChanges();
    expect(component.getWebLinks("Social Media")).toEqual([
      {name: "LinkedIn", url: "https://linkedin.com", category: "Social Media"},
    ]);
  });

  it("should filter out other web links not in Donate, Social Media, or Personal Website", () => {
    component.account = {
      webLinks: [
        {name: "GitHub", url: "https://github.com", category: "Other"},
        {name: "Donate", url: "https://donate.com", category: "Donation"},
        {name: "Twitter", url: "https://twitter.com", category: "Social Media"},
        {
          name: "Portfolio",
          url: "https://portfolio.com",
          category: "Personal Website",
        },
      ],
    };
    fixture.detectChanges();
    expect(component.getOtherWebLinks()).toEqual([
      {name: "GitHub", url: "https://github.com", category: "Other"},
    ]);
  });
});
