import type { Metadata } from "next";

import { FinancialForm } from "@/components/profile-setup/forms/financial";

export default function ProfileSetupFinancialPage() {
  return <FinancialForm />;
}

export const metadata: Metadata = { title: "Profile Setup - Financial" };
