import type { Metadata } from "next";

import { GoalsForm } from "@/components/profile-setup/forms/goals";

export default function ProfileSetupGoalsPage() {
  return <GoalsForm />;
}

export const metadata: Metadata = { title: "Profile Setup - Goals" };
