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
  waitForNavigation,
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

const mockAuth = async (next: NextFixture, page: Page, step: number) => {
  next.onFetch((request) => {
    const url = request.url;

    if (url.includes("/auth/v1/token")) {
      return jsonResponse(mockSession);
    }

    if (url.includes("/auth/v1/user")) {
      return jsonResponse(mockUser);
    }

    if (url.includes("/rest/v1/profile_setup")) {
      const profileData = getProfileSetupData(step);

      switch (request.method) {
        case "GET":
          return jsonResponse([profileData]);
        case "POST":
          return jsonResponse({ ...profileData, id: mockUser.id });
        case "PATCH":
          return jsonResponse({ ...profileData, id: mockUser.id });
        default:
          return jsonResponse([profileData]);
      }
    }

    return "abort";
  });

  await page.goto("/signin");
  await waitForNavigation(page, "/signin");

  await page.getByPlaceholder("Enter your email").fill("test@example.com");
  await page.getByPlaceholder("Enter your password").fill("password");

  await checkCaptchaButton(page);

  await Promise.all([
    page.getByRole("button", { name: /sign in/i }).click(),
    waitForNavigation(page, "/dashboard"),
  ]);

  await expect(page).toHaveURL("/dashboard");
};

test.describe("Profile Setup Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupTurnstileMock(page);
  });

  test("should complete personal information step", async ({ page, next }) => {
    await mockAuth(next, page, 0);

    await page.goto("/profile-setup/personal");
    await waitForNavigation(page, "/profile-setup/personal");

    await page.getByPlaceholder("Enter your display name").fill("testuser");
    await page.getByLabel("Language").click();
    await page.getByRole("option", { name: "English" }).click();
    await page.getByLabel("Country").click();
    await page.getByRole("option", { name: "United States" }).click();

    await Promise.all([
      page.getByRole("button", { name: /continue/i }).click(),
      waitForNavigation(page, "/profile-setup/financial"),
    ]);

    await expect(page).toHaveURL("/profile-setup/financial");
  });

  test("should complete financial setup step", async ({ page, next }) => {
    await mockAuth(next, page, 1);

    await page.goto("/profile-setup/financial");
    await waitForNavigation(page, "/profile-setup/financial");

    await page.getByLabel("Currency").click();
    await page.getByRole("option", { name: "USD" }).click();
    await page.getByRole("spinbutton").fill("1000");

    await Promise.all([
      page.getByRole("button", { name: /continue/i }).click(),
      waitForNavigation(page, "/profile-setup/categories"),
    ]);

    await expect(page).toHaveURL("/profile-setup/categories");
  });

  test("should complete categories selection step", async ({ page, next }) => {
    await mockAuth(next, page, 2);

    await page.goto("/profile-setup/categories");
    await waitForNavigation(page, "/profile-setup/categories");

    await page.getByLabel("Food").check();
    await page.getByLabel("Transportation").check();

    await Promise.all([
      page.getByRole("button", { name: /continue/i }).click(),
      waitForNavigation(page, "/profile-setup/goals"),
    ]);

    await expect(page).toHaveURL("/profile-setup/goals");
  });

  test("should complete goals setup step", async ({ page, next }) => {
    await mockAuth(next, page, 3);

    await page.goto("/profile-setup/goals");
    await waitForNavigation(page, "/profile-setup/goals");

    await page.locator('input[name="monthlySavingGoals"]').fill("500");
    await page.locator('input[name="budgetLimit"]').fill("2000");

    await Promise.all([
      page.getByRole("button", { name: /get started/i }).click(),
      waitForNavigation(page, "/dashboard"),
    ]);

    await expect(page).toHaveURL("/dashboard");
  });
});
