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

import {StandardProjectCategory} from "../../../../shared/models/standard-project-template.model";

/**
 * Keywords used for smart category suggestions based on project names
 * These keywords help the AI suggest appropriate categories for new projects
 */
export const CATEGORY_KEYWORDS: {[key in StandardProjectCategory]: string[]} = {
  Volunteer: [
    "volunteer",
    "community",
    "service",
    "help",
    "support",
    "assist",
    "charity",
    "nonprofit",
    "giveback",
  ],
  Fundraising: [
    "fundraising",
    "donation",
    "grant",
    "sponsor",
    "funding",
    "revenue",
    "financial",
    "budget",
    "investment",
    "capital",
    "money",
  ],
  Event: [
    "event",
    "conference",
    "workshop",
    "meeting",
    "seminar",
    "gathering",
    "celebration",
    "ceremony",
    "festival",
    "concert",
  ],
  Education: [
    "education",
    "training",
    "learning",
    "teaching",
    "curriculum",
    "course",
    "program",
    "workshop",
    "tutorial",
    "knowledge",
  ],
  Outreach: [
    "outreach",
    "engagement",
    "community",
    "public",
    "awareness",
    "civic",
    "local",
    "participation",
    "advocacy",
    "awareness",
  ],
  Research: [
    "research",
    "study",
    "analysis",
    "investigation",
    "survey",
    "data",
    "experiment",
    "academic",
    "scientific",
    "evaluation",
    "assessment",
  ],
  Operations: [
    "operations",
    "management",
    "administration",
    "logistics",
    "coordination",
    "planning",
    "execution",
    "process",
    "workflow",
  ],
  Marketing: [
    "marketing",
    "promotion",
    "advertising",
    "branding",
    "communication",
    "publicity",
    "social media",
    "outreach",
    "campaign",
  ],
  Technology: [
    "technology",
    "tech",
    "digital",
    "software",
    "app",
    "website",
    "platform",
    "system",
    "automation",
    "development",
    "coding",
    "programming",
  ],
  General: [
    "general",
    "misc",
    "miscellaneous",
    "other",
    "various",
    "mixed",
    "multi",
    "cross",
    "collaborative",
    "initiative",
  ],
};

/**
 * Interface for category suggestion results
 */
export interface CategorySuggestion {
  category: StandardProjectCategory;
  confidence: number;
  reason: string;
}
