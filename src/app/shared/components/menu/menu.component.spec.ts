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
import {MenuComponent} from "./menu.component";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthStoreService} from "../../../core/services/auth-store.service";

describe("MenuComponent", () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let service: AuthStoreService;
  let authSpy: any;
  let translate: TranslateService;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj("auth", ["onSignOut"]);
    // Mock authUser$ as an Observable that emits null
    authSpy.authUser$ = of(null);
    authSpy.onSignOut.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        {provide: AuthStoreService, useValue: authSpy},
        TranslateService,
      ],
    }).compileComponents();

    service = TestBed.inject(AuthStoreService);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService); // inject TranslateService
    fixture.detectChanges();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const menu = fixture.componentInstance;
    expect(menu).toBeTruthy();
  });
});
