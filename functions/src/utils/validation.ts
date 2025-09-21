import {HttpsError} from "firebase-functions/v2/https";

/**
 * Validation utilities for input sanitization and validation
 */
export class ValidationUtils {
  /**
   * Validate email format
   * @param {string} email - The email address to validate
   * @return {boolean} True if email format is valid
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate username format (alphanumeric, underscores, hyphens, 3-30 chars)
   * @param {string} username - The username to validate
   * @return {boolean} True if username format is valid
   */
  static validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
  }

  /**
   * Validate password strength
   * @param {string} password - The password to validate
   * @return {{valid: boolean, message?: string}} Validation result with optional error message
   */
  static validatePassword(password: string): {
    valid: boolean;
    message?: string;
  } {
    if (password.length < 8) {
      return {
        valid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!/(?=.*\d)/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one number",
      };
    }
    return {valid: true};
  }

  /**
   * Validate coordinates
   * @param {number} latitude - Latitude value to validate
   * @param {number} longitude - Longitude value to validate
   * @return {boolean} True if coordinates are valid
   */
  static validateCoordinates(latitude: number, longitude: number): boolean {
    return (
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  /**
   * Validate phone number (basic international format)
   * @param {string} phone - Phone number to validate
   * @return {boolean} True if phone number format is valid
   */
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ""));
  }

  /**
   * Sanitize string input (remove potential XSS, limit length)
   * @param {string} input - Input string to sanitize
   * @param {number} maxLength - Maximum allowed length (default: 1000)
   * @return {string} Sanitized string
   */
  static sanitizeString(input: string, maxLength = 1000): string {
    if (typeof input !== "string") {
      throw new HttpsError("invalid-argument", "Input must be a string");
    }

    // Remove HTML tags and limit length
    const sanitized = input
      .replace(/<[^>]*>/g, "")
      .trim()
      .substring(0, maxLength);

    return sanitized;
  }

  /**
   * Validate array of strings (skills, tags, etc.)
   * @param {unknown} arr - Array to validate
   * @param {object} options - Validation options
   * @param {number} options.maxItems - Maximum number of items allowed
   * @param {number} options.maxItemLength - Maximum length per item
   * @param {boolean} options.allowEmpty - Whether empty arrays are allowed
   * @return {string[]} Validated and sanitized string array
   */
  static validateStringArray(
    arr: unknown,
    options: {
      maxItems?: number;
      maxItemLength?: number;
      allowEmpty?: boolean;
    } = {},
  ): string[] {
    if (!Array.isArray(arr)) {
      throw new HttpsError("invalid-argument", "Input must be an array");
    }

    const {maxItems = 20, maxItemLength = 100, allowEmpty = false} = options;

    if (arr.length > maxItems) {
      throw new HttpsError(
        "invalid-argument",
        `Array cannot have more than ${maxItems} items`,
      );
    }

    if (!allowEmpty && arr.length === 0) {
      throw new HttpsError("invalid-argument", "Array cannot be empty");
    }

    return arr.map((item, index) => {
      if (typeof item !== "string") {
        throw new HttpsError(
          "invalid-argument",
          `Item at index ${index} must be a string`,
        );
      }
      const sanitized = this.sanitizeString(item, maxItemLength);
      if (!sanitized && !allowEmpty) {
        throw new HttpsError(
          "invalid-argument",
          `Item at index ${index} cannot be empty`,
        );
      }
      return sanitized;
    });
  }

  /**
   * Validate budget/monetary amount
   * @param {unknown} amount - Amount to validate
   * @return {number} Validated amount rounded to 2 decimal places
   */
  static validateBudget(amount: unknown): number {
    if (typeof amount !== "number" || isNaN(amount) || amount < 0) {
      throw new HttpsError(
        "invalid-argument",
        "Budget must be a positive number",
      );
    }
    if (amount > 1000000) {
      throw new HttpsError(
        "invalid-argument",
        "Budget cannot exceed $1,000,000",
      );
    }
    return Math.round(amount * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Validate date string/timestamp
   * @param {unknown} date - Date to validate (string, number, or Date object)
   * @return {Date} Validated Date object
   */
  static validateDate(date: unknown): Date {
    let parsedDate: Date;

    if (date instanceof Date) {
      parsedDate = date;
    } else if (typeof date === "string") {
      parsedDate = new Date(date);
    } else if (typeof date === "number") {
      parsedDate = new Date(date);
    } else {
      throw new HttpsError("invalid-argument", "Invalid date format");
    }

    if (isNaN(parsedDate.getTime())) {
      throw new HttpsError("invalid-argument", "Invalid date");
    }

    return parsedDate;
  }

  /**
   * Validate pagination parameters
   * @param {object} options - Pagination options
   * @param {number} options.limit - Number of items per page
   * @param {string} options.startAfter - Cursor for pagination
   * @return {{limit: number, startAfter?: string}} Validated pagination parameters
   */
  static validatePagination(options: {limit?: number; startAfter?: string}): {
    limit: number;
    startAfter?: string;
  } {
    const limit = options.limit || 20;

    if (limit < 1 || limit > 50) {
      throw new HttpsError(
        "invalid-argument",
        "Limit must be between 1 and 50",
      );
    }

    if (options.startAfter && typeof options.startAfter !== "string") {
      throw new HttpsError("invalid-argument", "startAfter must be a string");
    }

    return {limit, startAfter: options.startAfter};
  }

  /**
   * Validate user ID format
   * @param {string} userId - User ID to validate
   * @return {string} Validated and trimmed user ID
   */
  static validateUserId(userId: string): string {
    if (typeof userId !== "string" || !userId.trim()) {
      throw new HttpsError("invalid-argument", "Invalid user ID");
    }
    return userId.trim();
  }

  /**
   * Validate enum value
   * @param {unknown} value - Value to validate
   * @param {T[]} allowedValues - Array of allowed values
   * @param {string} fieldName - Name of the field for error messages
   * @return {T} Validated enum value
   */
  static validateEnum<T>(
    value: unknown,
    allowedValues: T[],
    fieldName: string,
  ): T {
    if (!allowedValues.includes(value as T)) {
      throw new HttpsError(
        "invalid-argument",
        `${fieldName} must be one of: ${allowedValues.join(", ")}`,
      );
    }
    return value as T;
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @return {boolean} True if URL format is valid
   */
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate object has required fields
   * @param {unknown} obj - Object to validate
   * @param {string[]} requiredFields - Array of required field names
   * @param {string} objectName - Name of the object for error messages
   * @return {void}
   */
  static validateRequiredFields(
    obj: unknown,
    requiredFields: string[],
    objectName = "object",
  ): void {
    if (!obj || typeof obj !== "object") {
      throw new HttpsError(
        "invalid-argument",
        `${objectName} must be an object`,
      );
    }

    for (const field of requiredFields) {
      if (
        !(field in obj) ||
        (obj as Record<string, unknown>)[field] === undefined ||
        (obj as Record<string, unknown>)[field] === null
      ) {
        throw new HttpsError(
          "invalid-argument",
          `${objectName} is missing required field: ${field}`,
        );
      }
    }
  }

  /**
   * Validate location object
   * @param {unknown} location - Location object to validate
   * @return {{address: string, city: string, state: string, country: string, postalCode?: string, coordinates?: {latitude: number, longitude: number}}} Validated location object
   */
  static validateLocation(location: unknown): {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    coordinates?: {latitude: number; longitude: number};
  } {
    this.validateRequiredFields(
      location,
      ["address", "city", "state", "country"],
      "location",
    );

    const locationObj = location as Record<string, unknown>;

    const result = {
      address: this.sanitizeString(locationObj.address as string, 200),
      city: this.sanitizeString(locationObj.city as string, 100),
      state: this.sanitizeString(locationObj.state as string, 100),
      country: this.sanitizeString(locationObj.country as string, 100),
      postalCode: locationObj.postalCode
        ? this.sanitizeString(locationObj.postalCode as string, 20)
        : undefined,
      coordinates: undefined as
        | {latitude: number; longitude: number}
        | undefined,
    };

    if (locationObj.coordinates) {
      const coords = locationObj.coordinates as {
        latitude: number;
        longitude: number;
      };
      const {latitude, longitude} = coords;
      if (!this.validateCoordinates(latitude, longitude)) {
        throw new HttpsError("invalid-argument", "Invalid coordinates");
      }
      result.coordinates = {latitude, longitude};
    }

    return result;
  }
}
