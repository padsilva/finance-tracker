type EnvVariable = {
  name: string;
  isRequired: boolean;
  defaultValue?: string;
};

const envVariables: EnvVariable[] = [
  { name: "NEXT_PUBLIC_SUPABASE_URL", isRequired: true },
  { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", isRequired: true },
];

type EnvConfig = {
  [key: string]: string;
};

function validateEnv(): EnvConfig {
  const env: EnvConfig = {};

  for (const variable of envVariables) {
    const value = process.env[variable.name];

    if (!value && variable.isRequired) {
      throw new Error(
        `Missing required environment variable: ${variable.name}`,
      );
    }

    env[variable.name] = value ?? variable.defaultValue ?? "";
  }

  return env;
}

export const env = validateEnv();
