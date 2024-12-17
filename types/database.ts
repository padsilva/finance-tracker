import { User } from "@supabase/supabase-js";

export type Category = {
  code: string;
  name: string;
};

export interface ProfileData {
  user: Pick<User, "id" | "email" | "user_metadata">;
  profile: ProfileSetup | null;
}

export interface ProfileSetup {
  id: string;
  full_name: string;
  display_name?: string | null;
  language?: string | null;
  country?: string | null;
  currency?: string | null;
  starting_balance?: number | null;
  expense_categories?: Category[] | null;
  monthly_saving_goals?: number | null;
  budget_limit?: number | null;
  completed_steps: number;
}
