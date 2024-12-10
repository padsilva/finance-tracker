import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    fullName: z.string().min(2, "Full name must be at least 2 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resendSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const personalInfoSchema = z.object({
  completedSteps: z.string(),
  id: z.string({
    required_error: "User id should exist",
  }),
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters long"),
  language: z.string({
    required_error: "Please select a language",
  }),
  country: z.string({
    required_error: "Please select a country",
  }),
});

export const financialSetupSchema = z.object({
  completedSteps: z.string(),
  id: z.string({
    required_error: "User id should exist",
  }),
  currency: z.string({
    required_error: "Please select a currency",
  }),
  startingBalance: z.coerce
    .number()
    .min(0.01, "Starting balance should be greater than zero")
    .multipleOf(
      0.01,
      "Starting balance cannot have more than 2 decimal places",
    ),
});

export const categoriesSchema = z.object({
  completedSteps: z.string(),
  id: z.string(),
  categories: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one category.",
    }),
});

export const goalsSchema = z.object({
  completedSteps: z.string(),
  id: z.string({
    required_error: "User id should exist",
  }),
  monthlySavingGoals: z.coerce
    .number()
    .min(0.01, "Monthly saving goals should be greater than zero")
    .multipleOf(
      0.01,
      "Monthly saving goals cannot have more than 2 decimal places",
    ),
  budgetLimit: z.coerce
    .number()
    .min(0.01, "Bugdet limit should be greater than zero")
    .multipleOf(0.01, "Bugdet limit cannot have more than 2 decimal places"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type ResendValues = z.infer<typeof resendSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type CategoriesValues = z.infer<typeof categoriesSchema>;

// Form-specific types
export type FinancialSetupValues = {
  completedSteps: string;
  id: string;
  currency: string;
  startingBalance: string;
};

export type GoalsValues = {
  completedSteps: string;
  id: string;
  monthlySavingGoals: string;
  budgetLimit: string;
};
