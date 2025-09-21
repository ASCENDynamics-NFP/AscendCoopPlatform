import {expect} from "chai";
import {ValidationUtils} from "../src/utils/validation";

describe("ValidationUtils", () => {
  describe("validateEmail", () => {
    it("should validate correct email formats", () => {
      expect(ValidationUtils.validateEmail("test@example.com")).to.be.true;
      expect(ValidationUtils.validateEmail("user.name@domain.co.uk")).to.be
        .true;
      expect(ValidationUtils.validateEmail("user+tag@example.org")).to.be.true;
    });

    it("should reject invalid email formats", () => {
      expect(ValidationUtils.validateEmail("invalid-email")).to.be.false;
      expect(ValidationUtils.validateEmail("test@")).to.be.false;
      expect(ValidationUtils.validateEmail("@example.com")).to.be.false;
      expect(ValidationUtils.validateEmail("test.example.com")).to.be.false;
    });
  });

  describe("validateUsername", () => {
    it("should validate correct username formats", () => {
      expect(ValidationUtils.validateUsername("user123")).to.be.true;
      expect(ValidationUtils.validateUsername("test_user")).to.be.true;
      expect(ValidationUtils.validateUsername("user-name")).to.be.true;
      expect(ValidationUtils.validateUsername("a".repeat(30))).to.be.true;
    });

    it("should reject invalid username formats", () => {
      expect(ValidationUtils.validateUsername("ab")).to.be.false; // too short
      expect(ValidationUtils.validateUsername("a".repeat(31))).to.be.false; // too long
      expect(ValidationUtils.validateUsername("user name")).to.be.false; // space
      expect(ValidationUtils.validateUsername("user@name")).to.be.false; // special char
    });
  });

  describe("validatePassword", () => {
    it("should validate strong passwords", () => {
      const result = ValidationUtils.validatePassword("Password123");
      expect(result.valid).to.be.true;
      expect(result.message).to.be.undefined;
    });

    it("should reject weak passwords", () => {
      const shortPassword = ValidationUtils.validatePassword("Pass1");
      expect(shortPassword.valid).to.be.false;
      expect(shortPassword.message).to.contain("at least 8 characters");

      const noLowercase = ValidationUtils.validatePassword("PASSWORD123");
      expect(noLowercase.valid).to.be.false;
      expect(noLowercase.message).to.contain("lowercase letter");

      const noUppercase = ValidationUtils.validatePassword("password123");
      expect(noUppercase.valid).to.be.false;
      expect(noUppercase.message).to.contain("uppercase letter");

      const noNumber = ValidationUtils.validatePassword("Password");
      expect(noNumber.valid).to.be.false;
      expect(noNumber.message).to.contain("number");
    });
  });

  describe("validateCoordinates", () => {
    it("should validate correct coordinates", () => {
      expect(ValidationUtils.validateCoordinates(37.7749, -122.4194)).to.be
        .true; // San Francisco
      expect(ValidationUtils.validateCoordinates(0, 0)).to.be.true; // Equator/Prime Meridian
      expect(ValidationUtils.validateCoordinates(90, 180)).to.be.true; // Extremes
      expect(ValidationUtils.validateCoordinates(-90, -180)).to.be.true; // Extremes
    });

    it("should reject invalid coordinates", () => {
      expect(ValidationUtils.validateCoordinates(91, 0)).to.be.false; // Invalid latitude
      expect(ValidationUtils.validateCoordinates(-91, 0)).to.be.false; // Invalid latitude
      expect(ValidationUtils.validateCoordinates(0, 181)).to.be.false; // Invalid longitude
      expect(ValidationUtils.validateCoordinates(0, -181)).to.be.false; // Invalid longitude
    });
  });

  describe("validatePhoneNumber", () => {
    it("should validate correct phone numbers", () => {
      expect(ValidationUtils.validatePhoneNumber("+1234567890")).to.be.true;
      expect(ValidationUtils.validatePhoneNumber("+1-234-567-8900")).to.be.true;
      expect(ValidationUtils.validatePhoneNumber("+44 20 7946 0958")).to.be
        .true;
    });

    it("should reject invalid phone numbers", () => {
      expect(ValidationUtils.validatePhoneNumber("0234567890")).to.be.false; // Starts with 0
      expect(ValidationUtils.validatePhoneNumber("+0234567890")).to.be.false; // Starts with 0 after +
      expect(ValidationUtils.validatePhoneNumber("abc123")).to.be.false; // Contains letters
    });
  });

  describe("sanitizeString", () => {
    it("should sanitize HTML and limit length", () => {
      const input = "<p>Hello <strong>World!</strong></p>";
      const result = ValidationUtils.sanitizeString(input, 20);
      expect(result).to.not.contain("<p>");
      expect(result).to.not.contain("<strong>");
      expect(result.length).to.be.at.most(20);
    });

    it("should throw error for non-string input", () => {
      expect(() => ValidationUtils.sanitizeString(123 as any)).to.throw(
        "Input must be a string",
      );
      expect(() => ValidationUtils.sanitizeString(null as any)).to.throw(
        "Input must be a string",
      );
      expect(() => ValidationUtils.sanitizeString(undefined as any)).to.throw(
        "Input must be a string",
      );
    });

    it("should trim whitespace", () => {
      const input = "  Hello World  ";
      const result = ValidationUtils.sanitizeString(input);
      expect(result).to.equal("Hello World");
    });
  });

  describe("validateBudget", () => {
    it("should validate correct budget amounts", () => {
      expect(ValidationUtils.validateBudget(100)).to.equal(100);
      expect(ValidationUtils.validateBudget(1000.5)).to.equal(1000.5);
      expect(ValidationUtils.validateBudget(0)).to.equal(0);
    });

    it("should round to 2 decimal places", () => {
      expect(ValidationUtils.validateBudget(100.123)).to.equal(100.12);
      expect(ValidationUtils.validateBudget(99.999)).to.equal(100);
    });

    it("should throw error for invalid amounts", () => {
      expect(() => ValidationUtils.validateBudget(-1)).to.throw(
        "Budget must be a positive number",
      );
      expect(() => ValidationUtils.validateBudget(1000001)).to.throw(
        "Budget cannot exceed $1,000,000",
      );
    });
  });

  describe("validateEnum", () => {
    it("should validate enum values", () => {
      const validValues = ["option1", "option2", "option3"];
      expect(
        ValidationUtils.validateEnum("option1", validValues, "testField"),
      ).to.equal("option1");
      expect(
        ValidationUtils.validateEnum("option2", validValues, "testField"),
      ).to.equal("option2");
    });

    it("should throw error for invalid enum values", () => {
      const validValues = ["option1", "option2", "option3"];
      expect(() =>
        ValidationUtils.validateEnum("invalid", validValues, "testField"),
      ).to.throw();
      expect(() =>
        ValidationUtils.validateEnum("", validValues, "testField"),
      ).to.throw();
    });
  });

  describe("validateUrl", () => {
    it("should validate correct URLs", () => {
      expect(ValidationUtils.validateUrl("https://example.com")).to.be.true;
      expect(ValidationUtils.validateUrl("http://test.org/path")).to.be.true;
      expect(
        ValidationUtils.validateUrl("https://sub.domain.com/path?query=value"),
      ).to.be.true;
    });

    it("should reject invalid URLs", () => {
      expect(ValidationUtils.validateUrl("not-a-url")).to.be.false;
      expect(ValidationUtils.validateUrl("")).to.be.false; // Empty string
      expect(ValidationUtils.validateUrl("http://")).to.be.false; // Incomplete
    });
  });
});
