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
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {
  TranslateService,
  TranslateModule,
  LangChangeEvent,
} from "@ngx-translate/core";
import {of, Subject} from "rxjs";
import {MenuComponent} from "./menu.component";
import {AuthStoreService} from "../../../core/services/auth-store.service";

describe("MenuComponent", () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authStoreService: jasmine.SpyObj<AuthStoreService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let langChangeSubject: Subject<LangChangeEvent>;

  beforeEach(waitForAsync(() => {
    const authStoreServiceSpy = jasmine.createSpyObj("AuthStoreService", [
      "authUser$",
    ]);
    const modalControllerSpyObj = jasmine.createSpyObj("ModalController", [
      "create",
    ]);
    const routerSpyObj = jasmine.createSpyObj("Router", ["navigate"]);
    const translateServiceSpyObj = jasmine.createSpyObj("TranslateService", [
      "instant",
    ]);

    // Initialize a subject for onLangChange
    langChangeSubject = new Subject<LangChangeEvent>();
    translateServiceSpyObj.onLangChange = langChangeSubject.asObservable();

    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        {provide: AuthStoreService, useValue: authStoreServiceSpy},
        {provide: ModalController, useValue: modalControllerSpyObj},
        {provide: Router, useValue: routerSpyObj},
        {provide: TranslateService, useValue: translateServiceSpyObj},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    authStoreService = TestBed.inject(
      AuthStoreService,
    ) as jasmine.SpyObj<AuthStoreService>;
    modalControllerSpy = TestBed.inject(
      ModalController,
    ) as jasmine.SpyObj<ModalController>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    translateServiceSpy = TestBed.inject(
      TranslateService,
    ) as jasmine.SpyObj<TranslateService>;

    authStoreService.authUser$ = of(null); // Mock no authenticated user
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show feedback modal when showFeedbackModal is called", async () => {
    modalControllerSpy.create.and.returnValue({
      present: jasmine.createSpy("present"),
      onWillDismiss: jasmine
        .createSpy("onWillDismiss")
        .and.returnValue(Promise.resolve({})),
    } as any);

    await component.showFeedbackModal();
    expect(modalControllerSpy.create).toHaveBeenCalled();
  });

  it("should call router.navigate when handleButtonClick is called with non-empty buttonLink", async () => {
    await component.handleButtonClick("create-group");
    expect(modalControllerSpy.create).toHaveBeenCalled();
  });

  it("should translate guest items if no user is authenticated", () => {
    component.translateGuestItems();
    expect(component.guestPages.user.length).toBeGreaterThan(0);
  });

  it("should handle language change events", () => {
    const langChangeEvent: LangChangeEvent = {lang: "en", translations: {}};
    langChangeSubject.next(langChangeEvent);
  });
});
