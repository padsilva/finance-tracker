import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forms/forgot-password";

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

export const metadata: Metadata = { title: "Forgot Password?" };
