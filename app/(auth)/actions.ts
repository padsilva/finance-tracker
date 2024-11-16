"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PrevState = Record<string, string | undefined> | null;

export async function signup(_prevState: PrevState, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/verify-signup");
}

export async function resendVerificationEmail(
  _prevState: PrevState,
  formData: FormData,
) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resend({ type: "signup", email });

  if (error) {
    return { error: error.message };
  }

  return { success: "Verification email resent. Please check your inbox." };
}
