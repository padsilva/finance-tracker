import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_CAPTCHA_SITE_KEY: z.string().min(1),
});

const validateEnv = () => {
  const publicEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
  };

  try {
    const parsed = envSchema.parse(publicEnv);
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Invalid public environment variables: ${error.message}.
        Make sure you have provided all required environment variables.`,
      );
    }

    throw error;
  }
};

export const env = validateEnv();
