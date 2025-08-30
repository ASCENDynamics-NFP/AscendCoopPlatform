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

import {Component, Input, Output, EventEmitter} from "@angular/core";
import {
  StandardProjectCategory,
  STANDARD_PROJECT_CATEGORIES_INFO,
} from "../../../../../../../../shared/models/standard-project-template.model";
import {CategorySuggestion} from "../../../../../../core/constants/category-keywords.constant";

@Component({
  selector: "app-smart-category-suggestions",
  templateUrl: "./smart-category-suggestions.component.html",
  styleUrls: ["./smart-category-suggestions.component.scss"],
})
export class SmartCategorySuggestionsComponent {
  @Input() suggestions: CategorySuggestion[] = [];
  @Input() visible = false;

  @Output() categorySelected = new EventEmitter<StandardProjectCategory>();
  @Output() dismissed = new EventEmitter<void>();

  projectCategories = STANDARD_PROJECT_CATEGORIES_INFO;

  applySuggestedCategory(suggestion: CategorySuggestion): void {
    this.categorySelected.emit(suggestion.category);
    this.dismissed.emit();
  }

  dismiss(): void {
    this.dismissed.emit();
  }

  getConfidenceColor(confidence: number): string {
    if (confidence > 70) return "success";
    if (confidence > 50) return "warning";
    return "medium";
  }
}
