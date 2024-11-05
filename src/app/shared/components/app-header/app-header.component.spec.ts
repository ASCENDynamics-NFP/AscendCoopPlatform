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
import {of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Account} from "../../../models/account.model";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";
import {selectAccounts} from "../../../state/selectors/account.selectors";
import {AuthUser} from "../../../models/auth-user.model";
import {Timestamp} from "firebase/firestore";

describe("AppHeaderComponent", () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let mockPopoverController: any;
  let mockStore: any;

  const mockAccountId = "12345";
  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: null,
    photoURL: null,
    emailVerified: false,
  };

  const mockAccount: Account = {
    id: "12345",
    name: "Test Account",
    type: "user",
    privacy: "public",
    tagline: "",
    description: "",
    iconImage: "assets/custom-image.png",
    heroImage: "",
    legalAgreements: {
      termsOfService: {
        accepted: false,
        datetime: new Timestamp(0, 0),
        version: "",
      },
      privacyPolicy: {
        accepted: false,
        datetime: new Timestamp(0, 0),
        version: "",
      },
    },
    webLinks: [],
    lastLoginAt: new Timestamp(0, 0),
    email: "",
  };

  beforeEach(async () => {
    mockPopoverController = {
      create: jasmine.createSpy().and.returnValue(
        Promise.resolve({
          present: jasmine.createSpy(),
        }),
      ),
    };

    mockStore = {
      select: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      declarations: [AppHeaderComponent],
      imports: [StoreModule.forRoot({})],
      providers: [
        {provide: PopoverController, useValue: mockPopoverController},
        {provide: Store, useValue: mockStore},
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors for child components not declared
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;

    // Set default return values for store selectors
    mockStore.select.withArgs(selectAuthUser).and.returnValue(of(null));
    mockStore.select.withArgs(selectAccounts).and.returnValue(of([]));

    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should have a default avatar image if account iconImage is not set", () => {
    expect(component.image).toBe("assets/avatar/male2.png");
  });

  it("should return account iconImage if account is set", () => {
    component["account"] = {
      id: "123",
      iconImage: "assets/custom-image.png",
    } as Account;
    expect(component.image).toBe("assets/custom-image.png");
  });

  it("should initialize subscriptions on ngOnInit", () => {
    spyOn(component, "initiateSubscribers").and.callThrough();
    component.ngOnInit();
    expect(component.initiateSubscribers).toHaveBeenCalled();
  });

  it("should unsubscribe on ngOnDestroy", () => {
    spyOn(component["subscriptions"], "unsubscribe");
    component.ngOnDestroy();
    expect(component["subscriptions"].unsubscribe).toHaveBeenCalled();
  });

  it("should set the account when authUser and accounts are available", () => {
    const mockAuthUser = {uid: mockAccountId};
    const mockAccounts: Account[] = [mockAccount];

    mockStore.select.withArgs(selectAuthUser).and.returnValue(of(mockAuthUser));
    mockStore.select.withArgs(selectAccounts).and.returnValue(of(mockAccounts));

    component.initiateSubscribers();

    expect(component["account"]).toEqual(mockAccounts[0]);
  });

  it("should reset the account if authUser is not available", () => {
    const mockAccounts: Account[] = [mockAccount];
    mockStore.select.withArgs(selectAuthUser).and.returnValue(of(null));
    mockStore.select.withArgs(selectAccounts).and.returnValue(of(mockAccounts));

    component.initiateSubscribers();

    expect(component["account"]).toBeUndefined();
  });

  // it("should present popover when presentPopover is called", async () => {
  //   const mockEvent = {};
  //   await component.presentPopover(mockEvent);
  //   expect(mockPopoverController.create).toHaveBeenCalledWith({
  //     component: UserMenuComponent,
  //     event: mockEvent,
  //     translucent: true,
  //   });
  //   expect(mockPopoverController.create().present).toHaveBeenCalled();
  // });
});
