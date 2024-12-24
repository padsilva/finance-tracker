import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CategoriesForm } from "@/components/profile-setup/forms/categories";
import { fetchInitialData } from "@/lib/supabase/fetchers";

export default async function ProfileSetupCategoriesPage() {
  const data = await fetchInitialData();

  if (!data?.user) {
    redirect("/signin");
  }

  return <CategoriesForm initialData={data} />;
}

export const metadata: Metadata = { title: "Profile Setup - Categories" };