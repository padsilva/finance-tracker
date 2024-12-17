import {
  signUpSchema,
  resendSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  personalInfoSchema,
  financialSetupSchema,
  categoriesSchema,
  goalsSchema,
} from "@/utils/validation-schema";

describe("Validation Schemas", () => {
  describe("signUpSchema", () => {
    const validData = {
      email: "test@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
      fullName: "John Doe",
    };

    it("should validate correct data", () => {
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
    ])("should fail validation for %s", (_, data) => {
      const result = signUpSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("signInSchema", () => {
    const validData = {
      email: "test@example.com",
      password: "Password123!",
    };

    it("should validate correct data", () => {
      const result = signInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it.each([
      ["invalid email", { ...validData, email: "invalid" }],
      ["short password", { ...validData, password: "short" }],
    ])("should fail validation for %s", (_, data) => {
      const result = signInSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    const validData = {
      password: "Password123!",
      confirmPassword: "Password123!",
    };

    it("should validate correct data", () => {
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
    ])("should fail validation for %s", (_, data) => {
      const result = resetPasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("resendSchema", () => {
    const validData = { email: "test@example.com" };

    it("should validate correct data", () => {
      const result = resendSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail validation for invalid email", () => {
      const result = resendSchema.safeParse({ email: "invalid" });
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    const validData = { email: "test@example.com" };

    it("should validate correct data", () => {
      const result = forgotPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail validation for invalid email", () => {
      const result = forgotPasswordSchema.safeParse({ email: "invalid" });
      expect(result.success).toBe(false);
    });
  });

  describe("personalInfoSchema", () => {
    const validData = {
      completedSteps: "0",
      id: "1",
      fullName: "John Doe",
      displayName: "jdoe",
      language: "PT",
      country: "PT",
    };

    it("should validate correct data", () => {
      const result = personalInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail validation for empty language", () => {
      const result = personalInfoSchema.safeParse({ language: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("financialSetupSchema", () => {
    const validData = {
      completedSteps: "1",
      id: "1",
      currency: "EUR",
      startingBalance: "1000.00",
    };

    it("should validate correct data", () => {
      const result = financialSetupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail validation for empty currency", () => {
      const result = financialSetupSchema.safeParse({ currency: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("categoriesSchema", () => {
    const validData = {
      completedSteps: "2",
      id: "1",
      categories: ["test"],
    };

    it("should validate correct data", () => {
      const result = categoriesSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail validation for empty categories", () => {
      const result = categoriesSchema.safeParse({ categories: [] });
      expect(result.success).toBe(false);
    });
  });

  describe("goalsSchema", () => {
    const validData = {
      completedSteps: "3",
      id: "1",
      monthlySavingGoals: "1000.00",
      budgetLimit: "1000.00",
    };

    it("should validate correct data", () => {
      const result = goalsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail validation for invalid budget limit", () => {
      const result = goalsSchema.safeParse({ budgetLimit: "0" });
      expect(result.success).toBe(false);
    });
  });
});
