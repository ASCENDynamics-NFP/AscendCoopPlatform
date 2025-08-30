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

import {
  StandardProjectCategory,
  StandardProjectTemplate,
} from "../../../../../../../shared/models/standard-project-template.model";
import {CategorySuggestion} from "../../../../../core/constants/category-keywords.constant";

export interface ProjectCreationEvent {
  type: "single";
  projectName: string;
  category: StandardProjectCategory;
  template?: StandardProjectTemplate;
}

export interface ProjectCreationState {
  newProjectName: string;
  selectedCategory?: StandardProjectCategory;
  selectedTemplate?: StandardProjectTemplate;
  availableTemplates: StandardProjectTemplate[];
  suggestedCategories: CategorySuggestion[];
  showCategorySuggestions: boolean;
}

export const DEFAULT_PROJECT_CREATION_STATE: ProjectCreationState = {
  newProjectName: "",
  selectedCategory: undefined,
  selectedTemplate: undefined,
  availableTemplates: [],
  suggestedCategories: [],
  showCategorySuggestions: false,
};
