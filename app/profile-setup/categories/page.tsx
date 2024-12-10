import type { Metadata } from "next";

import { CategoriesForm } from "@/components/profile-setup/forms/categories";

export default function ProfileSetupCategoriesPage() {
  return <CategoriesForm />;
}

export const metadata: Metadata = { title: "Profile Setup - Categories" };
