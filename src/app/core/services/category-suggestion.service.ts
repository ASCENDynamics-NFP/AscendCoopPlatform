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

import {Injectable} from "@angular/core";
import {StandardProjectCategory} from "../../../../shared/models/standard-project-template.model";
import {
  CATEGORY_KEYWORDS,
  CategorySuggestion,
} from "../constants/category-keywords.constant";

@Injectable({
  providedIn: "root",
})
export class CategorySuggestionService {
  /**
   * Generate smart category suggestions based on project name
   * @param projectName The name of the project to analyze
   * @returns Array of category suggestions with confidence scores
   */
  generateSuggestions(projectName: string): CategorySuggestion[] {
    if (!projectName || projectName.trim().length < 2) {
      return [];
    }

    const normalizedName = projectName.toLowerCase().trim();
    const suggestions: CategorySuggestion[] = [];

    // Analyze each category for keyword matches
    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
      const categoryKey = category as StandardProjectCategory;
      const matchData = this.analyzeKeywordMatches(normalizedName, keywords);

      if (matchData.confidence > 20) {
        // Only show suggestions with >20% confidence
        suggestions.push({
          category: categoryKey,
          confidence: matchData.confidence,
          reason: this.generateReason(matchData.matchedKeywords, categoryKey),
        });
      }
    });

    // Sort by confidence (highest first) and return top 3
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }

  /**
   * Analyze keyword matches in project name
   */
  private analyzeKeywordMatches(
    projectName: string,
    keywords: string[],
  ): {
    confidence: number;
    matchedKeywords: string[];
  } {
    const words = projectName.split(/\s+/);
    const matchedKeywords: string[] = [];
    let totalMatches = 0;
    let exactMatches = 0;

    keywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase();

      // Check for exact word matches
      if (words.some((word) => word === keywordLower)) {
        matchedKeywords.push(keyword);
        totalMatches += 3; // Higher weight for exact matches
        exactMatches++;
      }
      // Check for partial matches (contains)
      else if (projectName.includes(keywordLower)) {
        matchedKeywords.push(keyword);
        totalMatches += 1;
      }
    });

    // Calculate confidence score
    const maxPossibleScore = keywords.length * 3;
    const rawConfidence = (totalMatches / maxPossibleScore) * 100;

    // Boost confidence for exact matches
    const exactMatchBonus = exactMatches * 10;
    const confidence = Math.min(
      100,
      Math.round(rawConfidence + exactMatchBonus),
    );

    return {
      confidence,
      matchedKeywords: [...new Set(matchedKeywords)], // Remove duplicates
    };
  }

  /**
   * Generate human-readable reason for suggestion
   */
  private generateReason(
    matchedKeywords: string[],
    category: StandardProjectCategory,
  ): string {
    if (matchedKeywords.length === 0) {
      return `Suggested based on ${category.toLowerCase()} category patterns`;
    }

    const keywordText =
      matchedKeywords.length === 1
        ? `"${matchedKeywords[0]}"`
        : `"${matchedKeywords.slice(0, -1).join('", "')}" and "${matchedKeywords[matchedKeywords.length - 1]}"`;

    return `Contains ${keywordText} which ${matchedKeywords.length === 1 ? "is" : "are"} commonly associated with ${category.toLowerCase()} projects`;
  }

  /**
   * Check if suggestions should be shown (minimum criteria)
   */
  shouldShowSuggestions(
    projectName: string,
    selectedCategory?: StandardProjectCategory,
  ): boolean {
    if (selectedCategory) {
      return false; // Don't show if category already selected
    }

    if (!projectName || projectName.trim().length < 3) {
      return false; // Need at least 3 characters
    }

    return this.generateSuggestions(projectName).length > 0;
  }
}
