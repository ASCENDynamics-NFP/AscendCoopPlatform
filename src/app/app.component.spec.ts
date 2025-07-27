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
import {AppComponent} from "./app.component";
import {MenuController, Platform} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {Store, StoreModule} from "@ngrx/store";
import {of} from "rxjs";
import * as AuthActions from "./state/actions/auth.actions";
import {selectIsLoggedIn} from "./state/selectors/auth.selectors";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockMenuController: Partial<MenuController>;
  let mockTranslateService: Partial<TranslateService>;
  let mockStore: Partial<Store>;
  let mockPlatform: Partial<Platform>;

  beforeEach(async () => {
    mockMenuController = {
      enable: jasmine.createSpy().and.returnValue(Promise.resolve()),
    };

    mockTranslateService = {
      addLangs: jasmine.createSpy(),
      setDefaultLang: jasmine.createSpy(),
      getBrowserLang: jasmine.createSpy().and.returnValue("en"),
      use: jasmine.createSpy(),
    };

    mockStore = {
      select: jasmine.createSpy().and.returnValue(of(false)),
      dispatch: jasmine.createSpy(),
    };

    mockPlatform = {
      ready: jasmine.createSpy().and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [StoreModule.forRoot({})],
      providers: [
        {provide: MenuController, useValue: mockMenuController},
        {provide: TranslateService, useValue: mockTranslateService},
        {provide: Store, useValue: mockStore},
        {provide: Platform, useValue: mockPlatform},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize app on platform ready", async () => {
    await mockPlatform.ready!();
    expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith("en");
    expect(mockTranslateService.getBrowserLang).toHaveBeenCalled();
    expect(mockTranslateService.use).toHaveBeenCalledWith("en");
  });

  it("should dispatch initializeAuth action on ngOnInit", () => {
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AuthActions.initializeAuth(),
    );
  });

  it("should update menu for logged-in user", async () => {
    await component["updateMenu"](true);
    expect(mockMenuController.enable).toHaveBeenCalledWith(false, "guest");
    expect(mockMenuController.enable).toHaveBeenCalledWith(true, "user");
  });

  it("should update menu for guest user", async () => {
    await component["updateMenu"](false);
    expect(mockMenuController.enable).toHaveBeenCalledWith(false, "user");
    expect(mockMenuController.enable).toHaveBeenCalledWith(true, "guest");
  });

  it("should set up language on construction", () => {
    expect(mockTranslateService.addLangs).toHaveBeenCalledWith(["en", "fr"]);
  });

  it("should select isLoggedIn$ from the store", () => {
    component.isLoggedIn$.subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeFalse();
    });
    expect(mockStore.select).toHaveBeenCalledWith(selectIsLoggedIn);
  });
});
