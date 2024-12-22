/* eslint-disable @typescript-eslint/no-explicit-any */

import { Page } from "next/experimental/testmode/playwright";

export const mockUser = {
  id: "12345",
  aud: "authenticated",
  role: "authenticated",
  email: "test@example.com",
  email_confirmed_at: "2023-01-01T00:00:00Z",
  phone: "",
  confirmed_at: "2023-01-01T00:00:00Z",
  last_sign_in_at: "2023-01-01T00:00:00Z",
  app_metadata: {
    provider: "email",
    providers: ["email"],
  },
  user_metadata: {
    full_name: "Test User",
  },
  identities: [],
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};

export const mockSession = {
  access_token: "mock-access-token",
  token_type: "bearer",
  expires_in: 3600,
  refresh_token: "mock-refresh-token",
  user: mockUser,
};

export const jsonResponse = (
  data: Record<string, any>,
  status = 200,
  headers?: HeadersInit,
) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "x-client-info": "supabase-ssr/0.5.2",
      "x-supabase-api-version": "2024-01-01",
      ...headers,
    },
  });

export const errorResponse = (
  message: string,
  code: string,
  status = 400,
  headers?: HeadersInit,
) =>
  jsonResponse(
    {
      error: message,
      message,
      status,
      code,
    },
    status,
    headers,
  );

export const setupTurnstileMock = async (page: Page) => {
  await page.addInitScript(() => {
    (window as any).turnstile = {
      render: (_: any, { callback }: any) => {
        callback?.("test-turnstile-token");
        return "widget-id";
      },
      reset: () => {},
      remove: () => {},
    };
  });
};

export const checkCaptchaButton = async (page: Page) => {
  const captchaButton = page.getByRole("button", { name: /verify/i });
  if (await captchaButton.isVisible()) {
    await captchaButton.click();
  }
};

export const waitForNavigation = async (page: Page, expectedUrl: string) => {
  await Promise.all([
    page.waitForURL(expectedUrl),
    page.waitForLoadState("networkidle"),
    page.waitForLoadState("domcontentloaded"),
  ]);
};
