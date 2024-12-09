import type { Metadata } from "next";

import { PersonalForm } from "@/components/profile-setup/forms/personal";

export default function ProfileSetupPersonalPage() {
  return <PersonalForm />;
}

export const metadata: Metadata = { title: "Profile Setup - Personal" };
