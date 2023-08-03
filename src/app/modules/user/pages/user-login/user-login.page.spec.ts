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
import {UserLoginPage} from "./user-login.page";
import {of} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthStoreService} from "../../../../core/services/auth-store.service";

describe("UserLoginPage", () => {
  let component: UserLoginPage;
  let fixture: ComponentFixture<UserLoginPage>;
  let service: AuthStoreService;
  let authSpy: any;
  let translate: TranslateService;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj("auth", ["onSignInWithEmailLink"]);
    // Mock user$ as an Observable that emits null
    authSpy.user$ = of(null);
    authSpy.onSignInWithEmailLink.and.returnValue(Promise.resolve());
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {provide: AuthStoreService, useValue: authSpy},
        TranslateService,
      ],
    });
    service = TestBed.inject(AuthStoreService);
    fixture = TestBed.createComponent(UserLoginPage);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService); // inject TranslateService
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
