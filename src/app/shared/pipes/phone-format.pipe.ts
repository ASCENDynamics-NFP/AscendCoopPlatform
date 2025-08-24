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
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "phoneFormat",
})
export class PhoneFormatPipe implements PipeTransform {
  transform(phoneNumber: string): string {
    if (!phoneNumber) return "";

    // Remove all non-digit characters
    const digits = ("" + phoneNumber).replace(/\D/g, "");

    // Don't format if empty
    if (!digits) return "";

    // Limit to 16 digits
    const limitedDigits = digits.slice(0, 16);

    // Determine if it's an international number (starts with country code other than 1)
    const isInternational =
      limitedDigits.length > 10 ||
      (limitedDigits.length === 11 && limitedDigits[0] !== "1");

    if (isInternational) {
      // International format: +# (###) ###-#### or +## (###) ###-#### etc.
      if (limitedDigits.length <= 1) {
        return `+${limitedDigits}`;
      } else if (limitedDigits.length <= 4) {
        return `+${limitedDigits}`;
      } else if (limitedDigits.length <= 7) {
        const countryCode = limitedDigits.slice(0, -6);
        const areaCode = limitedDigits.slice(-6, -3);
        return `+${countryCode} (${areaCode})`;
      } else if (limitedDigits.length <= 10) {
        const countryCode = limitedDigits.slice(0, -6);
        const areaCode = limitedDigits.slice(-6, -3);
        const firstPart = limitedDigits.slice(-3);
        return `+${countryCode} (${areaCode}) ${firstPart}`;
      } else {
        const countryCode = limitedDigits.slice(0, -10);
        const areaCode = limitedDigits.slice(-10, -7);
        const firstPart = limitedDigits.slice(-7, -4);
        const lastPart = limitedDigits.slice(-4);
        return `+${countryCode} (${areaCode}) ${firstPart}-${lastPart}`;
      }
    } else {
      // Domestic US format: (###) ###-####
      if (limitedDigits.length <= 3) {
        return limitedDigits.length === 0 ? "" : `(${limitedDigits}`;
      } else if (limitedDigits.length <= 6) {
        return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
      } else {
        const areaCode = limitedDigits.slice(0, 3);
        const firstPart = limitedDigits.slice(3, 6);
        const lastPart = limitedDigits.slice(6, 10);
        return `(${areaCode}) ${firstPart}-${lastPart}`;
      }
    }
  }
}
