import type { Metadata } from "next";
import { EmailConfirmed } from "@/components/auth/email-confirmed";

export default function EmailConfirmedPage() {
  return <EmailConfirmed />;
}

export const metadata: Metadata = { title: "Email Confirmed" };
