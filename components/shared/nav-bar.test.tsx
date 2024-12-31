import { render, screen } from "@testing-library/react";

import { NavBar } from "./nav-bar";

jest.mock("./custom-trigger", () => ({
  CustomTrigger: () => (
    <button data-testid="mock-custom-trigger">Toggle</button>
  ),
}));

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

describe("NavBar Component", () => {
  it("should render with user data when user is authenticated", async () => {
    render(await NavBar());

    expect(screen.getByTestId("user-menu-button")).toHaveTextContent(
      "Test User",
    );
  });

  it("should render with fallback values when user is not authenticated", async () => {
    mockFullName = null;

    render(await NavBar());

    expect(screen.getByTestId("user-menu-button")).toHaveTextContent("User");
  });
});
