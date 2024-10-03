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
import {FormsModule} from "@angular/forms";
import {MemberSearchComponent} from "./member-search.component";
import {StoreService} from "../../../../../../core/services/store.service";
import {IonicModule} from "@ionic/angular";
import {of} from "rxjs";

describe("MemberSearchComponent", () => {
  let component: MemberSearchComponent;
  let fixture: ComponentFixture<MemberSearchComponent>;
  let storeServiceSpy: jasmine.SpyObj<StoreService>;

  beforeEach(waitForAsync(() => {
    const storeSpy = jasmine.createSpyObj("StoreService", [
      "searchDocsByName",
      "updateDocAtPath",
    ]);

    TestBed.configureTestingModule({
      declarations: [MemberSearchComponent],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [{provide: StoreService, useValue: storeSpy}],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberSearchComponent);
    component = fixture.componentInstance;
    storeServiceSpy = TestBed.inject(
      StoreService,
    ) as jasmine.SpyObj<StoreService>;

    fixture.detectChanges();
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should return search results", () => {
    component.users = [{name: "John Doe"}, {name: "Jane Smith"}];

    component.searchTerm = "john";
    const results = component.searchResults;

    expect(results.length).toBe(1);
    expect(results[0].name).toBe("John Doe");
  });

  it("should return all users if search term is empty", () => {
    component.users = [{name: "John Doe"}, {name: "Jane Smith"}];

    component.searchTerm = "";
    const results = component.searchResults;

    expect(results.length).toBe(2);
  });

  it("should call storeService.searchDocsByName on searchUsers", () => {
    const mockEvent = {target: {value: "john"}};
    component.searchUsers(mockEvent);

    expect(storeServiceSpy.searchDocsByName).toHaveBeenCalledWith(
      "users",
      "john",
    );
  });

  it("should return true if user can be invited", () => {
    component.currentGroup = {
      id: "group1",
      relatedAccounts: [{id: "user2", status: "accepted"}],
    };

    const user = {id: "user1"};
    const result = component.canInviteUser(user);

    expect(result).toBe(true);
  });

  it("should return false if user is already a member", () => {
    component.currentGroup = {
      id: "group1",
      relatedAccounts: [{id: "user1", status: "accepted"}],
    };

    const user = {id: "user1"};
    const result = component.canInviteUser(user);

    expect(result).toBe(false);
  });

  it("should call storeService.updateDocAtPath on inviteUser", () => {
    component.currentGroup = {id: "group1"};
    const user = {id: "user1", name: "John Doe"};

    component.inviteUser(user);

    expect(storeServiceSpy.updateDocAtPath).toHaveBeenCalled();
  });
});
