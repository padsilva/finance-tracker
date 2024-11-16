import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/forms/sign-up";

export default function SignUpPage() {
  return <SignUpForm />;
}

export const metadata: Metadata = { title: "Get Started" };
