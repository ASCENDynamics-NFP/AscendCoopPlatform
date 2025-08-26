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
 ********************************************************************************/
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ReportsPage} from "./reports.page";
import {
  AnalyticsService,
  TimeTrackingAnalytics,
} from "../../../../core/services/analytics.service";
import {Store} from "@ngrx/store";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";

describe("ReportsPage", () => {
  let component: ReportsPage;
  let fixture: ComponentFixture<ReportsPage>;
  let mockAnalyticsService: jasmine.SpyObj<AnalyticsService>;
  let mockStore: jasmine.SpyObj<Store>;

  const mockTimeTrackingAnalytics: TimeTrackingAnalytics = {
    totalHours: 40,
    totalEntries: 10,
    totalApprovedHours: 35,
    averageHoursPerEntry: 4,
    averageApprovalTime: 2,
    entriesByStatus: {approved: 8, pending: 2, rejected: 0},
    hoursByStatus: {approved: 35, pending: 5, rejected: 0},
    entriesByProject: {},
    entriesByUser: {},
    monthlyStats: {},
    weeklyStats: {},
    mostActiveUsers: [],
    mostActiveProjects: [],
    approvalMetrics: {
      approvalRate: 85,
      rejectionRate: 10,
      pendingRate: 5,
      averageDaysToApproval: 2,
    },
    timeDistribution: {
      byDayOfWeek: {},
      byTimeOfMonth: {},
    },
  };

  beforeEach(async () => {
    const analyticsServiceSpy = jasmine.createSpyObj("AnalyticsService", [
      "getTimeTrackingAnalytics",
      "getMonthlyTimeTrackingReport",
      "getQuarterlyTimeTrackingReport",
      "exportTimeTrackingData",
    ]);
    const storeSpy = jasmine.createSpyObj("Store", ["select"]);

    // Mock ActivatedRoute with accountId parameter
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy("get").and.returnValue("test-account-id"),
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [ReportsPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        {provide: AnalyticsService, useValue: analyticsServiceSpy},
        {provide: Store, useValue: storeSpy},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsPage);
    component = fixture.componentInstance;
    mockAnalyticsService = TestBed.inject(
      AnalyticsService,
    ) as jasmine.SpyObj<AnalyticsService>;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    // Setup default spy returns
    mockAnalyticsService.getTimeTrackingAnalytics.and.returnValue(
      of(mockTimeTrackingAnalytics),
    );
    mockAnalyticsService.getMonthlyTimeTrackingReport.and.returnValue(
      of(mockTimeTrackingAnalytics),
    );
    mockAnalyticsService.getQuarterlyTimeTrackingReport.and.returnValue(
      of(mockTimeTrackingAnalytics),
    );
    mockAnalyticsService.exportTimeTrackingData.and.returnValue(
      of([{date: "2023-01-01", hours: 8, project: "Test"}]),
    );
    mockStore.select.and.returnValue(
      of({uid: "test-uid", email: "test@example.com"}),
    );
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with default values", () => {
    expect(component.selectedReportType).toBe("monthly");
    expect(component.selectedUserId).toBe("");
    expect(component.selectedProjectId).toBe("");
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it("should have available reports configured", () => {
    expect(component.availableReports).toHaveSize(6);
    expect(component.availableReports[0].type).toBe("monthly");
    expect(component.availableReports[0].enabled).toBeTrue();
  });

  it("should generate report when generateReport is called", () => {
    component.currentAccountId = "test-account";
    component.isLoading = false; // Ensure it starts as false

    component.generateReport();

    expect(
      mockAnalyticsService.getMonthlyTimeTrackingReport,
    ).toHaveBeenCalled();
    // Note: isLoading will be false after the observable completes synchronously
    expect(component.error).toBeNull();
  });

  it("should handle report type selection", () => {
    component.onReportTypeChange("quarterly");
    expect(component.selectedReportType).toBe("quarterly");
  });

  it("should handle user selection", () => {
    component.onUserSelectionChange("user-123");
    expect(component.selectedUserId).toBe("user-123");
  });

  it("should handle project selection", () => {
    component.onProjectSelectionChange("project-456");
    expect(component.selectedProjectId).toBe("project-456");
  });

  it("should handle custom date range", () => {
    const startDate = "2023-01-01";
    const endDate = "2023-12-31";

    component.customStartDate = startDate;
    component.customEndDate = endDate;
    expect(component.customStartDate).toBe(startDate);
    expect(component.customEndDate).toBe(endDate);
  });

  it("should export to CSV when exportToCSV is called", async () => {
    component.currentAccountId = "test-account";
    mockAnalyticsService.exportTimeTrackingData.and.returnValue(
      of([{date: "2023-01-01", hours: 8, project: "Test"}]),
    );

    spyOn(component as any, "downloadCSV");
    await component.exportToCSV();

    expect(mockAnalyticsService.exportTimeTrackingData).toHaveBeenCalled();
    expect((component as any).downloadCSV).toHaveBeenCalled();
  });

  it("should get chart data from analytics", () => {
    const chartData = component.getChartData(mockTimeTrackingAnalytics);
    expect(chartData).toBeTruthy();
    expect(chartData!.statusPieChart).toBeTruthy();
    expect(chartData!.monthlyTrendChart).toBeTruthy();
    expect(chartData!.dayOfWeekChart).toBeTruthy();
  });

  it("should get summary stats from analytics", () => {
    const summaryStats = component.getSummaryStats(mockTimeTrackingAnalytics);
    expect(summaryStats).toHaveSize(4);
    expect(summaryStats![0].label).toBe("Total Hours");
    expect(summaryStats![0].value).toBe(40);
  });

  it("should refresh report", () => {
    spyOn(component, "generateReport");
    component.refreshReport();
    expect(component.generateReport).toHaveBeenCalled();
  });
});
