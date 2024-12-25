import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { GoalsForm } from "@/components/profile-setup/forms/goals";
import { fetchInitialData } from "@/lib/supabase/fetchers";

export default async function ProfileSetupGoalsPage() {
  connection();

  const data = await fetchInitialData();

  if (!data?.user) {
    redirect("/signin");
  }

  return <GoalsForm initialData={data} />;
}

export const metadata: Metadata = { title: "Profile Setup - Goals" };
