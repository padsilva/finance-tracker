import {
  test,
  expect,
  NextFixture,
} from "next/experimental/testmode/playwright";

import {
  checkCaptchaButton,
  errorResponse,
  jsonResponse,
  mockSession,
  mockUser,
  setupTurnstileMock,
} from "./utils/test-utils";

// Auth State Mocks
const mockValidToken = (next: NextFixture) =>
  next.onFetch((request) => {
    if (request.url.includes("/auth/v1/verify")) {
      return jsonResponse({
        data: {
          user: { ...mockUser, email_confirmed_at: new Date().toISOString() },
        },
        error: null,
      });
    }

    if (
      request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`
    ) {
      return jsonResponse(mockUser);
    }

    if (
      request.url.startsWith(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profile_setup`,
      )
    ) {
      return jsonResponse([]);
    }

    return "abort";
  });

const mockInvalidToken = (next: NextFixture) =>
  next.onFetch((request) => {
    if (request.url.includes("/auth/v1/verify")) {
      return errorResponse("Invalid verification token", "invalid_token");
    }
    return "abort";
  });

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupTurnstileMock(page);
  });

  test.describe("Sign Up", () => {
    test("should successfully create a new account", async ({ page, next }) => {
      next.onFetch((request) => {
        if (
          request.url ===
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`
        ) {
          return jsonResponse({
            ...mockUser,
            email_confirmed_at: null,
            user_metadata: { full_name: "Test User" },
          });
        }
        return "abort";
      });

      await page.goto("/signup");

      await page.getByPlaceholder("Enter your full name").fill("Test User");
      await page.getByPlaceholder("Enter your email").fill("test@example.com");
      await page.getByPlaceholder("Enter your password").fill("Password123!");
      await page.getByPlaceholder("Confirm your password").fill("Password123!");

      await checkCaptchaButton(page);

      await page.getByRole("button", { name: /create account/i }).click();

      await expect(page).toHaveURL("/verify-signup?email=test@example.com");
      await expect(
        page.getByText(/waiting for email confirmation/i),
      ).toBeVisible();
    });

    test("should show error for existing email", async ({ page, next }) => {
      next.onFetch((request) => {
        if (
          request.url ===
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`
        ) {
          return errorResponse(
            "User already registered",
            "user_already_registered",
            400,
            {
              "x-error-code": "user_already_registered",
            },
          );
        }
        return "abort";
      });

      await page.goto("/signup");

      await page.getByPlaceholder("Enter your full name").fill("Test User");
      await page
        .getByPlaceholder("Enter your email")
        .fill("existing@example.com");
      await page.getByPlaceholder("Enter your password").fill("Password123!");
      await page.getByPlaceholder("Confirm your password").fill("Password123!");

      await checkCaptchaButton(page);

      await page.getByRole("button", { name: /create account/i }).click();

      await expect(
        page.getByTestId("card-content").getByRole("alert"),
      ).toContainText(/user already registered/i);
    });
  });

  test.describe("Sign In", () => {
    test("should successfully sign in with valid credentials", async ({
      page,
      next,
    }) => {
      next.onFetch((request) => {
        if (
          request.url ===
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`
        ) {
          return jsonResponse({
            ...mockSession,
          });
        }

        if (
          request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`
        ) {
          return jsonResponse(mockUser);
        }

        if (
          request.url.startsWith(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profile_setup`,
          )
        ) {
          return jsonResponse(mockUser);
        }

        return "abort";
      });

      await page.goto("/signin");

      await page.getByPlaceholder("Enter your email").fill("test@example.com");
      await page.getByPlaceholder("Enter your password").fill("password");

      await checkCaptchaButton(page);

      await page.getByRole("button", { name: /sign in/i }).click();

      await expect(page).toHaveURL("/dashboard");
    });

    test("should show error for unverified email", async ({ page, next }) => {
      next.onFetch((request) => {
        if (
          request.url ===
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`
        ) {
          return errorResponse(
            "Email not confirmed",
            "email_not_confirmed",
            400,
            {
              "x-error-code": "email_not_confirmed",
            },
          );
        }

        if (
          request.url ===
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/resend`
        ) {
          return jsonResponse({
            message: "Email verification sent",
          });
        }

        return "abort";
      });

      await page.goto("/signin");

      await page
        .getByPlaceholder("Enter your email")
        .fill("unverified@example.com");
      await page.getByPlaceholder("Enter your password").fill("Password123!");
      await page.getByRole("button", { name: /sign in/i }).click();

      await expect(page).toHaveURL(
        "/verify-signup?email=unverified@example.com",
      );
      await expect(
        page.getByText(/waiting for email confirmation/i),
      ).toBeVisible();
    });

    test("should persist user session after page reload", async ({
      page,
      next,
    }) => {
      next.onFetch((request) => {
        if (
          request.url ===
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`
        ) {
          return jsonResponse({
            ...mockSession,
          });
        }

        if (
          request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`
        ) {
          return jsonResponse(mockUser);
        }

        if (
          request.url.startsWith(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profile_setup`,
          )
        ) {
          return jsonResponse(mockUser);
        }

        return "abort";
      });

      await page.goto("/signin");

      await page.getByPlaceholder("Enter your email").fill("test@example.com");
      await page.getByPlaceholder("Enter your password").fill("Password123!");

      await page.getByRole("button", { name: /sign in/i }).click();

      await expect(page).toHaveURL("/dashboard");

      await page.reload();

      await expect(page).toHaveURL("/dashboard");
    });
  });

  test.describe("Email Verification", () => {
    test("should handle verification link click", async ({ page, next }) => {
      await test.step("valid token", async () => {
        mockValidToken(next);
        await page.goto("/confirm?token_hash=valid_token&type=signup");
        await expect(page).toHaveURL("/email-confirmed");
        await expect(
          page.getByText(/email has been successfully verified/i),
        ).toBeVisible();
      });

      await test.step("invalid token", async () => {
        mockInvalidToken(next);
        await page.goto("/confirm?token_hash=invalid_token&type=signup");
        await expect(page).toHaveURL("/error");
        await expect(
          page.getByText(/sorry, something went wrong/i),
        ).toBeVisible();
      });
    });

    test("should allow resending verification email", async ({
      page,
      next,
    }) => {
      next.onFetch((request) => {
        if (
          request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`
        ) {
          return jsonResponse(mockUser);
        }

        if (request.url.includes("/auth/v1/resend")) {
          return jsonResponse({
            data: {},
            error: null,
          });
        }

        if (
          request.url.startsWith(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profile_setup`,
          )
        ) {
          return jsonResponse([]);
        }

        return "abort";
      });

      await page.goto("/verify-signup?email=test@example.com", {
        waitUntil: "networkidle",
      });

      await expect(page.getByText("test@example.com")).toBeVisible();

      await checkCaptchaButton(page);

      await page
        .getByRole("button", { name: /resend confirmation email/i })
        .click();

      await expect(
        page.getByTestId("card-content").getByRole("alert"),
      ).toContainText(/verification email resent/i);
    });
  });

  test.describe("Forgot Password", () => {
    test("should successfully send password reset email", async ({
      page,
      next,
    }) => {
      // Mock password reset request
      next.onFetch((request) => {
        if (request.url.includes("/auth/v1/recover")) {
          return Response.json({
            data: {},
            error: null,
          });
        }
        return "abort";
      });

      await page.goto("/forgot-password");

      await page.getByPlaceholder("Enter your email").fill("test@example.com");

      // Verify Turnstile is mocked

      await checkCaptchaButton(page);

      await page
        .getByRole("button", { name: /send reset instructions/i })
        .click();

      await expect(
        page.getByTestId("card-content").getByRole("alert"),
      ).toContainText(/password reset email sent/i);
    });

    test("should show error for non-existent email", async ({ page, next }) => {
      // Mock password reset request with error
      next.onFetch((request) => {
        if (request.url.includes("/auth/v1/recover")) {
          return new Response(
            JSON.stringify({
              error: "User not found",
              message: "User not found",
              status: 400,
              code: "user_not_found",
            }),
            {
              status: 400,
              headers: {
                "content-type": "application/json;charset=UTF-8",
                "x-client-info": "supabase-ssr/0.5.2",
                "x-error-code": "user_not_found",
                "x-supabase-api-version": "2024-01-01",
              },
            },
          );
        }
        return "abort";
      });

      await page.goto("/forgot-password");

      await page
        .getByPlaceholder("Enter your email")
        .fill("nonexistent@example.com");

      // Verify Turnstile is mocked

      await checkCaptchaButton(page);

      await page
        .getByRole("button", { name: /send reset instructions/i })
        .click();

      await expect(
        page.getByTestId("card-content").getByRole("alert"),
      ).toContainText(/user not found/i);
    });
  });
});
