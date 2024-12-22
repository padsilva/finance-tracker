"use client";

import { redirect, useSearchParams } from "next/navigation";

import { VerifySignUpForm } from "@/components/auth/forms/verify-signup";

export default function VerifySignUpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    redirect("/signin");
  }

  return <VerifySignUpForm email={email} />;
}
