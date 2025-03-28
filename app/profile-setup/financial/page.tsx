import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { FinancialForm } from "@/components/profile-setup/forms/financial";
import { fetchInitialData } from "@/lib/supabase/fetchers";

export default async function ProfileSetupFinancialPage() {
  connection();

  const data = await fetchInitialData();

  if (!data?.user) {
    redirect("/signin");
  }

  return <FinancialForm initialData={data} />;
}

export const metadata: Metadata = { title: "Profile Setup - Financial" };
