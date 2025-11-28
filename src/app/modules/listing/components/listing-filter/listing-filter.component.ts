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
// src/app/modules/listing/components/listing-filter/listing-filter.component.ts

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {debounceTime, takeUntil} from "rxjs/operators";

export interface ListingFilterValues {
  location?: {latitude: number; longitude: number} | null;
  radiusKm?: number | null;
  skills?: string[];
  remote?: boolean | null;
  hoursPerWeekMin?: number | null;
  hoursPerWeekMax?: number | null;
}

export interface RadiusOption {
  label: string;
  value: number | null;
  miles: number | null;
}

@Component({
  selector: "app-listing-filter",
  templateUrl: "./listing-filter.component.html",
  styleUrls: ["./listing-filter.component.scss"],
})
export class ListingFilterComponent implements OnInit, OnDestroy {
  @Input() availableSkills: string[] = [];
  @Input() isExpanded = false;
  @Input() showToggleButton = true;
  @Output() filterChange = new EventEmitter<ListingFilterValues>();
  @Output() expandedChange = new EventEmitter<boolean>();
  @Output() activeFilterCountChange = new EventEmitter<number>();

  filterForm: FormGroup;

  private destroy$ = new Subject<void>();
  private filterTrigger$ = new Subject<void>();

  radiusOptions: RadiusOption[] = [
    {label: "Any Distance", value: null, miles: null},
    {label: "5 miles", value: 8, miles: 5},
    {label: "10 miles", value: 16, miles: 10},
    {label: "25 miles", value: 40, miles: 25},
    {label: "50 miles", value: 80, miles: 50},
    {label: "100 miles", value: 161, miles: 100},
  ];

  hoursRange = {min: 0, max: 40};
  currentLocation: {latitude: number; longitude: number} | null = null;
  locationStatus: "idle" | "loading" | "success" | "error" = "idle";
  locationError: string | null = null;
  locationNote: string | null = null;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      radiusKm: [null],
      skills: [[]],
      remote: [null],
      hoursPerWeekMin: [null],
      hoursPerWeekMax: [null],
    });
  }

  ngOnInit() {
    // Debounce filter emissions to avoid excessive API calls
    this.filterTrigger$
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.emitFilterValues();
      });

    // Subscribe to form changes
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.triggerFilterUpdate();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Trigger a filter update (debounced)
   */
  private triggerFilterUpdate() {
    this.filterTrigger$.next();
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.expandedChange.emit(this.isExpanded);
  }

  async detectLocation() {
    if (!navigator.geolocation) {
      this.locationStatus = "error";
      this.locationError = "Geolocation is not supported by your browser";
      return;
    }

    this.locationStatus = "loading";
    this.locationError = null;

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // Cache for 5 minutes
          });
        },
      );

      this.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      this.locationStatus = "success";
      this.locationNote =
        "Location detected. Note: Location filtering requires listings to have geocoded addresses.";

      // If no radius selected, default to 25 miles
      if (!this.filterForm.get("radiusKm")?.value) {
        this.filterForm.patchValue({radiusKm: 40});
      }

      this.triggerFilterUpdate();
    } catch (error: any) {
      this.locationStatus = "error";
      if (error.code === 1) {
        this.locationError = "Location permission denied";
      } else if (error.code === 2) {
        this.locationError = "Unable to determine location";
      } else if (error.code === 3) {
        this.locationError = "Location request timed out";
      } else {
        this.locationError = "Failed to get location";
      }
    }
  }

  clearLocation() {
    this.currentLocation = null;
    this.locationStatus = "idle";
    this.locationNote = null;
    this.filterForm.patchValue({radiusKm: null});
    this.triggerFilterUpdate();
  }

  onSkillsChange(event: any) {
    const selectedSkills = event.detail.value || [];
    this.filterForm.patchValue({skills: selectedSkills}, {emitEvent: false});
    this.triggerFilterUpdate();
  }

  onRemoteChange(event: any) {
    const isChecked = event.detail.checked;
    // If checked, set remote to true; if unchecked, set to null (show all)
    this.filterForm.patchValue(
      {remote: isChecked ? true : null},
      {emitEvent: false},
    );
    this.triggerFilterUpdate();
  }

  onHoursRangeChange(event: any) {
    const value = event.detail.value;
    if (typeof value === "object" && value.lower !== undefined) {
      this.filterForm.patchValue(
        {
          hoursPerWeekMin: value.lower > 0 ? value.lower : null,
          hoursPerWeekMax: value.upper < 40 ? value.upper : null,
        },
        {emitEvent: false},
      );
      this.triggerFilterUpdate();
    }
  }

  clearAllFilters() {
    this.filterForm.reset(
      {
        radiusKm: null,
        skills: [],
        remote: null,
        hoursPerWeekMin: null,
        hoursPerWeekMax: null,
      },
      {emitEvent: false},
    );
    this.currentLocation = null;
    this.locationStatus = "idle";
    this.triggerFilterUpdate();
  }

  hasActiveFilters(): boolean {
    const values = this.filterForm.value;
    return !!(
      this.currentLocation ||
      values.radiusKm ||
      (values.skills && values.skills.length > 0) ||
      values.remote ||
      values.hoursPerWeekMin ||
      values.hoursPerWeekMax
    );
  }

  getActiveFilterCount(): number {
    let count = 0;
    const values = this.filterForm.value;

    if (this.currentLocation && values.radiusKm) count++;
    if (values.skills && values.skills.length > 0) count++;
    if (values.remote) count++;
    if (values.hoursPerWeekMin || values.hoursPerWeekMax) count++;

    return count;
  }

  private emitFilterValues() {
    const formValues = this.filterForm.value;

    const filterValues: ListingFilterValues = {
      location: this.currentLocation,
      radiusKm: formValues.radiusKm,
      skills: formValues.skills?.length > 0 ? formValues.skills : undefined,
      remote: formValues.remote,
      hoursPerWeekMin: formValues.hoursPerWeekMin,
      hoursPerWeekMax: formValues.hoursPerWeekMax,
    };

    this.filterChange.emit(filterValues);
    this.activeFilterCountChange.emit(this.getActiveFilterCount());
  }
}
