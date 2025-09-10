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
import {RelatedAccountsComponent} from "./related-accounts.component";
import {Router} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Account} from "@shared/models/account.model";

describe("RelatedAccountsComponent", () => {
  let component: RelatedAccountsComponent;
  let fixture: ComponentFixture<RelatedAccountsComponent>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy("navigate"),
    };

    await TestBed.configureTestingModule({
      declarations: [RelatedAccountsComponent],
      providers: [{provide: Router, useValue: mockRouter}],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it('should return "Friends" as title for user type when account is of type user', () => {
    component.type = "user";
    component.account = {type: "user"} as Account;
    expect(component.title).toBe("Friends");
  });

  it('should return "Members" as title for user type when account is of type group', () => {
    component.type = "user";
    component.account = {type: "group"} as Account;
    expect(component.title).toBe("Members");
  });

  it('should return "Organizations" as title for group type', () => {
    component.type = "group";
    expect(component.title).toBe("Organizations");
  });

  it("should return filtered related accounts by type and accepted status", () => {
    component.relatedAccounts = [
      {
        id: "1",
        type: "user",
        status: "accepted",
        accountId: "",
      },
      {
        id: "2",
        type: "user",
        status: "pending",
        accountId: "",
      },
      {
        id: "3",
        type: "group",
        status: "accepted",
        accountId: "",
      },
    ];
    component.type = "user";
    expect(component.filteredRelatedAccounts).toEqual([
      {id: "1", type: "user", status: "accepted", accountId: ""},
    ]);
  });

  it("should return an empty array if no related accounts match the filter", () => {
    component.relatedAccounts = [
      {
        id: "1",
        type: "group",
        status: "pending",
        accountId: "",
      },
      {
        id: "2",
        type: "user",
        status: "rejected",
        accountId: "",
      },
    ];
    component.type = "user";
    expect(component.filteredRelatedAccounts).toEqual([]);
  });

  it("should navigate to the correct related account when goToRelatedAccount is called with a valid ID", () => {
    component.goToRelatedAccount("123");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/account", "123"]);
  });

  it("should navigate to the related accounts list when viewAll is called", () => {
    component.account = {id: "12345"} as Account;
    component.type = "user";
    component.viewAll();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/account/12345/related/user",
    ]);
  });

  it("should not attempt navigation in viewAll if account ID is not set", () => {
    component.account = {} as Account;
    component.viewAll();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
