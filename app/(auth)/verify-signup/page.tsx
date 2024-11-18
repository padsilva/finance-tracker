import type { Metadata } from "next";

import { VerifySignUpForm } from "@/components/auth/forms/verify-signup";

export default function VerifySignUpPage() {
  return <VerifySignUpForm />;
}

export const metadata: Metadata = { title: "Verify Sign Up" };
