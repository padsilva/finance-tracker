import {
  test,
  expect,
  NextFixture,
  Page,
} from "next/experimental/testmode/playwright";

import {
  checkCaptchaButton,
  jsonResponse,
  mockSession,
  mockUser,
  setupTurnstileMock,
} from "./utils/test-utils";

const getProfileSetupData = (step: number) => ({
  id: "test-user-id",
  completed_steps: step,
  full_name: "Test User",
  display_name: step > 0 ? "testuser" : null,
  language: step > 0 ? "en" : null,
  country: step > 0 ? "US" : null,
  currency: step > 1 ? "USD" : null,
  starting_balance: step > 1 ? 1000 : null,
  expense_categories:
    step > 2
      ? [
          { code: "food", name: "Food & Dining" },
          { code: "transportation", name: "Transportation" },
        ]
      : null,
  monthly_saving_goals: step > 3 ? 500 : null,
  budget_limit: step > 3 ? 2000 : null,
});

const handleAuthFetch = (step: number) => (request: Request) => {
  const url = request.url;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (url === `${supabaseUrl}/auth/v1/token?grant_type=password`) {
    return jsonResponse({ ...mockSession });
  }

  if (url === `${supabaseUrl}/auth/v1/user`) {
    return jsonResponse(mockUser);
  }

  if (url.startsWith(`${supabaseUrl}/rest/v1/profile_setup`)) {
    return jsonResponse(getProfileSetupData(step));
  }

  return "abort";
};

const mockSignIn = async (next: NextFixture, page: Page, step: number) => {
  next.onFetch(handleAuthFetch(step));

  await page.goto("/signin");

  await page.getByPlaceholder("Enter your email").fill("test@example.com");
  await page.getByPlaceholder("Enter your password").fill("password");

  await checkCaptchaButton(page);

  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL("/dashboard");
};

test.describe("Profile Setup Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupTurnstileMock(page);
  });

  test("should complete personal information step", async ({ page, next }) => {
    await mockSignIn(next, page, 0);

    await page.goto("/profile-setup/personal");

    await page.getByPlaceholder("Enter your display name").fill("testuser");
    await page.getByLabel("Language").click();
    await page.getByRole("option", { name: "English" }).click();
    await page.getByLabel("Country").click();
    await page.getByRole("option", { name: "United States" }).click();

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveURL("/profile-setup/financial");
  });

  test("should complete financial setup step", async ({ page, next }) => {
    await mockSignIn(next, page, 1);

    await page.goto("/profile-setup/financial");

    await page.getByLabel("Currency").click();
    await page.getByRole("option", { name: "USD" }).click();
    await page.getByRole("spinbutton").fill("1000");

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveURL("/profile-setup/categories");
  });

  test("should complete categories selection step", async ({ page, next }) => {
    await mockSignIn(next, page, 2);

    await page.goto("/profile-setup/categories");

    await page.getByLabel("Food").check();
    await page.getByLabel("Transportation").check();

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveURL("/profile-setup/goals");
  });

  test("should complete goals setup step", async ({ page, next }) => {
    await mockSignIn(next, page, 3);

    await page.goto("/profile-setup/goals");

    await page.locator('input[name="monthlySavingGoals"]').fill("500");
    await page.locator('input[name="budgetLimit"]').fill("2000");

    await page.getByRole("button", { name: "Get Started" }).click();

    await expect(page).toHaveURL("/dashboard");
  });
});
