/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  test,
  expect,
  NextFixture,
  Page,
} from "next/experimental/testmode/playwright";

import {
  checkCaptchaButton,
  errorResponse,
  jsonResponse,
  mockSession,
  mockUser,
  setupTurnstileMock,
  waitForNavigation,
} from "./utils/test-utils";

const fillSignInForm = async (page: Page, email: string, password: string) => {
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await checkCaptchaButton(page);
};

const fillSignUpForm = async (
  page: Page,
  name: string,
  email: string,
  password: string,
) => {
  await page.getByPlaceholder("Enter your full name").fill(name);
  await fillSignInForm(page, email, password);
  await page.getByPlaceholder("Confirm your password").fill(password);
};

const performSuccessfulSignIn = async (page: Page, next: NextFixture) => {
  next.onFetch((request) => {
    const url = request.url;

    if (url.includes("/auth/v1/token")) {
      return jsonResponse({ ...mockSession });
    }

    if (url.includes("/auth/v1/user")) {
      return jsonResponse(mockUser);
    }

    if (url.includes("/rest/v1/profile_setup")) {
      return jsonResponse([]);
    }

    return "abort";
  });

  await page.goto("/signin");
  await waitForNavigation(page, "/signin");
  await fillSignInForm(page, "test@example.com", "password");
  await page.getByRole("button", { name: /sign in/i }).click();
  await waitForNavigation(page, "/dashboard");

  await expect(page).toHaveURL("/dashboard");
};

const mockValidToken = (next: NextFixture) =>
  next.onFetch((request) => {
    const url = request.url;

    if (url.includes("/auth/v1/verify")) {
      return jsonResponse({
        data: {
          user: { ...mockUser, email_confirmed_at: new Date().toISOString() },
        },
        error: null,
      });
    }

    if (url.includes("/auth/v1/user")) {
      return jsonResponse(mockUser);
    }

    if (url.includes("/rest/v1/profile_setup")) {
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
        if (request.url.includes("/auth/v1/signup")) {
          return jsonResponse({
            ...mockUser,
            email_confirmed_at: null,
            user_metadata: { full_name: "Test User" },
          });
        }

        return "abort";
      });

      await page.goto("/signup");
      await waitForNavigation(page, "/signup");

      await fillSignUpForm(
        page,
        "Test User",
        "test@example.com",
        "Password123!",
      );

      await page.getByRole("button", { name: /create account/i }).click();
      await waitForNavigation(page, "/verify-signup?email=test@example.com");

      await expect(page).toHaveURL("/verify-signup?email=test@example.com");
      await expect(
        page.getByText(/waiting for email confirmation/i),
      ).toBeVisible();
    });

    test("should show error for existing email", async ({ page, next }) => {
      next.onFetch((request) => {
        if (request.url.includes("/auth/v1/signup")) {
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
      await waitForNavigation(page, "/signup");

      await fillSignUpForm(
        page,
        "Test User",
        "existing@example.com",
        "Password123!",
      );

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
      await performSuccessfulSignIn(page, next);
    });

    test("should show error for unverified email", async ({ page, next }) => {
      next.onFetch((request) => {
        const url = request.url;

        if (url.includes("/auth/v1/token")) {
          return errorResponse(
            "Email not confirmed",
            "email_not_confirmed",
            400,
            { "x-error-code": "email_not_confirmed" },
          );
        }

        if (url.includes("/auth/v1/resend")) {
          return jsonResponse({
            message: "Email verification sent",
          });
        }

        return "abort";
      });

      await page.goto("/signin");
      await waitForNavigation(page, "/signin");

      await fillSignInForm(page, "unverified@example.com", "Password123!");

      await page.getByRole("button", { name: /sign in/i }).click();
      await waitForNavigation(
        page,
        "/verify-signup?email=unverified@example.com",
      );

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
      await performSuccessfulSignIn(page, next);

      await page.reload();
      await waitForNavigation(page, "/dashboard");

      await expect(page).toHaveURL("/dashboard");
    });
  });

  test.describe("Email Verification", () => {
    test("should handle verification link click", async ({ page, next }) => {
      await test.step("valid token", async () => {
        mockValidToken(next);

        await page.goto("/confirm?token_hash=valid_token&type=signup");
        await waitForNavigation(page, "/email-confirmed");

        await expect(page).toHaveURL("/email-confirmed");
        await expect(
          page.getByText(/email has been successfully verified/i),
        ).toBeVisible();
      });

      await test.step("invalid token", async () => {
        mockInvalidToken(next);

        await page.goto("/confirm?token_hash=invalid_token&type=signup");
        await waitForNavigation(page, "/error");

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
        const url = request.url;

        if (url.includes("/auth/v1/user")) {
          return jsonResponse(mockUser);
        }

        if (url.includes("/rest/v1/profile_setup")) {
          return jsonResponse([]);
        }

        if (url.includes("/auth/v1/resend")) {
          return jsonResponse({ data: {}, error: null });
        }

        return "abort";
      });

      await page.goto("/verify-signup?email=test@example.com");
      await waitForNavigation(page, "/verify-signup?email=test@example.com");

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
      await waitForNavigation(page, "/forgot-password");

      await page.getByPlaceholder("Enter your email").fill("test@example.com");

      await checkCaptchaButton(page);

      await page
        .getByRole("button", { name: /send reset instructions/i })
        .click();

      await expect(
        page.getByTestId("card-content").getByRole("alert"),
      ).toContainText(/password reset email sent/i);
    });

    test("should show error for non-existent email", async ({ page, next }) => {
      next.onFetch((request) => {
        if (request.url.includes("/auth/v1/recover")) {
          return errorResponse("User not found", "user_not_found", 400, {
            "x-error-code": "user_not_found",
          });
        }

        return "abort";
      });

      await page.goto("/forgot-password");
      await waitForNavigation(page, "/forgot-password");

      await page
        .getByPlaceholder("Enter your email")
        .fill("nonexistent@example.com");

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
