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
// src/app/shared/pipes/time-ago.pipe.ts

import {Pipe, PipeTransform} from "@angular/core";
import {FieldValue, Timestamp} from "firebase/firestore";

@Pipe({
  name: "timeAgo",
})
export class TimeAgoPipe implements PipeTransform {
  transform(
    value:
      | Date
      | string
      | number
      | Timestamp
      | {_seconds: number; _nanoseconds: number}
      | FieldValue
      | undefined,
  ): string {
    if (!value) {
      return "Unknown";
    }

    let date: Date;

    if (value instanceof Timestamp) {
      date = value.toDate();
    } else if (value instanceof Date) {
      date = value;
    } else if (typeof value === "string" || typeof value === "number") {
      date = new Date(value);
    } else if (
      typeof value === "object" &&
      value !== null &&
      "_seconds" in value &&
      typeof value._seconds === "number"
    ) {
      date = new Date(value._seconds * 1000);
    } else {
      return "Unknown";
    }

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return "just now";
    }

    const intervals: {[key: string]: number} = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval > 0) {
        return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }
}
