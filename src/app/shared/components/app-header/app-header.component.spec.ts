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
import {AppHeaderComponent} from "./app-header.component";
import {PopoverController} from "@ionic/angular";
import {Store, StoreModule} from "@ngrx/store";
import {BehaviorSubject, of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {AuthUser} from "@shared/models/auth-user.model";
import {UserMenuComponent} from "../user-menu/user-menu.component";
import {TranslateTestingModule} from "../../../shared/testing/translate-testing.module";
import {
  BrandingService,
  BRANDING_DEFAULTS,
} from "../../../core/services/branding.service";

describe("AppHeaderComponent", () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let mockPopoverController: any;
  let mockStore: any;
  let authUserSubject: BehaviorSubject<AuthUser | null>;

  const mockBrandingService = {
    config$: of(BRANDING_DEFAULTS),
  };

  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: null,
    emailVerified: false,
    iconImage: "assets/avatar/male1.png",
    heroImage: null,
    tagline: null,
    type: null,
    createdAt: null,
    lastLoginAt: null,
    phoneNumber: null,
    providerData: [],
    settings: {
      language: "en",
      theme: "light",
    },
  };

  beforeEach(async () => {
    // BehaviorSubject lets us push values into the component's image$ pipeline
    // after construction (image$ is derived from the store selector observable,
    // so we can't simply reassign component.authUser$ after creation).
    authUserSubject = new BehaviorSubject<AuthUser | null>(null);

    mockPopoverController = {
      create: jasmine.createSpy().and.returnValue(
        Promise.resolve({
          present: jasmine.createSpy(),
        }),
      ),
    };

    mockStore = {
      select: jasmine
        .createSpy()
        .and.returnValue(authUserSubject.asObservable()),
    };

    await TestBed.configureTestingModule({
      declarations: [AppHeaderComponent],
      imports: [StoreModule.forRoot({})],
      providers: [
        {provide: PopoverController, useValue: mockPopoverController},
        {provide: Store, useValue: mockStore},
        {provide: BrandingService, useValue: mockBrandingService},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should return authUser iconImage if it exists", (done) => {
    // Push a user into the subject — image$ is derived from the same
    // observable so it will emit the new value.
    authUserSubject.next(mockAuthUser);

    component.image$.subscribe((imagePath: string | null | undefined) => {
      expect(imagePath).toBe(mockAuthUser.iconImage);
      done();
    });
  });

  it("should present popover with authUser$ when presentPopover is called", async () => {
    const mockEvent = {};
    const mockPopover = {
      present: jasmine.createSpy("present"),
    };
    mockPopoverController.create.and.returnValue(Promise.resolve(mockPopover));

    await component.presentPopover(mockEvent);

    expect(mockPopoverController.create).toHaveBeenCalledWith({
      component: UserMenuComponent,
      componentProps: {
        authUser$: component.authUser$,
      },
      event: mockEvent,
      translucent: true,
    });
    expect(mockPopover.present).toHaveBeenCalled();
  });
});
