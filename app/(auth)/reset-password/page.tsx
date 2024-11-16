import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/forms/reset-password";

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}

export const metadata: Metadata = { title: "Reset Password" };
