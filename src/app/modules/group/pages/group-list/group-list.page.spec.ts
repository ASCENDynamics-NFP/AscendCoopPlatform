/**
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
* 
* This file is part of Nonprofit Social Networking Platform.
* 
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
* 
* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
*/
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupListPage} from "./group-list.page";
import {AuthService} from "../../../../core/services/auth.service";

describe("GroupListPage", () => {
  let component: GroupListPage;
  let fixture: ComponentFixture<GroupListPage>;
  // let service: AuthService;
  let authSpy: any;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [{provide: AuthService, useValue: authSpy}],
    });

    // service = TestBed.inject(AuthService);
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GroupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
