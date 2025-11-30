/*******************************************************************************
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
 *******************************************************************************/
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from "@angular/core/testing";
import {ApprovalsPage} from "./approvals.page";
import {
  IonicModule,
  AlertController,
  ToastController,
  ModalController,
} from "@ionic/angular";
import {RouterTestingModule} from "@angular/router/testing";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {TimesheetNotificationService} from "../../services/timesheet-notification.service";

describe("ApprovalsPage", () => {
  let component: ApprovalsPage;
  let fixture: ComponentFixture<ApprovalsPage>;
  let store: MockStore;
  let alertController: jasmine.SpyObj<AlertController>;
  let toastController: jasmine.SpyObj<ToastController>;
  let modalController: jasmine.SpyObj<ModalController>;

  const mockAccountId = "test-account-id";

  const initialState = {
    auth: {
      user: {
        uid: "test-user-id",
        email: "test@example.com",
        displayName: "Test User",
      },
    },
    account: {
      entities: {
        [mockAccountId]: {
          id: mockAccountId,
          name: "Test Organization",
          iconImage: "",
        },
      },
      ids: [mockAccountId],
    },
    timeTracking: {
      entries: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    const alertSpy = jasmine.createSpyObj("AlertController", ["create"]);
    const toastSpy = jasmine.createSpyObj("ToastController", ["create"]);
    const modalSpy = jasmine.createSpyObj("ModalController", ["create"]);
    const notificationSpy = jasmine.createSpyObj(
      "TimesheetNotificationService",
      [
        "notifyTimesheetSubmitted",
        "notifyTimesheetApproved",
        "notifyTimesheetRejected",
        "notifyNoteAdded",
      ],
    );

    // Mock notification service methods to resolve
    notificationSpy.notifyTimesheetSubmitted.and.returnValue(Promise.resolve());
    notificationSpy.notifyTimesheetApproved.and.returnValue(Promise.resolve());
    notificationSpy.notifyTimesheetRejected.and.returnValue(Promise.resolve());
    notificationSpy.notifyNoteAdded.and.returnValue(Promise.resolve());

    // Mock alert create to return a presentable alert
    alertSpy.create.and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => Promise.resolve({role: "cancel"}),
      }),
    );

    // Mock toast create to return a presentable toast
    toastSpy.create.and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => Promise.resolve({role: "timeout"}),
      }),
    );

    // Mock modal create to return a presentable modal
    modalSpy.create.and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => Promise.resolve({role: "cancel"}),
      }),
    );

    await TestBed.configureTestingModule({
      declarations: [ApprovalsPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({initialState}),
        {provide: AlertController, useValue: alertSpy},
        {provide: ToastController, useValue: toastSpy},
        {provide: ModalController, useValue: modalSpy},
        {provide: TimesheetNotificationService, useValue: notificationSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) =>
                  key === "accountId" ? mockAccountId : null,
              },
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    alertController = TestBed.inject(
      AlertController,
    ) as jasmine.SpyObj<AlertController>;
    toastController = TestBed.inject(
      ToastController,
    ) as jasmine.SpyObj<ToastController>;
    modalController = TestBed.inject(
      ModalController,
    ) as jasmine.SpyObj<ModalController>;

    // Clear localStorage to ensure default values in tests
    localStorage.removeItem("approvals_preferences");

    fixture = TestBed.createComponent(ApprovalsPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Clean up any running intervals before destroying the fixture
    if (component) {
      component.stopUpdateChecking();
    }
    // Clean up localStorage
    localStorage.removeItem("approvals_preferences");
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("initialization", () => {
    it("should set accountId from route params", () => {
      fixture.detectChanges();
      expect(component.accountId).toBe(mockAccountId);
    });

    it("should initialize with default filter values", () => {
      fixture.detectChanges();
      expect(component.statusFilter).toBe("all");
      expect(component.sortBy).toBe("date");
      expect(component.sortDirection).toBe("desc");
      expect(component.showAllWeeks).toBe(false);
    });

    it("should start update checking on init", () => {
      spyOn(component, "startUpdateChecking");
      fixture.detectChanges();
      expect(component.startUpdateChecking).toHaveBeenCalled();
    });
  });

  describe("week navigation", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("should navigate to next week", () => {
      const initialWeek = new Date(component.currentWeekStart);
      component.nextWeek();
      expect(component.currentWeekStart.getTime()).toBe(
        initialWeek.getTime() + 7 * 24 * 60 * 60 * 1000,
      );
    });

    it("should navigate to previous week", () => {
      const initialWeek = new Date(component.currentWeekStart);
      component.previousWeek();
      expect(component.currentWeekStart.getTime()).toBe(
        initialWeek.getTime() - 7 * 24 * 60 * 60 * 1000,
      );
    });

    it("should jump to current week", () => {
      // First go to a different week
      component.previousWeek();
      component.previousWeek();
      expect(component.isCurrentWeek()).toBe(false);

      // Jump back to this week
      component.jumpToThisWeek();
      expect(component.isCurrentWeek()).toBe(true);
    });

    it("should correctly identify current week", () => {
      expect(component.isCurrentWeek()).toBe(true);

      component.previousWeek();
      expect(component.isCurrentWeek()).toBe(false);
    });
  });

  describe("filter controls", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("should update status filter", () => {
      component.setStatusFilter("pending");
      expect(component.statusFilter).toBe("pending");

      component.setStatusFilter("approved");
      expect(component.statusFilter).toBe("approved");

      component.setStatusFilter("all");
      expect(component.statusFilter).toBe("all");
    });

    it("should update sort by", () => {
      component.setSortBy("user");
      expect(component.sortBy).toBe("user");

      component.setSortBy("hours");
      expect(component.sortBy).toBe("hours");
    });

    it("should toggle sort direction", () => {
      expect(component.sortDirection).toBe("desc");

      component.toggleSortDirection();
      expect(component.sortDirection).toBe("asc");

      component.toggleSortDirection();
      expect(component.sortDirection).toBe("desc");
    });
  });

  describe("user search", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("should update search term on input", () => {
      const event = {
        detail: {value: "test search"},
      } as CustomEvent<{value: string}>;

      component.onUserSearchChange(event);
      expect(component.userSearchTerm).toBe("test search");
    });

    it("should clear search term", () => {
      component.userSearchTerm = "test";
      component.clearUserSearch();
      expect(component.userSearchTerm).toBe("");
    });
  });

  describe("group expansion", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("should toggle group expansion", () => {
      const mockGroup = {
        userId: "user1",
        userName: "Test User",
        userEmail: "test@example.com",
        weekStart: new Date(),
        entries: [],
        totalHours: 8,
        status: "pending" as const,
      };

      expect(component.isGroupExpanded(mockGroup)).toBe(false);

      component.toggleGroupExpansion(mockGroup);
      expect(component.isGroupExpanded(mockGroup)).toBe(true);

      component.toggleGroupExpansion(mockGroup);
      expect(component.isGroupExpanded(mockGroup)).toBe(false);
    });

    it("should collapse all groups", () => {
      component.expandedGroups.add("test_key");
      component.collapseAllGroups();
      expect(component.expandedGroups.size).toBe(0);
      expect(component.allExpanded).toBe(false);
    });
  });

  describe("selection management", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("should return correct selected count", () => {
      expect(component.getSelectedCount()).toBe(0);

      component.selectedGroups.add("group1");
      component.selectedGroups.add("group2");
      expect(component.getSelectedCount()).toBe(2);
    });

    it("should deselect all groups", () => {
      component.selectedGroups.add("group1");
      component.selectedGroups.add("group2");

      component.deselectAll();

      expect(component.selectedGroups.size).toBe(0);
      expect(component.allPendingSelected).toBe(false);
    });
  });

  describe("status helpers", () => {
    it("should return correct status color", () => {
      expect(component.getStatusColor("approved")).toBe("success");
      expect(component.getStatusColor("rejected")).toBe("danger");
      expect(component.getStatusColor("pending")).toBe("warning");
      expect(component.getStatusColor("draft")).toBe("medium");
    });

    it("should return correct status icon", () => {
      expect(component.getStatusIcon("approved")).toBe("checkmark-circle");
      expect(component.getStatusIcon("rejected")).toBe("close-circle");
      expect(component.getStatusIcon("pending")).toBe("time");
      expect(component.getStatusIcon("draft")).toBe("create");
    });
  });

  describe("week range formatting", () => {
    it("should format week range correctly", () => {
      const weekStart = new Date("2025-11-30");
      weekStart.setHours(0, 0, 0, 0);

      const range = component.getWeekRange(weekStart);

      // Should include start and end dates
      expect(range).toContain("-");
      expect(range.length).toBeGreaterThan(0);
    });
  });

  describe("date picker", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("should toggle date picker when not showing all weeks", () => {
      component.showAllWeeks = false;
      expect(component.isDatePickerOpen).toBe(false);

      component.toggleDatePicker();
      expect(component.isDatePickerOpen).toBe(true);

      component.toggleDatePicker();
      expect(component.isDatePickerOpen).toBe(false);
    });

    it("should not toggle date picker when showing all weeks", () => {
      component.showAllWeeks = true;
      component.isDatePickerOpen = false;

      component.toggleDatePicker();
      expect(component.isDatePickerOpen).toBe(false);
    });

    it("should handle date selection", () => {
      const event = {
        detail: {value: "2025-11-15"},
      } as CustomEvent<{value: string}>;

      component.onDateSelected(event);

      // Should close the picker
      expect(component.isDatePickerOpen).toBe(false);
    });
  });

  describe("update detection", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("should refresh data and dismiss banner", () => {
      component.hasNewUpdates = true;
      component.refreshData();
      expect(component.hasNewUpdates).toBe(false);
    });

    it("should set isRefreshing flag when refreshing", () => {
      expect(component["isRefreshing"]).toBe(false);
      component.refreshData();
      expect(component["isRefreshing"]).toBe(true);
    });

    it("should create refreshSubscription when refreshing", () => {
      expect(component["refreshSubscription"]).toBeNull();
      component.refreshData();
      expect(component["refreshSubscription"]).not.toBeNull();
    });

    it("should cancel existing refreshSubscription when refresh is called again", () => {
      component.refreshData();
      const firstSubscription = component["refreshSubscription"];
      const unsubscribeSpy = spyOn(firstSubscription!, "unsubscribe");

      component.refreshData();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it("should clean up refreshSubscription on destroy", () => {
      component.refreshData();
      expect(component["refreshSubscription"]).not.toBeNull();

      const unsubscribeSpy = spyOn(
        component["refreshSubscription"]!,
        "unsubscribe",
      );
      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it("should dismiss update banner", () => {
      component.hasNewUpdates = true;
      component.dismissUpdateBanner();
      expect(component.hasNewUpdates).toBe(false);
    });
  });

  describe("entry notes", () => {
    it("should detect entries with notes", () => {
      const entryWithNotes = {
        notes: "Test notes",
        noteHistory: [],
      } as any;

      const entryWithHistory = {
        notes: "",
        noteHistory: [{content: "History note"}],
      } as any;

      const entryWithoutNotes = {
        notes: "",
        noteHistory: [],
      } as any;

      expect(component.hasEntryNotes(entryWithNotes)).toBe(true);
      expect(component.hasEntryNotes(entryWithHistory)).toBe(true);
      expect(component.hasEntryNotes(entryWithoutNotes)).toBe(false);
    });
  });

  describe("CSV export", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("should show toast when no data to export", fakeAsync(() => {
      component.exportToCSV();
      tick();
      expect(toastController.create).toHaveBeenCalled();
    }));
  });

  describe("toDate helper", () => {
    it("should convert Date object", () => {
      const date = new Date("2025-11-30");
      expect(component.toDate(date)).toEqual(date);
    });

    it("should convert ISO string", () => {
      const result = component.toDate("2025-11-30");
      expect(result instanceof Date).toBe(true);
    });

    it("should convert timestamp-like object", () => {
      const timestamp = {seconds: 1732924800, nanoseconds: 0};
      const result = component.toDate(timestamp);
      expect(result instanceof Date).toBe(true);
    });

    it("should return epoch for null/undefined", () => {
      expect(component.toDate(null).getTime()).toBe(0);
      expect(component.toDate(undefined).getTime()).toBe(0);
    });
  });

  describe("cleanup", () => {
    it("should clean up on destroy", () => {
      fixture.detectChanges();
      spyOn(component["subscriptions"], "unsubscribe");

      component.ngOnDestroy();

      expect(component["subscriptions"].unsubscribe).toHaveBeenCalled();
    });
  });
});
