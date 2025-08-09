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
// shared/models/project.model.ts

import {BaseDocument} from "./base-document";
import {
  StandardProjectCategory,
  ProjectComplexity,
  ProjectTimeframe,
} from "./standard-project-template.model";

export interface Project extends BaseDocument {
  name: string;
  /** The account/group this project belongs to */
  accountId: string;
  color?: string;
  clientId?: string;
  archived?: boolean;

  // New fields for standardization
  /** Reference to standard project template this project is based on */
  standardProjectTemplateId?: string;
  /** Standard category this project belongs to for analytics */
  standardCategory?: StandardProjectCategory;
  /** Whether this is a system-provided standard project (like the default "Volunteer") */
  isStandardProject?: boolean;
  /** Project description */
  description?: string;
  /** Icon associated with this project */
  icon?: string;
  /** Project complexity level */
  complexity?: ProjectComplexity;
  /** Expected project timeframe */
  timeframe?: ProjectTimeframe;
  /** Project status */
  status?: "Planning" | "Active" | "On Hold" | "Completed" | "Cancelled";
  /** Project priority level */
  priority?: "Low" | "Medium" | "High" | "Critical";
  /** Project start date */
  startDate?: Date;
  /** Project end date */
  endDate?: Date;
  /** Budget allocated for this project */
  budget?: number;
  /** Actual spending on this project */
  actualSpending?: number;
  /** Key metrics to track for this project */
  metrics?: ProjectMetric[];
  /** Tags for better categorization and search */
  tags?: string[];
  /** Project goals and objectives */
  goals?: string[];
  /** Required roles for this project */
  requiredRoles?: string[];
}

export interface ProjectMetric {
  id: string;
  name: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string; // e.g., "hours", "dollars", "people", "percent"
  type: "Number" | "Currency" | "Percentage" | "Count";
  lastUpdated?: Date;
}
