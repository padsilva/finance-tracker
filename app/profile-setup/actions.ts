"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProfileSetup } from "@/types/database";

export type PrevState = Record<string, string | undefined> | null;

export async function personalInfo(_prevState: PrevState, formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const fullName = formData.get("fullName") as string;
  const displayName = formData.get("displayName") as string;
  const language = formData.get("language") as string;
  const country = formData.get("country") as string;
  const completedSteps = Number(formData.get("completedSteps") as string);
  const isFirstStep = completedSteps === 0;

  const { error } = isFirstStep
    ? await supabase
        .from("profile_setup")
        .insert<ProfileSetup>([
          {
            id,
            full_name: fullName,
            completed_steps: 1,
            display_name: displayName,
            language,
            country,
          },
        ])
        .select()
    : await supabase
        .from("profile_setup")
        .update<
          Partial<ProfileSetup>
        >({ full_name: fullName, display_name: displayName, language, country })
        .eq("id", id)
        .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/profile-setup/financial");
}

export async function financialSetup(
  _prevState: PrevState,
  formData: FormData,
) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const currency = formData.get("currency") as string;
  const startingBalance = parseFloat(formData.get("startingBalance") as string);
  const completedSteps = Number(formData.get("completedSteps") as string);

  const { error } = await supabase
    .from("profile_setup")
    .update<Partial<ProfileSetup>>({
      currency,
      starting_balance: startingBalance,
      completed_steps: completedSteps === 1 ? 2 : completedSteps,
    })
    .eq("id", id)
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/profile-setup/categories");
}

export async function categories(_prevState: PrevState, formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const categories = JSON.parse(formData.get("categories") as string);
  const completedSteps = Number(formData.get("completedSteps") as string);

  const { error } = await supabase
    .from("profile_setup")
    .update<Partial<ProfileSetup>>({
      expense_categories: categories,
      completed_steps: completedSteps === 2 ? 3 : completedSteps,
    })
    .eq("id", id)
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/profile-setup/goals");
}

export async function goals(_prevState: PrevState, formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const monthlySavingGoals = parseFloat(
    formData.get("monthlySavingGoals") as string,
  );
  const budgetLimit = parseFloat(formData.get("budgetLimit") as string);
  const completedSteps = Number(formData.get("completedSteps") as string);

  const { error } = await supabase
    .from("profile_setup")
    .update<Partial<ProfileSetup>>({
      monthly_saving_goals: monthlySavingGoals,
      budget_limit: budgetLimit,
      completed_steps: completedSteps === 3 ? 4 : completedSteps,
    })
    .eq("id", id)
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
