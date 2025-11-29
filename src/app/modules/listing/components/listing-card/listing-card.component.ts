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
// src/app/modules/listing/components/listing-card/listing-card.component.ts

import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Listing} from "@shared/models/listing.model";
import {
  SkillMatchService,
  SkillMatchResult,
} from "../../../../core/services/skill-match.service";

@Component({
  selector: "app-listing-card",
  templateUrl: "./listing-card.component.html",
  styleUrls: ["./listing-card.component.scss"],
})
export class ListingCardComponent implements OnInit, OnChanges {
  @Input() listing!: Listing;
  @Input() userSkills: string[] = [];
  @Input() showMatchBadge = true;

  skillMatch: SkillMatchResult | null = null;
  tooltipText = "";

  // Cache previous inputs to avoid unnecessary recalculations
  private previousListingId: string | null = null;
  private previousUserSkillsHash: string | null = null;

  constructor(
    private skillMatchService: SkillMatchService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.calculateSkillMatch();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["listing"] || changes["userSkills"]) {
      this.calculateSkillMatch();
    }
  }

  private calculateSkillMatch() {
    if (!this.listing || !this.showMatchBadge) {
      return;
    }

    const currentListingId = this.listing.id;
    const currentUserSkillsHash = this.userSkills.slice().sort().join("|");

    // Skip recalculation if inputs haven't changed
    if (
      currentListingId === this.previousListingId &&
      currentUserSkillsHash === this.previousUserSkillsHash
    ) {
      return;
    }

    this.previousListingId = currentListingId;
    this.previousUserSkillsHash = currentUserSkillsHash;

    this.skillMatch = this.skillMatchService.calculateMatch(
      this.userSkills,
      this.listing.skills,
    );
    this.tooltipText = this.skillMatchService.getMatchTooltip(this.skillMatch);
  }

  /**
   * Get CSS class for listing type color coding
   */
  getTypeClass(): string {
    switch (this.listing?.type) {
      case "volunteer":
        return "type-volunteer";
      case "job":
        return "type-job";
      case "internship":
        return "type-internship";
      case "gig":
        return "type-gig";
      default:
        return "type-default";
    }
  }

  /**
   * Get icon for listing type
   */
  getTypeIcon(): string {
    switch (this.listing?.type) {
      case "volunteer":
        return "people-outline";
      case "job":
        return "briefcase-outline";
      case "internship":
        return "school-outline";
      case "gig":
        return "flash-outline";
      default:
        return "document-outline";
    }
  }

  /**
   * Get formatted location string
   */
  getLocation(): string {
    if (this.listing.remote) {
      return this.translate.instant("listings.remote");
    }
    const address = this.listing.contactInformation?.addresses?.[0];
    if (address) {
      const parts = [address.city, address.state, address.country].filter(
        Boolean,
      );
      return (
        parts.join(", ") ||
        this.translate.instant("listings.location_not_specified")
      );
    }
    return this.translate.instant("listings.location_not_specified");
  }

  /**
   * Get time commitment display string
   */
  getTimeCommitment(): string {
    const hours = this.listing.timeCommitment?.hoursPerWeek;
    if (hours) {
      return this.translate.instant("listings.hours_per_week", {hours});
    }
    return this.translate.instant("listings.flexible");
  }
}
