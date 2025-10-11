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

import {formatPhoneNumber, isValidPhoneNumber} from "./phone.util";

describe("Phone Utilities", () => {
  describe("formatPhoneNumber", () => {
    it("should format US domestic numbers", () => {
      expect(formatPhoneNumber("1234567890")).toBe("(123) 456-7890");
      expect(formatPhoneNumber("123456789")).toBe("(123) 456-789");
      expect(formatPhoneNumber("123456")).toBe("(123) 456");
      expect(formatPhoneNumber("123")).toBe("(123");
    });

    it("should format international numbers", () => {
      expect(formatPhoneNumber("441234567890")).toBe("+44 (123) 456-7890");
      expect(formatPhoneNumber("33123456789")).toBe("+3 (312) 345-6789");
      expect(formatPhoneNumber("861234567890")).toBe("+86 (123) 456-7890");
    });

    it("should handle empty and invalid inputs", () => {
      expect(formatPhoneNumber("")).toBe("");
      expect(formatPhoneNumber("abc")).toBe("");
      expect(formatPhoneNumber("   ")).toBe("");
    });

    it("should remove non-digit characters", () => {
      expect(formatPhoneNumber("(123) 456-7890")).toBe("(123) 456-7890");
      expect(formatPhoneNumber("123-456-7890")).toBe("(123) 456-7890");
      expect(formatPhoneNumber("123.456.7890")).toBe("(123) 456-7890");
    });

    it("should limit to 15 digits", () => {
      const longNumber = "12345678901234567890";
      const result = formatPhoneNumber(longNumber);
      expect(result.replace(/\D/g, "").length).toBe(15);
    });
  });

  describe("isValidPhoneNumber", () => {
    it("should validate US domestic numbers", () => {
      expect(isValidPhoneNumber("1234567890")).toBe(true);
      expect(isValidPhoneNumber("(123) 456-7890")).toBe(true);
    });

    it("should validate international numbers", () => {
      expect(isValidPhoneNumber("441234567890")).toBe(true);
      expect(isValidPhoneNumber("+44 (123) 456-7890")).toBe(true);
    });

    it("should reject invalid numbers", () => {
      expect(isValidPhoneNumber("")).toBe(false);
      expect(isValidPhoneNumber("123456789")).toBe(false); // Too short
      expect(isValidPhoneNumber("1234567890123456")).toBe(false); // Too long
      expect(isValidPhoneNumber("abc")).toBe(false);
    });
  });
});
