"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

type PrevState = Record<string, string | undefined> | null;

export async function signin(_prevState: PrevState, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

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

export async function forgotPassword(
  _prevState: PrevState,
  formData: FormData,
) {
  const headersList = await headers();
  const supabase = await createClient();

  const protocol = headersList.get("X-Forwarded-Proto");
  const hostname = headersList.get("X-Forwarded-Host");

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${protocol}://${hostname}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset email sent. Please check your inbox." };
}

export async function resetPassword(_prevState: PrevState, formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "Password updated successfully. You can now sign in with your new password.",
  };
}
