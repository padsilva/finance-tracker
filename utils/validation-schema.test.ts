import {
  signUpSchema,
  resendSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/utils/validation-schema";

describe("Validation Schemas", () => {
  describe("signUpSchema", () => {
    const validData = {
      email: "test@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
      fullName: "John Doe",
    };

    it("validates correct data", () => {
      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it.each([
      ["invalid email", { ...validData, email: "invalid" }],
      ["short password", { ...validData, password: "short" }],
      ["short name", { ...validData, fullName: "J" }],
      [
        "mismatched passwords",
        { ...validData, confirmPassword: "Different123!" },
      ],
    ])("fails validation for %s", (_, data) => {
      const result = signUpSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("signInSchema", () => {
    const validData = {
      email: "test@example.com",
      password: "Password123!",
    };

    it("validates correct data", () => {
      const result = signInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it.each([
      ["invalid email", { ...validData, email: "invalid" }],
      ["short password", { ...validData, password: "short" }],
    ])("fails validation for %s", (_, data) => {
      const result = signInSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    const validData = {
      password: "Password123!",
      confirmPassword: "Password123!",
    };

    it("validates correct data", () => {
      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it.each([
      [
        "short password",
        { ...validData, password: "short", confirmPassword: "short" },
      ],
      [
        "mismatched passwords",
        { ...validData, confirmPassword: "Different123!" },
      ],
    ])("fails validation for %s", (_, data) => {
      const result = resetPasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("resendSchema", () => {
    const validData = { email: "test@example.com" };

    it("validates correct data", () => {
      const result = resendSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails validation for invalid email", () => {
      const result = resendSchema.safeParse({ email: "invalid" });
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    const validData = { email: "test@example.com" };

    it("validates correct data", () => {
      const result = forgotPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails validation for invalid email", () => {
      const result = forgotPasswordSchema.safeParse({ email: "invalid" });
      expect(result.success).toBe(false);
    });
  });
});
