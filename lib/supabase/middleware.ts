import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import { ProfileSetup } from "@/types/database";

// Constants for route configuration
const ROUTES = {
  SETUP_STEPS: [
    { id: 1, path: "/profile-setup/personal" },
    { id: 2, path: "/profile-setup/financial" },
    { id: 3, path: "/profile-setup/categories" },
    { id: 4, path: "/profile-setup/goals" },
  ],
  AUTH: [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-signup",
    "/email-confirmed",
  ],
  PROTECTED: ["/dashboard", "/transactions", "/analytics", "/settings"],
  DASHBOARD: "/dashboard",
  ROOT: "/",
};

// Helper functions
const createSupabaseClient = (request: NextRequest) => {
  let response = NextResponse.next({ request });

  return {
    client: createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    ),
    response,
  };
};

const redirectTo = (request: NextRequest, pathname: string) => {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
};

const isPathStartsWith = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname.startsWith(route));

const getSetupPath = (step: number) =>
  ROUTES.SETUP_STEPS.find(({ id }) => id === step)?.path ??
  ROUTES.SETUP_STEPS[0].path;

export async function updateSession(request: NextRequest) {
  const { client: supabase, response } = createSupabaseClient(request);
  const pathname = request.nextUrl.pathname;

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle unauthenticated user
  if (!user) {
    if (isPathStartsWith(pathname, ROUTES.PROTECTED)) {
      return redirectTo(request, ROUTES.ROOT);
    }
    return response;
  }

  // Handle authenticated user
  if (isPathStartsWith(pathname, ROUTES.AUTH)) {
    return redirectTo(request, ROUTES.DASHBOARD);
  }

  // Check profile setup status
  const { data: profileSetup } = await supabase
    .from("profile_setup")
    .select("*")
    .eq("id", user.id)
    .single<ProfileSetup>();

  const isSetupRoute = pathname.startsWith("/profile-setup");

  if (!profileSetup && !isSetupRoute) {
    return redirectTo(request, getSetupPath(1));
  }

  if (profileSetup) {
    const { completed_steps } = profileSetup;

    if (completed_steps === 4 && isSetupRoute) {
      return redirectTo(request, ROUTES.DASHBOARD);
    }

    if (completed_steps < 4 && !isSetupRoute) {
      return redirectTo(request, getSetupPath(completed_steps + 1));
    }
  }

  return response;
}
