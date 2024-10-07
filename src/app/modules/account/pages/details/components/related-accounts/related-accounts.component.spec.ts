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
import {Account} from "../../../../../../models/account.model";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe("RelatedAccountsComponent", () => {
  let component: RelatedAccountsComponent;
  let fixture: ComponentFixture<RelatedAccountsComponent>;
  let mockRouter: any;

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
    component.account = {type: "user"};
    expect(component.title).toBe("Friends");
  });

  it('should return "Members" as title for user type when account is of type group', () => {
    component.type = "user";
    component.account = {type: "group"};
    expect(component.title).toBe("Members");
  });

  it('should return "Organizations" as title for group type', () => {
    component.type = "group";
    expect(component.title).toBe("Organizations");
  });

  it("should return related accounts filtered by type and accepted status", () => {
    component.account = {
      relatedAccounts: [
        {id: "1", type: "user", status: "accepted"},
        {id: "2", type: "user", status: "pending"},
        {id: "3", type: "group", status: "accepted"},
      ],
    };
    component.type = "user";
    expect(component.relatedAccounts).toEqual([
      {id: "1", type: "user", status: "accepted"},
    ]);
  });

  it("should return an empty array if no related accounts match the filter", () => {
    component.account = {
      relatedAccounts: [
        {id: "1", type: "group", status: "pending"},
        {id: "2", type: "user", status: "rejected"},
      ],
    };
    component.type = "user";
    expect(component.relatedAccounts).toEqual([]);
  });

  it("should navigate to the correct related account when goToRelatedAccount is called with a valid ID", () => {
    component.goToRelatedAccount("123");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/123"]);
  });

  it("should log an error if goToRelatedAccount is called with an undefined ID", () => {
    spyOn(console, "error");
    component.goToRelatedAccount(undefined);
    expect(console.error).toHaveBeenCalledWith(
      "Invalid ID provided for navigation.",
    );
  });

  it("should navigate to the related accounts list when viewAll is called", () => {
    component.account = {id: "12345"};
    component.type = "user";
    component.viewAll();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/12345/related/user"]);
  });

  it("should not attempt navigation in viewAll if account ID is not set", () => {
    component.account = {};
    component.viewAll();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
