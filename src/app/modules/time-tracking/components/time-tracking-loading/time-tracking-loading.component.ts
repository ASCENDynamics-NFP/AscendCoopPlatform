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
import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";

export type LoadingMode = "overlay" | "inline" | "skeleton";

@Component({
  selector: "app-time-tracking-loading",
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
  templateUrl: "./time-tracking-loading.component.html",
  styleUrls: ["./time-tracking-loading.component.scss"],
})
export class TimeTrackingLoadingComponent {
  /**
   * Mode of the loading indicator
   * - overlay: Appears over existing content with blur effect
   * - inline: Centered loading with message (for empty states)
   * - skeleton: Placeholder skeleton elements
   */
  @Input() mode: LoadingMode = "inline";

  /**
   * The message to display below the spinner
   */
  @Input() message: string = "time_tracking.loading";

  /**
   * Custom icon name (optional, uses spinner by default)
   */
  @Input() icon?: string;

  /**
   * Whether to show the loading indicator
   */
  @Input() isLoading = true;

  /**
   * Spinner color
   */
  @Input() spinnerColor: string = "primary";

  /**
   * Spinner type/name
   */
  @Input() spinnerName:
    | "bubbles"
    | "circles"
    | "circular"
    | "crescent"
    | "dots"
    | "lines"
    | "lines-sharp"
    | "lines-sharp-small"
    | "lines-small" = "crescent";

  /**
   * Number of skeleton items to show (for skeleton mode)
   */
  @Input() skeletonCount: number = 3;
}
