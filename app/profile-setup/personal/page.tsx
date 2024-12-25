import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { PersonalForm } from "@/components/profile-setup/forms/personal";
import { fetchInitialData } from "@/lib/supabase/fetchers";

export default async function ProfileSetupPersonalPage() {
  connection();

  const data = await fetchInitialData();

  if (!data?.user) {
    redirect("/signin");
  }

  return <PersonalForm initialData={data} />;
}

export const metadata: Metadata = { title: "Profile Setup - Personal" };
