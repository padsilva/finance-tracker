import { render, screen } from "@testing-library/react";

import { NavBar } from "./nav-bar";

let mockFullName: string | null = "Test User";
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => ({
        data: {
          user: {
            user_metadata: {
              full_name: mockFullName,
            },
          },
        },
      })),
    },
  })),
}));

describe("NavBar", () => {
  it("should render nav bar with logo and user menu", async () => {
    render(await NavBar());

    expect(screen.getByAltText("FinanceTracker Logo")).toBeInTheDocument();
    expect(screen.getByText("FinanceTracker")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu-button")).toHaveTextContent(
      "Test User",
    );
  });

  it("should render with fallback values when user data is missing", async () => {
    mockFullName = null;

    render(await NavBar());

    expect(screen.getByTestId("user-menu-button")).toHaveTextContent("User");
  });
});
