import type { Metadata } from "next";

import { SignInForm } from "@/components/auth/forms/sign-in";

export default function SignInPage() {
  return <SignInForm />;
}

export const metadata: Metadata = { title: "Sign In" };
