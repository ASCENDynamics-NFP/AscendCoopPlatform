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
import {AdminDashboardPage} from "./admin-dashboard.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {ActivatedRoute, Router} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {of} from "rxjs";
import {NotificationService} from "../../../messaging/services/notification.service";
import {TranslateTestingModule} from "../../../../shared/testing/translate-testing.module";

describe("AdminDashboardPage", () => {
  let component: AdminDashboardPage;
  let fixture: ComponentFixture<AdminDashboardPage>;
  let mockStore: MockStore;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockAccount = {
    id: "test-group-id",
    name: "Test Group",
    type: "group",
    tagline: "Test Group Tagline",
    iconImage: "/test-image.jpg",
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    const activatedRouteSpy = jasmine.createSpyObj("ActivatedRoute", [], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy("get").and.returnValue("test-group-id"),
        },
      },
      queryParams: of({}),
    });
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "showMemberJoinRequestNotification",
      "showListingApplicationNotification",
    ]);

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardPage],
      imports: [IonicModule.forRoot(), FormsModule, TranslateTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            account: {
              entities: {
                "test-group-id": mockAccount,
              },
              relatedAccounts: [],
            },
            auth: {
              user: {uid: "test-user-id"},
            },
          },
        }),
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        {provide: NotificationService, useValue: notificationServiceSpy},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardPage);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(
      ActivatedRoute,
    ) as jasmine.SpyObj<ActivatedRoute>;
    mockNotificationService = TestBed.inject(
      NotificationService,
    ) as jasmine.SpyObj<NotificationService>;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with overview segment", () => {
    expect(component.selectedSegment).toBe("overview");
  });

  it("should navigate to role management", () => {
    component.navigateToRoleManagement();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/account",
      "test-group-id",
      "roles",
    ]);
  });

  it("should navigate to role hierarchy", () => {
    component.navigateToRoleHierarchy();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/account",
      "test-group-id",
      "hierarchy",
    ]);
  });

  it("should navigate to listings", () => {
    component.navigateToListings();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/account",
      "test-group-id",
      "listings",
    ]);
  });

  it("should navigate to members", () => {
    component.navigateToMembers();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/account",
      "test-group-id",
      "related",
      "user",
    ]);
  });

  it("should navigate back to profile", () => {
    component.goBackToProfile();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/account",
      "test-group-id",
    ]);
  });

  it("should change segment", () => {
    const event = {detail: {value: "members"}};
    component.onSegmentChange(event);
    expect(component.selectedSegment).toBe("members");
  });
});
