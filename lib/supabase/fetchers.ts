import { createClient } from "@/lib/supabase/server";
import { ProfileData, ProfileSetup } from "@/types/database";

export async function fetchInitialData(): Promise<ProfileData | null> {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await (await supabase).auth.getUser();

    if (!user) return null;

    const { data: profile, error: profileError } = await (await supabase)
      .from("profile_setup")
      .select("*")
      .eq("id", user.id)
      .single<ProfileSetup>();

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError;
    }

    return {
      user,
      profile,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
