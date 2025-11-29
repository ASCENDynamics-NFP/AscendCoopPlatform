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
// src/app/core/services/skill-match.service.ts

import {Injectable} from "@angular/core";
import {SkillRequirement} from "@shared/models/listing.model";

export interface SkillMatchResult {
  /** Match percentage from 0 to 100 */
  percentage: number;
  /** Skills the user has that match listing requirements */
  matchedSkills: string[];
  /** Skills the listing requires that the user doesn't have */
  missingSkills: string[];
  /** Required skills that are missing (higher priority) */
  missingRequiredSkills: string[];
  /** Optional skills that are missing (lower priority) */
  missingOptionalSkills: string[];
  /** Color indicator based on match percentage */
  color: "success" | "warning" | "medium";
}

@Injectable({
  providedIn: "root",
})
export class SkillMatchService {
  // Weight multiplier for required skills (2x weight)
  private readonly REQUIRED_SKILL_WEIGHT = 2;
  private readonly OPTIONAL_SKILL_WEIGHT = 1;

  /**
   * Calculate skill match between user skills and listing requirements
   * @param userSkills Array of user's skills (from professionalInformation.skillsAndExpertise)
   * @param listingSkills Array of listing's SkillRequirement objects
   * @returns SkillMatchResult with percentage, matched/missing skills, and color
   */
  calculateMatch(
    userSkills: string[] | undefined | null,
    listingSkills: SkillRequirement[] | undefined | null,
  ): SkillMatchResult {
    // Handle edge cases
    if (!listingSkills || listingSkills.length === 0) {
      return {
        percentage: 100, // No requirements = perfect match
        matchedSkills: [],
        missingSkills: [],
        missingRequiredSkills: [],
        missingOptionalSkills: [],
        color: "success",
      };
    }

    if (!userSkills || userSkills.length === 0) {
      return {
        percentage: 0,
        matchedSkills: [],
        missingSkills: listingSkills.map((s) => s.name),
        missingRequiredSkills: listingSkills
          .filter((s) => s.required)
          .map((s) => s.name),
        missingOptionalSkills: listingSkills
          .filter((s) => !s.required)
          .map((s) => s.name),
        color: "medium",
      };
    }

    // Normalize user skills for case-insensitive comparison
    // Use Set for O(1) exact match lookup, fall back to fuzzy matching
    const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());
    const userSkillsSet = new Set(normalizedUserSkills);

    const matchedSkills: string[] = [];
    const missingRequiredSkills: string[] = [];
    const missingOptionalSkills: string[] = [];

    let totalWeight = 0;
    let matchedWeight = 0;

    for (const requirement of listingSkills) {
      const weight = requirement.required
        ? this.REQUIRED_SKILL_WEIGHT
        : this.OPTIONAL_SKILL_WEIGHT;
      totalWeight += weight;

      const normalizedSkillName = requirement.name.toLowerCase().trim();

      // Fast path: exact match using Set (O(1))
      let isMatched = userSkillsSet.has(normalizedSkillName);

      // Slow path: fuzzy matching for partial matches (O(n))
      if (!isMatched) {
        isMatched = normalizedUserSkills.some(
          (userSkill) =>
            userSkill.includes(normalizedSkillName) ||
            normalizedSkillName.includes(userSkill),
        );
      }

      if (isMatched) {
        matchedSkills.push(requirement.name);
        matchedWeight += weight;
      } else if (requirement.required) {
        missingRequiredSkills.push(requirement.name);
      } else {
        missingOptionalSkills.push(requirement.name);
      }
    }

    const percentage =
      totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 100;
    const color = this.getColorForPercentage(percentage);

    return {
      percentage,
      matchedSkills,
      missingSkills: [...missingRequiredSkills, ...missingOptionalSkills],
      missingRequiredSkills,
      missingOptionalSkills,
      color,
    };
  }

  /**
   * Get color indicator based on match percentage
   * - Green (success): >= 75%
   * - Yellow (warning): 50-74%
   * - Gray (medium): < 50%
   */
  private getColorForPercentage(
    percentage: number,
  ): "success" | "warning" | "medium" {
    if (percentage >= 75) {
      return "success";
    } else if (percentage >= 50) {
      return "warning";
    } else {
      return "medium";
    }
  }

  /**
   * Generate tooltip text for skill match
   */
  getMatchTooltip(result: SkillMatchResult): string {
    const parts: string[] = [];

    if (result.matchedSkills.length > 0) {
      parts.push(`Matched: ${result.matchedSkills.join(", ")}`);
    }

    if (result.missingRequiredSkills.length > 0) {
      parts.push(
        `Missing (required): ${result.missingRequiredSkills.join(", ")}`,
      );
    }

    if (result.missingOptionalSkills.length > 0) {
      parts.push(
        `Missing (optional): ${result.missingOptionalSkills.join(", ")}`,
      );
    }

    return parts.length > 0 ? parts.join("\n") : "No skill requirements";
  }
}
