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

export type SignUpValues = z.infer<typeof signUpSchema>;
export type ResendValues = z.infer<typeof resendSchema>;
